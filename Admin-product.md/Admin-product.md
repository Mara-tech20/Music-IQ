# Music IQ — Admin Dashboard
## Product Requirements Document

**Status:** Discovery → Design → Build
**Version:** 1.1
**Last Updated:** June 2026
**Audience:** Internal — Product, Design, Engineering

---

## Overview

The Music IQ Admin Dashboard is an internal management interface that gives the product team full operational control over the Music IQ platform. It is not player-facing. It is a back-office tool used by admins to manage content, monitor player activity, moderate submissions, and maintain platform health.

The admin dashboard prioritises **clarity, control, and speed of action**. Every page is purpose-built — metrics and management tools live together on the page most relevant to them. There is no standalone Analytics section; insight is surfaced in context, not in isolation.

---

## Who Uses the Admin Dashboard

| Role | Primary Responsibilities |
|---|---|
| **Product Admin** | Full access — manages all modules |
| **Content Manager** | Creates and publishes questions and categories |
| **Team Member** | Scoped access as defined by the Product Admin |

> **MVP Note:** All admin users share a single full-access role. Role-based access control (RBAC) is a post-MVP consideration.

---

## Core Admin Goals

1. **Monitor Platform Health** — Get an immediate, accurate view of the platform's state from the Dashboard
2. **Manage Questions** — Create, edit, organise, and retire quiz content without touching code
3. **Manage Categories** — Control what players see, enable/disable categories, and manage the Artist Spotlight
4. **Manage Players** — Review accounts, player performance, and take account-level actions
5. **Moderate Submissions** — Review and act on category requests from players
6. **Manage the Team** — Control who has admin access and maintain an audit trail

---

## Navigation Structure

```
Admin Dashboard
├── Dashboard
├── User Management
│   ├── Players
│   └── (Player Profile — detail view)
├── Question Management
├── Categories
│   ├── Category List
│   └── Category Requests
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
| Games Played | Today / this week / all time toggle |
| Pending Requests | Category requests awaiting review — links to Category Requests |
| Platform Alerts | Any system-level flags (e.g. a category with 0 active questions) |

**Charts (maximum 2):**

- **New Player Registrations** — 30-day trend line (registered accounts only)
- **Games by Category** — Bar chart showing which categories were played most this week

**Recent Activity Feed:**
- The last 10 admin actions logged on the platform (e.g. "Question added to Hip Hop", "Category request declined")
- Each entry shows: action description, admin who performed it, and timestamp

**Quick Actions:**
- Shortcut buttons for the most frequent tasks: Add Question, Review Requests, Manage Categories

---

### 2. User Management

Gives the admin team full visibility into the player base. Player performance data lives here — not in a separate analytics page.

#### 2a. Player List

- Paginated, searchable table of all player accounts
- **Columns:** Display name, Account type (Registered / Guest), Join date, Games played, Current rank, Total stars
- **Sort by:** Join date, Total stars, Games played
- **Actions per row:** View Profile, Deactivate Account

#### 2b. Player Profile (Detail View)

Accessed by clicking a player row. Gives a complete picture of that player's activity and performance.

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

### 3. Question Management

The primary content creation tool. Admins create, edit, organise, and retire quiz questions. Question-level metrics appear at the top of this page so the admin always has context on the state of the question bank before taking action.

**Question Bank Metrics (top of page — metric cards):**

| Card | Metric |
|---|---|
| Total Question Batches | Number of question sets across all categories |
| Published Questions | Total questions with Active status |
| Draft Questions | Questions saved but not yet active |
| Last Generated Batch | Date and category of the most recently added question batch |

**Question List:**
- Full searchable, filterable table of all questions
- **Filter by:** Category, Difficulty (Easy / Medium / Hard), Status (Active / Draft / Retired), Date added
- Inline status toggle (Active / Inactive) without opening the full editor
- **Bulk actions:** Activate, Deactivate, Delete

**Question Editor:**
- **Fields:** Question text, Answer A / B / C / D, Correct answer, Category, Difficulty, Status
- **Notes field** (optional): Internal context for the content team (e.g. "Verify this lyric is from the 2003 single, not the remix")
- **Preview mode:** Renders the question exactly as it appears in the player-facing game card
- **Validations:**
  - All four answer options must be filled
  - Exactly one answer must be marked correct
  - Duplicate detection: warns admin if a near-identical question already exists in that category

---

### 4. Categories

Controls everything related to game categories — both the category list itself and player-submitted category suggestions.

#### 4a. Category List

**Category Metrics (top of page — metric cards):**

| Card | Metric |
|---|---|
| Most Played Category | The category with the highest total play count this week |
| Active Players | Number of players who played any category in the last 7 days |
| Total Plays | All-time game sessions started across all categories |
| Average Completion Rate | % of started games that reached the results screen |

**Category Table:**
- **Columns:** Category name, Question count, Difficulty label, Status badge, Visibility toggle, Actions (Edit)
- The visibility toggle is the primary inline control — no full editor required just to show/hide a category
- **Disabling a category removes it immediately and silently from the player's category grid.** The action is non-destructive and fully reversible. The category and all its data are preserved; re-enabling it restores the card to the player grid instantly. No confirmation modal is shown — this is a low-risk, reversible toggle.
- A disabled category row appears dimmed in the admin table with a "Hidden" badge so admins always know what is currently invisible to players

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

#### 4b. Category Requests

Players can submit category suggestions from within the game. This tab is where those submissions are reviewed and actioned.

**Request Table:**
- **Columns:** Suggestion text, Submitted by (name or "Guest"), Submission date, Status
- **Filter tabs:** All | Pending | Reviewed | Accepted | Declined

**Actions per request:**
- **Mark as Reviewed** — acknowledges the submission without a decision
- **Accept** — flags the suggestion for the product roadmap
- **Decline** — archives the request; optionally add an internal note explaining why

---

### 5. Team Management

Controls who has access to the admin dashboard and maintains a full log of admin activity.

#### 5a. Team Members

- Table of all admin accounts: name, email, role, join date, last active
- **Actions:** Invite new member (email invite), Deactivate member, Edit role (post-MVP when RBAC is introduced)

#### 5b. Audit Trail

A chronological, read-only log of all actions taken by any admin on the platform.

- **Columns:** Admin name, Action description, Target (e.g. question ID, player name), Timestamp
- **Filter by:** Admin, Action type, Date range
- Non-editable — the audit trail cannot be modified or deleted

---

### 6. Settings

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

- Question content is the primary data that admin actively manages and persists
- Player data, metrics, and analytics in MVP may be populated from a seed or mock file
- All admin actions should be logged locally in MVP and connected to a real audit trail in production

---

## Success Criteria

| Metric | Target |
|---|---|
| Admin can add a new question end-to-end | Under 60 seconds |
| Admin can enable or disable a category | Under 5 seconds (single toggle) |
| Category request queue is reviewed | At least weekly |
| Admin dashboard load time | Under 2 seconds |
| Malformed questions caught by validation | 100% flagged before publish |

---

## Out of Scope (MVP)

- Role-based access control (RBAC) — single access level for now
- Real-time push notifications to players
- A/B testing of question sets
- Automated or AI-assisted content moderation
- Revenue or monetisation tracking
- Multi-admin collaboration (comments, task assignments)

---

## Open Questions

- [ ] Will the admin dashboard be a separate codebase or a protected route within the existing Vite/React app?
- [ ] What is the source of truth for question data in MVP — a JSON file, a database, or both?
- [ ] Who owns admin access in the initial rollout — developer only, or also product?
