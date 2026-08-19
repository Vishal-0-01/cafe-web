-- ============================================================================
-- Campus Discovery — Seed Data
-- Clearly-marked example content for "Northgate University" (a fictional
-- locality) so the site looks complete on first launch. Replace freely via
-- the /admin dashboard — nothing here is meant to represent real businesses.
-- All reviews are inserted with is_seed_content = true.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------------
insert into categories (name, slug, description, icon, sort_order) values
  ('Cafés',         'cafes',         'Coffee, tea, and study-friendly hangouts',        'coffee',      1),
  ('Food',          'food',          'Restaurants, quick bites, and cheap eats',        'utensils',    2),
  ('Printing',      'printing',      'Printing, photocopy, and binding',                'printer',     3),
  ('Stationery',    'stationery',    'Books, supplies, and stationery shops',           'pencil',      4),
  ('Laundry',       'laundry',       'Laundromats and dry cleaning',                    'shirt',       5),
  ('Gyms',          'gyms',          'Gyms and fitness studios',                        'dumbbell',    6),
  ('Pharmacies',    'pharmacies',    '24-hour and neighborhood pharmacies',             'pill',        7),
  ('Grocery',       'grocery',       'Grocery and convenience stores',                  'shopping-cart', 8),
  ('Study Spaces',  'study-spaces',  'Libraries, co-working spots, and quiet corners',  'book-open',   9),
  ('Salons',        'salons',        'Salons and barbershops',                          'scissors',    10)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- BUSINESSES
-- Coordinates are placed within ~1.5km of the example campus center
-- (28.6139, 77.2090) so distance sorting has something real to sort.
-- ---------------------------------------------------------------------------
with cat as (select id, slug from categories)

