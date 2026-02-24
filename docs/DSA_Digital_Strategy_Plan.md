# Digital Strategy & Project Plan — Domaine Sidi Abdallah

## Context

Domaine Sidi Abdallah is a luxury agritourism property in Mohammedia, Tunisia combining 3 pillars — boutique guesthouse (Dar Saad, 6 rooms), wellness center (Agrumia), farm-to-table restaurant — with retreats & events as a transversal layer.

**Current status (Feb 2026):** Renovations start April 6. Logos validating mid-March. Website text ready FR/EN (pending Lilia review). 5 design proposals exist, none chosen. No final photos or prices.

**Team & roles:**
- **Rached** — Developer. Builds all digital assets. Technical decisions.
- **Elyssa** — Project lead. Manages overall project (building, renovating, content, coordination). Strategic decisions with Rached.
- **Lilia** — Owner/stakeholder. Approves budget, strategic direction, and artistic choices. Engaged via WhatsApp only.

**Key decisions made:**
- Rached builds everything himself (React/Node/TypeScript stack)
- Geo-aware single website (one URL, content adapts based on visitor country)
- Hybrid launch: showcase for hotel/retreats, functional booking for restaurant/wellness
- Competitive research integrated as Phase 0 action
- Project management: Google Sheet + WhatsApp (minimal tooling)
- Lilia gets WhatsApp updates + screenshots for approvals
- Agrumia membership digital block (C) eliminated — no member portal, no subscription management, no membership page. Wellness operates as pay-per-visit/booking only.

---

## Project Management Setup

### Google Sheet — "DSA Digital Tracker"

**Tab 1: Task Board** (Kanban-style with status columns)

| Task | Block | Status | Owner | Due | Notes |
|------|-------|--------|-------|-----|-------|
| Register domain | Infrastructure | To Do | Rached | Mar 5 | .tn + .com? |
| ... | ... | ... | ... | ... | ... |

Statuses: `To Do` → `In Progress` → `Review` → `Done`
Filter by Block (1-6) to see per-block progress.

**Tab 2: Decisions Log**

| Date | Decision | Context | Decided by | Source |
|------|----------|---------|------------|--------|
| Feb 23 | Geo-aware single site | ... | Rached + Elyssa | WhatsApp |

When a decision happens on WhatsApp, one of you logs it here. Takes 30 seconds. Prevents "wait, what did we decide about X?"

**Tab 3: Asset Tracker**

| Asset | Status | Owner | ETA | Location |
|-------|--------|-------|-----|----------|
| Logo DSA | In review | Elyssa/designer | Mid-March | Drive |
| Logo Dar Saad | In review | Elyssa/designer | Mid-March | Drive |
| Logo Agrumia | In review | Elyssa/designer | Mid-March | Drive |
| FR website text | Ready (pending Lilia review) | Elyssa | March | Drive |
| EN website text | Ready | Elyssa | March | Drive |
| Phase I photos | Planned | Elyssa/photographer | Feb-Mar | Drive |
| Phase II photos (making-of) | Not started | Elyssa | May-Jun | — |

**Tab 4: Timeline / Milestones**

| Milestone | Target date | Depends on | Status |
|-----------|-------------|------------|--------|
| Logos finalized | Mid-March 2026 | Designer delivery + Lilia approval | In progress |
| Phase I photos delivered | March 2026 | Photographer shoot | Planned |
| Design direction chosen | March 2026 | Lilia + Elyssa + Rached | Not started |
| Website Phase 1 live | May 2026 | Logos + photos + text + design decision | Not started |
| Renovation starts | April 6, 2026 | Contractors | Confirmed |
| Restaurant opens | TBD | Renovation | — |
| Wellness opens | TBD | Renovation (wellness space TBD) | — |
| Hotel opens | TBD (post-Ramadan?) | Full renovation complete | — |

### Lilia's Involvement
- WhatsApp group: "DSA Digital" (Rached + Elyssa + Lilia)
- When approval needed: Elyssa sends a clear message with screenshots/links + specific question
- Format: "Lilia, we need your decision on [X]. Option A: ... Option B: ... Our recommendation: A. Can you confirm?"
- No need for Lilia to check any tool — everything comes to her

---

## The 6 Digital Blocks

---

### Block 1: Site Web (Website)

#### Architecture: Geo-Aware Single Site

One codebase, one URL. Next.js middleware (running on Vercel Edge) detects the visitor's IP country and adapts the experience:

**What changes by audience:**

