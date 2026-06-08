# Music IQ

## Product Requirements Document (MVP)

### Status

Discovery → Design → MVP Build

---

# Product Vision

Music IQ is a standalone music trivia platform that transforms music knowledge into an engaging game experience.

Players progress through themed music categories, answer increasingly challenging questions, earn points, unlock levels, and compete for leaderboard positions.

The goal is not to build another quiz app.

The goal is to create a music game that feels alive, rewarding, and addictive enough that players return daily.

The experience should feel:

* Fun
* Competitive
* Rewarding
* Fast paced
* Highly interactive
* Visually exciting

---

# Product Goal

Validate whether users enjoy returning regularly to play category based music trivia and progress through levels.

Core question:

> Will users repeatedly return to Music IQ to improve their scores, complete levels, and explore new music categories?

---

# Core User Needs

Users want to:

* Start playing immediately
* Test their music knowledge
* Feel a sense of progress
* Beat previous scores
* Explore favorite genres
* Unlock harder challenges
* Compete on leaderboards
* Customize display preferences (including Light/Dark theme toggles)

---

# MVP Categories

The MVP launches with four core categories instead of a single music category:

### General Music
A mix of mainstream artists, songs, genres, and music culture.
* **Theme**: Deep purple → electric blue gradient with sound waves and neon pulse motifs.

### Pop Music
Questions focused on globally popular artists, songs, albums, and trends.
* **Theme**: Hot pink → electric yellow gradient with stars and spotlights.

### Hip Hop
Questions focused on hip hop artists, culture, albums, and iconic moments.
* **Theme**: Dark charcoal → neon orange gradient with city grid and graffiti vibes.

### Afrobeats
Questions focused on Afrobeats artists, songs, and music culture.
* **Theme**: Warm amber → emerald green gradient with drum circles and rhythmic waves.

Future categories:
* R&B
* Gospel
* Rock
* Country
* Amapiano
* K-Pop
* Latin Music
* Artist Spotlights

---

# Product Structure

Music IQ is built as a React (Vite) Single Page Application (SPA) with a modular Component architecture, utilizing React Context for global state management to maintain smooth, instant view transitions without page reloads.

## Global Background & Layout

### Background Canvas
All views share a single global canvas background rendering interactive floating particles.
* In **Dark Mode**, the background is a deep cosmic indigo (`#080818`) with glowing neon particle elements.
* In **Light Mode**, the background becomes a clean light gray (`#f0f2f5`) with soft, high-contrast pastel floating particles.

### Top Bar Spec
The top bar is persistent across all views:
* **Left**: Current view title (e.g. "Home", "Play", "Leaderboard") and a context-aware **Back Button**.
* **Center**: Music IQ logo.
* **Right**:
  * **Theme Switcher Button**: A Sun/Moon icon toggle that lets the player quickly swap between Light and Dark mode.
  * **Notification Bell**: Displaying active notification badge count.
  * **Profile Avatar Dropdown**: Clickable avatar circle showing initials. Triggering a dropdown menu with slide-in animation containing options for:
    * **Profile** (with icon)
    * **Settings** (with icon)
    * **Leaderboard** (with icon)
    * **Log Out** (danger option with exit icon)

---

# Screen Details & Layouts

## 1. Home Screen (Game Hub)
An immersive game dashboard containing:
* **Player Hero Card**: Displays user avatar, current rank badge (e.g. Rookie, Beatmaker, Legend), and active daily streak count (with flame icon).
* **XP Progress Bar**: Displays current XP, progress percentage to next rank, and visual growth bar.
* **Quick Stats Grid**: Displaying Games Played, Wins, Accuracy %, and Highest Level reached.
* **Daily Challenge Card**: Prompts players with a special high-XP bonus objective (e.g. "Answer 10 questions with 80%+ accuracy").
* **Category Scroller Grid**: Visual cards for General, Pop, Hip Hop, and Afrobeats categories.
* **Recent Activity Feed**: List of recently completed levels, score rewards, and date timestamps.

## 2. Category Selection Screen
Displays a grid of large category cards. Each card displays:
* Card gradient backdrop matching the genre theme.
* Play button and difficulty level label.
* Interactive hover effects (3D lift, border shine, neon drop shadow).

## 3. Gameplay Screen
A focused card-based gameplay area:
* **Scoped Gameplay Card Background**: Only the game card container adopts the category's colored gradients and motifs, providing strong focus and readability against the global particle background canvas.
* **Info Header**: Shows Level count, Category Badge, and running session Score.
* **Progress Indicator**: A row of dots showing progress through the 4 questions in the level.
* **Circular Timer**: SVG-based 30-second countdown circle.
* **Floating XP Indicator**: Correct answers immediately trigger a flying "+10 XP" pop-up overlay inside the card with particle bursts.
* **Exit Button**: Quick "End Game" confirm modal overlay.

