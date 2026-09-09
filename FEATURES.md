# Wayfare — Features

Wayfare is a full-stack adventure travel platform: a public marketing and booking
site, plus an internal admin control room that runs on the same live database.

Everything documented here is built and working. Things that are **not** built yet
are listed at the bottom, under [Not built yet](#not-built-yet), so this file can be
trusted as an accurate picture of the product.

**Stack:** React 19 · Vite · React Router 7 · Tailwind CSS 4 · Framer Motion ·
Supabase (Postgres 17 + GoTrue auth + Row Level Security) · deployed on Vercel.

---

## 1. Public site

### Home
- Cinematic hero with layered parallax, animated headline and live trip search entry.
- Animated destination showcase (editorial layout, not a uniform grid).
- "Why choose Wayfare" section with auto-advancing cards.
- Daily Highlight — one trip surfaced per day, deterministic from the date so every
  visitor sees the same pick.
- Offer strip with the current sale (see [Offers & sales](#offers--sales)).
- Newsletter sign-up that writes to `newsletter_subscribers`.

### Destinations
- `/destinations` — editorial mosaic of every destination (mixed wide/tall tiles).
- `/destinations/:slug` — destination page with hero, description, best season and
  every trip that runs there.

### Expeditions (trips)
- `/tours` — full catalogue with **smart filters**: search, category, difficulty,
  budget band and duration, all combinable, with a live result count.
- `/tours/:slug` — trip page with hero, quick-stat strip (duration, grade, altitude,
  group size, season), and tabs for Overview, day-by-day Itinerary, Inclusions /
  Exclusions and What to Carry. Sticky booking card with price, "Book This Trip",
  "Ask a Question" and "Add to Compare".
- Related trips from the same destination.

### Trip Atlas — interactive 3D globe
- `/atlas` — the full departure list (75 journeys, 10 regions, 3 countries) plotted
  on a real WebGL globe built with three.js: actual world coastlines drawn from
  Natural Earth outline data, a latitude/longitude graticule, and a fresnel
  atmosphere glow.
- Drag to spin with momentum; it auto-rotates when idle and holds still while your
  pointer is on it so a marker can be aimed at.
- One marker per journey, coloured by region. Hover or tap one and the panel names
  the journey; tap it and the globe spins that marker to the front and scrolls the
  matching card into view.
- Filtering by region or trip type updates the globe and the list together, and
  zooms the globe in on the region.
- Search across every journey name, region and description.
- Each journey card shows its grade, maximum altitude and season where those are
  known, and an Enquire button that carries the journey (and its trip type) into the
  Custom Trip Planner.
- The globe respects `prefers-reduced-motion` (no auto-spin, no pulsing), and
  three.js is lazy-loaded so only this page pays for it.
- Journey coordinates, altitudes, grades and seasons are geographic facts. Prices
  and fixed departure dates are deliberately **not** shown — they are commercial
  decisions, so every journey reads "Dates & price on request" and routes into the
  planner.

### Trip comparison
- Add up to 4 trips from any trip card or trip page.
- Floating compare bar shows the current selection anywhere on the site.
- `/compare` — side-by-side table of price, duration, difficulty, altitude, group
  size, season and rating, with the best value in each row flagged.
- Selection persists across page navigation.

### Custom trip planner
- `/custom-trip` — multi-step planner: destination → dates and group → trip style →
  hotel/transport preference → budget → contact details.
- Progress indicator, per-step validation, back/forward navigation.
- On submit it writes a real row to `enquiries`, which appears immediately in the
  admin Leads pipeline.

### Booking
- `/plan` (also reachable as "Book This Trip") — trip, date, traveller count and
  contact details, with a live price breakdown.
- Promo codes are validated and applied against the real offer rules before the
  total is written.
- Booking is stored in `bookings` and is visible on the traveller's account page and
  in the admin panel.

### Offers & sales
- `/offers` — every live offer with its code, discount, cap and expiry.
- Codes are validated in one place (`src/data/offers.js`) and enforced at booking
  time — the rules in the copy are the rules in the code, including date windows
  (e.g. the Diwali code only applies to October/November departures) and discount
  caps.
- Animated sale banner on the home page (moving gradient, sweeping shine) that
  always reflects whichever offer is currently featured.
- Each offer card carries a live countdown to its expiry.

### Journal
- `/journal` — travel stories with category filtering.
- `/journal/:slug` — full story with hero image and related reading.

### Accounts
- Email/password sign-up and login via Supabase Auth (`/signup`, `/login`).
- `/account` — profile plus the signed-in traveller's own bookings.
- Sessions persist across reloads; Row Level Security means a traveller can only
  ever read their own bookings.

### Contact & assistance
- `/contact` — contact form writing to `contact_messages`, plus office details.
- Floating WhatsApp and contact buttons on every page.
- Trip Assistant chat widget that answers from the real trip catalogue (budget,
  destination, difficulty and duration questions) and links to matching trips.

### Site-wide
- Per-page SEO: title, description, canonical URL, Open Graph and Twitter card tags
  that update on client-side navigation (`src/components/Seo.jsx`).
- Page transitions, scroll progress bar, scroll-reveal animations, pointer tilt on
  cards, and a reduced-motion path for every animation.
- Lazy-loaded routes, responsive images, skeleton loading states and real error
  states with retry.
- SPA rewrites configured in `vercel.json`, so every route works on a hard refresh.

---

## 2. Admin control room

Reached at `/admin`, gated twice: the UI redirects non-admins, and Row Level
Security means the database returns nothing to a non-admin session even if the UI
were bypassed. Admin status lives in `profiles.is_admin`.

The admin section is a **multi-page app** with a persistent sidebar. Data for all
four tables loads once for the whole section, so moving between pages is instant;
a Refresh button re-syncs everything and shows the last sync time.

### `/admin` — Dashboard
- Six live KPIs: total leads, new/untouched leads, bookings, revenue booked,
  average booking value and lead → booked conversion.
- 14-day bookings and 14-day leads column charts.
- Pipeline breakdown by stage.
- **Needs a reply** — leads that have sat in an open stage for more than 2 days.
- Recent activity feed merging leads, bookings, messages and subscribers, newest
  first, each row linking to its section.

### `/admin/leads` — CRM pipeline
- Every enquiry from the planner and contact forms.
- **9-stage pipeline**: New Lead → Contacted → Quotation Sent → Follow-up →
  Payment Pending → Booked → Completed → Review Requested → Repeat/Referral.
  Changing a lead's stage writes to the database immediately.
- Stage filter chips with live counts, plus search across name, email, phone,
  destination, notes and stage, and sorting (newest, oldest, name, group size).
- Expandable detail panel: travel window, hotel and transport preference, budget
  band and special requirements.
- **Internal notes** per lead, saved to the database (`enquiries.admin_notes`) and
  searchable.
- One-tap **WhatsApp** with a pre-filled message and one-tap **Email**.
- CSV export of exactly what is on screen, notes included.

### `/admin/bookings`
- Summary strip: bookings shown, revenue shown, discounts given, travellers.
- Sortable table (traveller, trip date, total, booked date) with search across trip,
  traveller, contact and promo code.
- Discounts and the promo code used are shown per booking.
- WhatsApp confirmation button per booking; CSV export.

### `/admin/messages`
- Every contact-form message, newest first, with the full message body.
- Search across sender and message text, plus subject filter chips.
- Reply by email or WhatsApp in one tap; CSV export.

### `/admin/subscribers`
- Total subscribers, sign-ups in the last 30 days, top email domain.
- 14-day sign-up chart.
- Search, **copy all shown emails** to the clipboard for pasting into a mailer, and
  CSV export.

### `/admin/trips` — Trip catalogue
- Every published trip with grade, duration, price and rating, joined against live
  data: how many times it has actually been booked, revenue it has produced, and how
  many leads named its destination.
- Filter by category and difficulty, search, and sort by any column.
- "Best seller" and average-price summary cards; each row links to its live page.

### `/admin/reports`
- Reporting range selector: last 30 / 90 / 365 days or all time.
- KPIs for the selected range: revenue, bookings, average value, discounts given,
  leads and conversion.
- Revenue by month (last 6 months).
- Revenue by destination and top trips by bookings.
- Lead-source donut, pipeline stage breakdown, budget bands requested, and discount
  given per promo code.
- One-click CSV export of the whole report.

### Across the admin
- Unread badges on the sidebar count rows created since the section was last opened
  (tracked per browser in `localStorage`) — they are real counts, not decoration.
- Every table has a genuine loading skeleton, error state with retry, and an empty
  state that says what would fill it.
- All charts are dependency-free CSS/SVG — no chart library in the bundle.

---

## 3. Data & security

Postgres tables: `profiles`, `bookings`, `enquiries`, `contact_messages`,
`newsletter_subscribers`.

- Row Level Security on every table.
- Travellers can read only their own bookings; admins (`profiles.is_admin`) can read
  all rows on all tables.
- Anonymous visitors can submit enquiries, contact messages and newsletter sign-ups,
  but cannot read anything back.
- Auth is Supabase GoTrue; no passwords or tokens are stored by the app itself.

---

## Not built yet

Honest list of things a full commercial travel platform would have that this one
does not, so nothing here is mistaken for working:

- **Online payments and invoices.** Bookings are recorded, but no payment gateway is
  integrated and no invoice/receipt is generated.
- **Fixed-departure seat inventory.** Trips have no seat count, so a departure cannot
  sell out or be closed.
- **Automated messaging.** WhatsApp and email buttons open the app with a pre-filled
  message; nothing is sent automatically, and there is no WhatsApp Business API
  integration.
- **CMS for trips and journal.** Trips, destinations and stories are published from
  code (`src/data/`), not editable from the admin panel. Bookings, leads, messages
  and subscribers are fully live.
- **Multi-user admin roles.** There is one admin level; no per-agent ownership,
  assignment or activity log.