| Element | Tunisian visitor (IP from Tunisia) | International visitor (all other IPs) |
|---------|-----------------------------------|---------------------------------------|
| Default language | Français | English |
| Homepage hero | "Votre échappée nature à 16km de Tunis" | "An authentic Tunisian retreat in the heart of citrus groves" |
| Primary CTAs | "Réserver une table" / "Réserver un soin" / WhatsApp | "Book a stay" / "Explore retreats" / Online form |
| Pricing | TND | EUR (with TND equivalent) |
| Payment methods | Flouci / Konnect / Click to Pay | Stripe (Visa/MC) |
| Content emphasis | Restaurant menu, spa day packages, events calendar | Rooms, retreats, story, farm-to-table philosophy |
| Booking flow | WhatsApp + simple form (quick, mobile) | Online booking form (detailed, planned) |

**What stays the same:**
- All content exists in both versions (user can switch manually via language toggle)
- Room descriptions, wellness offerings, restaurant concept — shared content
- Photo gallery, about page, contact — identical
- Manual override: "I'm a Tunisian abroad" / "Je suis en Tunisie" toggle (sets a cookie)

**Technical implementation:**
- **Next.js 14+** with App Router
- **Vercel Edge Middleware** — reads `request.geo.country`, sets a cookie `audience=tn|intl`
- **Tailwind CSS** for styling
- **next-intl** or **next-i18next** for FR/EN
- Content: Markdown/MDX files initially, migrate to Sanity CMS if Elyssa needs to edit without code
- Images: optimized via Next.js Image component + Vercel CDN

**Phasing:**

| Phase | When | What |
|-------|------|------|
| 1 | April-May 2026 | Showcase site: all pages, FR/EN, geo-detection, WhatsApp CTAs. Hotel/retreats = "coming soon" with email capture. Restaurant/wellness = simple booking (form/WhatsApp). |
| 1b | When pillars open | Activate real booking for operational pillars. Switch "Bientôt" → "Ouvert". |
| 2 | Late 2026 | Online booking integration, payment gateway, OTA integration, final photos/prices. |
| 3 | 2027+ | Composite retreat builder, blog/SEO. |

**Site structure:**
```
/                    → Homepage (geo-adapted hero + 4 pillars + story + newsletter)
/en/                 → English version (all pages)
/sejour              → Dar Saad rooms + experience. Coming soon with waitlist (Phase 1)
/bien-etre           → Agrumia wellness + spa menu + service catalog. Booking CTA
/restaurant          → Farm-to-table concept + seasonal menu. Booking CTA
/retraites           → Retreat programs + calendar. Coming soon with email capture (Phase 1)
/notre-histoire      → Property story, family, philosophy, orange groves
/contact             → Form, WhatsApp, phone, map
```

**Design direction:** Still open — 5 proposals at https://rachedmaalej.github.io/inspiration-website-dsa/website-proposals.html. Decision needed by March with Lilia + Elyssa. Present alongside competitive research findings.

---

### Block 2: Système de Réservation (Booking System)

**Strategic decision: Build everything in-house with Claude Code.**
No SaaS dependency (no Fresha, no PMS, no TheFork). Full control over UX, data, and integration.

#### Architecture: Unified Monolithic Booking Engine

One codebase, one database, one API serving all 3 booking domains (restaurant, wellness, rooms) + composite retreats. This is the correct architecture for a single property — microservices add complexity with zero benefit at this scale.

**Tech stack:**
- **Frontend:** Next.js (part of the website) — booking UI lives within the main site
- **Backend:** Next.js API routes (or separate Express API if needed)
- **Database:** PostgreSQL via Supabase (free tier → Pro when needed)
- **ORM:** Prisma
- **Payments:** Stripe (international) + Konnect (Tunisian)
- **Notifications:** Resend (email) + WhatsApp Business API via Twilio (SMS/WhatsApp)
- **OTA sync:** iCal export (Phase 2 MVP) → Channex.io API (Phase 2b for real-time sync)
- **Calendar:** Custom availability engine (calendar table pattern, not gap analysis)

#### Core Data Model (shared across all booking types)

