# UX Spec — "Adaptive Explorer" for Visitor Information

Companion to `PRD.md`. This file specifies exact visual tokens, component states, and interaction rules so a build (human or agent) can implement without guessing.

---

## 1. Design Direction

**Grounding subject:** Yogyakarta's own material world — batik indigo, volcanic ash from Merapi, kraton (palace) brass ornament, clay roof tiles — rather than a generic "tropical travel site" look.

**Signature element:** *The Trail.* Breadcrumb and sidebar are the same component at two sizes: a connected line of dots representing a route, echoing the site's tagline ("every journey becomes your story"). This is the one place the design takes a visible risk; everything else stays quiet so the Trail reads clearly as the wayfinding spine of the section.

### 1.1 Color tokens

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#241F1C` | Primary text, active Trail dots |
| `--paper` | `#EFE7D8` | Page background — unbleached batik cotton, not a marketing-cream tone |
| `--surface` | `#FBF8F1` | Card backgrounds |
| `--indigo` | `#223A5E` | Primary accent — batik tulis indigo. Active states, links, current Trail node |
| `--indigo-soft` | `#D8E0E9` | Indigo tint for hover backgrounds, chip fills |
| `--clay` | `#B5502F` | Secondary accent — clay roof terracotta. Used sparingly (tags, one hero moment) — deliberately not the AI-default `#D97757` |
| `--brass` | `#B8863B` | Tertiary accent — kraton ornament brass. Icons, dividers, subtle highlight only |
| `--jade` | `#4C7A5E` | Success/confirmation states only (e.g. "saved") |
| `--line` | `#D9CFBB` | Hairline borders, Trail connecting lines (inactive) |

No pure black, no pure white — everything sits on the warm paper/ink pairing.

### 1.2 Typography

| Role | Face | Notes |
|---|---|---|
| Display (H1/H2, card titles) | **Fraunces** (serif, opsz axis if variable) | Warm, ink-trap serif — used at larger sizes only, restraint at body scale |
| Body / UI | **Plus Jakarta Sans** | Geometric sans, a small nod to Indonesian type culture, used for all body copy, nav labels, buttons |
| Utility (meta strip, tags, timestamps) | **IBM Plex Mono**, small size | Read time, "last updated", tag pills — gives reference-content a quiet data feel without looking robotic everywhere |

Type scale (desktop): H1 40/44, H2 28/34, H3 20/26, body 16/26, small/meta 13/18.

### 1.3 Motif

A subtle **parang batik diagonal-stripe texture**, used at ~4% opacity, only in two places: the Hub page hero background, and behind the collapsed Trail Rail. Never on cards or body content — it's a frame, not a wallpaper.

---

## 2. Component: Breadcrumb Trail

**Purpose:** always-visible answer to "where am I", clickable to jump to any ancestor.

**Structure:** horizontal row of dot-nodes connected by a thin `--line` colored line. Each dot:
- Inactive ancestor: 8px circle, `--line` fill, `--ink` label to the right, 60% opacity.
- Current node: 10px circle, `--indigo` fill, full-opacity `--ink` label, small ring (2px `--indigo-soft`) around the dot.
- Hover/focus (ancestors only): label opacity → 100%, dot fill → `--indigo`.

**Overflow rule:** if the trail has more than 4 segments (common at depth 3), collapse middle segments into a single "…" dot. Tapping/clicking it opens a small popover (not a tooltip — must be tappable on mobile) listing the collapsed ancestors as a plain list, each still clickable.

**Position:** sticky under the global site header, full width, `--surface` background, hairline `--line` bottom border. Height 48px desktop / 44px mobile.

**Structured data:** emits `BreadcrumbList` JSON-LD matching the visible order exactly — no hidden extra levels.

---

## 3. Component: Trail Rail (desktop/tablet, persistent)

**Purpose:** the vertical, larger version of the Trail — shows the current branch fully expanded, siblings collapsed-but-reachable, without ever rendering the whole tree.

**Layout:** fixed-width left column, 260px expanded / 64px collapsed (icon-only). Sits below the sticky Breadcrumb, scrolls independently from content if it overflows viewport height.

**Rendering rule (this is the core trick that avoids "boring tree" feel):**
- Only the **active path** (root → current node) is expanded and shows full labels.
- Siblings of each active-path node are shown as **small unlabeled dots** (icon-only, 24px) below/beside the expanded item — hovering (desktop) or tapping reveals the label in a small flyout; clicking navigates there directly (this *is* the sibling-jump shortcut, no need to walk back up first).
- Non-active branches elsewhere in the tree are **not rendered at all** at this stage — only surfaced if the user expands upward past the hub (i.e., collapses back to the Hub level, which shows all top-level categories as the "root" state of the rail).

