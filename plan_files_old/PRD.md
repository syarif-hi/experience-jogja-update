# PRD — Visitor Information: Information Architecture & Navigation Redesign

**Product:** Experience Jogja (demo.experiencejogja.com)
**Section:** `/visitor-information`
**Doc owner:** _(fill in)_
**Status:** Draft v0.1 for review
**Last updated:** 2026-07-29

---

## 1. Summary

`/visitor-information` is a deep content section (Section → Category → Sub-category → Detail page, up to 4 levels). Today, a visitor lands on a detail page (e.g. an individual airport) with no way to see where they are in the section, no way to jump sideways to a sibling page, and no way to jump up/down the tree without going back through multiple clicks. This PRD proposes:

1. A **breadcrumb** on every page in the section, reflecting the full path.
2. A **persistent left sidebar** showing the section's full tree, with the current location expanded and highlighted.
3. Supporting template and interaction changes (landing pages for branches, prev/next sibling nav, in-sidebar search, mobile drawer) so the deep tree stays easy to scan and "surf" regardless of entry point.

A clickable prototype (`ux-prototype.html`) is included to demonstrate the target interaction; the exact tree used there is an **assumed placeholder** pending a real content audit (see §4).

---

## 2. Problem Statement

- The tree is **4 levels deep** (`Visitor Information > Getting to Jogja > Airports > Airport A/B/C`), but the page currently gives no persistent sense of hierarchy.
- Visitors who land on a detail page via search or a shared link have **no path back to related content** (sibling airports, the parent category, the section home) without using browser-back or the main site nav.
- Content editors will keep adding categories/sub-categories over time; the IA needs a **pattern that scales** past today's specific categories, not a one-off fix for "Airports."
- No current mechanism to **jump across branches** (e.g., from an Airport detail page to "Visa & Entry Requirements") without a full page reload through the top-level menu.

## 3. Goals

- Make current location in the hierarchy **always visible** (breadcrumb).
- Make the **entire section tree reachable in ≤2 clicks** from any page inside it (sidebar).
- Support **fast lateral movement** between sibling pages (prev/next, sidebar highlight).
- Keep the experience usable on **mobile**, where a persistent sidebar can't just be transplanted 1:1.
- Keep the pattern **content-agnostic** — works whether a branch is 1 level deep (a flat page like "Weather") or 3 levels deep (Airports → individual airport).

### Non-goals (this phase)
- Redesigning visual branding of the whole site.
- Rewriting or re-authoring actual content copy.
- Building a global site-wide search (only in-section sidebar filter is in scope).
- CMS/backend data-modeling work (flagged as a dependency, not delivered here).

---

## 4. Assumptions & Inputs

The live demo page renders client-side (JS SPA); it wasn't possible to crawl the actual rendered category tree for this doc. Everything below the section root is therefore a **representative placeholder tree**, built from the single real example given:

> `Visitor Information > Getting to Jogja > Airports > Airports A, B, C`

...extended with plausible sibling categories a visitor-information hub typically needs (Getting Around, Accommodation, Travel Essentials, Weather, Tourist Info Centers). **Before implementation, run a content audit against the live CMS** to replace the placeholder tree in §6 with the real one — the interaction patterns and components in this PRD do not depend on the specific labels, only on the shape (mixed depth, some flat pages, some 3-deep chains).

Open items to confirm with stakeholders are listed in §15.

---

## 5. Current State (as described)

- Flat-feeling navigation: category → sub-category → detail, but no breadcrumb or persistent tree once inside a detail page.
- Presumed URL pattern is unconfirmed (could be flat slugs or nested slugs — see §10).
- Section is bilingual (ID/EN per site meta description) — nav components must support both without layout breakage.

---

## 6. Proposed Information Architecture

Depth levels used throughout this doc:

| Level | Name | Example | Has children? |
|---|---|---|---|
| L0 | Section hub | Visitor Information | yes |
| L1 | Category | Getting to Jogja | yes, or none (flat page) |
| L2 | Sub-category | Airports | yes, or none |
| L3 | Detail | Yogyakarta International Airport (YIA) | no |

