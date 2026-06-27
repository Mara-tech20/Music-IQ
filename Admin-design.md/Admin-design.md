# Music IQ — Admin Dashboard
## Design Specification

**Status:** Discovery → Design → Build
**Version:** 1.0
**Last Updated:** June 2026
**Audience:** Internal — Design, Engineering

---

## Design Philosophy

The admin dashboard is a tool, not a product. Every design decision should serve efficiency over aesthetics. That said, it should not look cheap. The admin interface reflects the quality of the company that built Music IQ.

**Three design principles for the admin:**

1. **Clarity First** — Information must be immediately legible. No decorative elements that compete with content.
2. **Speed of Action** — Admins should be able to accomplish tasks in as few clicks as possible. Common actions must never be buried.
3. **Consistent With The Brand** — The admin inherits the Music IQ visual language (colours, typography, spacing system) but applies it in a more structured, data-dense way.

---

## Visual Identity

### Colour Palette

The admin uses the Music IQ dark theme as its default. There is no light mode for the admin dashboard in MVP.

| Token | Value | Usage |
|---|---|---|
| `--admin-bg-base` | `#080818` | Main page background |
| `--admin-bg-surface` | `#0f0f28` | Sidebar, top bar surfaces |
| `--admin-bg-card` | `rgba(255,255,255,0.06)` | Data cards, table containers |
| `--admin-bg-elevated` | `rgba(255,255,255,0.10)` | Modals, dropdowns, tooltips |
| `--admin-text-primary` | `#f0f0ff` | Headings and primary labels |
| `--admin-text-secondary` | `rgba(240,240,255,0.60)` | Supporting labels, metadata |
| `--admin-text-muted` | `rgba(240,240,255,0.35)` | Timestamps, placeholders |
| `--admin-border` | `rgba(255,255,255,0.08)` | Card borders, dividers |
| `--admin-accent` | `#7c3aed` | Primary interactive elements |
| `--admin-accent-hover` | `#6d28d9` | Hover state for accent elements |
| `--admin-success` | `#22c55e` | Active status, success states |
| `--admin-warning` | `#f59e0b` | Pending states, warnings |
| `--admin-danger` | `#ef4444` | Destructive actions, error states |
| `--admin-info` | `#3b82f6` | Informational badges |

### Typography

Inherits from the player app type system.

| Role | Font | Weight | Size |
|---|---|---|---|
| Page Titles | Outfit | 700 | 24px |
| Section Headers | Outfit | 600 | 18px |
| Card Labels | Space Grotesk | 600 | 14px |
| Body / Table Text | Space Grotesk | 400 | 14px |
| Supporting Meta | Space Grotesk | 400 | 12px |
| Badges / Tags | Space Grotesk | 500 | 11px |

### Spacing System

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | `4px` | Inline gaps, icon margins |
| `--space-sm` | `8px` | Compact internal padding |
| `--space-md` | `16px` | Card padding, row gaps |
| `--space-lg` | `24px` | Section gaps |
| `--space-xl` | `40px` | Page-level breathing room |

### Border Radius

| Element | Radius |
|---|---|
| Cards | `12px` |
| Buttons | `8px` |
| Badges | `6px` |
| Input fields | `8px` |
| Modals | `16px` |
| Table rows | `0` (flat within container) |

---

## Layout Architecture

### Shell Layout

The admin uses a fixed two-column shell:

```
┌─────────────────────────────────────────────────────────┐
│                       TOP BAR                           │
├───────────────┬─────────────────────────────────────────┤
│               │                                         │
│   SIDEBAR     │             MAIN CONTENT                │
│   (240px)     │                                         │
│               │                                         │
│               │                                         │
└───────────────┴─────────────────────────────────────────┘
```

- **Top Bar:** Fixed, 64px height. Full-width across the page.
- **Sidebar:** Fixed, 240px wide. Scrollable if nav items overflow.
- **Main Content:** Scrollable. Takes all remaining horizontal space. Padded `32px` on all sides.

---

### Top Bar

| Element | Detail |
|---|---|
| Left | Music IQ logo + "Admin" label in muted text |
| Center | Current page title (updates per route) |
| Right | Admin avatar (initials), admin name, logout button |

- Top bar uses `--admin-bg-surface` background with a subtle `1px` bottom border
- Logout triggers a confirmation modal before destroying the session

---

### Sidebar Navigation

The sidebar groups navigation into logical sections with dividers.

```
Music IQ Admin
─────────────────
  Overview

  CONTENT
  Questions
  Categories

  PLAYERS
  Player List
  Category Requests

  DATA
  Leaderboard & Stats

  PLATFORM
  Announcements
  Settings
─────────────────
  Logout
```