**States:**
- Default: expanded (260px), showing icons + labels for the active path, dots for siblings.
- Collapsed: 64px, icons only (active path highlighted via `--indigo` icon background), no sibling dots (tooltip on hover shows label). Toggled via a small chevron control at the top of the rail; persists per-session (not per-page).
- Active node row: `--indigo-soft` background pill behind the icon+label, `--indigo` left border accent (3px).

**Connecting line:** a vertical `--line` colored line runs behind the icons down the active path, visually reinforcing "this is one continuous route" — this is the literal Trail motif at rail scale.

---

## 4. Component: Browse Drawer (mobile)

**Trigger:** floating pill button, bottom-right, label "Browse" + a compass icon (ties back to the Hub's icon), visible on Section and Page templates only (not the Hub itself).

**Behavior:** slides up as a bottom sheet, ~70% viewport height max, scrollable. Content is the *same* Trail Rail component, mobile-adapted: active path expanded with full labels, siblings as a horizontal chip row nested under each active node rather than small dots (touch targets need to be ≥44px).

**Dismiss:** swipe down, tap scrim, or Esc (external keyboard/tablet).

**Motion:** 250ms ease-out slide, scrim fades in parallel. Respect `prefers-reduced-motion` → cross-fade instead of slide.

---

## 5. Component: Sibling Chip Scroller

**Purpose:** the fast path to "show me the other one" without opening the Drawer.

**Structure:** horizontally scrollable row of pill buttons, one per sibling of the current node (including the current node itself, visually marked active), placed directly beneath the page/section header.

**Chip states:**
- Default: `--surface` background, `--line` border, `--ink` text.
- Active (current node): `--indigo` background, `--paper`-colored text (inverted).
- Overflow affordance: right-edge soft gradient fade when there's more to scroll, no visible scrollbar.

**Mobile only** below tablet breakpoint is a hard requirement; optional to also show on tablet if the Rail is collapsed to icon-only, per PRD §9 matrix.

---

## 6. Component: Card (Hub grid / Section grid)

Two variants sharing a base:

**Section card** (used on Hub for categories, and on Section pages when a child is itself a section): cover image (4:3), gradient scrim bottom third for text legibility, icon badge top-left, title (Fraunces, H3 size) + one-line summary over the scrim, small "N inside" count badge bottom-right.

**Page card** (used on Section pages when a child is a leaf page): no cover image — icon (brass-colored, 32px) + title + one-line summary + meta strip (read time, mono font) in a bordered `--surface` panel. Denser than the section card since these are scannable reference items, not destinations to be "sold" visually.

**Hover (desktop):** section card lifts 3px + cover image scales 1.03x, 200ms ease-out. Page card: border color shifts `--line` → `--indigo-soft`, no movement (keeps dense grids calm).

---

## 7. Component: Related Pages module

Bottom-of-detail-page row of up to 4 compact Page cards (no cover image, same style as grid Page cards), sourced from `meta.relatedPageIds`. Heading: "Related" (not "You might also like" — plain, per writing guidance). If a referenced ID doesn't resolve (see PRD §13), it's silently dropped from the row rather than shown broken.

---

## 8. Responsive Breakpoints

| Name | Range | Rail | Drawer trigger | Chip scroller |
|---|---|---|---|---|
| Desktop | ≥1024px | Expanded (260px), collapsible to 64px | Hidden | Hidden |
| Tablet | 768–1023px | Collapsed (64px) by default | Hidden | Visible |
| Mobile | <768px | Hidden entirely | Visible (Section/Page only) | Visible |

---

## 9. Accessibility Checklist

- All Trail dots, Rail rows, chips, and drawer items are real buttons/links — never `div onClick`.
- `aria-current="page"` on the active Trail node at every size.
- Rail and chip scroller support arrow-key navigation between siblings; Enter activates; Esc closes the Drawer.
- Focus ring: 2px `--indigo` outline, visible against both `--paper` and `--surface`.
- Reduced motion: all transform-based transitions (lift, scale, slide) replaced with opacity-only equivalents.
- Cover-image card text always sits on a scrim verified for 4.5:1 contrast against the busiest part of the actual image used, not just an average color.

---

## 10. What NOT to build

- No infinite auto-expanding nested `<ul>` tree with indentation-as-hierarchy — this is exactly the "boring documentation" pattern being replaced.
- No mega-dropdown mimicking the entire tree from the global header (out of scope per PRD non-goals) — Trail Rail/Drawer are section-local, not a sitewide mega-menu.
- No auto-redirect/skip when a section has a single child (PRD §13) — always render the intermediate step.
- No AI-default palette (warm cream + terracotta `#D97757`, near-black + neon accent, or hairline broadsheet layout) — this section has its own grounded palette per §1.1.
