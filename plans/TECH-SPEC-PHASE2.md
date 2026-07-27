# TECH-SPEC-PHASE2.md — Experience Jogja, Phase 2 Data Model

**Doc type:** Technical Specification addendum
**Builds on:** `TECH-SPEC.md` (Phase 1 entities: `Destination`, `Event`, `Article`, live on Base44)
**Companion docs:** `SITE-STRUCTURE.md`, `VISITOR-INFORMATION-SPEC.md`, `DETAIL-PAGE-SPEC.md`, `00-AGENT-PROMPT-PHASE2.md`
**Status:** Draft v1.0

All changes below are additive — existing Phase 1 fields are untouched, so the live homepage keeps working unmodified while this phase is built.

---

## 1. `destination.jsonc` — schema extension

Add to the existing entity (do not recreate it):

```jsonc
{
  "regency": {
    "type": "string",
    "enum": ["yogyakarta-city", "sleman", "bantul", "kulon-progo", "gunungkidul", "villages-hidden-gems"],
    "description": "Which DIY regency this destination is in — powers the Destinations nav group"
  },
  "experience_type": {
    "type": "array",
    "items": {
      "type": "string",
      "enum": ["heritage-culture", "entertainment-creative", "sports-adventure", "culinary-lifestyle", "health-wellness", "mice-business"]
    },
    "description": "One or more intent-based tags — powers the Things To Do nav group. Independent from `category` (place-type) — see SITE-STRUCTURE.md §2"
  },
  "latitude": { "type": "number" },
  "longitude": { "type": "number" },
  "address": { "type": "string" },
  "opening_hours": { "type": "string", "description": "Free-text for now (e.g. 'Daily 6:00–17:00') — structured per-day hours is a future refinement if needed" },
  "highlights": {
    "type": "array",
    "items": { "type": "string" },
    "description": "Facility/amenity chip labels for the detail page — see DETAIL-PAGE-SPEC.md §3.4"
  },
  "typical_duration": { "type": "string", "description": "e.g. '1–2 hours' — shown in the detail page quick-facts strip" }
}
```