```
Guest {
  id, firstName, lastName, email, phone, country, language,
  source (DIRECT | BOOKING_COM | AIRBNB | WALKIN | WHATSAPP),
  notes, createdAt, lastVisitAt
}

-- MULTI-RESOURCE AVAILABILITY ENGINE --

ResourceType: ROOM | SPA_ROOM | RESTAURANT_TABLE | PRACTITIONER | CLASS_SESSION

Resource {
  id, type: ResourceType, name, capacity, properties (JSONB),
  isActive
}

-- One row per resource per date (or per time-slot for spa/restaurant)
AvailabilitySlot {
  id, resourceId, date, startTime?, endTime?,
  status (AVAILABLE | HELD | BOOKED | BLOCKED),
  price?, bookingId?, holdExpiresAt?,
  UNIQUE(resourceId, date, startTime)
}

-- UNIFIED BOOKING --

Booking {
  id, guestId, type (ROOM | SPA | RESTAURANT | RETREAT | DAY_PASS),
  parentBookingId? (for sub-bookings within a retreat),
  status (PENDING | CONFIRMED | CHECKED_IN | COMPLETED | CANCELLED | NO_SHOW),
  checkIn?, checkOut?,  -- for room bookings
  date?, startTime?, endTime?,  -- for spa/restaurant
  totalPrice, currency (TND | EUR | USD),
  source (DIRECT | OTA | WHATSAPP | PHONE | WALKIN),
  channelBookingRef?,
  specialRequests?, internalNotes?,
  createdAt, updatedAt
}

BookingLineItem {
  id, bookingId, resourceId, description,
  date, startTime?, endTime?,
  unitPrice, quantity, subtotal
}

Payment {
  id, bookingId, amount, currency,
  gateway (STRIPE | KONNECT | CASH | BANK_TRANSFER),
  gatewayRef, type (DEPOSIT | FULL | REFUND | CHARGE),
  status (PENDING | CAPTURED | FAILED | REFUNDED),
  capturedAt
}

-- RESTAURANT-SPECIFIC --

DayConfig {
  id, date, service (LUNCH | DINNER),
  maxCovers, isOpen,
  slots: [{ time, maxCovers, isOpen }]
}

-- SPA/WELLNESS-SPECIFIC --

Service {
  id, name, category (MASSAGE | HAMMAM | FACIAL | YOGA | FITNESS),
  durationMinutes, bufferAfterMinutes,
  price, requiresRoom, requiresPractitioner,
  maxCapacity,  -- for group services (yoga: 12, hammam: 6)
  description
}

PractitionerSchedule {
  id, practitionerId (→ Resource), date,
  startTime, endTime, isAvailable
}

-- ROOM-SPECIFIC --

RoomType {
  id, name, description, maxOccupancy, basePrice,
  amenities (JSONB)
}

Season {
  id, name, startDate, endDate,
  priceMultiplier  -- 1.0 = normal, 1.3 = high, 0.85 = low
}

CancellationPolicy {
  id, name, freeCancelUntilDays,
  penaltyPercent, noShowCharge
}

-- OTA SYNC --

Channel {
  id, name (BOOKING_COM | AIRBNB | DIRECT),
  icalExportUrl, icalImportUrl,
  lastSyncAt
}
```

#### The 3+1 Booking Types

---

**2.1 Restaurant Booking**

The simplest booking type. Capacity-based (not table-based) for online booking; table assignment happens at the host stand.

**How it works:**
1. Guest selects: date + service (Lunch/Dinner) + time slot + party size
2. System checks: `DayConfig.slots[time].maxCovers - currentBookings >= partySize`
3. Guest enters: name, phone, special requests (dietary, occasion)
4. Confirmation via WhatsApp (primary) + email
5. Reminder T-24h via WhatsApp ("Reply C to confirm, X to cancel")

**Key design decisions:**
- **Capacity model, not table model** — don't expose table inventory to guests
- **Turn times:** lunch = 90min, dinner = 120min (configurable per day)
- **Hold 20-30% of capacity for walk-ins** — never allocate 100% to reservations
- **No-show prevention:** WhatsApp reminders (98% open rate). Credit card hold optional for large parties (6+) using Stripe `capture_method: manual`
- **WhatsApp as primary channel:** Pre-filled WhatsApp link + automated response flow for Tunisian audience. Form-based for international.

**Admin view:**
- Daily reservation list (by time slot, with guest details + status)
- One-tap status updates: Confirmed → Seated → Completed / No-Show
- Daily cover counter (reserved vs capacity)

---

**2.2 Wellness/Spa Booking**

Multi-resource scheduling: each appointment needs a practitioner AND a room AND both must be free at the same time (with buffer).

**How it works:**
1. Guest browses: service catalog (organized by category: Massage, Hammam, Yoga, Fitness)
2. Guest selects: service + date
3. System calculates: available time slots where `practitioner_free(slot, duration+buffer) AND room_free(slot, duration+buffer)`
4. Guest optionally selects practitioner preference
5. Guest enters: name, phone, special requests
6. Confirmation via WhatsApp + email

