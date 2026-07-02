# Music IQ — Admin Dashboard
## Design Specification

**Status:** Discovery → Design → Build
**Version:** 1.1
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
| Drawers | `0` (flush with screen edge) |
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
  OVERVIEW
  Dashboard

  CONTENT
  Categories
  Question Management

  GAMEPLAY
  Gameplay

  PLAYERS
  User Management

  PLATFORM
  Team Management
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

Used on the Dashboard, Categories, Question Management, Gameplay, and Category Questions pages.

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

The primary component for player lists, question lists, batch lists, gameplay sessions, etc.

**Structure:**

```
┌── TABLE HEADER ────────────────────────────────────────────┐
│  Search input  │  Filter dropdowns  │  Export  │  Action   │
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
- Export button: In the table header bar, secondary button style, always visible

---

### Status Badges

Used throughout tables and detail views to communicate status at a glance.

| Status | Background | Text Colour | Label |
|---|---|---|---|
| Active | `rgba(34,197,94,0.15)` | `#22c55e` | Active |
| Draft | `rgba(245,158,11,0.15)` | `#f59e0b` | Draft |
| Published | `rgba(34,197,94,0.15)` | `#22c55e` | Published |
| Archived | `rgba(239,68,68,0.10)` | `#ef4444` | Archived |
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
| Primary | `--admin-accent` | White | None | Confirm, Save, Publish, Generate |
| Secondary | Transparent | `--admin-text-primary` | `1px --admin-border` | Cancel, Back, Export |
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

Used in the AI Batch Generation drawer, question editor, category editor, etc.

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
- Number input: Same as text input; show increment/decrement controls on focus
- All inputs have focus ring: `0 0 0 3px rgba(124,58,237,0.25)`

---

### Drawers

Used for: AI Batch Generation, Question Editor, Category Editor.

```
┌──── MAIN CONTENT ────────────┬──── DRAWER ─────────────────┐
│                              │  Drawer Title        [×]    │
│                              │  ─────────────────────────  │
│                              │  Form fields / content      │
│                              │                             │
│                              │  ─────────────────────────  │
│                              │  [Cancel]    [Primary CTA]  │
└──────────────────────────────┴─────────────────────────────┘
```

- Width: `480px`
- Background: `--admin-bg-surface`
- Left border: `1px solid --admin-border`
- Overlay: `rgba(0,0,0,0.40)` covers the main content
- Entry animation: Slide in from right, `250ms ease-out`
- Exit animation: Slide out to right, `200ms ease-in`
- Footer: Sticky at bottom with Cancel + primary CTA, separated from content by a `1px` border

---

### Modals

Used for: confirmation dialogs, question preview, logout confirmation.

```
┌────────── OVERLAY (60% opacity) ─────────────────┐
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
- Overlay: `rgba(0,0,0,0.60)`
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

### Progress Indicators

Used in the AI Batch Generation drawer during the generation process.

- **Spinner:** `24px`, accent coloured, smooth rotation
- **Progress bar (optional):** Full width, accent fill on `--admin-bg-card` track, `6px` height, `3px` border radius
- **State labels:** "Generating questions…" in `--admin-text-secondary`, `14px`

---

### Charts and Analytics

Used on the Dashboard and Gameplay pages.

- **Library:** Lightweight — use native SVG or a minimal charting library (e.g. Recharts if React is used)
- **Line charts:** Trend lines for player registrations, games played — thin `2px` accent-coloured strokes, subtle gradient fill below the line
- **Bar charts:** Category performance comparison — vertical bars in category accent colours
- **Tooltip:** Dark glass card on hover, showing exact data point value and label
- **Axis labels:** `11px`, `--admin-text-muted`
- **Grid lines:** `rgba(255,255,255,0.05)` horizontal only

---

## Screen Designs

### 1. Dashboard (Home)

**Top section — KPI Cards Row:**
- 4 cards in a 4-column grid
- Cards: Total Players, Games Played Today, Pending Requests, Platform Alerts

**Middle section — Charts Row (2 columns):**
- Left: New Registrations (last 30 days) — line chart
- Right: Games by Category (this week) — bar chart

**Bottom section — Activity Feed + Quick Actions:**
- Left: Recent platform activity log (last 10 actions)
- Right: Quick-action buttons (Generate Question Batch, Review Requests, View Gameplay)

---

### 2. Categories — Category List

- Category cards displayed as a table with inline actions
- **Table columns:** Category name, Question count, Difficulty label, Status badge, Visibility toggle, Actions
- **Actions per row:** Edit (opens Category Editor drawer), View Questions (navigates to Category Questions page), Generate Question Batch (opens AI Batch Generation drawer)
- A disabled category row is dimmed with a "Hidden" status badge
- **Category Editor Drawer** (480px, slides from right):
  - Fields: Category name, description, gradient colour pickers, difficulty label, visibility toggle, icon/emoji
  - **Artist Spotlight Panel** (only for the Artist Spotlight category):
    - Currently spotlighting block (read-only: artist image, name, active since date)
    - Change Spotlight Artist form: Artist Name field, Artist Image upload/URL, Update Spotlight button

---

### 3. Category Questions (Detail View)

Accessed from View Questions on a category row. Full-page view within the admin.

**Page Header:**
```
← Categories  /  [Category Name] — Questions
                                    [Generate Question Batch ▶]
