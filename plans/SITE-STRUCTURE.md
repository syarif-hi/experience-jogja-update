# SITE-STRUCTURE.md — Experience Jogja Phase 2 Navigation & IA

**Doc type:** Information Architecture plan
**Builds on:** `PRD.md`, `TECH-SPEC.md`, `00-AGENT-PROMPT.md` (Phase 1 — homepage, live at experience-jogja.base44.app)
**Companion docs (this phase):** `VISITOR-INFORMATION-SPEC.md`, `DETAIL-PAGE-SPEC.md`, `TECH-SPEC-PHASE2.md`, `00-AGENT-PROMPT-PHASE2.md`
**Status:** Draft v1.0

---

## 1. Why this doc exists

Phase 1 shipped the homepage against a 9-category taxonomy and three entities (`Destination`, `Event`, `Article`). This phase introduces a full mega-menu with 7 groups and ~40 sub-items. Several of those sub-items are genuinely new content; many others are **the same underlying content, viewed through a different lens** (by place-type, by interest, by region). Building each as a bespoke page would fragment the content model fast, so this doc maps every nav item to either an existing entity/filter, a small new entity, or an explicit "future phase" flag — before anything gets built.

## 2. The three taxonomies problem

Three of the seven nav groups classify the *same* destinations differently:

