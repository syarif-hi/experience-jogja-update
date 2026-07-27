# DETAIL-PAGE-SPEC.md — Experience Jogja Universal Detail Page

**Doc type:** Page specification (redesign)
**Used by:** `Destination` detail pages (existing, being redesigned) and `Stay`/hotel detail pages (new)
**References:** Attached hero/photo-grid layout image; hotels.com property page pattern (Plataran Heritage Borobudur listing, linked by Caps)
**Companion docs:** `SITE-STRUCTURE.md`, `TECH-SPEC-PHASE2.md §1–2`, `DESIGN-SYSTEM.md`
**Status:** Draft v1.0

---

## 1. Scope note

This redesign applies to the **shared detail-page template** used by both destinations and stays — not Event detail pages, which stay in their simpler form (date/venue/price/description) as originally scoped in `TECH-SPEC.md §3`. A destination or hotel is a *place* with photos, a location, and things nearby; an event is a *date-bound occurrence*. They don't need the same template.

---

## 2. Hero section — photo grid (from the attached layout)

The reference image is a wireframe: one large rectangle (hero) with a row of 5 smaller equal-width rectangles directly beneath it.

**Desktop/tablet (≥768px):**
- One large hero photo, full content width, ~21:9 to 16:9 aspect ratio.
- Directly below: a row of exactly 5 smaller thumbnail photos, equal width, ~4:3 aspect ratio, `--radius-md` corners, no border (per `DESIGN-SYSTEM.md §1`).
- Clicking the hero **or** any thumbnail opens a full-screen lightbox gallery cycling through all of that listing's `gallery_image_urls`.
- If a listing has fewer than 6 total photos (1 hero + 5 thumbnails), the last thumbnail slot shows a solid-color "+N more" overlay tile if there are more photos than fit, or is simply omitted if there are exactly enough — never stretch or duplicate an image to fill an empty slot.

**Mobile (<768px):** 5 fixed thumbnails don't fit — collapse to a single swipeable hero image with a small solid-fill photo-count badge in the corner (e.g. "1 / 12"), tapping opens the same lightbox. This is a deliberate mobile-specific layout, not a scaled-down desktop grid, per the "mobile is first-class" rule in `DESIGN-SYSTEM.md §7`.

**Component:** `DetailHeroGallery.jsx` (new), takes `hero_image_url` + `gallery_image_urls` array, handles both the desktop grid and mobile swipe view internally, plus the lightbox.

---

## 3. Body sections (hotels.com pattern, adapted)

Reviewing the linked hotels.com property page pattern (Expedia Group's standard hotel listing layout — hero gallery, sticky booking sidebar, overview, amenities, "Explore the area" nearby-distance section, policies, reviews), here's the adapted section order. Sections marked *(Stay only)* or *(Destination only)* don't apply to the other type; everything else is shared.

1. **Title bar** — name (bilingual), regency + category tag(s), star rating *(Stay only)*, address line with a small pin icon, share icon (no functional share target needed yet — visual only).
2. **Quick facts strip** — solid-fill chip row directly under the title:
   - *Destination:* category tag, typical visit duration, entry price (or "Free"), today's opening hours status.
   - *Stay:* star rating, guest rating score placeholder (reviews aren't built yet — omit the number, don't fake one), price per night from `price_idr_per_night`.
3. **Overview** — bilingual body/description text, 2–4 short paragraphs, richtext field.
4. **Highlights / Amenities** — icon + label chip grid (solid fill, per `DESIGN-SYSTEM.md §6` tag styling):
   - *Destination:* facilities available (parking, guide available, prayer room, accessible entry, photo spot, etc.)
   - *Stay:* amenities (pool, wifi, breakfast included, parking, air conditioning, etc.)
5. **Explore the area** — *(the section Caps specifically asked to match hotels.com)*. See §4 below — this is the most structurally new section.
6. **Location map** — static or interactive map centered on the listing's coordinates, with pins for the items shown in "Explore the area" so the map and the list agree with each other.
7. **Practical info panel** — sticky sidebar on desktop (scrolls with the page up to a limit, then stops — not fixed-forever), stacks below the fold on mobile:
   - *Destination:* opening hours by day, entry price, contact/phone if available, a "Plan this into your trip" CTA linking to Trip Planner (once it exists) or Itineraries.
   - *Stay:* price per night, check-in/check-out times, a "Check availability" CTA button — **visual only, no real booking flow**, consistent with the non-goal in `PRD.md §3`. Clicking it can open a simple "contact/inquire" form or an external link field on the `Stay` record, not a payment flow.
8. **Reviews** — placeholder section ("Reviews coming soon") rather than fabricated ratings; real UGC reviews are Phase 3 per `PRD.md §7`.
9. **You might also like** — reuses the existing `DestinationCardGrid` component, filtered to same `category` or `regency`, per the "one component per pattern" rule from Phase 1.

---

## 4. "Explore the area" — distance-from-here section

This is the specific feature Caps called out from the hotels.com reference: a list of nearby places grouped by type, each showing distance and estimated travel time from the current listing.

**Structure:** tabbed or accordion groups (match whichever pattern renders better in Base44's component library — recommend tabs on desktop, accordion on mobile):

- **Nearby Attractions** — nearest `Destination` records by straight-line distance, excluding the current listing itself.
- **Where to Eat** — nearest `Destination` records where `category = eat-drink`.
- **Getting There** — nearest transit-relevant reference points (airport, train station) — sourced from a small fixed reference list rather than full entities, since there are only a handful of these in the whole province (see `TECH-SPEC-PHASE2.md §1` for the approach).

**Each row shows:** small thumbnail, name (bilingual), distance (`X.X km`) and an estimated drive time, and links through to that item's own detail page (so "Explore the area" is also a discovery/cross-linking mechanism, not just informational text).

**Calculation:** straight-line (haversine) distance between the current listing's `latitude`/`longitude` and each candidate's — computed at render time, not stored, so it never goes stale. Estimated time is a simple distance-based approximation (e.g. `distance_km / 25 * 60` minutes for local roads) labeled as "approx." rather than presented as precise live traffic data, since no live routing API is in scope for this phase.

**Requirement this creates:** every `Destination` and `Stay` record needs `latitude`/`longitude` fields — added in `TECH-SPEC-PHASE2.md §1–2`. Records without coordinates simply don't appear in any "Explore the area" list (fail gracefully, don't show a broken "0 km" row).

---

## 5. What's deliberately not copied from hotels.com

- No price-comparison/"other options in the area" carousel — that's a shopping-comparison pattern specific to a booking marketplace, not a fit for a destination-guide portal.
- No countdown/urgency messaging ("Only 2 rooms left") — inconsistent with the brand's calm, editorial tone and not honest without real inventory data.
- No third-party review-aggregator badges — reviews are first-party only, once built.

---
*End of DETAIL-PAGE-SPEC.md*
