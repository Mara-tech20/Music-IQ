// ─── Shared leaderboard data ────────────────────────────────────────────────
// Two distinct systems:
//  - Level Leaderboard: ranked by XP, scoped to players in the same rank tier
//    (Rookie, Beatmaker, ...). XP is lifetime progression and never resets.
//  - Category Leaderboard: ranked by Points, a per-category performance total
//    (accuracy-driven score) that only affects that category's ranking.

import { getRank } from '../context/GameContext';

const CATEGORY_KEYS = ['general', 'pop', 'hiphop', 'afrobeats', 'artistSpotlight'];

// Bots roster, spread across every rank tier so the Level Leaderboard always
// has peers to show, even for a brand-new Rookie.
const BOT_SEEDS = [
  // Legend
  { name: 'DJ Nova',       xp: 14800, level: 22, primaryCategory: 'general' },
  { name: 'BeatLegend',    xp: 12500, level: 19, primaryCategory: 'hiphop' },
  // Icon
  { name: 'RhythmQueen',   xp: 11200, level: 17, primaryCategory: 'pop' },
  { name: 'AfroKing',      xp: 9600,  level: 15, primaryCategory: 'afrobeats' },
  { name: 'SoundSurfer',   xp: 8400,  level: 14, primaryCategory: 'general' },
  // Chart Topper
  { name: 'MelodyMaestro', xp: 7100,  level: 12, primaryCategory: 'pop' },
  { name: 'GrooveMaster',  xp: 5900,  level: 10, primaryCategory: 'hiphop' },
  { name: 'BassDrop',      xp: 4700,  level: 8,  primaryCategory: 'afrobeats' },
  // Hitmaker
  { name: 'VocalStar',     xp: 3600,  level: 7,  primaryCategory: 'artistSpotlight' },
  { name: 'ChartTopper',   xp: 2800,  level: 6,  primaryCategory: 'pop' },
  // Track Star
  { name: 'TrackStar',     xp: 2100,  level: 5,  primaryCategory: 'hiphop' },
  { name: 'NotePerfect',   xp: 1500,  level: 4,  primaryCategory: 'general' },
  // Beatmaker
  { name: 'BeatMaker',     xp: 900,   level: 3,  primaryCategory: 'afrobeats' },
  { name: 'FreshMix',      xp: 650,   level: 2,  primaryCategory: 'pop' },
  // Rookie
  { name: 'FirstSpin',     xp: 320,   level: 1,  primaryCategory: 'general' },
  { name: 'NewWave',       xp: 90,    level: 1,  primaryCategory: 'artistSpotlight' },
];

// Every bot has a "best" category (their primary) and lower, deterministically
// varied points in the others — so different bots top different category
// leaderboards instead of the ranking just mirroring XP order everywhere.
function deriveCategoryPoints(basePoints, primaryCategory) {
  const result = {};
  CATEGORY_KEYS.forEach((cat, i) => {
    if (cat === primaryCategory) { result[cat] = basePoints; return; }
    const factor = 0.3 + ((i * 11) % 30) / 100; // deterministic 0.30–0.59 spread
    result[cat] = Math.max(10, Math.round(basePoints * factor));
  });
  return result;
}

const BOTS = BOT_SEEDS.map(b => ({
  ...b,
  categoryPoints: deriveCategoryPoints(Math.round(b.xp * 0.6), b.primaryCategory),
}));

// ─── Level Leaderboard — same rank tier only, ranked by XP ─────────────────
export function buildLevelLeaderboard(playerName, playerXP) {
  const tierTitle = getRank(playerXP).title;
  const peers = BOTS.filter(b => getRank(b.xp).title === tierTitle);
  const entries = [
    ...peers.map(b => ({ name: b.name, xp: b.xp, level: b.level })),
    { name: playerName, xp: playerXP, level: 1, isPlayer: true },
  ].sort((a, b) => b.xp - a.xp);
  return { tierTitle, entries: entries.map((e, i) => ({ ...e, rank: i + 1 })) };
}

// ─── Category Leaderboard — all bots, ranked by that category's points ────
export function buildCategoryLeaderboard(playerName, playerPoints, category) {
  const entries = [
    ...BOTS.map(b => ({ name: b.name, level: b.level, points: b.categoryPoints[category] ?? 0 })),
    { name: playerName, level: 1, points: playerPoints, isPlayer: true },
  ].sort((a, b) => b.points - a.points);
  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

export function getMedalEmoji(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
}
