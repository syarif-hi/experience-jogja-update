# 00-AGENT-PROMPT-PHASE2.md — Experience Jogja Phase 2 Build

**Target tool:** Base44 Builder Chat, on the existing live project (experience-jogja.base44.app)
**Generation model:** Claude Opus 4.8
**Build scope:** New/extended entities, the redesigned universal Detail Page, the Visitor Information page, filtered list views, and the mega-menu nav
**Reference docs to attach:** `SITE-STRUCTURE.md`, `VISITOR-INFORMATION-SPEC.md`, `DETAIL-PAGE-SPEC.md`, `TECH-SPEC-PHASE2.md`, plus the two reference images (Visitor Information layout, hero photo-grid layout) and the four Phase 1 docs for context

---

## How to use this document

Same rule as Phase 1: paste one phase at a time, review before continuing, use Discuss mode before any change that touches already-shipped homepage code. **This is Phase 2 of a live project** — the homepage and its entities (`Destination`, `Event`, `Article`) already exist and are in use. Every step below is additive; nothing in Phase 1 should be deleted, renamed, or restructured as a side effect of this work.

---

## Scope — what Phase 2 covers (and doesn't)

**In scope:** the entity extensions in `TECH-SPEC-PHASE2.md`, the Visitor Information page, the redesigned Detail Page template (used by destinations and the new Stay entity), simple filtered list pages for Things To Do / Destinations-by-regency / Events-by-type, the Discover pages, Itineraries, and the mega-menu header.

**Not in scope for this phase** (per `SITE-STRUCTURE.md §4`): Trip Planner (interactive tool), Tours, any booking/payment/ticketing flow, reviews/UGC. Where the nav needs to link to one of these, use a placeholder route — do not scaffold the feature itself.

---

## Phase A — Extend and add entities

