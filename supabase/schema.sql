-- ============================================================================
-- Campus Discovery — Database Schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) once per
-- project. Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE throughout.
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- fuzzy/forgiving text search

-- ---------------------------------------------------------------------------
-- CATEGORIES
-- Fully admin-manageable. Adding a row here makes a new category (and its
-- listing page) appear on the site with no code changes.
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  icon text default 'sparkles',       -- lucide icon name used by the UI
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- BUSINESSES
-- ---------------------------------------------------------------------------
create table if not exists businesses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  category_id uuid references categories(id) on delete set null,

  tagline text,                        -- short one-liner for cards
  description text,                    -- long-form for detail page

  address text,
  latitude double precision,
  longitude double precision,

  phone text,
  whatsapp text,                       -- E.164, digits only e.g. 919876543210
  website text,
  instagram text,

  price_level smallint default 1 check (price_level between 1 and 4), -- ₹ .. ₹₹₹₹

  -- opening hours stored as JSON keyed by weekday (0=Sun..6=Sat):
  -- { "0": {"open":"09:00","close":"22:00"}, "1": null, ... } null = closed
  opening_hours jsonb default '{}'::jsonb,

  amenities text[] default '{}',       -- e.g. {wifi,charging,ac,quiet,card_payment}
  tags text[] default '{}',            -- free-form discovery tags

  rating numeric(2,1) default 0,       -- denormalized average, kept in sync by trigger
  review_count int not null default 0, -- denormalized count, kept in sync by trigger

  is_published boolean not null default true,
  is_featured boolean not null default false,
  is_curated_favorite boolean not null default false,

  curated_sections text[] default '{}', -- e.g. {open_late, best_study, budget_eats}

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_businesses_category on businesses(category_id);
create index if not exists idx_businesses_published on businesses(is_published);
create index if not exists idx_businesses_name_trgm on businesses using gin (name gin_trgm_ops);
create index if not exists idx_businesses_tags on businesses using gin (tags);
create index if not exists idx_businesses_curated on businesses using gin (curated_sections);