**Sidebar item states:**
- **Default:** Muted icon + label, no background
- **Hover:** Subtle background `rgba(255,255,255,0.05)`, label brightens to `--admin-text-primary`
- **Active:** Accent-coloured left border (`3px` solid `--admin-accent`), icon and label in `--admin-accent` colour, background `rgba(124,58,237,0.12)`

---

## Component Library

### Stat Cards

Used on the Overview page to show key platform metrics.

```
┌─────────────────────────────┐
│  Icon                       │
│  Metric Label               │
│  Large Number Value         │
│  ▲ +12% vs last week        │
└─────────────────────────────┘
```

- Background: `--admin-bg-card` with `1px` border
- Icon: Category-coloured circle with SVG icon inside
- Value: `32px`, `Outfit`, `700`
- Trend indicator: Green arrow + % for positive, red for negative, grey for neutral

---

### Data Tables

The primary component for player lists, question lists, request queues, etc.

**Structure:**

```
┌── TABLE HEADER ────────────────────────────────────────────┐
│  Search input  │  Filter dropdowns  │  Bulk action button  │
└────────────────────────────────────────────────────────────┘
┌─────────┬────────────────────┬───────────┬─────────────────┐
│  Check  │  Column A          │  Column B │  Actions        │
├─────────┼────────────────────┼───────────┼─────────────────┤
│  [ ]    │  Row data          │  Row data │  Edit  Delete   │
│  [ ]    │  Row data          │  Row data │  Edit  Delete   │
└─────────┴────────────────────┴───────────┴─────────────────┘
┌── PAGINATION ──────────────────────────────────────────────┐
│  Showing 1–20 of 143 results          ← Prev  1  2  Next → │
└────────────────────────────────────────────────────────────┘
```

**Table design rules:**
- Container: `--admin-bg-card` with `12px` radius and `1px` border
- Header row: `rgba(255,255,255,0.04)` background, `600` weight, `--admin-text-secondary` colour, `12px` uppercase text
- Body rows: No background by default; `rgba(255,255,255,0.03)` on hover
- Row height: `52px`
- Row separator: `1px` border using `--admin-border`
- Checkbox column: `44px` wide
- Actions column: Right-aligned; icon buttons with tooltips on hover
- Pagination: Below the table, right-aligned page controls, `12px` from table edge

---

### Status Badges

Used throughout tables and detail views to communicate status at a glance.

| Status | Background | Text Colour | Label |
|---|---|---|---|
| Active | `rgba(34,197,94,0.15)` | `#22c55e` | Active |
| Draft | `rgba(245,158,11,0.15)` | `#f59e0b` | Draft |
| Retired | `rgba(239,68,68,0.10)` | `#ef4444` | Retired |
| Pending | `rgba(245,158,11,0.15)` | `#f59e0b` | Pending |
| Reviewed | `rgba(59,130,246,0.15)` | `#3b82f6` | Reviewed |
| Accepted | `rgba(34,197,94,0.15)` | `#22c55e` | Accepted |
| Declined | `rgba(239,68,68,0.10)` | `#ef4444` | Declined |

- Badge dimensions: `6px 10px` padding, `6px` border radius
- Font: `11px`, `Space Grotesk`, `500` weight

---

### Buttons

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| Primary | `--admin-accent` | White | None | Confirm, Save, Publish |
| Secondary | Transparent | `--admin-text-primary` | `1px --admin-border` | Cancel, Back |
| Danger | `rgba(239,68,68,0.15)` | `#ef4444` | `1px rgba(239,68,68,0.3)` | Delete, Deactivate |
| Ghost | Transparent | `--admin-accent` | None | Subtle actions |
| Icon-only | Transparent | `--admin-text-secondary` | None | Table inline actions |

- Standard button height: `36px`
- Padding: `0 16px`
- Border radius: `8px`
- Hover: Shift background by `10%` opacity
- All buttons have a `0.15s` ease transition on hover

---

### Form Inputs

Used in question editor, category editor, announcement composer, etc.

| Property | Value |
|---|---|
| Height | `40px` |
| Background | `rgba(255,255,255,0.05)` |
| Border | `1px solid rgba(255,255,255,0.10)` |
| Border (focus) | `1px solid --admin-accent` |
| Border radius | `8px` |
| Text | `--admin-text-primary`, `14px` |
| Placeholder | `--admin-text-muted` |
| Padding | `0 12px` |

- Textarea: Same styles, min-height `100px`, `padding: 12px`
- Select dropdown: Matching style with a custom chevron icon
- All inputs have focus ring: `0 0 0 3px rgba(124,58,237,0.25)`

---

### Modals

Used for: confirmation dialogs, question preview, form submissions.

