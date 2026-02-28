# Domaine Sidi Abdallah — Digital Platform: Implementation Plan

> **Status:** Approved — February 28, 2026
> **Author:** Rached
> **Audience:** Rached (execution), Elyssa (milestones + decisions), Lilia (strategic overview)

---

## Context

The Domaine Sidi Abdallah is a luxury agritourism property in Mohammedia (~16km from Tunis) built around four pillars:

| Pillar | Sub-brand | Status |
|--------|-----------|--------|
| Séjourner | Dar Saad (6 boutique rooms) | Opens late 2026 |
| Se Détendre | Agrumia (spa, yoga, fitness) | Opens Jun–Sep 2026 |
| Déguster | Restaurant (farm-to-table) | Opens with renovation |
| S'Évader | Retreats & programs | Launches 2027 |

The digital platform serves two distinct audiences via a **single geo-aware website**:
- **Tunisian visitors** → French content, TND pricing, WhatsApp CTAs
- **International visitors** → English content, EUR/USD pricing, online booking forms

Renovation starts **April 6, 2026**. Website must go live by **mid-May 2026**.

---

## Part 1 — Strategic Decisions (Resolved)

### 1. Design Direction → **"Terre d'Agrumes"** with Agrume's typographic discipline

**Eliminated:**
- **Heritage Doré** — signals generic hotel luxury, not agritourism; alienates Tunisian day-visitor segment
- **Édito** — requires an exceptional photo library to carry the editorial weight; pre-renovation photos make this a liability
- **Les Saisons** — GSAP scroll animations take weeks to polish; underperforms on low-end Android (common in Tunisia); revisit in 2027
- **Agrume** — minimalism needs excellent photography to avoid looking empty at launch

**Why Terre d'Agrumes wins:**
- Works with imperfect, construction-phase photography (texture + warmth + organic shapes carry the page)
- Communicates the orange grove identity without explanatory text
- Distinctive in a Tunisian market that trends sterile-minimal or oversaturated-luxury
- Serves all three audience types equally (Mediterranean farm language is universally understood)

**Design tokens:**
```
Typography:  Cormorant Garamond (headings) + DM Sans (body)
Parchment:   #F7F0E3
Grove:       #2C4035
Terracotta:  #B5623A
Gold:        #C4A35A
Ink:         #1C1A17
```
Organic SVG citrus-leaf shapes for section dividers. No gradients, no heavy shadows.

---

### 2. Booking at Launch → **Yes — restaurant booking ships with Phase 1**

The restaurant is the primary acquisition channel for the Tunisian day-visitor segment. A WhatsApp CTA without a booking form loses that conversion. Restaurant booking is also the simplest type: pay on arrival (no payment gateway needed), no OTA sync, no multi-resource availability engine. It is 2–3 weeks of development.

**Scope at May 2026 launch:**
| Feature | Status |
|---------|--------|
| Restaurant booking (date / time / party size → WhatsApp + email) | ✅ Live |
| Wellness | WhatsApp CTA only (space not open yet) |
| Hotel rooms | Email waitlist capture |
| Retreats | Email waitlist capture |

If the restaurant isn't open by May, the booking module is deployed but hidden behind a single `isOpen` config flag.

---

### 3. CMS → **MDX in repo (Phase 1), migrate to Sanity when Elyssa needs self-edit**

The first 3 months will have ~3–4 content changes/month — Rached handles those in 5 minutes. Adding Sanity at launch means writing schemas, configuring Studio, and teaching Elyssa a new tool before she has seen the live site.

**Critical pattern:** Build a `getContent()` abstraction from day one so page components never import MDX directly. When Sanity is added (likely Phase 2 for high-churn content: menus, retreat programs), zero page refactoring is needed.

---

### 4. Domain → **`domainesidiabdallah.com` as primary, `.tn` as redirect**

The `.tn` TLD has no organic search advantage and triggers legitimacy hesitation with non-Tunisian visitors. `.com` registers in minutes with no document requirements (Namecheap). Register `.tn` when admin capacity allows; redirect it to `.com` via 301.

