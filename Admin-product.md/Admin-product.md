# Music IQ — Admin Dashboard
## Product Requirements Document

**Status:** Discovery → Design → Build
**Version:** 1.0
**Last Updated:** June 2026
**Audience:** Internal — Product, Design, Engineering

---

## Overview

The Music IQ Admin Dashboard is an internal management interface that gives the product team full operational control over the Music IQ game platform. It is not player-facing. It is a back-office tool used by admins to manage content, monitor player activity, review analytics, and maintain the health of the game at scale.

The admin dashboard must be fast, information-dense, and purpose-built for efficiency. Unlike the player-facing game which prioritises emotion and immersion, the admin surface prioritises clarity, control, and speed of action.

---

## Who Uses the Admin Dashboard

| Role | What They Do in the Dashboard |
|---|---|
| **Product Admin** | Full access — manages everything |
| **Content Manager** | Creates, edits, and publishes quiz questions and categories |
| **Data Analyst** | Read-only access to analytics and player data |

> For the MVP, all admin users share a single role level (full access). Role-based access control (RBAC) is a post-MVP consideration.

---

## Core Admin Goals

1. **Manage Content** — Create, edit, and publish questions and categories without touching code
2. **Monitor Players** — View player accounts, activity, and progress across the platform
3. **Track Performance** — Understand which categories and questions perform well
4. **Moderate Submissions** — Review category requests submitted by players
5. **Control the Platform** — Enable/disable features, manage the featured Artist Spotlight, and push announcements

---

## Feature Modules

### 1. Dashboard Overview (Home)

The landing page of the admin panel. Gives an at-a-glance health summary of the platform.

**Displays:**
- Total registered players (with guest vs. signed-in split)
- Games played today / this week / all time
- Most played category (ranked list)
- New player registrations over the last 7 and 30 days (trend chart)
- Pending moderation items (category requests awaiting review)
- Platform health indicators (e.g. question bank size per category)

**Key actions from this screen:**
- Quick-jump links to the most common admin tasks (Add Question, Review Requests, View Leaderboard)

---

### 2. Question Management

The primary content creation tool. Admins create, edit, organise, and retire quiz questions.

**Question List View:**
- Full searchable, filterable table of all questions
- Filter by: category, difficulty, status (active / draft / retired), date added
- Inline status toggle (active / inactive) without opening the full question editor
- Bulk actions: bulk activate, bulk deactivate, bulk delete

**Question Detail / Editor:**
- Fields: Question text, Answer A / B / C / D, Correct Answer, Category, Difficulty (Easy / Medium / Hard), Status
- Optional: a "Notes" field for the content team to leave internal context on a question (e.g. "verify lyric is from 2003 single not the remix")
- Preview mode: shows how the question will appear to the player in-game

**Validations:**
- All four answer options must be filled
- One answer must be marked as correct
- Duplicate question detection (warn admin if a near-identical question already exists in the category)

---

### 3. Category Management

Controls the game categories that appear on the player home screen.

**Category List View:**
- Displays all categories with: name, theme/colour, question count, active status, visibility toggle
- One-click to enable or disable a category
- **Disabling a category removes it immediately and silently from the player's category grid.** No error, no placeholder — the card simply stops appearing. The category and its data are preserved internally; re-enabling it restores it to the grid instantly.

**Category Editor:**
- Category name and description
- Theme colours (primary gradient start / end, accent)
- Difficulty range label (e.g. "Easy to Hard")
- Visibility toggle (show / hide in game)
- Category icon or emoji

**Artist Spotlight Control:**

The Artist Spotlight is a special category that is always tied to one featured artist at a time. The admin has full control over which artist is currently spotlighted.

- A dedicated **"Artist Spotlight"** section in the Category Editor (or as a standalone panel) lets the admin set:
  - **Featured Artist Name** — the name displayed on the category card and inside the game
  - **Artist Image** — uploaded or linked image shown on the spotlight card
  - **Active Since** — the date this artist was set (auto-populated, read-only)
