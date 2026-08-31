# Music Trivia — Product Overview

Music Trivia is a music knowledge quiz game where players test how well they know songs, artists, and genres. The game is built around levels, scores, and a rank system that rewards consistent play and improvement.

---

## Who It's For

Anyone who loves music and wants to test or show off their knowledge. The game is designed to be easy to pick up on both phones and computers, with no account required to get started.

---

## Getting Started

When a new player arrives, they have three ways to begin:

- **Sign up** with their name, email, and a password
- **Sign in** if they already have an account
- **Continue as a Guest** — just type a name and jump straight in

Google sign-in is also available for a one-tap option.

Once logged in, the player's **first name** is used to greet them throughout the app. They can update their full display name any time from their profile.

---

## The Home Screen

The home screen is the player's hub. It shows:

- A personalised welcome greeting using their first name
- Their **current rank** and how far they are from the next one, shown as a progress bar
- Their **total stars** earned across all games
- A grid of **music categories** to choose from

### Categories Available

| Category | Theme |
|---|---|
| General Music | Broad music knowledge across all genres |
| Pop | Pop hits, artists, and chart history |
| Hip Hop | Rap, beats, lyrics, and culture |
| Afrobeats | African and Afropop music knowledge |
| Artist Spotlight | Deep-dive into a specific artist (currently Michael Jackson) |

Each category card shows its difficulty level, how many questions it has, and the player's personal best level in that category.

There is also a **Request a Category** card where players can type in a genre they'd love to see added. Suggestions are saved and reviewed weekly.

---

## Playing the Game

Tapping a category starts a game session immediately.

### The Game Area

Every game is made up of **levels**. Each level has **4 questions**. To pass a level and move on, the player must answer **all 4 correctly**.

**What the player sees during a game:**
- The current level they're on (top left)
- A countdown timer in the **exact centre** of the screen — always
- Their current score (top right) alongside a music toggle button
- A progress bar showing how far through the level they are
- The question in a clear card
- Four answer options to choose from (one per row on mobile, a grid on desktop)

When a player picks the right answer, it lights up green and they earn stars. A wrong answer lights up red and shows the correct one. If the timer runs out, the question is marked as missed.

### Level Transitions

When a player clears a level and moves to the next one, a brief **2-second loading screen** appears with a spinner and the upcoming level number. It keeps the energy up between rounds.

### Winning and Losing a Level

- Pass all 4 → a **Level Cleared** celebration appears and they move to the next level
- Miss any → a **Level Failed** screen appears with the option to retry or end the session

---

## After the Game (Results Screen)

When a session ends, the player sees a full summary of how they did:

- A headline message based on their accuracy (e.g. *"Flawless! 🏆"* or *"Off Beat 😔"*)
- An accuracy bar showing correct vs total answers
- A stat grid: category played, level reached, final score, rank, stars earned, and leaderboard position

### Buttons on the Results Screen
- **Restart Game** — play the same category again
- **Home** — go back to the category selection
- **View Summary Card** — generate and share a visual card of the performance (more below)

These three buttons are the only set of action buttons — there is no duplicate set at the bottom of the page.

### Daily Reward
If the player hasn't claimed their reward today, a gift chest appears on the results screen. Tapping it awards **+10 stars** and a little celebration animation.

### Global Leaderboard
A mock global leaderboard is shown, including where the current player ranks among other players.

---

## Sharing Your Results

Tapping **View Summary Card** generates a visual card that shows the player's name, score, accuracy, level, and rank. The card can be:

- Shared directly to **WhatsApp, Twitter, Facebook, or Instagram**
- **Downloaded** to save or share manually

---

## Player Profile

Players can visit their profile to personalise their experience:

- **Choose an avatar** from 20 character archetypes, including: Rockstar, Hero, Wizard, Ninja, Astronaut, Android, Alien, Vampire, Elf, Fox, Wolf, Artist, Hacker, Surfer, and more
- **Change their display name** at any time
- **View their stats** — games played, levels won, stars earned, and more

---

## Rank System

Players earn stars (XP) for every correct answer and every game they complete. Stars accumulate and push them up through a series of ranks.

Ranks can be viewed at any time by tapping **View Ranks** on the home screen. When a player hits a new rank, a celebration modal appears the next time they return home.

---

## Settings

Players can customise their experience from the Settings screen:

| Setting | What It Does |
|---|---|
| Dark Mode | Switch between a dark purple theme and a light theme |
| Sound Effects | Turn game sounds (correct, wrong, button clicks) on or off |
| Background Music | Play or mute ambient music during gameplay and on the home screen |
| Background Animations | Toggle the floating particle effects behind the UI |
| Daily Reminders | Turn on/off streak reminder notifications |

The **Background Music** setting is also available as a quick-access speaker icon directly in the game area, so players don't have to leave the game to change it.

---

## Navigation

### On a Computer (Desktop)
The top bar shows the app logo, the current page name, and icons for notifications, profile, settings, and logout — all visible at once.

### On a Phone (Mobile)
The top bar is split into two rows:
- **Row 1:** Back button (where applicable), app logo, and a hamburger menu icon
- **Row 2:** The current page title, larger for easy reading

Tapping the hamburger icon opens a side drawer with links to Notifications, Profile, Settings, and Logout. A dimmed overlay covers the rest of the screen while the drawer is open, and tapping it closes the menu.

---

## Visual Design

The game uses a **dark purple theme by default**, with a light theme available in settings.

**Key design details:**
- All cards throughout the app have a frosted glass appearance — semi-transparent with a blur effect behind them
- Modal pop-ups (win screen, lose screen, settings modals, etc.) are more solid than regular cards so they're easy to read, while still keeping the frosted glass style
- Background overlays behind modals are at 50% opacity
- Each category has its own colour scheme, gradient, and accent colours that carry through into the game area
- The timer is always pinned to the exact centre of the game header, regardless of what's around it

---

## Mobile Experience

The mobile layout is fully optimised separately from the desktop view:

- Categories appear **2 per row** in a compact grid
- The **Artist Spotlight** and **Request a Category** cards are full width for better readability
- Answer options appear as a **single column** so each option has its full line
- The navigation is simplified to a hamburger drawer
- Buttons, spacing, and font sizes are all adjusted for smaller screens
- The **View Summary Card** button is full width on mobile

---

## Data & Accounts

All player data (name, stats, stars, settings, progress) is stored locally on the player's device. Nothing is sent to a server. This means:

- The game works offline
- Progress stays between visits as long as the player uses the same browser
- Guest accounts work the same way — data persists until the browser is cleared

---

## What's Unique About Music Trivia

- A rank system that rewards long-term play, not just one good session
- Per-category stats so players can track improvement in specific genres
- A shareable visual card to brag about results on social media
- An Artist Spotlight mode that goes deep on a single artist (new artists added over time)
- A category request system so the community can influence what's added next
- Fully playable on both mobile and desktop with a tailored experience for each