**Resource conflict resolution query (PostgreSQL):**
```sql
-- Find available slots for a 60-min massage with 15-min buffer
SELECT generate_series(
  '09:00'::time, '18:00'::time, '30 minutes'::interval
) AS slot_time
WHERE NOT EXISTS (
  SELECT 1 FROM availability_slot
  WHERE resource_id = [practitioner_id]
  AND date = [target_date]
  AND status IN ('BOOKED', 'HELD')
  AND tsrange(start_time, end_time) && tsrange(slot_time, slot_time + '75 min')
)
AND NOT EXISTS (
  SELECT 1 FROM availability_slot
  WHERE resource_id = [room_id]
  AND date = [target_date]
  AND status IN ('BOOKED', 'HELD')
  AND tsrange(start_time, end_time) && tsrange(slot_time, slot_time + '75 min')
);
```

**Package booking (e.g., Hammam + Massage):**
- Packages are defined as ordered sequences of services
- System finds a time window where ALL required resources are available sequentially
- Creates a parent `Booking` with child `BookingLineItem` per service
- All created atomically in a single DB transaction (Prisma `$transaction`)

**Group sessions (Yoga, Fitness):**
- Different model from individual appointments — uses `ClassSession` + `ClassEnrollment`
- Instructor creates weekly recurring schedule
- Guests enroll in specific sessions (capacity-limited)
- Waitlist: if session full, guest can join waitlist → auto-notified if spot opens

**Admin view:**
- Daily schedule per practitioner (timeline view)
- Room utilization grid
- Class session enrollment list
- One-tap status: Confirmed → In Progress → Completed / No-Show

---

**2.3 Room Booking (Dar Saad)**

6 rooms, each unique with a citrus name. Show all rooms (no category filtering needed at this scale).

**How it works (3-step booking flow):**
1. **Dates + Guests:** Date picker with inline availability (color-coded). Price per night shown on available dates. Guest count selector.
2. **Room selection:** All 6 rooms displayed as visual cards (large photo gallery, evocative name, brief poetic description, specs row, price). Only available rooms shown (unavailable ones grayed with "Sold out for these dates"). Show "Only 2 rooms left" when genuine.
3. **Guest details + Payment:** Name, email, phone, arrival time, special requests. Payment via Stripe (international) or Konnect (Tunisian). Deposit (30%) or full prepay for non-refundable rate.

**Availability engine (calendar table pattern):**
- One row per room per date in `AvailabilitySlot`
- To check 3-night availability: query `WHERE room_id = X AND date BETWEEN check_in AND check_out-1 AND status = 'AVAILABLE'` — must return exactly N rows for N nights
- When booking: UPDATE all rows atomically to `BOOKED` within a transaction
- 15-minute hold: on step 2 selection, set status to `HELD` with `holdExpiresAt`. Cron job releases expired holds.

**Pricing engine (rule-based, no ML needed):**
```
finalPrice = basePrice
  × season.multiplier          -- high/low/shoulder
  × (1 - lengthOfStayDiscount) -- -10% for 5+ nights
  × (1 - earlyBookingDiscount) -- -5% for 60+ days ahead
  × weekendPremium             -- +10% Fri-Sat
```

**OTA Integration (critical for international discovery):**

Booking.com and Airbnb do NOT give API access to individual properties. Two options:

| Approach | How | Delay | Cost | Risk |
|----------|-----|-------|------|------|
| **iCal sync** | Export your calendar as .ics URL. Import OTA calendars. Each OTA polls every 20min-4hrs. | 20min-4hr | Free | Double-booking window |
| **Channex.io** | White-label channel manager API. Real-time 2-way sync. You build the UI, they handle OTA connections. | Real-time | ~$3-5/room/month | Low |

**Recommended path:**
- Phase 2 launch: iCal sync (free, simple, acceptable risk for 6 rooms with low booking velocity)
- Phase 2b: Channex.io API if iCal delay causes problems or booking volume increases
- Direct booking incentive: "Book direct for complimentary airport transfer" (or welcome drink, early check-in)

**Target:** 50%+ direct bookings within year 1 (industry avg is 37%, well-optimized boutiques reach 55%)

**Cancellation policy:**
- Flexible rate: free cancel until 48h before, 1-night penalty 48-0h, full no-show charge
- Non-refundable rate: -10% discount, 100% upfront, no refund
- Retreats: 30% deposit at booking, balance 2 weeks before arrival, free cancel until 2 weeks