**Also register immediately:** `darsaad.com` + `agrumia.com` — sub-brand domain squatting is a real risk once the property appears on Instagram.

---

### 5. WhatsApp API → **Twilio**

Meta direct API onboarding takes 2–4 weeks with unreliable self-onboarding. The cost delta vs. Twilio is ~50–150 TND/month at DSA's volume — not a decision driver. Twilio onboards in 2–3 days, has a best-in-class TypeScript SDK, and Rached already knows the pattern. Reassess at Phase 3 if volume justifies the migration effort.

---

## Part 2 — Architecture

### Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 14 App Router | Full-stack, Vercel Edge for geo middleware |
| Styling | Tailwind CSS | Design tokens in `tailwind.config.ts` |
| i18n | `next-intl` | `fr` default (no prefix), `/en/*` for English |
| ORM | Prisma | Incremental schema migrations |
| Database | Supabase PostgreSQL | pgbouncer pooling in production |
| Geo-detection | Vercel Edge Middleware | Cookie-based override, zero DB calls |
| Email (transactional) | Resend | Booking confirmations, contact forms |
| Newsletter | Brevo | Waitlist capture, pre-opening campaigns |
| WhatsApp | Twilio | Staff notifications, guest confirmations |
| Payments | Stripe (intl) + Konnect (TN) | Phase 2 only |
| Hosting | Vercel (`cdg1` Paris region) | ~40–60ms RTT to Tunis |
| DNS/CDN | Cloudflare | DDoS protection, SSL |
| Analytics | Vercel Analytics + Umami | Privacy-friendly, no cookie banner needed |
| CMS | MDX → Sanity (Phase 2 if needed) | `getContent()` abstraction hides the switch |

### Single Application (no monorepo split)

The admin back-office lives in the same Next.js application as the public website. Admin and website share all data models, components, and the Prisma client. The overhead of splitting into separate packages outweighs the benefits at DSA's scale.

### Geo-Detection Flow

```
Visitor request
    │
    ▼
Vercel Edge Middleware (middleware.ts)
    │
    ├── Has `dsa-audience` cookie?
    │       YES → use cookie value ('tn' | 'intl')
    │       NO  → read request.geo.country from Vercel
    │               TN → audience = 'tn'
    │               other → audience = 'intl'
    │
    ├── Set `dsa-audience` cookie (30 days, httpOnly: false)
    │
    ├── audience = 'intl' and no /en/ prefix?
    │       → redirect to /en/*
    │
    └── Pass to next-intl middleware for locale routing
```

`AudienceToggle.tsx` (client component) lets visitors override by writing the cookie and calling `router.refresh()`.

---

## Part 3 — Repository Structure

