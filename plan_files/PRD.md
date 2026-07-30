# PRD — Visitor Information: Information Architecture & Navigation Redesign

**Product:** Experience Jogja — Visitor Information section
**Page:** `/visitor-information` and everything beneath it
**Author:** Prepared with Claude, for Caps
**Status:** Draft for review
**Related files:** `content-tree.json`, `UX-SPEC.md`, `prototype.html`

---

## 1. Summary

`Visitor Information` is a deep content section: **Hub → Category → Subcategory → Detail Page**, and the depth is *inconsistent* — some categories skip the subcategory layer and go straight to detail pages (e.g. `Money & Costs`), others nest a full extra level (e.g. `Getting to Jogja → Airports → YIA`).

The current build presents this like a documentation tree (nested lists, cascading columns). That works for developers reading docs, not for a tourist on a phone trying to figure out how to get from the airport to their hotel. This PRD proposes an **"Adaptive Explorer"** navigation system: a visual, card-first hub; a wayfinding device we call the **Trail** (a unified breadcrumb + sidebar language, since they're really the same underlying model — "where am I in the tree" — expressed at two different sizes); and a responsive split where desktop gets a persistent rail and mobile gets a drawer + horizontal chips, instead of a shrunken version of the desktop sidebar.

## 2. Background & Problem

- The page tree is genuinely deep (4 levels including the hub), and depth is **not uniform** across branches.
- Current structure reads as a nested/cascading list — functionally fine, but it's a "browse the whole tree at once" pattern borrowed from software documentation. It front-loads complexity before the user has context, and doesn't scale visually once more categories are added.
- There's no breadcrumb, so once a visitor is 3 levels deep (e.g. an Airport detail page), there's no cheap way to jump back up to a sibling (another airport) or up to the category (Getting to Jogja) without using the browser back button repeatedly.
- Visitor Information content is mostly **reference content people scan, not read start-to-finish** — the navigation itself is a large part of the product here, arguably more important than on a typical marketing page.

## 3. Goals

1. Make it obvious, at every depth, **where you are** and **what's next to it** (siblings) and **what's above it** (ancestors) — without needing to memorize the tree.
2. Support **variable depth** cleanly — a category with no subcategories shouldn't render an empty/awkward middle step.
3. Give the hub page (`/visitor-information`) a **visual, inviting first impression** — categories as a card grid with cover imagery, not a text list.
4. Ship a **navigation system that scales**: adding a 9th category or a 4th airport shouldn't require rethinking the layout.
5. Make deep pages easy to reach in **2 taps/clicks or fewer** from anywhere else in the section (via search, the rail, or the drawer).
6. Fully responsive, with mobile treated as a first-class citizen (not a squeezed desktop sidebar) — this audience skews mobile.
7. Preserve **bilingual (ID/EN)** content support, matching the rest of the site.

## Non-Goals

- Redesigning the global site header/footer or other sections (Events, Destinations, etc.) — only `Visitor Information` and its descendants are in scope.
- A full CMS/admin UI — content stays in a static config file per the decision below (see §6).
- Search-engine-style full-text search across all content (a lightweight in-section filter is in scope; a global search engine is not).
- Native app considerations — this is the responsive web build only.

## 4. Users & Key Scenarios

| Scenario | Need |
|---|---|
| First-time visitor researching before the trip, mostly on desktop | Wants to browse broadly: "what do I need to know about visiting Jogja?" — served by the visual hub grid. |
| Traveller already in transit, on a phone, spotty connection | Wants one specific answer fast: "how do I get from YIA to Malioboro?" — served by chips/drawer + short pages. |
| Someone deep in a detail page who realizes they want the *other* option | Wants to compare siblings without losing their place — served by the Trail rail/chips showing siblings inline. |
| Returning visitor who bookmarked or was linked directly to a detail page | Lands 3–4 levels deep with zero context — the breadcrumb/rail must reconstruct the path immediately from the URL, not from click history. |

## 5. Chosen Direction: Adaptive Explorer

Four directions were considered:

| Direction | Description | Verdict |
|---|---|---|
| A — Journey Explorer | Persistent left sidebar accordion on all breakpoints | Good wayfinding, but a persistent sidebar is heavy on mobile and doesn't solve the "boring tree" feeling on the hub page. |
| B — Hub & Spoke Cards | Pure visual cards, no persistent sidebar anywhere | Great first impression, but loses fast lateral movement once you're deep in the tree (no quick sibling jump). |
| C — Search-first / command bar | Search + mega-menu, no sidebar | Best for return users who already know the answer; weak for first-time exploratory browsing, which is most of this audience. |
| **D — Adaptive Explorer (chosen)** | Visual card hub (from B) + a collapsible rail on desktop and a drawer + chip-scroller on mobile (from A), unified under one "Trail" visual language with the breadcrumb | Combines the strengths of A and B without B's dead-end depth problem or A's mobile weight. |

**Decision:** Build Direction D. Full component behavior is specified in `UX-SPEC.md`.

## 6. Information Architecture

### 6.1 Node model

Every node in the tree is one of two `kind`s:

- **`section`** — has children (either more sections or pages). Renders as a listing page (card grid of its children). May itself have introductory copy.
- **`page`** — a leaf. Has a body (bilingual rich content) and no children.

A section's children can be **mixed** — some `page`, some `section` — which is exactly how a category like `Getting to Jogja` can have both an `Airports` subsection *and* a direct `By Train` page as siblings. This is what makes variable depth work without a schema change per category.

```
visitor-information (hub)
├─ getting-to-jogja (section)
│  ├─ airports (section)
│  │  ├─ airport-yia (page)
│  │  └─ airport-jog (page)
│  ├─ by-train (page)          ← no subcategory layer needed
│  └─ by-bus-car (page)
├─ money-and-costs (section)
│  ├─ currency-exchange (page)  ← flat category, no subsections at all
│  ├─ atms-digital-payments (page)
│  └─ daily-budget (page)
└─ ...
```

Full example data: see `content-tree.json` (6 categories, 30 nodes total, deliberately mixing flat and nested categories so every layout case is exercised).

### 6.2 Node schema

```ts
type LocalizedString = { en: string; id: string };

interface Node {
  id: string;                 // stable id, never changes
  slug: string;                // URL segment, unique among siblings
  kind: "hub" | "section" | "page";
  icon: string;                 // lucide icon name
  title: LocalizedString;
  summary: LocalizedString;     // 1 sentence, used in cards + <meta description>
  coverImage?: string;           // sections only, for hub/category card grids
  body?: LocalizedString;        // pages only, markdown
  children?: Node[];             // sections only
  meta?: {
    lastUpdated: string;         // ISO date, shown on pages
    estReadMins: number;
    tags: string[];
    relatedPageIds: string[];    // powers the "Related" module — curated, not algorithmic
  };
}
```

### 6.3 URL strategy

Full path is the join of ancestor slugs:

```
/visitor-information
/visitor-information/getting-to-jogja
/visitor-information/getting-to-jogja/airports
/visitor-information/getting-to-jogja/airports/yogyakarta-international-airport-yia
/visitor-information/money-and-costs/currency-and-exchange   ← flat category, one less segment
```

Rules:
- Slugs are permanent once published. If a title changes, the slug doesn't (avoids breaking bookmarks/SEO).
- No numeric IDs in the URL — slugs only.
- Depth is *derived from the tree*, not hardcoded — a template must handle a page appearing at depth 2 or depth 3 identically.

### 6.4 Content management decision

**Decision: static JSON config file** (`content-tree.json`), rebuilt/edited manually and deployed with the site — not Base44 dynamic entities.

Implications for the build:
- No admin UI needed for this phase; content edits go through the JSON file + a redeploy.
- The file is the single source of truth for both the tree structure *and* the page content bodies — one file to keep in sync, not a structure table plus separate content records.
- Because there's no CMS validating shape at entry time, the build **must validate the tree at build time** (see §13, Edge Cases) — malformed nodes should fail the build loudly, not render broken pages.
- If content volume grows significantly or non-technical editors need to publish, revisit moving to Base44 entities in a later phase — the node schema above is intentionally CMS-agnostic so that migration wouldn't require a URL or IA change.

## 7. Page Templates

Three templates cover every node in the tree (a node's `kind` determines which template renders):

### 7.1 Hub template (`/visitor-information`)
- Hero intro (1–2 sentences, no image carousel).
- Card grid of top-level categories: cover image, icon, title, one-line summary. No nested lists here at all — this is the "photos, not a tree" first impression.
- No Trail rail/breadcrumb on this page (it *is* the root — nothing to break out of).

### 7.2 Section template (category or subcategory listing)
- Sticky Trail (breadcrumb, see §8.1) at top.
- Desktop: Trail Rail sidebar (§8.2) visible in the left column.
- Header: title + summary of this section.
- Card grid of this section's children — a `page` child renders as a compact card (icon + title + summary + read time); a `section` child renders like a hub card (cover image, "N pages inside").
- Mobile: no persistent rail; a floating "Browse" button opens the Drawer (§8.3), and a horizontal Chip Scroller (§8.4) of this section's own children sits right under the header, so you don't strictly need the drawer to move to a sibling section.

### 7.3 Page template (detail page)
- Sticky Trail + Trail Rail (desktop) / Drawer trigger + Chips (mobile), same as section template.
- Content body (rendered markdown), localized to current language.
- Metadata strip: last updated, est. read time, tags.
- Sibling navigation: "Previous / Next" within the current section, based on tree order.
- Related Pages module at the bottom, sourced from `meta.relatedPageIds` (curated, not auto-generated — keeps it accurate and cheap to compute).

## 8. Core Navigation Components — "The Trail"

The site's own tagline is *"Where every journey becomes your story."* The navigation system leans into that literally: breadcrumb and sidebar are treated as **one wayfinding device at two sizes** — a route with stops — rather than two unrelated components bolted together. Full visual/interaction spec is in `UX-SPEC.md`; summarized here:

### 8.1 Breadcrumb Trail (all breakpoints, sticky)
A horizontal line of connected dots, one per ancestor + current page, each dot clickable/tappable to jump straight there. On narrow screens, middle dots collapse into a single "…" dot that expands a small popover listing the skipped ancestors — never truncates to unusable text.

### 8.2 Trail Rail (desktop/tablet, persistent, collapsible)
Left-hand vertical rail = the same dot-and-line trail, oriented vertically, showing the *entire current branch* (root → current node) expanded, with **collapsed siblings** shown as smaller unlabeled dots the user can expand on hover/click — this is what avoids ever rendering the *whole* tree at once. Collapses to an icon-only rail with one click for users who want more content width.

### 8.3 Browse Drawer (mobile, on demand)
On mobile the Rail doesn't take permanent space. A small floating "Browse" pill opens a bottom sheet with the same tree, current branch pre-expanded, everything else collapsed. Dismiss by swipe-down or tapping outside.

### 8.4 Sibling Chip Scroller (mobile + tablet, inline)
A horizontally-scrollable row of pill buttons for the current node's siblings, placed directly under the page header. This is the fast path for "show me the *other* airport" without opening the drawer at all.

### 8.5 Related Pages module
Bottom-of-page card row, curated via `relatedPageIds`, for lateral discovery that isn't strictly tree-adjacent (e.g. linking `Currency & Exchange` to `ATMs & Digital Payments` even though they're siblings, or eventually cross-linking to a different top-level category).

## 9. Responsive Behavior Matrix

| Breakpoint | Hub page | Section page | Detail page |
|---|---|---|---|
| Desktop (≥1024px) | Full card grid, 3–4 columns | Rail (left) + card grid (right) | Rail (left) + content + related module |
| Tablet (768–1023px) | 2-column card grid | Collapsed icon-rail + chip scroller + card grid | Collapsed icon-rail + chip scroller + content |
| Mobile (<768px) | Single-column card grid | Chip scroller + Browse drawer trigger + card list | Chip scroller + Browse drawer trigger + content |

Breadcrumb Trail is sticky at all breakpoints; only the Rail vs. Drawer treatment changes.

## 10. Interaction & Motion

- Rail branch expand/collapse: 150–200ms ease-out height transition, not spring/bounce (this is a navigation tool, not a delight moment — motion should feel instant and functional).
- Drawer: slide-up sheet, ~250ms, dismiss via swipe or scrim tap.
- Card hover (desktop only): subtle lift (2–4px translateY) + cover image slight scale (1.03x), no color inversion.
- Respect `prefers-reduced-motion`: disable translate/scale transitions, keep opacity/height changes only.

## 11. Visual Design Direction

Full token system (color, type, the "Trail" motif's visual construction) is defined in `UX-SPEC.md`. Summary: a palette and type pairing grounded in Yogyakarta's own materials (batik indigo, volcanic ash charcoal, kraton brass, clay roof terracotta) rather than a generic travel-site look — deliberately avoiding the current wave of AI-default palettes (warm-cream-plus-clay, near-black-plus-neon, hairline-broadsheet).

## 12. Bilingual (ID/EN) Requirements

- Every user-facing string in the tree (`title`, `summary`, `body`) is stored as `{ en, id }` — see schema in §6.2.
- Language switch must be **instant client-side** (no route change), and must persist the user's current node — switching language on a detail page keeps you on that same page, translated.
- URLs are **not** localized (no `/id/visitor-information/...` prefix) in this phase — language is a display-layer toggle, not a routing concern. Flag if this should change later (e.g. for localized SEO).

## 13. Edge Cases & Rules

| Case | Rule |
|---|---|
| Section with zero children | Should not be possible post-launch; build-time validation fails if any `section` node has an empty `children` array. |
| Section with exactly one child | Render normally (as a 1-card grid) — **do not auto-redirect/skip** to the single child. Auto-skipping breaks the breadcrumb's ability to show the skipped level and confuses back-navigation. |
| Very long child lists (10+) | Card grid paginates or lazy-loads after ~12 cards rather than growing unbounded; chip scroller gets a subtle scroll-shadow affordance so users know there's more. |
| Direct deep link to a level-3 detail page | Trail Rail/Breadcrumb must reconstruct the full ancestor path from the URL alone on first paint — never rely on client-side navigation history. |
| Missing/broken `relatedPageIds` reference | Build-time validation warns and drops the dead reference rather than rendering a broken link. |
| In-section filter/search | Lightweight client-side filter (by title/tag) scoped to the current section's descendants only — out of scope: a global fuzzy search across all of Visitor Information (flagged as a fast-follow, not blocking this phase). |

## 14. SEO & Accessibility

- Each node gets its own canonical URL, `<title>`, and meta description from `summary`.
- Breadcrumb Trail emits `BreadcrumbList` structured data (schema.org) matching the visible trail exactly.
- Rail and Drawer are both keyboard-navigable (arrow keys to move between siblings, Enter to open, Esc to close Drawer); current node marked with `aria-current="page"`.
- Color contrast for text on cover-image cards meets WCAG AA (scrim/gradient overlay behind text, verified against the actual imagery, not just the base color).

## 15. Success Metrics

- Reduction in "back button" usage within the section (proxy for people getting lost).
- Increase in cross-category page views per session (proxy for the Related module and Rail doing their job, vs. today's dead-end pages).
- Bounce rate on deep (level-3) pages reached via direct link/share — should not be meaningfully higher than level-1/2 pages, confirming the Trail reconstructs context properly.

## 16. Build Plan / Phases

1. **Data & validation**: finalize `content-tree.json` schema, migrate real content into it, add build-time tree validator (§13).
2. **Templates**: build the three page templates (Hub, Section, Page) against the static tree, desktop-only.
3. **Trail system**: Breadcrumb + Rail (desktop), then Drawer + Chip Scroller (mobile) — see `UX-SPEC.md` for full component spec.
4. **Bilingual pass**: wire the `en`/`id` toggle through all templates and the Trail.
5. **Polish**: motion, empty/edge states, SEO structured data, accessibility pass.
6. **QA against edge cases** in §13 using the example tree in `content-tree.json` before swapping in final real content.

## 17. Assumptions & Open Questions

- Assumed 6 top-level categories in the example data (Getting to Jogja, Getting Around, Where to Stay, Money & Costs, Health & Safety, Culture & Etiquette) — **replace with the real category list** before implementation; the templates and Rail are built to handle any count and any mix of depths, so the real list is a drop-in data change, not a rebuild.
- Assumed no admin/CMS UI is needed this phase, per the static-JSON decision in §6.4 — confirm this holds once real content volume is known.
- Open question: should Visitor Information have its own in-section search, or should this wait for a site-wide search feature? (Flagged as fast-follow in §13, not blocking.)
- Open question: is a `visitor-information` sitewide nav entry point (header mega-menu) also being redesigned, or does this PRD's scope stop at the hub page itself?

## 18. Appendix — Related Files

- `content-tree.json` — the data model + example bilingual content (source of truth for structure).
- `UX-SPEC.md` — detailed component spec: exact states, sizes, tokens, and the Trail's visual construction.
- `prototype.html` — clickable static prototype of the Adaptive Explorer pattern, built directly against `content-tree.json`'s example data, for stakeholder review before implementation.