---

**2.4 Composite Retreat Booking (the strategic differentiator)**

**Key insight from research: Use the Canyon Ranch pattern.**

Don't try to sell "room + hammam + 4 activities + meals + transfers" as one atomic transaction. Instead:

**What you sell:** "The Yoga Retreat — 3 nights" (fixed package with a name and a price). This includes: accommodation, all meals, wellness access, and a credit/allocation for specific treatments.

**What you schedule separately:** The specific massage slot, the specific yoga class, the room assignment. These are booked pre-arrival (via a "Plan your stay" link sent after the package is confirmed) or on-site.

**This elegantly sidesteps the partial availability problem.** The guest commits to the package even if their preferred massage time isn't available yet. The schedule is a separate, mutable concern.

**Technical implementation:**

```
RetreatProgram {
  id, name, description, durationNights,
  basePrice, maxParticipants,
  includes: ["accommodation", "all_meals", "2x_yoga_daily", "1x_hammam", "1x_massage_60min"],
  schedule: DaySchedule[]  -- template: day 1 = arrival + dinner, day 2 = yoga + hammam + ...
}

RetreatDate {
  id, programId, startDate, endDate,
  availableSpots, status (OPEN | FULL | CANCELLED)
}

RetreatBooking {
  id, retreatDateId, guestId,
  roomBookingId (→ Booking),     -- linked room reservation
  status, totalPrice, depositPaid,
  activityCredits: { type, quantity, used }[],  -- "1x massage", "1x hammam"
  scheduledActivities: Booking[]  -- child bookings for specific slots
}
```

**Guest booking flow:**
1. Browse retreat programs on `/retraites` (visual cards with "A Day in Your Retreat" timeline)
2. Select a retreat + available date → see remaining spots
3. Select room preference (from available rooms for those dates)
4. Guest details + 30% deposit payment
5. Confirmation email + WhatsApp with "Plan Your Stay" link
6. Pre-arrival (7 days before): guest accesses "Plan Your Stay" to book specific treatment times, yoga preferences
7. On-site: remaining unscheduled credits can be booked with staff

**"A Day in Your Retreat" visual (key UX element):**
```
[07:00] ☀️ Morning yoga on the terrace
[08:30] 🍊 Farm breakfast — seasonal citrus from our groves
[10:00] 🌿 Free time: hammam, reading, wandering the orchards
[13:00] 🍽️ Farm-to-table lunch
[15:00] 💆 Your treatment: hammam ritual or massage (you choose)
[18:00] 🌅 Sundowner on the terrace with views of Jbel Ressas
[20:00] 🔥 Dinner under the stars
```

---

#### Phasing: Build Order

| Phase | When | What to build | Effort |
|-------|------|---------------|--------|
| **1** | Apr-May 2026 | Contact forms + WhatsApp pre-filled links (no booking engine) | 1 week |
| **1b** | When restaurant opens | Restaurant booking: date/time/party picker → WhatsApp + email confirmation. Admin daily list view. | 2-3 weeks |
| **1b+** | When wellness opens | Spa booking: service catalog, practitioner scheduling, availability engine, confirmation. Admin schedule view. | 3-4 weeks |
| **2** | Hotel opens (late 2026) | Room booking: availability calendar, 3-step flow, Stripe + Konnect, confirmation emails, admin dashboard. | 4-6 weeks |
| **2b** | After room launch | OTA integration: iCal export/import for Booking.com + Airbnb. Channex.io API if needed. | 1-2 weeks |
| **3** | 2027 (6+ months of data) | Composite retreat booking: program definition, date management, package purchase, "Plan Your Stay" pre-arrival scheduler. | 6-8 weeks |
| **3+** | Ongoing | WhatsApp Business API automation, AI booking assistant, dynamic pricing rules, abandoned booking recovery. | Incremental |

#### Guest-Facing UX Principles

- **Audience routing at entry:** "What are you planning?" → 3 clear paths (Stay / Wellness / Table) before any booking form
- **3-step maximum** for any booking type
- **WhatsApp as first-class channel:** "Book via WhatsApp" alongside every form for Tunisian audience
- **Show all 6 rooms** (no category filtering) with evocative names + large photos
- **Inline availability on calendar** with per-night pricing
- **Mobile-first:** bottom-anchored CTAs, full-screen date picker, Apple Pay / Google Pay
- **Genuine scarcity:** "2 rooms left" or "3 spots remaining" only when factually true