```
┌────────── OVERLAY (50% opacity) ─────────────────┐
│                                                  │
│   ┌────────── MODAL (480px max-width) ────────┐  │
│   │  Modal Title                     [×]      │  │
│   │  ─────────────────────────────────────    │  │
│   │  Modal body content / form               │  │
│   │                                           │  │
│   │  [Secondary Action]   [Primary Action]   │  │
│   └───────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Modal background: `--admin-bg-elevated`
- Border: `1px solid --admin-border`
- Border radius: `16px`
- Overlay: `rgba(0,0,0,0.60)` — slightly heavier than the player app (admin context demands more focus)
- Entry animation: `scale(0.96) → scale(1)` + `opacity 0 → 1`, `200ms ease-out`
- Exit animation: `scale(1) → scale(0.96)` + `opacity 1 → 0`, `150ms ease-in`
- Close button (×): Top right, icon-only, muted colour

---

### Toggle Switches

Used for active/inactive status on questions, categories, and platform settings.

- **On state:** `--admin-accent` track, white thumb
- **Off state:** `rgba(255,255,255,0.15)` track, muted thumb
- Transition: `200ms ease` thumb slide
- Size: `40px × 22px`
- Thumb diameter: `16px`

---

### Charts and Analytics

Used on the Overview page and the Leaderboard & Stats module.

- **Library:** Lightweight — use native SVG or a minimal charting library (e.g. Recharts if React is used)
- **Line charts:** Trend lines for DAU, games played — thin `2px` accent-coloured strokes, subtle gradient fill below the line
- **Bar charts:** Category performance comparison — vertical bars in category accent colours
- **Tooltip:** Dark glass card on hover, showing exact data point value and label
- **Axis labels:** `11px`, `--admin-text-muted`
- **Grid lines:** `rgba(255,255,255,0.05)` horizontal only

---

## Screen Designs

### 1. Overview (Home)

**Top section — Stat Cards Row:**
- 4 cards in a 4-column grid
- Cards: Total Players, Games Played Today, Most Active Category, Pending Requests
- Each card has an icon, value, and a trend vs. previous period

**Middle section — Charts Row (2 columns):**
- Left: New Registrations (last 30 days) — line chart
- Right: Games by Category (this week) — bar chart

**Bottom section — Activity Feed + Quick Actions:**
- Left: Recent platform activity log (last 10 actions)
- Right: Quick-action buttons (Add Question, Review Requests, View Leaderboard)

---

### 2. Questions List

- Full-width table with: Question text (truncated at 60 chars), Category badge, Difficulty badge, Status badge, Date Added, Actions (Edit | Toggle Active | Delete)
- Table header: Search bar on the left, category and status filter dropdowns in the middle, "Add Question" primary button on the right
- Clicking Edit opens the Question Editor in a drawer from the right (not a new page — keeps table context intact)

---

### 3. Question Editor (Drawer)

- Slides in from the right side, `480px` wide
- Title: "Edit Question" or "New Question"
- Fields (top to bottom): Category (select), Difficulty (select), Question Text (textarea), Answer A / B / C / D (4 inputs), Correct Answer (radio group), Status (toggle), Notes (textarea, optional)
- Preview Tab: Switches the drawer to show how this question looks in the actual game card
- Footer: "Cancel" (secondary) + "Save" (primary) — always visible, sticky at the bottom of the drawer

---

### 4. Category Management

**Category Table:**
- Columns: Category name, question count, difficulty label, status badge, visibility toggle, actions (Edit)
- The visibility toggle is the primary inline control — no full editor needed just to show/hide a category
- **Disabling a category (toggle off) removes the category card from the player home screen immediately and silently.** No modal confirmation is shown for this action — it is non-destructive and fully reversible. The category and all its data are preserved; toggling back on restores it instantly.
- A disabled category row in the admin table shows a dimmed appearance (reduced opacity on the name + a "Hidden" badge) so the admin can easily see what is currently invisible to players

**Category Editor Drawer** (opens on clicking Edit):
- Category name, description
- Gradient colour pickers (start/end) and accent colour
- Difficulty range label
- Visibility toggle (mirrored from the table inline toggle)
- Category icon or emoji

**Artist Spotlight Panel** (separate section within the Category Editor drawer, only shown when editing the Artist Spotlight category):

```
┌── ARTIST SPOTLIGHT ──────────────────────────────────────┐
│                                                          │
│  Currently Spotlighting                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  [Artist Image]   Michael Jackson                │   │
│  │                   Active since: 1 Jun 2026       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Change Spotlight Artist                                 │
│  Artist Name  [__________________________________]       │
│  Artist Image [Upload image / paste image URL   ]       │
│                                                          │
│  [ Cancel ]                   [ Update Spotlight ]       │
└──────────────────────────────────────────────────────────┘
```

- **Currently Spotlighting block:** Read-only preview showing the active artist's image, name, and the date the spotlight was last set. Always visible at the top of the panel so the admin has full context before making a change.
- **Artist Name field:** Free-text input. This value drives the category card label and the in-game header.
- **Artist Image:** Upload from local file or paste a URL. Image previews inline after selection. Recommended dimensions noted below the input (`400 × 400px minimum, square crop`).
- **Update Spotlight button:** Applies the change immediately. No draft/publish step — the player-facing card updates on save.
- **Active Since** is auto-populated to the current date when the admin saves a new artist and is read-only.

---

### 5. Player List

- Table: Name, Account Type badge, Join Date, Games Played, Current Rank, Total Stars, Actions (View | Deactivate)
- Clicking View opens a Player Detail panel — either a right drawer or a separate detail page
- Player Detail: Shows full stat breakdown and per-category performance bars (reusing the player profile design language)

---

### 6. Category Requests

- Table: Suggestion text, Submitted By, Date, Status badge, Actions (Mark Reviewed | Accept | Decline)
- Decline action opens a small inline modal asking for an optional internal note
- Filter tabs at the top: All | Pending | Reviewed | Accepted | Declined

---

### 7. Leaderboard & Stats

- Top: Category filter tabs (All / General / Pop / Hip Hop / Afrobeats / etc.)
- Main: Leaderboard table (Rank, Player Name, Stars, Accuracy, Games Played)
- Below leaderboard: Analytics section with line and bar charts

---

### 8. Announcements

- Split view: Left panel is the announcement composer form (title, body, audience selector, schedule time), Right panel shows a live preview of how the notification will appear in the player app
- Below: Sent announcements log table

---

## Responsive Behaviour

The admin dashboard is **desktop-first**. It is designed for use on a laptop or monitor. Mobile support is not a priority for MVP.

- **Minimum supported viewport:** `1280px`
- **Sidebar:** Collapsible at `1024px` — collapses to icon-only mode (64px wide) with tooltips on hover
- At widths below `1024px`, the sidebar can be toggled via a hamburger button in the top bar

---

## Interaction & Motion

Animations in the admin are subtle and functional — never decorative for its own sake.

| Interaction | Animation |
|---|---|
| Page route change | Fade `opacity 0 → 1`, `150ms` |
| Drawer open | Slide in from right, `250ms ease-out` |
| Drawer close | Slide out to right, `200ms ease-in` |
| Modal open | Scale `0.96 → 1` + fade, `200ms ease-out` |
| Modal close | Scale `1 → 0.96` + fade, `150ms ease-in` |
| Table row hover | Background shift, `100ms` |
| Button hover | Background shift, `150ms` |
| Toggle switch | Thumb slide, `200ms ease` |
| Badge appear | No animation — instant |

> Keep `prefers-reduced-motion` in mind. All keyframe animations should respect the system setting by defaulting to instant transitions when reduced motion is enabled.

---

## Accessibility

- All interactive elements must have visible focus states (using the `3px rgba(124,58,237,0.25)` ring system)
- Icon-only buttons must have `aria-label` and `title` attributes
- Table headers must use `<th scope="col">` semantics
- Colour is never the only indicator of status — badges always include a text label
- Modals must trap focus while open and restore focus to the trigger element on close
- Form inputs must be associated with labels via `htmlFor` / `id`

---

## Empty States

Every list or data view must have a designed empty state — never a blank page.

| Screen | Empty State Message | Action |
|---|---|---|
| Questions List | "No questions yet. Start building your question bank." | Add Question button |
| Category Requests | "No requests pending. You're all caught up." | — |
| Player List | "No players found matching your search." | Clear filters |
| Announcements Log | "No announcements sent yet." | Create Announcement button |

Empty state layout: Centred icon + heading + subtext + optional CTA button.

---

## Error & Loading States

### Loading
- Skeleton screens on first load for tables and stat cards (not spinners)
- Skeleton: Same dimensions as real content, `rgba(255,255,255,0.06)` background, shimmer animation

### Error
- Toast notifications for non-critical errors (e.g. "Failed to save. Try again.")
- Toast position: Bottom right, `320px` wide, auto-dismiss after `4s`
- Full error screen for critical failures (e.g. cannot load data) — centred card with error message and a "Retry" button

---

## Open Design Questions

- [ ] Should the Question Editor be a side drawer or a dedicated full-page editor? Drawer keeps context; full page gives more room for complex forms.
- [ ] How should the admin handle pagination vs. infinite scroll for large tables?
- [ ] Should we support any chart exporting (CSV, PNG) for the analytics module in MVP?
- [ ] Does the admin need its own logo/branding, or does it reuse the Music IQ logo with an "Admin" suffix label?