- Changing the featured artist takes effect immediately — the player-facing card updates to show the new artist name and image without requiring a restart
- Questions in the Artist Spotlight bank are artist-specific; the admin is responsible for ensuring the correct question set is active alongside the featured artist
- There is no automatic rotation — the admin manually changes the featured artist whenever the spotlight period ends

---

### 4. Player Management

Gives the admin team visibility into the player base.

**Player List View:**
- Paginated table of all player accounts (registered users; guests are tracked separately in aggregate)
- Columns: Display name, account type (registered / guest), join date, games played, current rank, total stars
- Search by name
- Sort by: join date, total stars, games played

**Player Detail View:**
- Full stats: games played, levels won, total stars, current rank, accuracy rate
- Per-category performance breakdown
- Account actions: reset progress, deactivate account

---

### 5. Category Request Moderation

Players can request new categories from the game. This module is where those requests are reviewed.

**Request List View:**
- Table of all submitted category requests
- Columns: suggestion text, submitted by (name or "Guest"), submission date, status (Pending / Reviewed / Accepted / Declined)
- Filter by status

**Request Actions:**
- Mark as Reviewed
- Accept (and optionally add it to the future category roadmap)
- Decline (with optional internal note)

---

### 6. Leaderboard & Stats

A read-only view of the global leaderboard and platform statistics.

**Global Leaderboard:**
- Top players by total stars, with rank, name, games played, and accuracy
- Filter by category (same as the in-game leaderboard view)

**Analytics Panel:**
- Daily active users (DAU) trend line
- Games started vs. games completed (completion rate)
- Average accuracy per category
- Question difficulty performance (which questions are answered correctly most/least often)
- Category popularity over time

---

### 7. Announcements & Notifications

Gives admins the ability to push messages to players in the notification centre.

**Announcement Composer:**
- Title, message body, target audience (all players / registered only), scheduled send time
- Preview before sending

**Sent Announcements Log:**
- Table of past announcements with date sent, delivery status, and open rate (if trackable)

---

### 8. Admin Settings & Access

Controls for the admin environment itself.

- Change admin password
- View admin activity log (who did what and when — basic audit trail)
- API keys or integration settings (post-MVP)

---

## Admin Navigation Structure

```
Admin Dashboard
├── Overview (Home)
├── Content
│   ├── Questions
│   └── Categories
├── Players
│   ├── Player List
│   └── Category Requests
├── Leaderboard & Stats
├── Announcements
└── Settings
```

---

## Admin Access & Authentication

- The admin dashboard lives on a separate route (e.g. `/admin`) isolated from the player-facing app
- Admin login is a standalone form (email + password) — not connected to the player authentication flow
- Session expires after a defined period of inactivity
- No public-facing link to the admin panel — access is by direct URL only

---

## Data Considerations

> At MVP, player data is stored locally in the browser (localStorage). This means the admin dashboard in the MVP phase will work with **static/seeded data** or a **mock data layer**, and full real-time data management will be available once a backend is introduced.

- Question content is the primary data source that admin actively manages
- Player data and analytics in the MVP may be simulated or populated from a seed file
- The architecture should be designed so that swapping in a real API later requires minimal restructuring

---

## Success Criteria

| Metric | Target |
|---|---|
| Admin can add a new question end-to-end | Under 60 seconds |
| Admin can enable/disable a category | Under 5 seconds (single toggle) |
| Category request moderation queue is reviewed | At least weekly |
| Admin dashboard load time | Under 2 seconds |
| Content errors caught by validation | 100% of malformed questions flagged before publish |

---

## Out of Scope (MVP)

- Role-based access control (RBAC) — single admin role for now
- Real-time push notifications to players
- A/B testing of question sets
- Automated content moderation (AI-assisted)
- Revenue or monetisation tracking
- Multi-admin collaboration features (comments, assignments)

---

## Open Questions

- [ ] Will the admin dashboard be a separate codebase or a protected route within the existing Vite/React app?
- [ ] What is the source of truth for question data in the MVP — a JSON file, a database, or both?
- [ ] Should the admin require its own backend or will it operate on the same data layer as the player app?
- [ ] Who owns admin access in the initial rollout — developer only, or also product?
