# Music Trivia — Admin Dashboard
## Product Requirements Document

**Status:** Discovery → Design → Build
**Version:** 1.2
**Last Updated:** June 2026
**Audience:** Internal — Product, Design, Engineering

---

## Overview

The Music Trivia Admin Dashboard is an internal management interface that gives the product team full operational control over the Music Trivia platform. It is not player-facing. It is a back-office tool used by admins to manage content, monitor gameplay activity, moderate submissions, and maintain platform health.

The admin dashboard prioritises **clarity, control, and speed of action**. Every page is purpose-built — metrics and management tools live together on the page most relevant to them. There is no standalone Analytics section; insight is surfaced in context, not in isolation.

**Core admin workflow:**

```
Categories  →  Generate AI Question Batches for a specific category
Question Management  →  Review, edit, and publish generated batches
Gameplay  →  Monitor live gameplay activity and player engagement
User Management  →  Manage player accounts and view detailed player profiles
```

---

## Who Uses the Admin Dashboard

| Role | Primary Responsibilities |
|---|---|
| **Product Admin** | Full access — manages all modules |
| **Content Manager** | Manages categories and reviews AI-generated question batches |
| **Team Member** | Scoped access as defined by the Product Admin |

> **MVP Note:** All admin users share a single full-access role. Role-based access control (RBAC) is a post-MVP consideration.

---

## Core Admin Goals

1. **Monitor Platform Health** — Get an immediate, accurate view of the platform's state from the Dashboard
2. **Manage Question Batches** — Review, edit, publish, and retire AI-generated question batches
3. **Manage Categories** — Control what players see, enable/disable categories, generate question batches per category, and manage the Artist Spotlight
4. **Monitor Gameplay** — Review live gameplay sessions, session data, and player engagement metrics
5. **Manage Players** — Review accounts, player performance, and take account-level actions
6. **Moderate Submissions** — Review and act on category requests from players
7. **Manage the Team** — Control who has admin access and maintain an audit trail

---

## Navigation Structure

```
Admin Dashboard
├── Dashboard
├── Categories
│   ├── Category List
│   │   └── Category Questions (per-category detail view)
│   └── Category Requests
├── Question Management (Batch Library — read + manage only)
│   └── Batch Detail (questions within a batch)
├── Gameplay
│   ├── Gameplay Sessions
│   └── Global Leaderboard (sub-view)
├── User Management
│   ├── Players
│   └── Player Profile (detail view)
├── Team Management
│   ├── Team Members
│   └── Audit Trail
└── Settings
```

---

## Page Specifications

---

### 1. Dashboard

The Dashboard is the admin's landing page. It provides a fast, high-level view of platform health — not deep analytics. Admins should be able to assess the state of the platform and jump to any key action within seconds.

**KPI Cards (top row — 4 cards):**

| Card | Metric |
|---|---|
| Total Players | Registered + guest count with registered/guest split |
| Games Played Today | Today's game session count with a 7-day sparkline trend |
| Pending Requests | Category requests awaiting review — links to Category Requests |
| Platform Alerts | Any system-level flags (e.g. a category with 0 active questions) |

**Charts (maximum 2):**

- **New Player Registrations** — 30-day trend line (registered accounts only)
- **Games by Category** — Bar chart showing which categories were played most this week

**Recent Activity Feed:**
- The last 10 admin actions logged on the platform (e.g. "Question batch published to Hip Hop", "Category request declined")
- Each entry shows: action description, admin who performed it, and timestamp

**Quick Actions:**
- Shortcut buttons for the most frequent tasks: Generate Question Batch, Review Requests, View Gameplay

---

### 2. Categories

Controls everything related to game categories — both the category list itself and player-submitted category suggestions.

#### 2a. Category List

**Category Metrics (top of page — metric cards):**

| Card | Metric |
|---|---|
| Most Played Category | The category with the highest total play count this week |
| Active Players | Number of players who played any category in the last 7 days |
| Total Plays | All-time game sessions started across all categories |
| Average Completion Rate | % of started games that reached the results screen |

**Category Cards / Table:**

- **Columns:** Category name, Question count, Difficulty label, Status badge, Visibility toggle, Actions
- **Actions per category:** Edit, **View Questions**, Generate Question Batch
- The visibility toggle is the primary inline control — no full editor required just to show/hide a category
- **Disabling a category removes it immediately and silently from the player's category grid.** The action is non-destructive and fully reversible. The category and all its data are preserved; re-enabling it restores the card to the player grid instantly. No confirmation modal is shown — this is a low-risk, reversible toggle.
- A disabled category row appears dimmed in the admin table with a "Hidden" badge so admins always know what is currently invisible to players

