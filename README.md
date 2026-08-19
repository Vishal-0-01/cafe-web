# Nearby — Hyperlocal Campus Discovery Website

A data-driven local discovery website for students: search cafés, food,
printing, laundry, gyms, and more around a campus, filter by what actually
matters (open now, student deals, price, amenities), and get straight to
directions, calling, or WhatsApp. No account required for visitors. A private
`/admin` dashboard is the only application-style surface — everything public
is generated from the database.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Supabase** — Postgres database, Storage (business photos), Auth (admin only)
- **React Leaflet** + OpenStreetMap tiles for maps (no paid API key required)
- **lucide-react** for icons

Every business, category, review, and offer lives in the database. Adding a
business through `/admin` makes it live on the site immediately — no code
changes, no redeploy.

## 1. Create the Supabase project

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run `supabase/schema.sql` (creates tables, RLS
   policies, triggers, and the `business-images` storage bucket).
3. Then run `supabase/seed.sql` to load example data for a fictional
   locality ("Northgate University") so the site looks complete on first
   launch. All seed reviews are flagged `is_seed_content = true` and every
   seed business/review is clearly placeholder content — replace via
   `/admin` before going live with real listings.

## 2. Create your admin account

1. In Supabase, go to **Authentication → Users → Add user** and create
   yourself an account with an email + password (or invite yourself by
   email).
2. In **SQL Editor**, run:
   ```sql
   insert into admin_users (id, email)
   values ('<the auth.users id from step 1>', 'you@example.com');
   ```
   Row Level Security only grants write access to rows in `admin_users`, so
   this step is what actually makes your login an admin — creating a
   Supabase auth user alone is not enough.

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in from **Project Settings → API** in Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, never exposed to the client;
  used sparingly for privileged server-side operations. **Never commit this
  value or expose it in client code.**

Also set `NEXT_PUBLIC_CAMPUS_NAME` and coordinates for your real locality —
these are just copy/context values, not hard-coded data, so changing them
doesn't require touching any components.

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin` to sign in and manage content.

```bash
npm run build   # production build
npm run start   # run the production build locally
```

## Project structure

```
src/
  app/
    page.tsx                  # Homepage
    search/page.tsx           # Global search + filters
    category/[slug]/page.tsx  # Category listing (dynamic, DB-driven)
    business/[slug]/page.tsx  # Business detail (dynamic, DB-driven)
    admin/                    # Private CMS (auth-protected via middleware)
  components/                 # Reusable public UI
  components/admin/           # Admin forms, image uploader
  lib/
    data.ts                   # All public-facing DB reads
    actions/admin.ts          # Server actions for admin writes (CRUD)
    supabase/                 # Browser / server / middleware Supabase clients
    utils.ts                  # Distance, open/closed logic, formatting
  types/database.ts           # Hand-written types mirroring the schema
supabase/
  schema.sql                  # Full schema, RLS policies, storage bucket
  seed.sql                    # Example data, clearly marked as seed content
```

Nothing about a business is hard-coded into a React component — categories,
listings, images, hours, amenities, offers, and reviews are all rows in
Postgres, rendered through the reusable templates above.

## Admin capabilities (`/admin`)

- **Businesses** — create, edit, publish/unpublish, feature, delete; manage
  category, contact info, coordinates, opening hours, amenities, tags, and
  curated-section membership (e.g. "Open Late", "Best Study Cafés").
- **Photos** — upload directly to Supabase Storage per business, set a
  primary image, delete.
- **Categories** — add, rename, deactivate. New categories appear across the
  site (homepage grid, `/category/[slug]`) automatically.
- **Offers** — student deals with optional coupon code and validity window.
- **Reviews** — curated/admin-managed; ratings and review counts on each
  business recalculate automatically via a database trigger.

## Analytics-ready, not analytics-heavy

User actions (`search performed`, `category_select`, `business_view`,
`directions_clicked`, `call_clicked`, `whatsapp_clicked`, `website_clicked`)
are logged to an `events` table via `lib/actions/events.ts`, readable only by
admins. Nothing is sent to a third party by default — this just gives you a
first-party event log to build real dashboards or wire up Google Analytics
against later without changing the app architecture.

## Deployment

### Vercel (recommended)

1. Push this project to a GitHub repo.
2. Import it in Vercel.
3. Add the same environment variables from `.env.local` in
   **Project Settings → Environment Variables**.
4. Deploy. `npm run build` / `next start` are used automatically.

### Hostinger / other Node hosts

The project builds to a standard Next.js server (`npm run build` then
`npm run start`), so it runs on any host that supports a long-running Node
process. Hostinger's Node.js hosting or a VPS both work — just set the same
environment variables and run the two commands above behind your process
manager of choice (e.g. `pm2`).

## Security notes

- `SUPABASE_SERVICE_ROLE_KEY` is never imported into any client component
  and is not part of the `NEXT_PUBLIC_*` set that reaches the browser.
- All public reads/writes go through Supabase Row Level Security. Anonymous
  visitors can only read published businesses, active categories, published
  reviews, and currently-valid offers. Only rows present in `admin_users`
  can write.
- `/admin` is protected by `src/middleware.ts`, which redirects
  unauthenticated visitors to `/admin/login` before any admin page renders.

## Extending later (intentionally out of scope for this version)

Per the product brief, these are deliberately not built yet, but the
architecture doesn't block them:
- SEO content pass (metadata is already in place per page; a full SEO
  content strategy is a later phase)
- Real analytics wiring (Google Analytics/GA4) against the existing
  `events` table
- Campaign/landing-page variants
- Social sharing polish