#### Admin Dashboard (built incrementally)

- **Phase 1b:** Daily reservation list (restaurant + spa), status updates, cover counter
- **Phase 2:** Room calendar (6 rooms × dates grid), booking management, payment tracking
- **Phase 3:** Unified calendar across all pillars, retreat management, guest CRM
- **Access:** Web-based, mobile-responsive, secured with auth (reuse your JWT pattern from BleSaf)

#### Automated Communication Pipeline

| Trigger | Channel | Content |
|---------|---------|---------|
| Booking confirmed | WhatsApp + Email | Reservation details, cancellation policy, property map |
| T-48h (restaurant) | WhatsApp | "Reply C to confirm, X to cancel" |
| T-7 days (room/retreat) | Email | Pre-arrival: what to pack, directions, "Plan Your Stay" link |
| T-2 days (room/retreat) | WhatsApp | Check-in instructions, arrival info |
| T-1 day | WhatsApp | "We're looking forward to welcoming you tomorrow" |
| Post-stay (+2h) | WhatsApp | Thank you + Google Review link |
| Post-stay (+24h) | Email | Thank you + review request + direct rebooking offer |

#### Reference Websites to Study

Best booking UX for properties similar to DSA:
- **Babylonstoren** (babylonstoren.com) — farm property, integrated booking, seasonal promotions
- **Canyon Ranch** (canyonranch.com) — package selector with credit system (the model for retreats)
- **Singita** (singita.com) — inquiry-driven luxury booking, "Journey Designer" touchpoint
- **The Newt in Somerset** (thenewtinsomerset.com) — farm estate with cross-sell between dining/accommodation
- **Fogo Island Inn** (fogoislandinn.ca) — mission-driven booking narrative, all-inclusive pricing
- **Bookinglayer** (bookinglayer.com) — retreat booking software, study their package builder UX
- **Cap Rocat** (caprocat.com) — "request to stay" framing, inquiry-based for luxury

---

### Block 3: Paiement & Facturation (Payment & Billing)

**Phase 1: No online payment.** Tunisian day visitors pay on-site (cash/card). Zero payment complexity.

**Phase 2 (hotel opening):**

| Audience | Gateway | Currencies | Use case |
|----------|---------|-----------|----------|
| Tunisian | Konnect or Flouci | TND | Restaurant, spa, day passes, room bookings |
| International | Stripe | EUR, USD, GBP | Room bookings, retreat deposits, full retreat payment |

**Billing features (Phase 2+):**
- Booking confirmation email with receipt
- Deposit system for retreats (e.g., 30% upfront, balance on arrival)
- Cancellation policy enforcement (refund rules per booking type)
- Invoice generation for corporate events / team buildings

**Phase 3:**
- Gift card / voucher system (day pass, spa package, dining experience)
- Unified invoicing across all pillars

---

### Block 4: Communication Client (Client Communication)

#### Step 1: Client Segment Identification

| Segment | Who | Size est. | Primary channel | Language | Key trigger moments |
|---------|-----|-----------|-----------------|----------|-------------------|
| **A. Tunisian day visitors** | Locals from Tunis area wanting lunch, spa day, events | ~40% of revenue | Instagram → WhatsApp | FR | Weekend planning, special occasions, events |
| **B. Tunisian staycationers** | Residents seeking weekend escape near Tunis | ~15% of revenue | Instagram → Website → WhatsApp/form | FR | School holidays, long weekends, couple getaways |
| **C. International tourists** | Experiential/sustainable travelers | ~25% of revenue | Google/OTA → Website → Email/form | EN (FR secondary) | Trip planning 2-6 months ahead |
| **D. Corporate clients** | Companies for team building, events | ~10-15% of revenue | LinkedIn / Network → Email/WhatsApp | FR/EN | Annual team events, client entertainment |

(Note: percentages adapted from strategic docs, some segments overlap. Agrumia membership block eliminated — wellness operates as pay-per-visit only.)

#### Step 2: Communication Plan Per Segment

**Segment A — Tunisian Day Visitors:**
- **Discovery:** Instagram content (food photography, spa ambiance, event announcements)
- **Engagement:** Instagram stories with polls/questions, behind-the-scenes
- **Conversion:** Instagram → WhatsApp link for booking
- **Retention:** WhatsApp broadcast list for events + promotions (weekly/bi-weekly)
- **Tools:** Instagram Business + WhatsApp Business