```

**Metric Cards Row (4 cards):**
- Total Questions, Easy, Medium, Hard — each as a stat card

**Questions Table:**
- Columns: Question text (truncated), Difficulty badge, Status badge, Batch name, Date Added, Actions
- Table header: Search bar left, filter dropdowns (Difficulty, Status, Batch), Export button right
- Inline status toggle
- Bulk actions: Activate, Deactivate, Delete
- Clicking Edit on a question row opens the Question Editor drawer

---

### 4. Question Management — Batch Library

The Batch Library is a read-and-manage view. There is no "Add Question" or "New Batch" button here. All batch creation happens from the Categories section.

**Metric Cards Row (4 cards):**
- Total Batches, Published Questions, Draft Questions, Last Generated Batch

**Batch Table:**
- Columns: Batch Name, Category badge, Difficulty badge, Question Count, Status badge, Generated On, Actions
- Table header: Search bar left, filter dropdowns (Category, Difficulty, Status), Export button right
- Actions per row: View Batch, Edit Name, Publish, Archive, Delete

**Batch Detail Page:**

```
← Question Management  /  [Batch Name]
[Category badge]  [Difficulty badge]  [Status badge]  Generated: [date]
                          [Archive Batch]  [Edit Name]  [Publish Batch ▶]
```

- Questions table (same structure as Category Questions table)
- Clicking Edit opens the Question Editor drawer

---

### 5. AI Batch Generation Drawer

Opens from: Category card actions, Category Questions page header, Dashboard quick actions.

**Drawer Header:** "Generate Question Batch" + close (×)

**Form fields (top to bottom):**
1. Batch Name — text input (required)
2. Category — select dropdown (pre-filled from trigger point, editable)
3. Difficulty — select: Easy / Medium / Hard
4. Number of Questions — number input (e.g. 10, 20, 50)

**Generation states:**

```
[Initial state]
  All fields filled → "Generate Batch" primary button enabled

[Generating state]
  Progress spinner
  "Generating [N] questions for [Category]…"
  Cancel button visible

[Success state]
  Preview list of generated questions (question text + correct answer preview)
  "Regenerate" link per question (optional)
  Footer: [Back] [Save as Draft ▶]

[Error state]
  Error icon + message
  "Retry" primary button
  [Cancel] secondary button
```

---

### 6. Question Editor Drawer

Accessed from: Batch Detail page (Edit action), Category Questions page (Edit action).

- Slides in from the right side, `480px` wide
- Title: "Edit Question"
- **Fields (top to bottom):** Difficulty (select), Question Text (textarea), Answer A / B / C / D (4 inputs), Correct Answer (radio group), Status (toggle), Notes (textarea, optional)
- **Preview Tab:** Switches the drawer to show how this question looks in the actual game card
- **Footer:** "Cancel" (secondary) + "Save" (primary) — always visible, sticky at the bottom

**Validations:**
- All four answer options must be filled
- Exactly one answer must be marked correct
- Duplicate detection: warns if a near-identical question already exists in that category

---

### 7. Gameplay

**Page Header:**
```
Gameplay Sessions
                              [View Global Leaderboard →]