**View Questions Action:**
- Present on every category card/row
- Navigates to the **Category Questions page** for that specific category (see §2c)

**Generate Question Batch Action:**
- Present on every category card/row
- Opens the **AI Batch Generation drawer** (see §3) pre-filled with the selected category
- The generated batch is saved to Question Management and linked to that category

**Category Editor (drawer):**
- Category name and description
- Theme gradient colours (start / end) and accent colour
- Difficulty range label (e.g. "Easy to Hard")
- Visibility toggle (mirrored from the inline table toggle)
- Category icon or emoji

**Artist Spotlight Control:**

The Artist Spotlight is a special category always tied to one featured artist at a time. The admin has full manual control over who is currently spotlighted — there is no automatic rotation.

- A dedicated panel within the Artist Spotlight category editor lets the admin set:
  - **Featured Artist Name** — displayed on the category card and in-game header
  - **Artist Image** — uploaded from file or via URL; previews inline before saving
  - **Active Since** — auto-populated to today's date on save; read-only
- Changes take effect immediately — no restart or republish step required
- The admin is responsible for ensuring the correct question set is active for the featured artist before updating the spotlight

#### 2b. Category Requests

Players can submit category suggestions from within the game. This tab is where those submissions are reviewed and actioned.

**Request Table:**
- **Columns:** Suggestion text, Submitted by (name or "Guest"), Submission date, Status
- **Filter tabs:** All | Pending | Reviewed | Accepted | Declined

**Actions per request:**
- **Mark as Reviewed** — acknowledges the submission without a decision
- **Accept** — flags the suggestion for the product roadmap
- **Decline** — archives the request; optionally add an internal note explaining why

#### 2c. Category Questions (Detail View)

Accessed by clicking **View Questions** on a category card. Displays all questions within a specific category.

**Metric Cards (top of page — 4 cards):**

| Card | Metric |
|---|---|
| Total Questions | Total number of questions in this category (all statuses) |
| Easy Questions | Count of questions with Easy difficulty |
| Medium Questions | Count of questions with Medium difficulty |
| Hard Questions | Count of questions with Hard difficulty |

**Questions Table:**
- Full searchable, filterable table of questions in this category
- **Columns:** Question text (truncated), Difficulty badge, Status badge, Batch name, Date Added, Actions (Edit | Toggle Status | Delete)
- **Search:** Free-text search across question content
- **Filters:** Difficulty (Easy / Medium / Hard), Status (Active / Draft / Retired), Batch, Date range
- **Export:** Download visible question set as CSV or JSON
- Inline status toggle (Active / Inactive) without opening the full editor
- **Bulk actions:** Activate, Deactivate, Delete

**Page Header:**
- Displays the category name, icon, and a back link to the Category List
- A **Generate Question Batch** button in the top-right corner opens the AI Batch Generation drawer pre-filled with this category

---

### 3. Question Management (Batch Library)

The Question Management page is a **read-and-manage library** of all AI-generated question batches. Admins do not create individual questions manually here. All new content is produced through the AI Batch Generation drawer, accessible from the Categories section or the Dashboard quick actions.

> **Key Principle:** Admins never write individual questions. The admin's role is to review, edit, publish, or retire AI-generated batches.

**Batch Library Metrics (top of page — 4 metric cards):**

| Card | Metric |
|---|---|
| Total Batches | Number of question batches across all categories |
| Published Questions | Total questions with Active status across all batches |
| Draft Questions | Questions saved but not yet published |
| Last Generated Batch | Date, category, and name of the most recently generated batch |

**Batch Table:**
- Full searchable, filterable table of all generated batches
- **Columns:** Batch Name, Category, Difficulty, Question Count, Status badge, Generated On, Actions
- **Search:** Free-text search across batch names and categories
- **Filters:** Category, Difficulty (Easy / Medium / Hard), Status (Draft / Published / Archived), Date range
- **Export:** Download the filtered batch list as CSV
- **Actions per batch:** View Batch, Edit Batch Name, Publish, Archive, Delete

**Batch Detail Page:**

Accessed by clicking **View Batch** on a batch row. Displays all questions within that specific batch.