**Segment B — Tunisian Staycationers:**
- **Discovery:** Instagram + word-of-mouth + Google ("weekend nature Tunis")
- **Engagement:** Website retreat/package pages with seasonal offers
- **Conversion:** Website contact form or WhatsApp
- **Retention:** Email newsletter with seasonal packages (monthly)
- **Tools:** Instagram + Website + Brevo (email)

**Segment C — International Tourists:**
- **Discovery:** Google organic + Booking.com/Airbnb + Pinterest + travel blogs
- **Engagement:** Website storytelling, photo gallery, retreat descriptions
- **Conversion:** Online booking form → email confirmation → pre-arrival info
- **Retention:** Post-stay email sequence (thank you → review request → seasonal offers)
- **Tools:** Website + Brevo (automated email sequences) + OTAs

**Segment D — Corporate Clients:**
- **Discovery:** LinkedIn + personal network + referrals
- **Engagement:** Dedicated corporate page on website (or PDF deck)
- **Conversion:** Custom quote via email
- **Retention:** Annual follow-up email + personalized proposals
- **Tools:** Email + LinkedIn + custom proposal template

#### Step 3: Email Automation (Brevo, free tier)

**Automated sequences to set up:**

1. **Waitlist welcome** (Phase 1): signup → welcome email → monthly update during construction → opening announcement
2. **Post-booking** (Phase 2): booking confirmed → pre-arrival info (3 days before) → post-stay thank you + review request (2 days after)
3. **Newsletter** (ongoing): monthly email with events, seasonal offers, new photos, farm stories
4. **Retreat interest** (Phase 1): retreat form submission → "we'll notify you when bookings open" → retreat launch announcement
5. **Wellness regulars** (Phase 2): spa/activity booking confirmation → post-visit thank you → seasonal promotions for repeat visitors

---

### Block 5: Back-Office / Gestion (Management)

**Phase 1-2: Keep it simple — Google Sheets + WhatsApp**

For a 6-room property with 1 restaurant and 1 wellness center in its first year, you don't need a custom dashboard. You need:

- **Shared Google Sheet: "DSA Operations"**
  - Tab: Room calendar (manual, 6 rooms × dates grid)
  - Tab: Restaurant reservations (date, name, guests, contact, status)
  - Tab: Spa bookings (date, service, client, time, therapist)
  - Tab: Retreat bookings (dates, client, package, rooms, activities, payment status)
  - Tab: Revenue tracker (daily entries per pillar)

- **WhatsApp group: "DSA Équipe"** for real-time coordination

**Phase 3 (2027+): Custom Dashboard**
Built only when the manual process becomes painful. Features:
- Unified calendar (rooms + spa + restaurant + activities in one view)
- CRM: client profiles with booking history and preferences
- Revenue tracking per pillar with basic charts
- Availability management that feeds the website booking system
- **Tech:** React + Express + PostgreSQL + Supabase (same stack as the booking system)

---

### Block 6: Infrastructure

#### Phase 0-1 (Now → May 2026)

| Component | Tool | Cost | Action |
|-----------|------|------|--------|
| Domain | .tn (primary) + .com (redirect) | ~30-60 TND/year | Register both. .com redirects to .tn |
| Web hosting | Vercel (free tier) | Free | Deploy Next.js site |
| Professional email | Zoho Mail (free: 5 users) | Free | contact@, reservations@, info@ |
| Email/CRM | Brevo (free: 300/day) | Free | Newsletter, waitlist, transactional |
| Analytics | Vercel Analytics or Plausible | Free | Traffic, geo, device tracking |
| DNS | Cloudflare (free) | Free | DNS management, CDN, SSL |
| File storage | Google Drive (existing) | Free | Photos, videos, documents |
| Code hosting | GitHub (existing) | Free | Private repo |
| Spa booking | Custom-built (in-house) | Free | When wellness opens |

**Total Phase 0-1 cost: ~30-60 TND/year (domain only)**

#### Phase 2 (Late 2026)

| Component | Tool | Cost |
|-----------|------|------|
| Room booking | Custom-built (in-house) | Free (dev time only) |
| Payment - Tunisia | Konnect or Flouci | Per-transaction fees |
| Payment - International | Stripe | 2.9% + 30¢ per transaction |
| Database | Supabase (free tier) | Free (up to 500MB) |
| Brevo upgrade (if needed) | Brevo Starter | ~€25/month |
| OTA commissions | Booking.com | 15-18% per booking |

#### Phase 3 (2027+)
- Potential Vercel Pro upgrade if traffic grows ($20/month)
- Supabase Pro if database exceeds free tier ($25/month)
- Additional SaaS tools as needed