```
dsa-platform/
├── .github/workflows/
│   ├── ci.yml              # lint + type-check + build + test on all PRs
│   └── preview.yml         # Vercel preview URL posted on PR
│
├── app/
│   ├── [locale]/           # fr (default, no /fr/ prefix) | en (/en/*)
│   │   ├── layout.tsx      # Root: fonts, nav, footer, analytics
│   │   ├── page.tsx        # Homepage
│   │   ├── sejour/page.tsx
│   │   ├── bien-etre/page.tsx
│   │   ├── restaurant/
│   │   │   ├── page.tsx
│   │   │   └── reserver/page.tsx      # Booking flow
│   │   ├── retraites/page.tsx
│   │   ├── notre-histoire/page.tsx
│   │   └── contact/page.tsx
│   │
│   ├── admin/              # Always FR, no locale prefix
│   │   ├── layout.tsx      # Sidebar, auth guard
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── restaurant/
│   │   │   ├── page.tsx               # Daily reservation list
│   │   │   ├── [date]/page.tsx
│   │   │   └── config/page.tsx        # Open/close days, capacity
│   │   ├── bien-etre/page.tsx         # Phase 1b
│   │   └── sejour/page.tsx            # Phase 2
│   │
│   └── api/
│       ├── auth/route.ts
│       ├── bookings/
│       │   ├── restaurant/route.ts    # POST create | GET list (admin)
│       │   ├── wellness/route.ts      # Phase 1b
│       │   └── rooms/route.ts         # Phase 2
│       ├── availability/
│       │   ├── restaurant/route.ts    # GET ?date=&covers=
│       │   └── rooms/route.ts         # Phase 2
│       ├── newsletter/route.ts        # POST → Brevo
│       └── webhooks/
│           ├── konnect/route.ts       # Phase 2
│           └── stripe/route.ts        # Phase 2
│
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── WhatsAppButton.tsx         # Floating CTA, audience-adaptive
│   │   └── AudienceToggle.tsx         # Geo override cookie control
│   ├── ui/                            # Button, Badge, Card, Dialog, Input
│   ├── sections/
│   │   ├── HeroSection.tsx            # Geo-adaptive headline + CTA
│   │   ├── PillarGrid.tsx             # 4-pillar cards with Ouvert/Bientôt badges
│   │   ├── StorySection.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── NewsletterCapture.tsx      # → Brevo
│   │   └── ComingSoonOverlay.tsx      # Waitlist capture
│   ├── booking/
│   │   ├── restaurant/
│   │   │   ├── RestaurantBookingForm.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── TimeSlotSelector.tsx
│   │   │   └── PartySizeSelector.tsx
│   │   ├── wellness/                  # Phase 1b
│   │   │   ├── ServiceCatalog.tsx
│   │   │   ├── WellnessBookingForm.tsx
│   │   │   └── PractitionerSelector.tsx
│   │   └── rooms/                     # Phase 2
│   │       ├── AvailabilityCalendar.tsx
│   │       ├── RoomCard.tsx
│   │       └── RoomBookingForm.tsx
│   └── admin/
│       ├── ReservationList.tsx
│       ├── StatusBadge.tsx
│       └── DayCoverCounter.tsx
│
├── lib/
│   ├── db.ts                  # Prisma client singleton
│   ├── auth.ts                # JWT helpers for admin
│   ├── geo.ts                 # getAudience(): reads dsa-audience cookie
│   ├── content.ts             # getContent() abstraction (MDX → Sanity later)
│   ├── whatsapp.ts            # Twilio WhatsApp sender
│   ├── email.ts               # Resend email sender
│   ├── brevo.ts               # Newsletter subscription
│   └── booking/
│       ├── restaurant.ts      # Availability check + booking creation
│       ├── wellness.ts        # Phase 1b
│       └── rooms.ts           # Phase 2
│
├── middleware.ts              # Vercel Edge: geo-detection + locale routing
│
├── content/                   # MDX content files (FR + EN)
│   ├── fr/{home,sejour,bien-etre,restaurant,retraites,notre-histoire}.mdx
│   └── en/{same}
│
├── messages/
│   ├── fr.json                # UI strings: nav, CTA text, form labels
│   └── en.json
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│   ├── images/{property,rooms,restaurant,wellness,og}/
│   ├── icons/
│   └── fonts/
│
├── .env.local                 # Gitignored — dev secrets
├── .env.example               # Template for all variables
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Part 4 — Database Schema

Schema is built **incrementally** — only Phase 1 tables exist at launch. Each phase adds migrations, never destructive changes.

### Phase 1 Tables (May 2026)

```prisma
model Guest {
  id          String    @id @default(cuid())
  firstName   String
  lastName    String
  email       String?
  phone       String    @unique   // +216XXXXXXXX format
  country     String?
  language    String    @default("fr")
  notes       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  bookings    Booking[]
  @@index([email])
}