`latitude`/`longitude` are required for a record to appear in any "Explore the area" list (`DETAIL-PAGE-SPEC.md §4`) — not enforced at the schema level (so existing Phase 1 records without coordinates don't break), but the detail page and distance calculations must handle their absence gracefully.

---

## 2. `stay.jsonc` — new entity

```jsonc
{
  "name": "Stay",
  "type": "object",
  "title": "Stay",
  "description": "Hotels and accommodations — a distinct entity from Destination because pricing/amenity fields differ meaningfully (see DETAIL-PAGE-SPEC.md §3)",
  "properties": {
    "slug": { "type": "string" },
    "name_id": { "type": "string" },
    "name_en": { "type": "string" },
    "regency": { "type": "string", "enum": ["yogyakarta-city", "sleman", "bantul", "kulon-progo", "gunungkidul", "villages-hidden-gems"] },
    "star_rating": { "type": "integer", "minimum": 1, "maximum": 5 },
    "price_idr_per_night": { "type": "number" },
    "hero_image_url": { "type": "string", "format": "uri" },
    "gallery_image_urls": { "type": "array", "items": { "type": "string", "format": "uri" } },
    "description_id": { "type": "string", "format": "richtext" },
    "description_en": { "type": "string", "format": "richtext" },
    "amenities": { "type": "array", "items": { "type": "string" }, "description": "e.g. Pool, Wifi, Breakfast Included, Parking — chip labels per DETAIL-PAGE-SPEC.md §3.4" },
    "check_in_time": { "type": "string" },
    "check_out_time": { "type": "string" },
    "address": { "type": "string" },
    "latitude": { "type": "number" },
    "longitude": { "type": "number" },
    "contact_or_inquiry_url": { "type": "string", "description": "External booking/contact link — no in-app checkout, per PRD.md §3 non-goals" },
    "is_featured": { "type": "boolean", "default": false }
  },
  "required": ["slug", "name_id", "name_en", "regency", "price_idr_per_night"],
  "rls": { "read": "public", "write": "admin" }
}
```

---

## 3. `itinerary.jsonc` — new entity

Curated, read-only sample trips (distinct from the interactive Trip Planner tool, which remains a future/separate build per `SITE-STRUCTURE.md §3.1`).

```jsonc
{
  "name": "Itinerary",
  "type": "object",
  "title": "Itinerary",
  "properties": {
    "slug": { "type": "string" },
    "title_id": { "type": "string" },
    "title_en": { "type": "string" },
    "duration_days": { "type": "integer" },
    "cover_image_url": { "type": "string", "format": "uri" },
    "summary_id": { "type": "string" },
    "summary_en": { "type": "string" },
    "day_plan": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "day_number": { "type": "integer" },
          "title_id": { "type": "string" },
          "title_en": { "type": "string" },
          "destination_ids": { "type": "array", "items": { "type": "string" }, "description": "References to Destination records for that day" }
        }
      }
    }
  },
  "required": ["slug", "title_id", "title_en", "duration_days"],
  "rls": { "read": "public", "write": "admin" }
}
```

---

## 4. `discover-page.jsonc` — new entity

Flexible editorial content page, backing the 6 Discover nav sub-items (`SITE-STRUCTURE.md §3.3`).

```jsonc
{
  "name": "DiscoverPage",
  "type": "object",
  "title": "DiscoverPage",
  "properties": {
    "slug": { "type": "string", "description": "e.g. 'about-jogja', 'why-visit-jogja'" },
    "title_id": { "type": "string" },
    "title_en": { "type": "string" },
    "hero_image_url": { "type": "string", "format": "uri" },
    "body_id": { "type": "string", "format": "richtext" },
    "body_en": { "type": "string", "format": "richtext" },
    "display_order": { "type": "integer" }
  },
  "required": ["slug", "title_id", "title_en"],
  "rls": { "read": "public", "write": "admin" }
}
```

Rendered by one generic `DiscoverPageTemplate.jsx` (hero image + title + rich body), not six bespoke page designs.

---

## 5. `visitor-info-category.jsonc` — new entity

Backs `VISITOR-INFORMATION-SPEC.md`.

```jsonc
{
  "name": "VisitorInfoCategory",
  "type": "object",
  "title": "VisitorInfoCategory",
  "properties": {
    "title_id": { "type": "string" },
    "title_en": { "type": "string" },
    "image_url": { "type": "string", "format": "uri" },
    "items_id": { "type": "array", "items": { "type": "string" } },
    "items_en": { "type": "array", "items": { "type": "string" } },
    "display_order": { "type": "integer" }
  },
  "required": ["title_id", "title_en", "items_id", "items_en"],
  "rls": { "read": "public", "write": "admin" }
}
```

Seed the 6 records exactly as listed in `VISITOR-INFORMATION-SPEC.md §2` — `items_id`/`items_en` are parallel arrays (index 0 of each pairs together), not a single bilingual object per item, to keep the schema flat and simple for a short, rarely-changing list.

---

## 6. `event.jsonc` — schema extension

```jsonc
{
  "event_type": {
    "type": "string",
    "enum": ["festival", "cultural-performance", "exhibition", "sports", "other"],
    "description": "Powers the Events nav group filters — see SITE-STRUCTURE.md §3.6"
  }
}
```

---

## 7. "Explore the area" distance calculation

No new entity — computed at render time from existing coordinate fields (§1, §2):

```js
// lib/distance.js
function haversineKm(lat1, lon1, lat2, lon2) { /* standard haversine formula */ }
function estimateDriveMinutes(km) { return Math.round((km / 25) * 60); } // ~25km/h effective local-road average, labeled "approx." in the UI
```

For a given `Destination` or `Stay` record with coordinates, query the nearest N `Destination` records (excluding itself) sorted by computed distance, split into the "Nearby Attractions" / "Where to Eat" groups per `DETAIL-PAGE-SPEC.md §4` by `category`. "Getting There" pulls from a small **hardcoded reference list** (not an entity — there are only a handful of airports/stations in the whole province, e.g. Yogyakarta International Airport, Tugu Station, Lempuyangan Station), stored as a plain constants file (`lib/transit-reference-points.js`) rather than an admin-editable entity, since this list changes essentially never.

---
*End of TECH-SPEC-PHASE2.md*