---

## Competitive Research (Phase 0 — Prerequisite)

**Already drafted:** A comprehensive competitive research prompt exists to identify:
- Direct competitors (integrated agritourism + wellness + dining estates)
- Gîte rural / rural guesthouse competitors (France, Italy, Portugal, Morocco, Greece)
- Boutique wellness retreat competitors
- Properties serving dual local + international audiences
- Regional competitors in Tunisia and North Africa

**Output feeds into:**
- Website design direction decision (what do the best competitors' websites look like?)
- Pricing benchmarks (room nights + retreat packages)
- Positioning refinement
- Feature prioritization

**Action:** Run the prompt, compile findings, present to Elyssa + Lilia before the design direction meeting.

---

## Master Timeline

```
FEB 2026    ████ Phase 0: Foundation
            ├─ Register domain
            ├─ Set up email, Google Business, WhatsApp Business
            ├─ Run competitive research
            └─ Phase I photo shoot (oranges still on trees)

MAR 2026    ████ Phase 0: Decisions
            ├─ Logos finalized (mid-March)
            ├─ Design direction chosen (Lilia + Elyssa + Rached)
            ├─ Tech stack confirmed
            ├─ FR text approved by Lilia
            └─ Instagram account launched (making-of content begins)

APR 2026    ████ Phase 1: Build
            ├─ Renovation starts (April 6)
            ├─ Website development begins
            ├─ Phase I photos integrated
            └─ Making-of content → Instagram

MAY 2026    ████ Phase 1: Launch
            ├─ Website goes live (showcase + contact)
            ├─ Google Business links to website
            ├─ Brevo email capture active
            └─ Making-of content continues

JUN-SEP     ░░░░ Phase 1b: Soft Launch (when pillars open)
            ├─ Activate booking for restaurant/wellness
            ├─ Phase II photos (making-of/renovation)
            └─ Google Reviews accumulation begins

LATE 2026   ████ Phase 2: Hotel Opening
            ├─ Room booking system live
            ├─ Payment integration (Konnect + Stripe)
            ├─ OTA listings (Booking.com, Airbnb)
            ├─ Phase III photos (final product)
            └─ Final pricing on all offerings

2027+       ████ Phase 3: Custom Systems
            ├─ Composite retreat booking system
            ├─ Internal management dashboard
            └─ Blog, SEO, loyalty program
```

---

## Open Decisions Summary

| # | Decision | When | Who | Notes |
|---|----------|------|-----|-------|
| 1 | Domain name (.tn? .com? both?) | Now | Rached + Elyssa | Recommend both: .tn primary, .com redirect |
| 2 | Design direction (1 of 5 proposals) | March | Lilia + Elyssa + Rached | After competitive research results |
| 3 | CMS approach | March | Rached | Markdown initially, Sanity later if Elyssa needs to edit |
| 4 | OTA sync approach | Mid-2026 | Rached | iCal sync (free) vs Channex.io API (~$3-5/room/month) |
| 5 | SaaS budget for Phase 2 | Mid-2026 | Lilia + Elyssa | Mainly OTA commissions + payment gateway fees |
| 6 | WhatsApp Business API provider | When restaurant opens | Rached | Twilio vs direct Meta API vs other BSP |

---

## Verification / Success Metrics

### Phase 1 Launch Checklist
- [ ] Website live on custom domain, loads < 3s on mobile
- [ ] Geo-detection working (Tunisian IP → FR/local content, other → EN/international)
- [ ] Manual audience toggle working (cookie-based override)
- [ ] All 4 pillar pages live with correct status badges
- [ ] FR/EN language toggle functional
- [ ] WhatsApp floating button on all pages
- [ ] Newsletter signup capturing to Brevo
- [ ] Google Business Profile live with photos + link to website
- [ ] Contact form delivering emails to team
- [ ] Restaurant/wellness booking CTAs functional (WhatsApp or form)
- [ ] Instagram linked and posting making-of content

### Phase 2 Success Metrics
- [ ] Online room bookings flowing end-to-end
- [ ] Payment processing working for both TN and international
- [ ] OTA listings generating bookings
- [ ] Google Reviews: 20+ in first 3 months
- [ ] Email sequences firing correctly (post-booking, pre-arrival)

### Phase 3 Success Metrics
- [ ] Retreat booking: guest can build a complete package and pay online
- [ ] Team using internal dashboard instead of spreadsheets
- [ ] Organic search traffic growing month-over-month