model Booking {
  id              String        @id @default(cuid())
  guestId         String
  type            BookingType   // RESTAURANT | WELLNESS | ROOM | RETREAT
  status          BookingStatus @default(PENDING)
  source          BookingSource @default(WEBSITE)
  date            DateTime?     @db.Date
  startTime       DateTime?     @db.Time
  partySize       Int?
  totalPrice      Decimal       @db.Decimal(10, 3)
  currency        Currency      @default(TND)
  specialRequests String?
  internalNotes   String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  cancelledAt     DateTime?
  guest                Guest              @relation(fields: [guestId], references: [id])
  restaurantBooking    RestaurantBooking?
  payments             Payment[]
  communicationLogs    CommunicationLog[]
  @@index([type, status, date])
  @@index([guestId])
}

// Restaurant-specific extension of Booking
model RestaurantBooking {
  id          String    @id @default(cuid())
  bookingId   String    @unique
  service     String    // "LUNCH" | "DINNER"
  tableNumber Int?      // Assigned at seating, not at booking time
  confirmedAt DateTime?
  booking     Booking   @relation(fields: [bookingId], references: [id])
}

// One row per (date × service). Pre-seeded for 90 days ahead.
model RestaurantDayConfig {
  id           String    @id @default(cuid())
  date         DateTime  @db.Date
  service      String    // "LUNCH" | "DINNER"
  isOpen       Boolean   @default(true)
  maxCovers    Int       @default(40)
  heldCovers   Int       @default(10)    // Reserved for walk-ins, not bookable online
  openingTime  String    @default("12:30")
  closingTime  String    @default("14:30")
  slotInterval Int       @default(30)    // Minutes between slots
  notes        String?   // e.g. "Closed for private event"
  timeSlots    RestaurantTimeSlot[]
  @@unique([date, service])
  @@index([date, isOpen])
}

model RestaurantTimeSlot {
  id            String              @id @default(cuid())
  dayConfigId   String
  time          String              // "12:30", "13:00", etc.
  maxCovers     Int
  bookedCovers  Int                 @default(0)
  isAvailable   Boolean             @default(true)
  dayConfig     RestaurantDayConfig @relation(fields: [dayConfigId], references: [id])
  @@unique([dayConfigId, time])
}

model NewsletterSubscriber {
  id           String    @id @default(cuid())
  email        String    @unique
  firstName    String?
  interests    String[]  // ["sejour", "bien-etre", "restaurant", "retraites"]
  source       String    @default("website")
  language     String    @default("fr")
  subscribedAt DateTime  @default(now())
  confirmed    Boolean   @default(false)
}

model AdminUser {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String
  role         String    @default("staff")  // "owner" | "manager" | "staff"
  isActive     Boolean   @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime  @default(now())
}