-- ---------------------------------------------------------------------------
-- BUSINESS IMAGES
-- ---------------------------------------------------------------------------
create table if not exists business_images (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  url text not null,
  alt_text text not null default '',
  is_primary boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_business_images_business on business_images(business_id);

-- ---------------------------------------------------------------------------
-- REVIEWS (admin/curated-managed; no public accounts required)
-- ---------------------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  review_text text not null,
  reviewer_name text not null,
  reviewer_photo_url text,
  review_date date not null default current_date,
  tags text[] default '{}',
  is_published boolean not null default true,
  -- marks the row as curated/seed content rather than a real submitted review,
  -- per the requirement that demo content be clearly identifiable in the data.
  is_seed_content boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_reviews_business on reviews(business_id);

-- ---------------------------------------------------------------------------
-- OFFERS / STUDENT DEALS
-- ---------------------------------------------------------------------------
create table if not exists offers (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  title text not null,                 -- "20% off with student ID"
  description text,
  code text,                           -- optional coupon code
  valid_from date,
  valid_until date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_offers_business on offers(business_id);
create index if not exists idx_offers_active on offers(is_active);

-- ---------------------------------------------------------------------------
-- ANALYTICS-READY EVENT LOG
-- Nothing is sent to a third party. This just gives the app a place to record
-- meaningful user actions now, so a real analytics pipeline can be wired to
-- (or read from) this table later without changing the app architecture.
-- ---------------------------------------------------------------------------
create table if not exists events (
  id bigint generated always as identity primary key,
  event_type text not null,            -- search | category_select | business_view | ...
  business_id uuid references businesses(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_type on events(event_type);
create index if not exists idx_events_created on events(created_at);

-- ---------------------------------------------------------------------------
-- ADMIN PROFILES
-- Supabase auth handles login; this table just marks which authenticated
-- users are allowed into /admin.
-- ---------------------------------------------------------------------------
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Keep businesses.rating / review_count in sync with published reviews
-- ---------------------------------------------------------------------------
create or replace function recalc_business_rating() returns trigger as $$
declare
  target_id uuid;
begin
  target_id := coalesce(new.business_id, old.business_id);

  update businesses b
  set rating = coalesce((
        select round(avg(r.rating)::numeric, 1)
        from reviews r
        where r.business_id = target_id and r.is_published = true
      ), 0),
      review_count = coalesce((
        select count(*) from reviews r
        where r.business_id = target_id and r.is_published = true
      ), 0)
  where b.id = target_id;

  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_reviews_recalc on reviews;
create trigger trg_reviews_recalc
after insert or update or delete on reviews
for each row execute function recalc_business_rating();

-- keep updated_at fresh
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_businesses_updated on businesses;
create trigger trg_businesses_updated before update on businesses
for each row execute function set_updated_at();

drop trigger if exists trg_categories_updated on categories;
create trigger trg_categories_updated before update on categories
for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Public (anon) role: read-only access to published content.
-- Authenticated admin users: full read/write, gated additionally by the
-- admin_users table so a normal Supabase auth signup can't self-grant access.
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table businesses enable row level security;
alter table business_images enable row level security;
alter table reviews enable row level security;
alter table offers enable row level security;
alter table events enable row level security;
alter table admin_users enable row level security;

create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$ language sql stable security definer;

-- Categories: public can read active ones, admins can do everything
drop policy if exists "public read active categories" on categories;
create policy "public read active categories" on categories
  for select using (is_active = true or is_admin());

drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories
  for all using (is_admin()) with check (is_admin());

-- Businesses: public can read published, admins can do everything
drop policy if exists "public read published businesses" on businesses;
create policy "public read published businesses" on businesses
  for select using (is_published = true or is_admin());

drop policy if exists "admin write businesses" on businesses;
create policy "admin write businesses" on businesses
  for all using (is_admin()) with check (is_admin());

-- Business images: readable if parent business is readable
drop policy if exists "public read business images" on business_images;
create policy "public read business images" on business_images
  for select using (
    is_admin() or exists (
      select 1 from businesses b
      where b.id = business_images.business_id and b.is_published = true
    )
  );

drop policy if exists "admin write business images" on business_images;
create policy "admin write business images" on business_images
  for all using (is_admin()) with check (is_admin());

-- Reviews: public reads published reviews only
drop policy if exists "public read published reviews" on reviews;
create policy "public read published reviews" on reviews
  for select using (is_published = true or is_admin());

drop policy if exists "admin write reviews" on reviews;
create policy "admin write reviews" on reviews
  for all using (is_admin()) with check (is_admin());

-- Offers: public reads active, non-expired offers
drop policy if exists "public read active offers" on offers;
create policy "public read active offers" on offers
  for select using (
    is_admin() or (
      is_active = true
      and (valid_from is null or valid_from <= current_date)
      and (valid_until is null or valid_until >= current_date)
    )
  );

drop policy if exists "admin write offers" on offers;
create policy "admin write offers" on offers
  for all using (is_admin()) with check (is_admin());

-- Events: anyone can insert (anonymous analytics), only admins can read
drop policy if exists "anyone can log events" on events;
create policy "anyone can log events" on events
  for insert with check (true);

drop policy if exists "admin read events" on events;
create policy "admin read events" on events
  for select using (is_admin());

-- admin_users: only admins can read the list; no public access
drop policy if exists "admin read admin_users" on admin_users;
create policy "admin read admin_users" on admin_users
  for select using (is_admin());

-- ---------------------------------------------------------------------------
-- STORAGE
-- Public bucket for business images, admin-only writes.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('business-images', 'business-images', true)
on conflict (id) do nothing;

drop policy if exists "public read business-images" on storage.objects;
create policy "public read business-images" on storage.objects
  for select using (bucket_id = 'business-images');

drop policy if exists "admin write business-images" on storage.objects;
create policy "admin write business-images" on storage.objects
  for all using (bucket_id = 'business-images' and is_admin())
  with check (bucket_id = 'business-images' and is_admin());
