# VISITOR-INFORMATION-SPEC.md — Experience Jogja

**Doc type:** Page specification
**Route:** `/visitor-information`
**Reference:** Attached layout image ("VISITOR INFORMATION" — 6-card grid)
**Companion docs:** `SITE-STRUCTURE.md §3.7`, `TECH-SPEC-PHASE2.md §5`, `DESIGN-SYSTEM.md`
**Status:** Draft v1.0

---

## 1. What the reference image shows

A single page titled "VISITOR INFORMATION," with a 3-column × 2-row grid of category cards. Each card = one square photo placeholder + a bold category title + a bulleted list of sub-topics underneath (plain text, not individually linked in the reference). No pricing, no CTA buttons — this is a practical-information directory, not a browse-and-book page.

## 2. Content (transcribed from the reference, bilingual added)

| Category | Sub-items (EN) | Sub-items (ID) |
|---|---|---|
| **Getting to Jogja** | Airports, Train Stations, Bus Terminals, Intercity Transportation | Bandara, Stasiun Kereta, Terminal Bus, Transportasi Antarkota |
| **Getting Around** | Taxi, Online Transportation, Trans Jogja, Car Rental, Motorcycle Rental, Bicycle Rental, Parking Information | Taksi, Transportasi Online, Trans Jogja, Sewa Mobil, Sewa Motor, Sewa Sepeda, Informasi Parkir |
| **Health & Emergency** | Hospitals, Clinics, Pharmacies, Police Stations, Fire Department, Emergency Numbers, Tourist Assistance | Rumah Sakit, Klinik, Apotek, Kantor Polisi, Pemadam Kebakaran, Nomor Darurat, Bantuan Wisatawan |
| **Money & Communication** | Money Changers, Banks and ATMs, SIM Cards, Internet and Wi-Fi, Post Offices | Penukaran Uang, Bank dan ATM, Kartu SIM, Internet dan Wi-Fi, Kantor Pos |
| **Wellness & Fitness** | Spas, Massage and Wellness Centers, Gyms, Sports Centers, Swimming Pools, Yoga and Meditation | Spa, Pusat Pijat dan Kebugaran, Gym, Pusat Olahraga, Kolam Renang, Yoga dan Meditasi |
| **Public Facilities** | Public Toilets, Information Centers, Prayer Facilities, Accessibility Services, Luggage Storage, Laundromats | Toilet Umum, Pusat Informasi, Fasilitas Ibadah, Layanan Aksesibilitas, Penitipan Barang, Laundry |

Every category and sub-item ships in both languages from day one, consistent with the bilingual rule established in `TECH-SPEC.md §5`.

## 3. Layout

- **Desktop (≥1280px):** 3-column, 2-row grid, matching the reference exactly. Card = square image (top) + title (bold, `--text-primary`) + bullet list (red bullet marker per the reference — use `--color-primary` for the bullet dot, not the text).
- **Tablet (768–1279px):** 2-column grid, 3 rows.
- **Mobile (<768px):** 1-column stack, image width = full card width, list left-aligned below.
- Page header: "VISITOR INFORMATION" as an H1 (Fraunces, per `DESIGN-SYSTEM.md §3`), plus a one-line bilingual intro sentence above the grid (not present in the reference but recommended so the page isn't a bare list — e.g. "Everything you need to know before and during your trip to Yogyakarta.").
- No card is a dead end: even though the reference shows plain bullet text, make each **card itself** (image + title) a link to an anchor lower on the page or a simple expanded detail view — but **individual bullet items stay as plain text in this phase**, not links, since the reference doesn't design them as tappable and there's no destination page for "Airports" to link to yet. Flag this as a future enhancement once real venue-level content (e.g. actual hospital names/addresses) exists.

## 4. Component

New component: `VisitorInfoCard.jsx` (image, title, bullet list — takes a `VisitorInfoCategory` record as props) + `VisitorInfoGrid.jsx` (renders all 6 in the responsive grid above). No reuse of `DestinationCard` — this card shape (bullet list body, no descriptor/price/tag) is different enough to warrant its own component rather than overloading the existing one, per the "one component per pattern" rule — overloading `DestinationCard` with an optional bullet-list prop would violate that rule just as much as duplicating it would.

## 5. Data model

See `TECH-SPEC-PHASE2.md §5` for the `VisitorInfoCategory` entity (title_id/en, icon_or_image_url, items array bilingual, display_order). Seed content is the table in §2 above.

## 6. Out of scope for this page

- No search/filter within the page — it's short and static enough not to need one.
- No map. (A map belongs on the Detail Page per `DETAIL-PAGE-SPEC.md`, not here.)
- No live data (e.g. real-time pharmacy hours) — this is reference information, editable by admin, not a live directory integration.

---
*End of VISITOR-INFORMATION-SPEC.md*