> Read TECH-SPEC-PHASE2.md fully before making any entity changes. Extend the existing `Destination` entity with the fields in §1 (`regency`, `experience_type`, `latitude`, `longitude`, `address`, `opening_hours`, `highlights`, `typical_duration`) — this must be an **extension**, not a recreation; existing Destination records and the live homepage queries against `is_featured_top_destination` / `is_recommended_today` must keep working exactly as before.
>
> Create the new entities exactly as specified: `Stay` (§2), `Itinerary` (§3), `DiscoverPage` (§4), `VisitorInfoCategory` (§5). Extend `Event` with `event_type` (§6). Set RLS per each entity's spec — public read / admin write throughout, except none of these need user-scoped RLS (no accounts in this phase either, consistent with Phase 1's scope boundary).
>
> Seed data:
> - Add `regency`, `experience_type`, `latitude`/`longitude`, `address` values to the 8 existing seeded Destination records from Phase 1 (real coordinates for Borobudur, Prambanan, Malioboro, Tugu Jogja, Taman Sari, Kraton Yogyakarta, Goa Pindul, Kaliurang — look these up rather than guessing, since the "Explore the area" distances in Phase B depend on them being accurate).
> - Seed 3–4 `Stay` records (placeholder hotels in different regencies, with coordinates near the destinations they'd realistically be close to, so "Explore the area" has something to show).
> - Seed the 6 `VisitorInfoCategory` records exactly as listed in `VISITOR-INFORMATION-SPEC.md §2`.
> - Seed 2 `Itinerary` records referencing existing Destination records.
> - Seed the 6 `DiscoverPage` records (About Jogja, Why Visit Jogja, Living Heritage, Creative Culture, Future Lifestyle, Travel Inspiration) with placeholder bilingual copy — real brand copy comes later.
>
> Confirm the schema changes and seed counts back to me before moving to Phase B.

---

## Phase B — Redesign the universal Detail Page

> Read DETAIL-PAGE-SPEC.md fully, and look at the attached hero/photo-grid reference image before writing any layout code.
>
> Build `DetailHeroGallery.jsx` per §2: one large hero photo + a row of 5 thumbnails on desktop/tablet, collapsing to a single swipeable hero with a photo-count badge on mobile (<768px) — this is a genuinely different mobile layout, not a scaled-down grid. All thumbnails and the hero open a shared lightbox cycling through `gallery_image_urls`.
>
> Then build the body sections in the order given in §3: title bar, quick facts strip, overview, highlights/amenities, **Explore the area** (§4 — build `lib/distance.js` per TECH-SPEC-PHASE2.md §7 first, this section depends on it), location map, practical info sidebar (sticky on desktop, stacked on mobile), a "Reviews coming soon" placeholder (do not fabricate ratings), and "You might also like" reusing the existing `DestinationCardGrid`.
>
> This one template must work for both a `Destination` record and a `Stay` record — branch only the specific fields called out as *(Stay only)* / *(Destination only)* in §3, share everything else. Do not build two separate templates.
>
> Replace whatever detail page currently exists on the live site with this template for Destinations, and wire it up fresh for Stay records at a new route. Check both a Destination detail page and a Stay detail page, in both languages, both currencies (for Stay pricing), both themes, and at all three breakpoints before moving on.

---

## Phase C — Visitor Information page

> Read VISITOR-INFORMATION-SPEC.md fully and look at the attached Visitor Information reference image. Build `VisitorInfoCard.jsx` and `VisitorInfoGrid.jsx` per §4, rendering the 6 seeded `VisitorInfoCategory` records in the exact grid pattern from the reference: 3 columns × 2 rows desktop, 2 columns tablet, 1 column mobile. Bullet markers use `--color-primary`, not plain default list styling. Add the page-intro line described in §3. This is a new component, not a reuse of `DestinationCard` — the content shape (bullet list, no price/tag) is different enough to need its own component.

---

## Phase D — Filtered list pages (Things To Do, Destinations by regency, Events by type)

> Build three lightweight list pages reusing the **existing** `DestinationCardGrid` / event card components with a filter prop, per `SITE-STRUCTURE.md §3.4–3.6` — do not design new card layouts for these:
> - `/things-to-do?type=<experience_type value>` — filters Destination by `experience_type`
> - `/destinations?regency=<regency value>` — filters Destination by `regency`
> - `/events?type=<event_type value>` — filters Event by `event_type`, plus `/events?view=calendar` as a simple calendar-style listing (dates grouped by month is sufficient — no need for a full interactive calendar widget yet)
>
> Each page needs a short header (category name + one-line description) above the reused grid.

---

## Phase E — Discover pages and Itineraries

> Build one generic `DiscoverPageTemplate.jsx` (hero image, title, rich body) and route the 6 `DiscoverPage` slugs through it per `TECH-SPEC-PHASE2.md §4` — six routes, one template, not six bespoke designs.
>
> Build a simple `/itineraries` list page (cards: cover image, title, duration) and an itinerary detail view showing the day-by-day plan with linked Destination cards for each day.

---

## Phase F — Mega-menu navigation

> Replace the Phase 1 `SiteHeader.jsx` nav with the 7-group mega-menu from `SITE-STRUCTURE.md §3`: Plan Your Trip, Book & Experience, Discover, Things To Do, Destinations, Events, plus Visitor Information as its own top-level item (it's also linked from inside Plan Your Trip — that's intentional, not a bug). On desktop, each group opens a dropdown panel listing its sub-items with the routes from `SITE-STRUCTURE.md`. On mobile, this becomes nested accordion groups inside the existing `MobileNavDrawer.jsx` — don't try to fit a hover dropdown pattern into a touch interface.
>
> Sub-items that route to not-yet-built pages (Trip Planner, Tours) should still appear in the menu but can link to a simple "coming soon" placeholder rather than a 404 — check with me before deciding which of those need a placeholder page vs. being temporarily hidden from the menu.

---

## Phase G — Full QA pass

> Check every new/changed page — Detail Page (both types), Visitor Information, the 3 filtered list pages, Discover pages, Itineraries, and the new mega-menu — at desktop/tablet/mobile, light/dark, and both languages. Additionally verify: the Phase 1 homepage still renders correctly and its queries against `Destination`/`Event`/`Article` still work after the schema extensions in Phase A; the "Explore the area" section never shows a broken/zero-distance row for records missing coordinates; the mega-menu's placeholder links behave as agreed in Phase F rather than 404ing unexpectedly.

---
*End of 00-AGENT-PROMPT-PHASE2.md*