model CommunicationLog {
  id          String    @id @default(cuid())
  bookingId   String
  channel     String    // "whatsapp" | "email"
  type        String    // "confirmation" | "reminder_24h"
  recipient   String    // Phone or email
  status      String    // "sent" | "delivered" | "failed"
  externalRef String?   // Twilio message SID or Resend email ID
  sentAt      DateTime  @default(now())
  booking     Booking   @relation(fields: [bookingId], references: [id])
  @@index([bookingId])
}
```

### Phase 1b Additions (Wellness — Jun–Sep 2026)

New tables: `WellnessService`, `PractitionerSchedule`, `Resource` (types: `PRACTITIONER`, `SPA_TREATMENT_ROOM`), `AvailabilitySlot` (multi-resource conflict detection), `BookingLineItem`.

Booking engine logic: find slots where **both** a practitioner AND a treatment room are free for `durationMinutes + bufferAfterMinutes`. Line items record which practitioner and which room are allocated.

### Phase 2 Additions (Rooms — Late 2026)

New tables: `RoomType` (6 rooms with citrus names), `PricingSeason` (multiplier per date range), `OtaChannel` (iCal import/export URLs per OTA). Add `Payment` model (first time payment processing is needed). Add `checkIn` / `checkOut` date fields to `Booking`. Heavy use of `AvailabilitySlot` for nightly room blocking with 15-min hold expiry.

### Phase 3 Additions (Retreats — 2027)

New tables: `RetreatProgram`, `RetreatDate`, `RetreatBooking`. `RetreatBooking` carries `activityCredits` (JSON), `creditsUsed` (JSON), and a `planYourStayToken` for the pre-arrival activity scheduler. Child bookings (room nights + wellness sessions) link back to the parent retreat booking via `parentBookingId`.

---

## Part 5 — Build Order

### Phase 0: Pre-Development (March 1 – April 6)

Not development hours — decisions and infrastructure that unblock coding.

| Task | Owner | Deadline |
|------|-------|----------|
| Register `domainesidiabdallah.com` (Namecheap) | Rached | **March 1** |
| Pre-register `darsaad.com` + `agrumia.com` | Rached | **March 1** |
| Create GitHub repo + Vercel project | Rached | March 1 |
| Create Supabase project (dev + prod) | Rached | March 1 |
| Set up Brevo, create "DSA Waitlist" list | Rached | March 1 |
| **Apply for Twilio WhatsApp API** (2–3 day approval) | Rached | **March 3** |
| Set up Resend for transactional email | Rached | March 5 |
| Set up Cloudflare, point domain DNS | Rached | March 5 |
| Set up Google Business Profile | Rached | March 10 |
| **Finalize design direction with Lilia** | Elyssa + Lilia | **March 15** |
| Logos validated, design tokens confirmed | Designer | March 15 |
| FR + EN website texts final-approved | Elyssa + Lilia | March 31 |
| Phase I photos delivered (property, orange grove) | Photographer | April 5 |

> **Hard blocker:** Design direction must be locked before April 7. Tailwind config and all component styling depend on it.

---

### Phase 1: Website + Restaurant Booking (April 7 – May 16)

**~230 hours across 6 weeks**

#### Week 1 (Apr 7–13) — Foundation
- Initialize Next.js 14 App Router + TypeScript + Tailwind (with confirmed design tokens)
- Set up `next-intl` with `fr.json` + `en.json` message files
- Implement `middleware.ts` (geo-detection + locale routing)
- Write Phase 1 Prisma schema → first migration on dev Supabase
- Build `Navigation.tsx` + `Footer.tsx` (desktop + mobile hamburger)
- Deploy skeleton to Vercel — production URL live from day 1

**Gate:** Vercel deployment succeeds. Custom domain resolves. Middleware logs correct audience for TN vs. non-TN IPs.

#### Week 2 (Apr 14–20) — Homepage
- `HeroSection.tsx` — geo-adaptive copy + CTA (TN: "Réserver via WhatsApp", INTL: "Discover the Domain")
- `PillarGrid.tsx` — 4 pillar cards with "Ouvert" / "Bientôt" status badges
- `StorySection.tsx` — farm narrative from MDX
- `NewsletterCapture.tsx` → `POST /api/newsletter` → Brevo waitlist
- `WhatsAppButton.tsx` — floating, links to DSA number with pre-filled message
- `AudienceToggle.tsx` — writes cookie, triggers `router.refresh()`
- Phase I photos integrated once delivered

**Gate:** Homepage renders FR and EN. Geo-detection switches copy. Newsletter form adds subscriber to Brevo.

#### Week 3 (Apr 21–27) — All Showcase Pages
- `/sejour` — Dar Saad concept, room name cards with evocative descriptions, "Rejoindre la liste" waitlist form
- `/bien-etre` — Agrumia concept, static service catalog (display only), WhatsApp CTA
- `/retraites` — Retreat program cards with story-first descriptions, email waitlist
- `/notre-histoire` — Property story, family, orange groves, farming philosophy
- `/contact` — Form → Resend email, WhatsApp link, address, Google Maps embed

**Gate:** All pages render FR/EN. Contact form sends to team inbox. Waitlist forms append to Brevo.

#### Week 4 (Apr 28 – May 4) — Restaurant Booking Backend
- `/restaurant` page — concept text, seasonal menu (MDX), "Réserver une table" CTA
- `lib/booking/restaurant.ts`:
  - `getAvailableSlots(date, covers)` — reads `RestaurantDayConfig`, calculates remaining covers per slot
  - `createBooking(data)` — Guest upsert + Booking + RestaurantBooking in one Prisma transaction
- `GET /api/availability/restaurant?date=&covers=` → available time slots with hints ("3 places restantes")
- `POST /api/bookings/restaurant` → validate → create → WhatsApp notification (Twilio) → email confirmation (Resend) → return booking reference
- Seed `RestaurantDayConfig` for next 90 days
- Unit tests: availability edge cases (full slots, partial capacity, date boundaries, race condition simulation)

**Gate:** End-to-end booking via API with test data. WhatsApp notification received. Email confirmation received. Full-slot attempt returns 409.

#### Week 5 (May 5–11) — Restaurant Booking UI + Admin
- `DatePicker.tsx` — calendar marking unavailable dates from API
- `TimeSlotSelector.tsx` — shows remaining capacity hint per slot
- `PartySizeSelector.tsx` — stepper 1–20
- `RestaurantBookingForm.tsx` — 3-step mobile-first flow: date → time → guest details → confirmation screen
- `POST /api/auth` → JWT in httpOnly cookie + admin route middleware
- `/admin/login` page
- `/admin/dashboard` — today's cover count, next 5 bookings, quick "Add booking" link
- `/admin/restaurant` — day selector, lunch/dinner panels, booking list sorted by time, one-tap status update (Pending → Confirmed → Seated → Completed / No-Show), cover counter with color indicator

**Gate:** Full booking flow on a real mobile device. Admin can log in, see booking, update status. Manual booking entry (walk-in) works.

#### Week 6 (May 12–16) — QA, Polish, Launch
- Lighthouse audit → optimize to LCP < 2.5s on throttled 4G
- `<meta>`, `og:image`, LocalBusiness structured data on all pages
- Accessibility: keyboard navigation, ARIA labels on forms, color contrast
- Vercel Analytics + Umami configured
- Cross-browser: Chrome, Safari, Firefox, iPhone Safari, Android Chrome (real devices)
- Geo-detection QA with VPN (TN → FR content; UK → EN content)
- Final FR/EN texts and photos placed
- DNS cutover → **go live**

---

### Phase 1b: Wellness Booking (June–September 2026)

*Trigger: confirmed opening date from Elyssa. Estimated ~90 hours over 3–4 weeks.*

1. Prisma migration: `WellnessService`, `PractitionerSchedule`, `Resource`, `AvailabilitySlot`, `BookingLineItem`
2. Populate `Resource` rows (each practitioner + each treatment room)
3. `lib/booking/wellness.ts` — find slots where practitioner AND room are both free (with buffer)
4. `GET /api/availability/wellness?service=&date=` and `POST /api/bookings/wellness`
5. `ServiceCatalog.tsx` — visual grid by category (massage, hammam, yoga, fitness)
6. `WellnessBookingForm.tsx` — service → date → time slot → guest details
7. `/admin/bien-etre` — practitioner columns × time rows daily grid
8. Switch `/bien-etre` from ComingSoon to live booking flow

---

### Phase 2: Room Booking + Payments (Late 2026)

*Trigger: confirmed hotel opening date. Estimated ~200 hours over 6–7 weeks.*

1. Prisma migration: `RoomType`, `PricingSeason`, `OtaChannel`, `Payment`. Add `checkIn` / `checkOut` to `Booking`.
2. Populate `AvailabilitySlot` for all 6 rooms × next 12 months
3. `lib/booking/rooms.ts` — date-range availability check, pricing (base × season × LOS discount × weekend premium), 15-min hold with expiry
4. `GET /api/availability/rooms?checkin=&checkout=&guests=` → available rooms with prices
5. `POST /api/bookings/rooms` → validate → hold slots → create booking → trigger payment
6. Set up Stripe (international) + Konnect (Tunisian) test mode
7. `AvailabilityCalendar.tsx` — date-range picker with per-night pricing
8. `RoomCard.tsx` — large photo, room name, specs row, price, CTA
9. 3-step booking flow: dates → room selection → guest details + payment
10. Stripe Elements + Konnect checkout integration
11. `GET /api/bookings/rooms/[id]/ical` → iCal export for OTA
12. OTA import cron — fetches Booking.com + Airbnb iCal URLs → blocks dates in `AvailabilitySlot`
13. `/admin/sejour` — 6-room × 30-day grid, arrivals/departures sidebar
14. Switch `/sejour` from waitlist to full booking flow

---

### Phase 3: Retreats + Management Dashboard (2027+)

*Estimated ~200 hours over 8–10 weeks.*

1. `RetreatProgram` + `RetreatDate` + `RetreatBooking` schema
2. Admin: create/edit retreat programs, open dates, manage capacity
3. Dynamic `/retraites/[slug]` pages with "A Day in Your Retreat" visual timeline
4. Retreat booking: select date → room preference → 30% deposit payment
5. `planYourStayToken` URL: pre-arrival activity scheduler consuming activity credits
6. Composite availability check (room free for all nights AND wellness capacity exists)
7. Unified admin calendar — all pillars in one timeline view
8. Guest CRM — per-guest history, total spend, notes

---

## Part 6 — Back-Office Roadmap

### Phase 1 (ships at launch)
| Route | What it does |
|-------|-------------|
| `/admin/login` | Email + password → JWT httpOnly cookie |
| `/admin/dashboard` | Today's cover count, next 5 reservations, quick links |
| `/admin/restaurant` | Day selector, lunch/dinner panels, booking list, one-tap status update, cover counter |
| `/admin/restaurant/config` | Toggle services open/closed, override capacity per date |

### Phase 1b (when Agrumia opens)
| Route | What it does |
|-------|-------------|
| `/admin/bien-etre` | Practitioner columns × time rows grid, colored booking blocks, empty = bookable |

### Phase 2 (when Dar Saad opens)
| Route | What it does |
|-------|-------------|
| `/admin/sejour` | 6-room × 30-day color-coded grid, arrivals/departures sidebar, revenue MTD |
| `/admin/sejour/bookings/[id]` | Full detail: guest, dates, room, payment status, check-in/out/cancel actions |
| `/admin/guests` | Guest list, per-guest booking history |

### Phase 3 (2027)
| Route | What it does |
|-------|-------------|
| `/admin` | Unified dashboard: revenue per pillar, occupancy rates, upcoming retreats |
| `/admin/retraites` | Program management, date management, activity credit tracking |
| `/admin/unified-calendar` | All resources (rooms, practitioners, restaurant) in one timeline |

---

## Part 7 — Deployment Pipeline

### Branch Strategy

| Branch | Vercel target | Database |
|--------|--------------|----------|
| `main` | Production | Production Supabase |
| `develop` | Preview (stable) | Dev Supabase |
| `feature/*` | Preview (per-PR URL) | Dev Supabase |

**Workflow:** `feature/*` → PR to `develop` (preview URL shared with Elyssa for review) → merge to `develop` → when release-ready, PR `develop` → `main` → CI must pass → auto-deploys to production.

### Vercel Configuration

```json
{
  "framework": "nextjs",
  "regions": ["cdg1"],
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

`cdg1` (Paris) = lowest Vercel latency to Tunisia (~40–60ms RTT vs. ~120ms from US East).

### Environment Variables

```bash
# Database
DATABASE_URL                     # Supabase pooler URL (pgbouncer)
DIRECT_URL                       # Supabase direct URL (Prisma migrations)

# Auth
ADMIN_JWT_SECRET                 # 32+ char random string

# Notifications
RESEND_API_KEY
FROM_EMAIL                       # "Domaine Sidi Abdallah <noreply@domainesidiabdallah.com>"
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER           # "whatsapp:+14155238886" (sandbox) or verified number
NEXT_PUBLIC_WHATSAPP_NUMBER      # DSA's actual WhatsApp number, for frontend links

# Newsletter
BREVO_API_KEY
BREVO_WAITLIST_LIST_ID

# Payments (Phase 2)
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
KONNECT_API_KEY
KONNECT_WALLET_ID

# Site
NEXT_PUBLIC_SITE_URL             # https://domainesidiabdallah.com

# Dev only (.env.local, gitignored)
DEV_GEO_COUNTRY                  # "TN" or "GB" to simulate geo locally
```

---

## Part 8 — Effort Estimates

| Phase | Timeline | Developer Hours | Scope |
|-------|----------|----------------|-------|
| Phase 0 | Mar 1 – Apr 6 | ~10h (admin) | Accounts, domains, infrastructure |
| Phase 1 | Apr 7 – May 16 (6 weeks) | ~230h | Full website + restaurant booking + admin |
| Phase 1b | Jun–Sep 2026 (3–4 weeks) | ~90h | Wellness booking + practitioner admin |
| Phase 2 | Late 2026 (6–7 weeks) | ~200h | Room booking + payments + OTA sync |
| Phase 3 | 2027+ (8–10 weeks) | ~200h | Retreats + unified dashboard + CRM |
| **Total** | **~14 months** | **~730h** | All four pillars fully operational |

Phase 1: 230h ÷ 6 weeks = ~38h/week. Feasible with zero scope creep. Scope must stay locked.

---

## Part 9 — Launch Verification Checklist

### Phase 1 Gate (before go-live)

**Performance**
- [ ] Lighthouse mobile: Performance > 85, Accessibility > 90, SEO > 95
- [ ] LCP < 2.5s on throttled 4G (Chrome DevTools)

**Geo-detection**
- [ ] Tunisian VPN → FR content, WhatsApp CTA, no `/en/` prefix
- [ ] International VPN → EN content, booking form CTA, `/en/` prefix
- [ ] Audience toggle switches content and persists on page reload

**Content**
- [ ] FR ↔ EN toggle works on every page
- [ ] All pages have correct `<title>`, `<meta description>`, `og:image`
- [ ] All 3 ComingSoon overlays (séjourner, bien-être, retraites) capture email to Brevo

**Bookings**
- [ ] Restaurant booking end-to-end: WhatsApp notification to team, email confirmation to guest
- [ ] Full-slot booking attempt → 409 error (no double-booking)
- [ ] Admin login → bookings visible → status update persists
- [ ] Manual walk-in booking entry from admin works

**Forms**
- [ ] Newsletter form → subscriber appears in Brevo
- [ ] Contact form → email arrives at team inbox
- [ ] WhatsApp floating button links to correct number with pre-filled message

**Devices**
- [ ] iPhone Safari (real device, not simulator)
- [ ] Android Chrome (real device)

### Phase 1b Gate
- [ ] Overlapping practitioner bookings → second attempt rejected
- [ ] 15-min buffer enforced between appointments
- [ ] Wellness admin timeline renders bookings as time-span blocks

### Phase 2 Gate
- [ ] Overlapping room date range → rejected
- [ ] 15-min slot hold expires via cron → room becomes available again
- [ ] Stripe test card `4242 4242 4242 4242` → booking confirmed end-to-end
- [ ] iCal export imports correctly into Apple Calendar
- [ ] Mock Airbnb iCal block → date blocked on website

---

## Reference Documents

| Document | Purpose |
|----------|---------|
| [DSA_Digital_Strategy_Plan.md](DSA_Digital_Strategy_Plan.md) | Master technical strategy — primary reference for feature scope at every phase |
| [reponse-brief-elyssa-lilia.md](reponse-brief-elyssa-lilia.md) | Vertical slice architecture rationale, data model sketches, booking UX principles |
| [Brief.md](Brief.md) | Original client brief — audience personas, UX principles, content delivery schedule |
| [../designs/proposition-site-web-dsa.html](../designs/proposition-site-web-dsa.html) | All 5 design directions — design tokens to translate into `tailwind.config.ts` |