- **Page Header:** Batch name, category, difficulty, status badge, generated date, and a back link to the Batch Library
- **Batch Actions (top-right):** Publish Batch, Archive Batch, Edit Batch Name
- **Questions Table:** All questions in this batch — same columns and functionality as the Category Questions table (search, filter, inline edit, export)
- **Individual question editing:** Clicking Edit on a question row opens the Question Editor drawer
  - Fields: Question text, Answer A / B / C / D, Correct answer, Difficulty, Status, Notes (optional internal context)
  - Preview mode: Renders the question exactly as it appears in the player-facing game card
  - Validations:
    - All four answer options must be filled
    - Exactly one answer must be marked correct
    - Duplicate detection: warns admin if a near-identical question already exists in that category

---

### 4. AI Batch Generation (Drawer)

Admins initiate question generation from Categories or the Dashboard quick actions. **Admins do not create individual questions by hand.**

**Trigger points:**
- "Generate Question Batch" button on a category card/row
- "Generate Question Batch" button on the Category Questions page
- "Generate Question Batch" quick action on the Dashboard

**Drawer fields:**

| Field | Type | Notes |
|---|---|---|
| Batch Name | Text input | Required. Admin-assigned name for the batch (e.g. "Hip Hop – Hard Set 3") |
| Category | Select dropdown | Pre-filled when launched from a category; editable |
| Difficulty | Select dropdown | Easy, Medium, or Hard — one per batch |
| Number of Questions | Number input | e.g. 10, 20, 50 — subject to AI generation limits |

**Generation flow:**
1. Admin fills in the fields and clicks **Generate Batch**
2. A progress indicator replaces the form while the AI generates questions
3. On success: the drawer shows a preview of the generated questions (question text, answers, correct answer) with an option to regenerate individual questions
4. Admin clicks **Save Batch** — the batch is saved as a Draft and appears in Question Management
5. The batch can then be reviewed, edited, and published from the Batch Library

**On failure:**
- The drawer shows an error message with a Retry option
- No partial batch is saved

---

### 5. Gameplay

A dedicated monitoring page focused on live gameplay activity and player engagement. This page gives the admin team visibility into how players are interacting with the platform right now and over time.

**KPI Cards (top row — 4 cards):**

| Card | Metric |
|---|---|
| Games Played Today | Total game sessions started today |
| Active Players Today | Unique players who started at least one session today |
| Average Session Length | Mean number of levels completed per session (all-time or last 7 days toggle) |
| Average Level Reached | Mean highest level reached per session (all-time or last 7 days toggle) |

**Gameplay Sessions Table:**

A paginated, searchable log of all gameplay sessions across all players.