## 4. Post-Game Screen
Summary screen presented after finishing a session:
* Displays Category played, final Rank reached, total Session Score, and Correct answer ratio.
* Detailed stats breakdown including Highest level, overall Accuracy %, and total XP earned.
* Direct navigation actions: Play Again, Try Another Category, View Leaderboard.

## 5. Leaderboard Screen
A competitive category-specific leaderboard:
* Filter tabs (All, General, Pop, Hip Hop, Afrobeats) to select category rankings.
* Podium display for Top 3 players (1st, 2nd, and 3rd place medals with varying column heights and animation entries).
* Full player details table showing Rank, Name, Score, Best Level, and Accuracy.

## 6. Profile Screen
Player progression details:
* Profile header with large initials avatar, rank badge, and account join date.
* Visual category performance level bars showing best level reached per genre.
* Achievements shelf displaying unlocked badges (e.g. "First Win", "3-Day Streak", "Music Expert").
* Name editor to edit display username locally.

## 7. Settings Screen
Customization panel:
* **Sound**: Toggle switches for background Music and SFX feedbacks.
* **Notifications**: Toggle switches for Daily Challenge reminders and Leaderboard alerts.
* **Display Preferences**:
  * **Dark Mode Toggle**: Synchronized toggle switch that aligns with the top bar switcher button.
  * **Reduced Motion**: Switch to disable resource-heavy background particles and keyframe transitions.
  * **High Contrast**: Switch to increase font weights and contrast levels.
* **Account Actions**: Edit Profile, Log Out.

---

# Gameplay & Timer Mechanics

### Timer & Timeouts
* Every question has a strict **15-second** countdown timer.
* If the timer runs out: the question is recorded as **incorrect silently** and the game immediately advances to the next question.
* **No timeout modal is shown mid-game** to prevent breaking player momentum.
* Players always earn a minor **+2 XP** consolation reward for missed or timed-out questions so that their effort is always rewarded. Correct answers award **+10 XP**.

### Level Completion & Evaluation
* A level consists of **4 questions**.
* After the 4th question, the level performance is evaluated:
  * **Level Won**: At least 3 out of 4 questions correct. Triggers **Level Complete Modal** with an animated golden trophy, flying stars, and falling confetti.
  * **Level Failed**: 2 or more questions incorrect or timed out. Triggers **Level Failed Modal** displaying a dejected animated character crying moving tears.
  * If a failure was caused by any timeouts, the failed modal customizes the hint: *"Time ran out on some questions. Answer every question to unlock the next level."*
* **Category Progress Retention**: When a player starts or restarts a category, the session begins at their current level in that category (`bestLevel + 1`) rather than resetting back to level 1.

### Rank Progression & Promotions
* Points/Stars range define the rank system:
  * **Rookie**: 0 - 499 stars
  * **Beatmaker**: 500 - 1199 stars
  * **Track Star**: 1200 - 2499 stars
  * **Hitmaker**: 2500 - 4499 stars
  * **Chart Topper**: 4500 - 7499 stars
  * **Icon**: 7500 - 11999 stars
  * **Legend**: 12000+ stars
* **Rank Up Modal**: When a player acquires enough stars to cross into a new rank, a congratulations animated modal overlays instantly, celebrating their advancement with confetti and displaying their current level and new rank.

---

# Visual Design Guidelines

* **Premium Glassmorphism**: Cards use translucent frosted-glass backgrounds (`rgba(255,255,255,0.07)` in dark, solid `#ffffff` white card bases in light) with running drop-shadows and thin borders.
* **Modern Typography**: Clear font hierarchy using Google Fonts `Outfit` (display) and `Space Grotesk` (body).
* **Smooth Micro-Animations**:
  * Level won trophy bouncy entrance and rotating glow ring.
  * Level failed tear drops sliding down the sad character head.
  * Page screen entries sliding smoothly side-to-side.
  * Avatar dropdown expanding using a scale-in transition.
* **Profile Credentials Modals**: To maintain a clean and elegant profile tab layout, display name updates and password modifications are triggered by premium horizontal cards which open up interactive local modals.
* **Log Out Confirmation**: An elegant confirmation modal prompt with an exit door icon prevents accidental logouts.

---

# Multi-Theme Specification (Light & Dark Mode)

The system leverages CSS custom variables (`:root`) and a `[data-theme="light"]` attribute selector.

| Token Variable | Dark Mode Value (Default) | Light Mode Value |
|---|---|---|
| `--bg-base` | `#080818` (Indiglo Space) | `#eae8f4` (Soft Lavender-Grey) |
| `--bg-surface` | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.55)` |
| `--bg-card` | `rgba(255,255,255,0.07)` | `#ffffff` |
| `--bg-elevated` | `rgba(20,20,48,0.95)` | `#ffffff` |
| `--text-primary` | `#f0f0ff` | `#181236` |
| `--text-secondary` | `rgba(240,240,255,0.65)` | `#4a4563` |
| `--border` | `rgba(255,255,255,0.1)` | `rgba(124,58,237,0.18)` |
| `--shadow-card` | `rgba(0,0,0,0.45)` | `rgba(124,58,237,0.06)` |