Placeholder tree (replace with audited content):

```
Visitor Information
├─ Getting to Jogja
│  ├─ Airports
│  │  ├─ Yogyakarta International Airport (YIA)
│  │  └─ Adisutjipto Airport (JOG)
│  ├─ Train Stations
│  │  ├─ Tugu Station
│  │  └─ Lempuyangan Station
│  ├─ Bus Terminals
│  │  ├─ Jombor Bus Terminal
│  │  └─ Giwangan Bus Terminal
│  └─ By Car & Toll Roads                    (flat L2, no children)
├─ Getting Around
│  ├─ Public Transport
│  │  ├─ TransJogja Bus
│  │  └─ Trans Jateng
│  ├─ Ride-Hailing Apps                      (flat L2)
│  └─ Car & Motorbike Rental                 (flat L2)
├─ Accommodation
│  ├─ Hotels
│  ├─ Homestays & Guesthouses
│  └─ Villas
├─ Travel Essentials
│  ├─ Visa & Entry Requirements
│  ├─ Currency & Money
│  ├─ Health & Safety
│  ├─ Local Etiquette & Culture
│  └─ Emergency Contacts
├─ Weather & Best Time to Visit               (flat L1, no children)
└─ Tourist Information Centers                 (flat L1, no children)
```

Note the deliberate mix of depths — some categories go 3 deep (Getting to Jogja → Airports → YIA), some stop at 2 (Accommodation → Hotels), and some are flat single pages (Weather). **The sidebar and breadcrumb components must handle all three shapes without special-casing**, since editors will keep changing which is which. Full slug proposal in `information-architecture.md`.

---

## 7. Proposed Page Layout & UX

Overall page anatomy for every page inside `/visitor-information/*`:

```
┌───────────────────────────────────────────────────────────┐
│ Site header (unchanged)                                    │
├───────────────────────────────────────────────────────────┤
│ Breadcrumb: Home / Visitor Information / Getting to Jogja / │
│             Airports / Yogyakarta International Airport     │
├───────────────┬───────────────────────────────────────────┤
│               │  Page content                              │
│  Sidebar tree │  (Category landing / Sub-category landing   │
│  (sticky)     │   / Detail template — see 7.3)              │
│               │                                              │
│               │  ...                                         │
│               │  ← Prev   Next → (sibling nav, detail pages) │
└───────────────┴───────────────────────────────────────────┘
```

### 7.1 Breadcrumb

- Rendered on **every** page in the section, including the section root.
- Format: `Home > Visitor Information > [Category] > [Sub-category] > [Detail]` — only as many segments as actually apply (flat L1 pages show 3 segments, not padded to 5).
- Every segment except the current page is a link.
- Current (last) segment is plain text, `aria-current="page"`, visually de-emphasized (not a link) so it's clear it's not clickable.
- Mobile: horizontally scrollable single line rather than wrapping to multiple lines; middle segments collapse to `…` when width is constrained, keeping first (Home) and last two segments visible — tap `…` to reveal the rest.
- Emit `BreadcrumbList` structured data (schema.org) for SEO on every page.

### 7.2 Left Sidebar Tree Navigation

- Persistent, **sticky** on desktop (stays in view while the content column scrolls), scrolls independently once its own content exceeds viewport height.
- Shows the **entire section tree**, not just the current branch — visitors can jump from an Airport detail page straight to "Currency & Money" in one click.
- **Auto-expands** the ancestor chain of the current page on load; all other branches start collapsed.
- Current page is **highlighted** (background + left accent bar); ancestor categories carry a lighter "active branch" indicator so the user's whole path is visible at a glance, not just the final node.
- Each top-level category gets a consistent **accent color + icon** ("wayfinding color"), reused on that category's breadcrumb chip, sidebar node, and content-page accent — so users can orient by color even when scrolled past the tree itself. (Demonstrated in the prototype.)
- **Search/filter field** pinned at the top of the sidebar: typing filters the tree to matching labels (and their ancestors/descendants), auto-expanding matches. This is the main mitigation for "the tree is quite deep" — a visitor who knows roughly what they want doesn't have to expand 4 levels manually.
- Expand/collapse affordance (chevron) on any node with children; whole row is clickable, not just the chevron.
- Keyboard and screen-reader accessible as a proper tree widget (see §8).