```

**KPI Cards Row (4 cards):**
- Games Played Today, Active Players Today, Average Session Length, Average Level Reached

**Gameplay Sessions Table:**
- Columns: Player name (linked), Category, Level Reached, Score, Stars Earned, Date & Time, Duration, Actions
- Table header: Search bar left, filter dropdowns (Category, Date range, Outcome), Export button right
- Actions per row: View Player (navigates to User Management → Player Profile)

---

### 8. Global Leaderboard (Sub-view of Gameplay)

Accessible via "View Global Leaderboard" button on the Gameplay page. Renders as a full sub-page, not a modal.

**Page Header:**
```
← Gameplay  /  Global Leaderboard
                                              [Export CSV]
```

**Leaderboard Table:**
- Columns: Rank (number badge), Player Name, Total Stars, Accuracy Rate, Games Played, Current Rank Badge, Actions
- Table header: Search bar left, sort dropdowns right (Sort by: Stars / Accuracy / Games Played)
- Actions per row: View Player (navigates to User Management → Player Profile)
- Rank 1–3 rows: Highlighted with subtle gold/silver/bronze left-border accent

---

### 9. Player List

- Table: Name, Account Type badge, Join Date, Games Played, Current Rank, Total Stars, Actions (View Profile | Deactivate)
- Clicking View Profile opens the Player Profile detail page

---

### 10. Player Profile (Detail View)

Accessed from: Player List, Gameplay Sessions table (View Player), Global Leaderboard (View Player).

**Page Header:**
```
← [source page]  /  [Player Display Name]
```

- Account Overview (name, type, join date, last active)
- Performance Statistics (games played, levels won, stars, rank, accuracy)
- Rank Progression (current badge, stars to next rank, progress bar)
- Gameplay History (recent sessions list)
- Categories Played (per-category breakdown)
- Account Actions (Reset Progress | Deactivate Account) — danger-styled, with confirmation modals

---

### 11. Category Requests

- Filter tabs at the top: All | Pending | Reviewed | Accepted | Declined
- Table: Suggestion text, Submitted By, Date, Status badge, Actions (Mark Reviewed | Accept | Decline)
- Decline action opens a small inline modal asking for an optional internal note

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
| AI generation spinner | Continuous rotation, `800ms linear` |

> Keep `prefers-reduced-motion` in mind. All keyframe animations should respect the system setting by defaulting to instant transitions when reduced motion is enabled.

---

## Accessibility

- All interactive elements must have visible focus states (using the `3px rgba(124,58,237,0.25)` ring system)
- Icon-only buttons must have `aria-label` and `title` attributes
- Table headers must use `<th scope="col">` semantics
- Colour is never the only indicator of status — badges always include a text label
- Modals must trap focus while open and restore focus to the trigger element on close
- Drawers must trap focus while open and restore focus to the trigger element on close
- Form inputs must be associated with labels via `htmlFor` / `id`

---

## Empty States

Every list or data view must have a designed empty state — never a blank page.

| Screen | Empty State Message | Action |
|---|---|---|
| Batch Library | "No question batches yet. Generate your first batch from Categories." | — (no direct CTA here — guide to Categories) |
| Batch Detail — Questions | "This batch has no questions." | — |
| Category Questions | "No questions in this category yet. Generate a batch to get started." | Generate Question Batch button |
| Gameplay Sessions | "No gameplay sessions recorded yet." | — |
| Global Leaderboard | "No players on the leaderboard yet." | — |
| Category Requests | "No requests pending. You're all caught up." | — |
| Player List | "No players found matching your search." | Clear filters |

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

- [ ] Should the Question Editor drawer allow category reassignment, or is the category locked to the batch's category?
- [ ] How should the admin handle pagination vs. infinite scroll for large gameplay session tables?
- [ ] Should we support any chart exporting (CSV, PNG) for the analytics module in MVP?
- [ ] Does the admin need its own logo/branding, or does it reuse the Music IQ logo with an "Admin" suffix label?
- [ ] Should the Global Leaderboard show all-time rankings or be filterable by time period (Today / This Week / All Time)?
- [ ] Should the AI Batch Generation drawer allow the admin to preview and regenerate individual questions before saving?