insert into businesses (
  name, slug, category_id, tagline, description, address, latitude, longitude,
  phone, whatsapp, website, price_level, opening_hours, amenities, tags,
  is_published, is_featured, is_curated_favorite, curated_sections
)
select * from (values
  (
    'The Daily Grind', 'the-daily-grind',
    (select id from cat where slug='cafes'),
    'Reliable coffee, reliable WiFi, reliable outlets.',
    'A no-frills café two minutes from the north gate that has quietly become the unofficial second office for half the student body. Big communal tables, strong espresso, and nobody will rush you out for camping with a laptop all afternoon.',
    '14 College Road, near North Gate', 28.6151, 77.2101,
    '+911140001234', '919810000001', 'https://example.com/daily-grind', 2,
    '{"0":{"open":"08:00","close":"23:00"},"1":{"open":"07:30","close":"23:00"},"2":{"open":"07:30","close":"23:00"},"3":{"open":"07:30","close":"23:00"},"4":{"open":"07:30","close":"23:00"},"5":{"open":"07:30","close":"23:30"},"6":{"open":"08:00","close":"23:30"}}'::jsonb,
    ARRAY['wifi','charging','ac','quiet','card_payment'],
    ARRAY['study-friendly','good-coffee','laptop-friendly'],
    true, true, true, ARRAY['best_study','best_coffee']
  ),
  (
    'Brew & Books', 'brew-and-books',
    (select id from cat where slug='cafes'),
    'Secondhand books, fresh filter coffee.',
    'Part café, part used bookshop. Shelves of donated paperbacks line the walls and you are actively encouraged to read while you sip. Gets loud around lunchtime, calmer after 4pm.',
    '2nd Floor, Ashoka Plaza, University Road', 28.6108, 77.2065,
    '+911140005678', '919810000002', 'https://example.com/brew-books', 2,
    '{"0":{"open":"10:00","close":"22:00"},"1":{"open":"09:00","close":"22:00"},"2":{"open":"09:00","close":"22:00"},"3":{"open":"09:00","close":"22:00"},"4":{"open":"09:00","close":"22:00"},"5":{"open":"09:00","close":"22:30"},"6":{"open":"10:00","close":"22:30"}}'::jsonb,
    ARRAY['wifi','quiet','card_payment'],
    ARRAY['study-friendly','good-coffee','cozy'],
    true, false, true, ARRAY['best_coffee']
  ),
  (
    'Midnight Chai Point', 'midnight-chai-point',
    (select id from cat where slug='cafes'),
    'Open till 2am. Chai, Maggi, and company.',
    'The place everyone ends up at after a late library session. Plastic chairs, a tiny TV, and the best cutting chai within walking distance.',
    'Outside South Gate, University Road', 28.6119, 77.2142,
    '+911140009012', '919810000003', null, 1,
    '{"0":{"open":"16:00","close":"02:00"},"1":{"open":"16:00","close":"02:00"},"2":{"open":"16:00","close":"02:00"},"3":{"open":"16:00","close":"02:00"},"4":{"open":"16:00","close":"02:00"},"5":{"open":"16:00","close":"02:30"},"6":{"open":"16:00","close":"02:30"}}'::jsonb,
    ARRAY['outdoor_seating'],
    ARRAY['cheap','open-late','quick-bite'],
    true, false, true, ARRAY['open_late','budget_eats']
  ),
  (
    'Copy Point Xerox & Print', 'copy-point-xerox',
    (select id from cat where slug='printing'),
    '₹2/page black & white, same-day binding.',
    'Fast, cheap printing right outside the main gate. Handles spiral binding, lamination, and last-minute thesis printouts without complaint.',
    'Shop 3, Gate Market, College Road', 28.6146, 77.2088,
    '+911140003456', '919810000004', null, 1,
    '{"0":null,"1":{"open":"09:00","close":"21:00"},"2":{"open":"09:00","close":"21:00"},"3":{"open":"09:00","close":"21:00"},"4":{"open":"09:00","close":"21:00"},"5":{"open":"09:00","close":"21:00"},"6":{"open":"10:00","close":"18:00"}}'::jsonb,
    ARRAY['card_payment'],
    ARRAY['cheap','fast-service'],
    true, false, false, ARRAY['budget_eats']
  ),
  (
    'Campus Stationers', 'campus-stationers',
    (select id from cat where slug='stationery'),
    'Everything from graph paper to lab coats.',
    'The go-to shop for anything academic — notebooks, calculators, lab equipment, and a surprisingly good selection of pens.',
    '9 College Road', 28.6149, 77.2095,
    '+911140002233', null, null, 2,
    '{"0":null,"1":{"open":"09:30","close":"20:00"},"2":{"open":"09:30","close":"20:00"},"3":{"open":"09:30","close":"20:00"},"4":{"open":"09:30","close":"20:00"},"5":{"open":"09:30","close":"20:00"},"6":{"open":"10:00","close":"18:00"}}'::jsonb,
    ARRAY['card_payment'],
    ARRAY['reliable-stock'],
    true, false, false, ARRAY[]::text[]
  ),
  (
    'QuickWash Laundromat', 'quickwash-laundromat',
    (select id from cat where slug='laundry'),
    'Self-serve or drop-off, ready in 24 hours.',
    'Coin-operated machines for the DIY crowd, or drop off a bag and pick it up washed and folded the next day.',
    '22 Hostel Road', 28.6172, 77.2077,
    '+911140004455', '919810000005', null, 2,
    '{"0":{"open":"08:00","close":"20:00"},"1":{"open":"08:00","close":"20:00"},"2":{"open":"08:00","close":"20:00"},"3":{"open":"08:00","close":"20:00"},"4":{"open":"08:00","close":"20:00"},"5":{"open":"08:00","close":"20:00"},"6":{"open":"08:00","close":"20:00"}}'::jsonb,
    ARRAY['card_payment'],
    ARRAY['reliable-service'],
    true, false, false, ARRAY[]::text[]
  ),
  (
    'IronPeak Fitness', 'ironpeak-fitness',
    (select id from cat where slug='gyms'),
    'Student memberships from ₹999/month.',
    'A proper strength-training gym with free weights, a small cardio section, and trainers who will actually correct your form if you ask.',
    '5 Sports Complex Road', 28.6095, 77.2114,
    '+911140006677', '919810000006', 'https://example.com/ironpeak', 2,
    '{"0":{"open":"06:00","close":"21:00"},"1":{"open":"05:30","close":"22:00"},"2":{"open":"05:30","close":"22:00"},"3":{"open":"05:30","close":"22:00"},"4":{"open":"05:30","close":"22:00"},"5":{"open":"05:30","close":"22:00"},"6":{"open":"06:00","close":"21:00"}}'::jsonb,
    ARRAY['ac','showers'],
    ARRAY['student-discount'],
    true, true, false, ARRAY[]::text[]
  ),
  (
    'CityCare 24hr Pharmacy', 'citycare-pharmacy',
    (select id from cat where slug='pharmacies'),
    'Open around the clock, right by the hostel gate.',
    'A dependable 24-hour pharmacy stocking common prescriptions, first-aid supplies, and basic health essentials.',
    '1 Hostel Road', 28.6168, 77.2081,
    '+911140007788', null, null, 2,
    '{"0":{"open":"00:00","close":"23:59"},"1":{"open":"00:00","close":"23:59"},"2":{"open":"00:00","close":"23:59"},"3":{"open":"00:00","close":"23:59"},"4":{"open":"00:00","close":"23:59"},"5":{"open":"00:00","close":"23:59"},"6":{"open":"00:00","close":"23:59"}}'::jsonb,
    ARRAY['card_payment'],
    ARRAY['open-late','24-hours'],
    true, false, false, ARRAY['open_late']
  ),
  (
    'GreenBasket Grocery', 'greenbasket-grocery',
    (select id from cat where slug='grocery'),
    'Instant noodles to fresh vegetables.',
    'A well-stocked convenience store popular for late-night snack runs and cheap essentials.',
    '18 College Road', 28.6144, 77.2103,
    '+911140008899', null, null, 1,
    '{"0":{"open":"08:00","close":"23:00"},"1":{"open":"08:00","close":"23:00"},"2":{"open":"08:00","close":"23:00"},"3":{"open":"08:00","close":"23:00"},"4":{"open":"08:00","close":"23:00"},"5":{"open":"08:00","close":"23:00"},"6":{"open":"08:00","close":"23:00"}}'::jsonb,
    ARRAY['card_payment'],
    ARRAY['cheap','open-late'],
    true, false, false, ARRAY['open_late','budget_eats']
  ),
  (
    'Thali Junction', 'thali-junction',
    (select id from cat where slug='food'),
    'Unlimited thali for ₹99, student special.',
    'A canteen-style spot serving generous unlimited thalis. Not fancy, but consistently good and famously cheap.',
    '11 Market Lane', 28.6132, 77.2073,
    '+911140010101', '919810000007', null, 1,
    '{"0":{"open":"11:30","close":"22:00"},"1":{"open":"11:30","close":"22:00"},"2":{"open":"11:30","close":"22:00"},"3":{"open":"11:30","close":"22:00"},"4":{"open":"11:30","close":"22:00"},"5":{"open":"11:30","close":"22:30"},"6":{"open":"11:30","close":"22:30"}}'::jsonb,
    ARRAY['ac','card_payment'],
    ARRAY['cheap','student-discount'],
    true, true, true, ARRAY['budget_eats']
  ),
  (
    'Slice House Pizza', 'slice-house-pizza',
    (select id from cat where slug='food'),
    'By-the-slice pizza, open till midnight.',
    'Quick, affordable pizza by the slice with a rotating list of daily specials. A reliable dinner option when the mess food gets old.',
    '7 Market Lane', 28.6129, 77.2069,
    '+911140011212', '919810000008', 'https://example.com/slicehouse', 2,
    '{"0":{"open":"12:00","close":"00:00"},"1":{"open":"12:00","close":"00:00"},"2":{"open":"12:00","close":"00:00"},"3":{"open":"12:00","close":"00:00"},"4":{"open":"12:00","close":"00:00"},"5":{"open":"12:00","close":"01:00"},"6":{"open":"12:00","close":"01:00"}}'::jsonb,
    ARRAY['ac','card_payment'],
    ARRAY['open-late','student-discount'],
    true, false, false, ARRAY['open_late']
  ),
  (
    'The Quiet Corner Library Café', 'quiet-corner-library-cafe',
    (select id from cat where slug='study-spaces'),
    'Silent study zone with a coffee counter.',
    'A dedicated silent-study room attached to a small café counter. Bring your own laptop; headphones required for calls.',
    '3rd Floor, Ashoka Plaza, University Road', 28.6106, 77.2062,
    '+911140012323', null, null, 2,
    '{"0":{"open":"09:00","close":"21:00"},"1":{"open":"08:00","close":"22:00"},"2":{"open":"08:00","close":"22:00"},"3":{"open":"08:00","close":"22:00"},"4":{"open":"08:00","close":"22:00"},"5":{"open":"08:00","close":"22:00"},"6":{"open":"09:00","close":"21:00"}}'::jsonb,
    ARRAY['wifi','charging','ac','quiet'],
    ARRAY['study-friendly','quiet'],
    true, true, true, ARRAY['best_study']
  ),
  (
    'Fresh Cuts Barbershop', 'fresh-cuts-barbershop',
    (select id from cat where slug='salons'),
    'Student haircuts from ₹150.',
    'A fast, friendly barbershop that keeps a queue moving even during exam-week rushes.',
    '4 Gate Market, College Road', 28.6147, 77.2091,
    '+911140013434', '919810000009', null, 1,
    '{"0":{"open":"10:00","close":"20:00"},"1":{"open":"10:00","close":"20:00"},"2":{"open":"10:00","close":"20:00"},"3":{"open":"10:00","close":"20:00"},"4":{"open":"10:00","close":"20:00"},"5":{"open":"10:00","close":"20:30"},"6":{"open":"10:00","close":"20:30"}}'::jsonb,
    ARRAY['card_payment'],
    ARRAY['cheap','student-discount'],
    true, false, false, ARRAY[]::text[]
  )
) as t(
  name, slug, category_id, tagline, description, address, latitude, longitude,
  phone, whatsapp, website, price_level, opening_hours, amenities, tags,
  is_published, is_featured, is_curated_favorite, curated_sections
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- BUSINESS IMAGES (Unsplash placeholder photography — replace via /admin)
-- ---------------------------------------------------------------------------
insert into business_images (business_id, url, alt_text, is_primary, sort_order)
select b.id, img.url, img.alt, img.is_primary, img.sort_order
from businesses b
join (values
  ('the-daily-grind', 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&q=80', 'Interior of The Daily Grind café with communal tables', true, 0),
  ('the-daily-grind', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80', 'Latte art at The Daily Grind', false, 1),
  ('brew-and-books', 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80', 'Bookshelves at Brew & Books café', true, 0),
  ('midnight-chai-point', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=1200&q=80', 'Chai being poured at Midnight Chai Point', true, 0),
  ('copy-point-xerox', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=80', 'Printing shop counter', true, 0),
  ('campus-stationers', 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=1200&q=80', 'Stationery shelves at Campus Stationers', true, 0),
  ('quickwash-laundromat', 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1200&q=80', 'Washing machines at QuickWash Laundromat', true, 0),
  ('ironpeak-fitness', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'Weight room at IronPeak Fitness', true, 0),
  ('citycare-pharmacy', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&q=80', 'Pharmacy shelves at CityCare', true, 0),
  ('greenbasket-grocery', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80', 'Grocery aisle at GreenBasket', true, 0),
  ('thali-junction', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200&q=80', 'Thali plate at Thali Junction', true, 0),
  ('slice-house-pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80', 'Pizza slices at Slice House', true, 0),
  ('quiet-corner-library-cafe', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80', 'Silent study room at The Quiet Corner', true, 0),
  ('fresh-cuts-barbershop', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80', 'Barber chair at Fresh Cuts', true, 0)
) as img(business_slug, url, alt, is_primary, sort_order)
  on img.business_slug = b.slug
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- REVIEWS — clearly marked as seed content (is_seed_content = true)
-- ---------------------------------------------------------------------------
insert into reviews (business_id, rating, review_text, reviewer_name, review_date, tags, is_seed_content)
select b.id, r.rating, r.text, r.name, r.rdate::date, r.tags, true
from businesses b
join (values
  ('the-daily-grind', 5, 'Basically my second home during finals. Outlets at every table and nobody minds if you stay for six hours.', 'Ananya R.', '2026-07-02', ARRAY['good-wifi','quiet']),
  ('the-daily-grind', 4, 'Great coffee, gets crowded around 4pm. Go earlier if you want a table by the window.', 'Rohit K.', '2026-06-14', ARRAY['good-coffee','crowded']),
  ('brew-and-books', 5, 'Traded three paperbacks for store credit and left with a new one plus a great cappuccino. Love this place.', 'Fatima S.', '2026-05-30', ARRAY['great-ambience']),
  ('midnight-chai-point', 4, 'Lifesaver after 1am library sessions. Cheap, fast, and the chai is genuinely good.', 'Devika M.', '2026-07-10', ARRAY['cheap','open-late']),
  ('copy-point-xerox', 4, 'Printed my entire thesis in twenty minutes the night before submission. Forever grateful.', 'Aakash P.', '2026-04-22', ARRAY['fast-service']),
  ('ironpeak-fitness', 5, 'Trainers actually check your form instead of just standing around. Worth the membership.', 'Sana T.', '2026-06-01', ARRAY['good-value']),
  ('thali-junction', 5, 'Unreal value. I have not paid more than ₹99 for a filling dinner all semester.', 'Vikram J.', '2026-07-15', ARRAY['cheap','good-value']),
  ('thali-junction', 4, 'Simple food, huge portions, quick service between classes.', 'Priya N.', '2026-05-19', ARRAY['quick-bite']),
  ('quiet-corner-library-cafe', 5, 'The only place near campus that is actually silent. Bring headphones, they will remind you.', 'Karan D.', '2026-06-27', ARRAY['quiet','good-for-studying']),
  ('slice-house-pizza', 4, 'Solid late-night option. The pepperoni slice is the move.', 'Neha B.', '2026-07-01', ARRAY['open-late']),
  ('fresh-cuts-barbershop', 5, 'In and out in fifteen minutes, good haircut, fair price.', 'Ishaan V.', '2026-04-11', ARRAY['fast-service'])
) as r(business_slug, rating, text, name, rdate, tags)
  on r.business_slug = b.slug;

-- ---------------------------------------------------------------------------
-- OFFERS
-- ---------------------------------------------------------------------------
insert into offers (business_id, title, description, code, valid_from, valid_until, is_active)
select b.id, o.title, o.description, o.code, o.vfrom::date, o.vuntil::date, true
from businesses b
join (values
  ('the-daily-grind', '15% off with student ID', 'Show a valid student ID at the counter for 15% off any order.', null, '2026-01-01', '2026-12-31'),
  ('copy-point-xerox', '₹2/page black & white printing', 'Standard rate for all students, no minimum order.', null, null, null),
  ('ironpeak-fitness', 'Student membership ₹999/month', 'Valid student ID required at sign-up. Includes locker access.', 'STUDENT999', '2026-01-01', '2026-12-31'),
  ('thali-junction', 'Unlimited thali for ₹99', 'Student special, available all day, every day.', null, null, null),
  ('slice-house-pizza', 'Buy 1 Get 1 slice after 10pm', 'Late-night student special, dine-in only.', 'NIGHTSLICE', '2026-01-01', '2026-12-31'),
  ('fresh-cuts-barbershop', '₹150 student haircuts', 'Regular price ₹250 — student ID required.', null, null, null)
) as o(business_slug, title, description, code, vfrom, vuntil)
  on o.business_slug = b.slug;