### 7.3 Page templates

Three content templates, chosen automatically by node depth/children — not by manual per-page configuration:

- **Category landing (L1 with children)**: short intro copy + card grid of its direct children (sub-categories and/or flat detail pages mixed together, whichever the category actually has).
- **Sub-category landing (L2 with children)**: short intro copy + list/card grid of its detail children.
- **Detail page (any leaf, at L1, L2, or L3)**: hero/lead area, body content, and a **prev/next** control that moves between siblings **at that same level** (e.g., YIA ⇄ Adisutjipto, without leaving Airports). This keeps "surfing" within a branch fast even without touching the sidebar.
- A flat L1 page (e.g. "Weather & Best Time to Visit") simply renders as a detail page directly off the section root — no special-case handling required.

### 7.4 Responsive / Mobile behavior

- Below the tablet breakpoint, the sidebar is not shown inline. A **"Browse Visitor Information" bar** sits directly under the breadcrumb; tapping it opens the tree as a **slide-in drawer** (overlay, full tree, same search field, same expand/collapse behavior as desktop).
- Selecting a node in the drawer navigates and closes the drawer.
- Breadcrumb remains visible and horizontally scrollable at all breakpoints — it is the lightweight always-on wayfinding cue when the tree is hidden.
- Prev/Next sibling controls remain visible on mobile detail pages (cheap, high-value "surf" mechanism when the tree is one tap away instead of zero).

### 7.5 Search / filter within section

- In-sidebar filter (see 7.2) is in scope for this phase.
- Section-wide full-text search (across body content, not just titles) is called out as a **fast-follow**, not required for this release (§14).

### 7.6 Related content

- Optional "You might also need" module at the bottom of detail pages, manually curated by editors (e.g., an Airport page links to "Ride-Hailing Apps" and "Currency & Money"). Nice-to-have, not required for MVP — flagged in §14.

---

## 8. Accessibility

- Sidebar implemented as an ARIA `tree` / `treeitem` structure (or an accessible accordion/nav landmark if `tree` semantics prove too heavy for the actual framework) — keyboard operable: arrow keys to move between visible nodes, Enter/Space to activate, Right/Left to expand/collapse.
- Breadcrumb uses `<nav aria-label="Breadcrumb">` with an ordered list; current page marked `aria-current="page"`.
- All interactive elements (tree nodes, drawer toggle, prev/next) have visible focus states and minimum 44×44px touch targets on mobile.
- Color is never the *only* signal for "current page" or "active branch" — always paired with a text/weight/icon change, for color-blind and low-vision users.
- Respect `prefers-reduced-motion` for the drawer slide-in and any expand/collapse transitions.

## 9. SEO Considerations

- Prefer **nested URL slugs** matching the tree (`/visitor-information/getting-to-jogja/airports/yogyakarta-international-airport`) over flat slugs — this alone communicates hierarchy to search engines and matches the breadcrumb, avoiding a mismatch between URL and displayed path.
- `BreadcrumbList` structured data per page (§7.1).
- Category/sub-category landing pages should have their own unique meta title/description (not just "reused" from a detail page), since they're now real navigable destinations rather than incidental menu states.

## 10. Content & CMS Implications

- The sidebar tree and breadcrumb must be **driven by the same underlying content tree the CMS already uses** for category/sub-category/detail relationships — not a hand-maintained duplicate nav config, or the two will drift.
- Editors need a way to reorder siblings (affects both sidebar order and prev/next order) — confirm this already exists in the CMS or flag as a dependency.
- Flat L1/L2 pages (no children) and deep chains (3 levels) must both be representable without extra schema — confirm current CMS content-type modeling supports "a category with zero children" cleanly.

