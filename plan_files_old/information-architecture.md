# Information Architecture — Visitor Information

Companion to `PRD.md`. This is the **placeholder tree** referenced there — replace the "Label" column (and add/remove rows) once the real CMS content is audited; keep the `Level` / `Template` / `Slug pattern` columns as the working convention.

> ⚠️ Content audit needed: this tree was reconstructed from the single example given (`Visitor Information > Getting to Jogja > Airports > Airports A, B, C`) plus standard categories a visitor-information hub typically needs. Verify against the live CMS before build.

## Depth & template legend

| Level | Meaning | Template |
|---|---|---|
| L0 | Section root | Section hub (intro + all L1 categories as cards) |
| L1 | Category | **Category landing** if it has children, else **Detail** |
| L2 | Sub-category | **Sub-category landing** if it has children, else **Detail** |
| L3 | Detail | **Detail** (always a leaf) |

Template is derived from "does this node have children?", not hardcoded per node — so an editor moving a page between levels doesn't require a template migration.

## Full tree with proposed slugs

Base path: `/visitor-information`

| Level | Node | Slug (nested, proposed) | Template |
|---|---|---|---|
| L0 | Visitor Information | `/visitor-information` | Section hub |
| L1 | Getting to Jogja | `/getting-to-jogja` | Category landing |
| L2 | ‣ Airports | `/getting-to-jogja/airports` | Sub-category landing |
| L3 | ‣‣ Yogyakarta International Airport (YIA) | `/getting-to-jogja/airports/yogyakarta-international-airport` | Detail |
| L3 | ‣‣ Adisutjipto Airport (JOG) | `/getting-to-jogja/airports/adisutjipto-airport` | Detail |
| L2 | ‣ Train Stations | `/getting-to-jogja/train-stations` | Sub-category landing |
| L3 | ‣‣ Tugu Station | `/getting-to-jogja/train-stations/tugu-station` | Detail |
| L3 | ‣‣ Lempuyangan Station | `/getting-to-jogja/train-stations/lempuyangan-station` | Detail |
| L2 | ‣ Bus Terminals | `/getting-to-jogja/bus-terminals` | Sub-category landing |
| L3 | ‣‣ Jombor Bus Terminal | `/getting-to-jogja/bus-terminals/jombor` | Detail |
| L3 | ‣‣ Giwangan Bus Terminal | `/getting-to-jogja/bus-terminals/giwangan` | Detail |
| L2 | ‣ By Car & Toll Roads | `/getting-to-jogja/by-car` | Detail (flat, no children) |
| L1 | Getting Around | `/getting-around` | Category landing |
| L2 | ‣ Public Transport | `/getting-around/public-transport` | Sub-category landing |
| L3 | ‣‣ TransJogja Bus | `/getting-around/public-transport/transjogja` | Detail |
| L3 | ‣‣ Trans Jateng | `/getting-around/public-transport/trans-jateng` | Detail |
| L2 | ‣ Ride-Hailing Apps | `/getting-around/ride-hailing` | Detail (flat) |
| L2 | ‣ Car & Motorbike Rental | `/getting-around/rentals` | Detail (flat) |
| L1 | Accommodation | `/accommodation` | Category landing |
| L2 | ‣ Hotels | `/accommodation/hotels` | Detail (flat) |
| L2 | ‣ Homestays & Guesthouses | `/accommodation/homestays` | Detail (flat) |
| L2 | ‣ Villas | `/accommodation/villas` | Detail (flat) |
| L1 | Travel Essentials | `/travel-essentials` | Category landing |
| L2 | ‣ Visa & Entry Requirements | `/travel-essentials/visa` | Detail (flat) |
| L2 | ‣ Currency & Money | `/travel-essentials/currency` | Detail (flat) |
| L2 | ‣ Health & Safety | `/travel-essentials/health-safety` | Detail (flat) |
| L2 | ‣ Local Etiquette & Culture | `/travel-essentials/etiquette` | Detail (flat) |
| L2 | ‣ Emergency Contacts | `/travel-essentials/emergency` | Detail (flat) |
| L1 | Weather & Best Time to Visit | `/weather` | Detail (flat, no children) |
| L1 | Tourist Information Centers | `/tourist-information-centers` | Detail (flat, no children) |

## Wayfinding color assignment (sidebar / breadcrumb chip / content accent)

| L1 category | Accent | Rationale |
|---|---|---|
| Getting to Jogja | Java-sea blue | Transit/arrival theme |
| Getting Around | Rice-paddy green | Movement/local theme |
| Accommodation | Turmeric gold | Warmth/hospitality theme |
| Travel Essentials | Roof-tile terracotta | Practical/utility theme |
| Weather / Tourist Info Centers (flat pages) | Neutral slate | Standalone utility pages, no branch to color-code |

## Breadcrumb strings (example)

```
Home / Visitor Information / Getting to Jogja / Airports / Yogyakarta International Airport (YIA)
Home / Visitor Information / Travel Essentials / Currency & Money
Home / Visitor Information / Weather & Best Time to Visit
```

Note the third example is only 3 segments — flat L1 pages must not be padded with empty placeholder segments.

## Prev/Next sibling order

Sibling order = editorial order within that parent (same order sidebar renders them in). Example for Airports:

`Yogyakarta International Airport (YIA)` ⇄ `Adisutjipto Airport (JOG)`

When there is only one child (or the node is itself flat), prev/next controls are simply omitted rather than shown disabled.

## Machine-readable tree

See `ia-tree.json` for the same structure in JSON, used directly by `ux-prototype.html` and intended as the shape the CMS/API should expose (`id`, `label`, `slug`, `color`, `children[]`).