| Lens | Where it shows up | Field |
|---|---|---|
| **What kind of place is it** | Phase 1's "Explore Jogja" grid (Landmarks, Nature & Outdoor, Cultural Heritage & Temples, etc.) | `Destination.category` (existing) |
| **What experience are you looking for** | "Things To Do" nav group (Heritage & Culture, Entertainment & Creative, Sports & Adventure, Culinary & Lifestyle, Health & Wellness, MICE & Business Events) | `Destination.experience_type` (**new**, multi-select) |
| **Where is it** | "Destinations" nav group (Yogyakarta City, Sleman, Bantul, Kulon Progo, Gunungkidul, Villages & Hidden Gems — the DIY province's actual regencies) | `Destination.regency` (**new**) |

Rather than three separate content sets, one destination gets tagged on all three axes (e.g. Borobudur: category = `cultural-heritage-temples`, experience_type = `[heritage-culture]`, regency = `kulon-progo` — administratively Borobudur sits just over the DIY border in Magelang, Central Java; flag this as a content decision for Caps: include it as a "day trip" exception or keep the taxonomy strictly DIY-only). "Things To Do" and "Destinations" are then just filtered views of the same `Destination` list, not new content types. Full field spec in `TECH-SPEC-PHASE2.md §1`.

**One nav item needs to be reconciled, not duplicated:** Visitor Information's "Wellness & Fitness" category (image 1) and Things To Do's "Health & Wellness" experience type describe the same subject from two different pages (one is *services* — spas, gyms; the other is *destinations* — a wellness retreat you visit). Keep them separate entities/purposes: Visitor Information is a practical-info directory (§4 below), Things To Do is a destination filter.

---

## 3. Nav group mapping

### 3.1 Plan Your Trip
| Sub-item | Route | Source | Status |
|---|---|---|---|
| Trip Planner | `/trip-planner` | Interactive tool (itinerary builder) | Future — scoped as Phase 2/3 in original `PRD.md §7`, not part of this phase |
| Itineraries | `/itineraries` | **New**, small `Itinerary` entity — curated read-only sample trips (e.g. "3 Days in Jogja"), distinct from the interactive planner above | New this phase (content model only — see `TECH-SPEC-PHASE2.md §3`) |
| Getting to Jogja | anchor on `/visitor-information` | Reuses Visitor Information's "Getting to Jogja" card | No new page — anchor link |
| Getting Around | anchor on `/visitor-information` | Reuses Visitor Information's "Getting Around" card | No new page — anchor link |
| Where to Stay | `/stay` | **New** `Stay` entity — listing grid | New this phase |
| Visitor Information | `/visitor-information` | **New** `VisitorInfoCategory` entity | New this phase — see `VISITOR-INFORMATION-SPEC.md` |
| Travel Tips | `/news?topic=travel-tips` | Existing `Article` entity, already has a `travel-tips` topic_tag (Phase 1) | No new entity — filtered view |

### 3.2 Book & Experience
| Sub-item | Route | Source | Status |
|---|---|---|---|
| Attractions | `/destinations` | Existing `Destination` entity, unfiltered/landmark-leaning categories | Reuse |
| Tours | `/tours` | New `Tour` entity (bookable guided experiences) | **Flag as future** — no visual reference given yet, needs its own short spec before building |
| Activities | `/destinations?category=nature-outdoor` (or `things-to-do`) | Existing `Destination` filter | Reuse |
| Hotels | `/stay` | Same as "Where to Stay" above | New this phase |
| Transportation | anchor on `/visitor-information` ("Getting Around") | Reuse | No new page |
| Restaurants | `/destinations?category=eat-drink` | Existing `Destination` filter | Reuse |
| Event Tickets | `/events` | Existing `Event` entity | Reuse — ticketing/payment is explicitly a non-goal per `PRD.md §3`; this is a browse view, not a checkout |

### 3.3 Discover
| Sub-item | Route | Source | Status |
|---|---|---|---|
| About Jogja | `/discover/about-jogja` | **New** `DiscoverPage` entity (flexible editorial page) | New this phase |
| Why Visit Jogja | `/discover/why-visit-jogja` | `DiscoverPage` | New this phase |
| Living Heritage | `/discover/living-heritage` | `DiscoverPage` | New this phase |
| Creative Culture | `/discover/creative-culture` | `DiscoverPage` | New this phase |
| Future Lifestyle | `/discover/future-lifestyle` | `DiscoverPage` | New this phase |
| Travel Inspiration | `/news?topic=travel-tips` or a `DiscoverPage` | Could double up with News — recommend `DiscoverPage` if this is meant to be evergreen brand storytelling rather than dated articles | Confirm with Caps |

One entity, six rows — see `TECH-SPEC-PHASE2.md §4`. These read as a fixed set of brand/editorial pages rather than a growing list, but keeping them entity-backed (not hardcoded JSX) means Caps can edit copy without a rebuild, consistent with the "no hardcoded homepage copy" principle from `PRD.md §8`.

### 3.4 Things To Do
Filtered views of `Destination.experience_type` (see §2). No new page template — reuses the existing `DestinationCardGrid` component with a filter, same pattern as Phase 1's Top Destinations / Recommended Today reuse.

| Sub-item | `experience_type` value |
|---|---|
| Heritage & Culture | `heritage-culture` |
| Entertainment & Creative | `entertainment-creative` |
| Sports & Adventure | `sports-adventure` |
| Culinary & Lifestyle | `culinary-lifestyle` |
| Health & Wellness | `health-wellness` |
| MICE & Business Events | `mice-business` |

Note for Caps: MICE & Business Events content could reasonably draw on the Jogja Expo Center work if that venue should be featured as a destination — flagging as a possible content source, not assuming it's in scope here.

### 3.5 Destinations
Filtered views of `Destination.regency` (see §2). Same reuse pattern as §3.4.

| Sub-item | `regency` value |
|---|---|
| Yogyakarta City | `yogyakarta-city` |
| Sleman | `sleman` |
| Bantul | `bantul` |
| Kulon Progo | `kulon-progo` |
| Gunungkidul | `gunungkidul` |
| Villages & Hidden Gems | `villages-hidden-gems` |

### 3.6 Events
Filtered views of the existing `Event` entity, extended with one new field (`event_type`).

| Sub-item | Route | Source |
|---|---|---|
| Events Calendar | `/events?view=calendar` | Existing `Event` list, calendar layout instead of card grid |
| Festivals | `/events?type=festival` | `Event.event_type` filter |
| Cultural Performances | `/events?type=cultural-performance` | `Event.event_type` filter |
| Exhibitions | `/events?type=exhibition` | `Event.event_type` filter |
| Sports Events | `/events?type=sports` | `Event.event_type` filter |
| Upcoming Highlights | `/events?highlight=true` | Reuses `is_homepage_highlight` |

### 3.7 Visitor Information
Standalone page, also linked from Plan Your Trip (§3.1). See `VISITOR-INFORMATION-SPEC.md`.

---

## 4. What this phase actually builds

To keep this phase shippable, the concrete build target is:

1. **New entities**: `Destination` schema extension (`regency`, `experience_type`, plus detail-page fields — `TECH-SPEC-PHASE2.md §1`), new `Stay` entity (`§2`), new `Itinerary` entity (`§3`), new `DiscoverPage` entity (`§4`), new `VisitorInfoCategory` entity (`§5`), `Event` schema extension (`event_type`).
2. **Visitor Information page** — full custom build per `VISITOR-INFORMATION-SPEC.md`.
3. **Universal Detail Page template redesign** — per `DETAIL-PAGE-SPEC.md`, replacing whatever detail page exists today, used by both `Destination` and `Stay` records.
4. **Filtered list pages** for Things To Do, Destinations (by regency), Events (by type) — reusing the existing card-grid component with query params, not new designs.
5. **Mega-menu header** replacing Phase 1's simple nav, per the 7 groups above.
6. **Discover pages and Itineraries** — entity + generic content-page template (title, hero, body), not custom per-page design.
7. **Explicitly deferred**: Tours (needs its own spec), Trip Planner (already deferred from Phase 1), any booking/payment/ticketing flow.

---
*End of SITE-STRUCTURE.md*