## 11. Success Metrics

- ↓ bounce rate on Visitor Information detail pages.
- ↑ pages-per-session within `/visitor-information/*` (proxy for "easy to surf").
- ↑ % of sessions in the section that use the sidebar or breadcrumb to navigate (vs. back button / re-entering via main nav) — requires basic click tracking on both components.
- ↓ time-to-find in a moderated usability test: "find the emergency contact number" / "find information about the second airport" (baseline vs. redesign).

## 12. User Stories & Acceptance Criteria

**US-1** — As a visitor on a detail page, I want to see my full location in the hierarchy, so I don't feel lost.
- Given any page under `/visitor-information`, when it loads, then a breadcrumb shows every ancestor from Home down to the current page, each ancestor clickable.

**US-2** — As a visitor, I want to jump to a sibling detail page without going back to the category list.
- Given a detail page with siblings at the same level, when I click "Next" (or "Previous"), then I land on the next (or previous) sibling in the defined order, and the breadcrumb/sidebar update to reflect it.

**US-3** — As a visitor, I want to browse the whole section's structure from wherever I am.
- Given any page in the section, when I look at the sidebar (desktop) or tap "Browse Visitor Information" (mobile), then I see the complete tree with my current branch already expanded and my current page highlighted.

**US-4** — As a visitor who knows roughly what I want, I want to jump straight there instead of expanding levels one by one.
- Given the sidebar is open, when I type in the filter field, then the tree narrows to matching nodes (plus their ancestors), auto-expanded.

**US-5** — As a mobile visitor, I don't want the tree to eat my screen.
- Given a viewport under the tablet breakpoint, when I open a page in the section, then the sidebar is collapsed into a drawer trigger by default, and opening it overlays the tree without navigating away from my current page until I select something.

## 13. Technical Notes / Component Breakdown

Framework-agnostic; suggested component split for whichever stack the site actually runs on:

- `<Breadcrumb path={ancestors[]} current={node} />`
- `<SectionSidebar tree={fullTree} activePath={ancestors[]} onFilter={...} />`
  - `<TreeNode node collapsed? active? onToggle onSelect />` (recursive)
- `<SectionLayout>` — wraps breadcrumb + sidebar + content slot, so every template (category/sub-category/detail) gets the chrome for free instead of re-implementing it.
- `<SiblingNav prevNode nextNode />`
- Tree data: single source of truth (ideally the CMS's existing category tree, fetched once per section and cached client-side; sidebar and breadcrumb both derive from it — do not hand-author two separate configs).

## 14. Rollout Plan / Phases

- **Phase 0 (this doc):** Content audit of real tree; confirm URL/slug strategy; stakeholder sign-off on tree shape and templates.
- **Phase 1 (MVP):** Breadcrumb + sidebar tree + 3 templates (category/sub-category/detail) + mobile drawer + prev/next. This PRD's scope.
- **Phase 2 (fast-follow):** In-sidebar search refinements (fuzzy match, keyboard shortcut to focus it), "related content" module, basic usage analytics on nav components.
- **Phase 3 (later):** Section-wide full-text search; personalized/recently-viewed shortcuts in the sidebar.

## 15. Risks & Open Questions

- **Real tree shape unknown** — this entire document is built on a placeholder; effort estimate may shift once the actual tree (and its max depth/breadth) is confirmed.
- Is the current URL structure flat or nested? Changing it has SEO/redirect implications (needs 301s if slugs change).
- Bilingual (ID/EN) — does each language have its own tree/labels, or one tree with translated strings? Affects search/filter implementation.
- Any existing design system/component library to reuse vs. building the sidebar/breadcrumb from scratch?
- Should category/sub-category landing pages be net-new pages (editor-authored intro copy) or auto-generated purely from child listings? Affects CMS scope in §10.

## 16. Appendix

- Full slug table and tree data: `information-architecture.md`
- Clickable interaction prototype: `ux-prototype.html` (open directly in a browser — no build step required)