- **Columns:** Player name (linked to Player Profile), Category played, Level reached, Score, Stars earned, Session date & time, Session duration
- **Search:** Free-text search by player name or category
- **Filters:** Category, Date range, Level reached (min/max), Outcome (Completed / Abandoned)
- **Export:** Download the filtered session log as CSV
- **Actions per row:** View Player (navigates to the player's profile in User Management)

**Global Leaderboard (sub-view):**

Accessible via a **View Global Leaderboard** button at the top-right of the Gameplay page.

- Opens as a dedicated sub-page within the Gameplay section (not a modal)
- **Leaderboard Table columns:** Rank, Player name, Total Stars, Accuracy Rate, Games Played, Current Rank Badge
- **Search:** Free-text search by player name
- **Filters:** Sort by Total Stars, Accuracy, or Games Played
- **Export:** Download leaderboard as CSV
- **Actions per row:** View Player (navigates to that player's profile in User Management)
- A back link returns the admin to the Gameplay page

---

### 6. User Management

Gives the admin team full visibility into the player base. Player performance data lives here — not in a separate analytics page.

#### 6a. Player List

- Paginated, searchable table of all player accounts
- **Columns:** Display name, Account type (Registered / Guest), Join date, Games played, Current rank, Total stars
- **Sort by:** Join date, Total stars, Games played
- **Actions per row:** View Profile, Deactivate Account

#### 6b. Player Profile (Detail View)

Accessed by clicking a player row or via the **View Player** action from the Gameplay sessions table or Global Leaderboard. Gives a complete picture of that player's activity and performance.

**Account Overview:**
- Display name, account type, join date, last active date

**Performance Statistics:**
- Games played, Levels won, Total stars, Current rank, Accuracy rate (correct answers / total answers)

**Rank Progression:**
- Current rank badge, stars to next rank, visual progress bar

**Gameplay History:**
- List of recent sessions: category played, level reached, score, date

**Categories Played:**
- Per-category breakdown: best level reached, total plays, accuracy per category

**Account Actions:**
- Reset progress (with confirmation modal)
- Deactivate account (with confirmation modal)

---

### 7. Team Management

Controls who has access to the admin dashboard and maintains a full log of admin activity.

#### 7a. Team Members

- Table of all admin accounts: name, email, role, join date, last active
- **Actions:** Invite new member (email invite), Deactivate member, Edit role (post-MVP when RBAC is introduced)

#### 7b. Audit Trail

A chronological, read-only log of all actions taken by any admin on the platform.

- **Columns:** Admin name, Action description, Target (e.g. batch ID, player name), Timestamp
- **Filter by:** Admin, Action type, Date range
- Non-editable — the audit trail cannot be modified or deleted

---

### 8. Settings

Controls for the admin environment itself.

- **Account:** Change admin display name, change password
- **Security:** Session timeout duration
- **Integrations:** API key management (post-MVP)

---

## Admin Access & Authentication

- The admin dashboard lives on a separate, protected route (e.g. `/admin`) — isolated from the player-facing app
- Admin login is a standalone form (email + password) — not connected to the player authentication flow
- Sessions expire after a defined period of inactivity
- No public-facing link to the admin panel — access is by direct URL only

---

## Data Considerations

> **MVP Note:** Player data is currently stored locally in the browser (localStorage). The admin dashboard in MVP will operate on **static/seeded data or a mock data layer**. Full real-time data management will be available once a backend is introduced. The architecture should be structured so that replacing the mock layer with a real API requires minimal refactoring.

- Question batch content is the primary data that admin actively manages and persists
- Player data, gameplay metrics, and leaderboard data in MVP may be populated from a seed or mock file
- All admin actions should be logged locally in MVP and connected to a real audit trail in production
- AI-generated batches in MVP may be simulated using a mock AI response layer; the batch save, review, and publish workflow remains functional regardless

---

## Sitemap

```
/admin
├── /admin/dashboard
├── /admin/categories
│   ├── /admin/categories/requests
│   └── /admin/categories/:id/questions
├── /admin/questions
│   └── /admin/questions/:batchId
├── /admin/gameplay
│   └── /admin/gameplay/leaderboard
├── /admin/users
│   └── /admin/users/:playerId
├── /admin/team
│   └── /admin/team/audit
└── /admin/settings
```

---

## Information Architecture

```
Admin Dashboard
│
├── OVERVIEW
│   └── Dashboard — Platform health snapshot, quick actions
│
├── CONTENT
│   ├── Categories
│   │   ├── Category List
│   │   │   ├── [per category] View Questions → Category Questions page
│   │   │   └── [per category] Generate Question Batch → AI Batch drawer
│   │   └── Category Requests
│   └── Question Management
│       ├── Batch Library (search, filter, export all batches)
│       └── [per batch] Batch Detail (questions within a batch)
│
├── GAMEPLAY
│   └── Gameplay
│       ├── Gameplay Sessions (search, filter, export)
│       └── Global Leaderboard → links to Player Profiles
│
├── PLAYERS
│   └── User Management
│       ├── Player List
│       └── Player Profile (detail view)
│           └── Accessed from: Player List, Gameplay Sessions, Global Leaderboard
│
└── PLATFORM
    ├── Team Management
    │   ├── Team Members
    │   └── Audit Trail
    └── Settings
```

---

## Success Criteria

| Metric | Target |
|---|---|
| Admin can generate and publish a question batch end-to-end | Under 3 minutes |
| Admin can enable or disable a category | Under 5 seconds (single toggle) |
| Admin can locate a player profile from a gameplay session | Under 3 clicks |
| Category request queue is reviewed | At least weekly |
| Admin dashboard load time | Under 2 seconds |
| Malformed questions caught by validation before publish | 100% flagged |

---

<<<<<<< HEAD
## Out of Scope (MVP)

- Role-based access control (RBAC) — single access level for now
- Real-time push notifications to players
- A/B testing of question sets
- Automated content moderation
- Revenue or monetisation tracking
- Multi-admin collaboration (comments, task assignments)
- Live AI model configuration in the dashboard

---

## Open Questions

- [ ] Will the admin dashboard be a separate codebase or a protected route within the existing Vite/React app?
- [ ] What is the source of truth for question data in MVP — a JSON file, a database, or both?
- [ ] Who owns admin access in the initial rollout — developer only, or also product?
- [ ] What AI provider/model will power the batch generation feature in production?
- [ ] Should the Gameplay page default to "Today" or "Last 7 days" for its session table?
- [ ] Should the Global Leaderboard be a separate nav item or remain a sub-view of Gameplay only?
=======
>>>>>>> 74c090f066a4c3e2da6272d095850c1148a14538
