import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { getQuestionsForLevel } from '../data/questions';

// ─── Constants ───────────────────────────────────────────────────────────────
const STORAGE_KEY  = 'musiciq_player';
const HISTORY_KEY  = 'musiciq_history';
const NOTIF_KEY    = 'musiciq_notifs';
const DAILY_KEY    = 'musiciq_daily_reward';

export const RANKS = [
  { title: 'Rookie',       minXP: 0     },
  { title: 'Beatmaker',    minXP: 500   },
  { title: 'Track Star',   minXP: 1200  },
  { title: 'Hitmaker',     minXP: 2500  },
  { title: 'Chart Topper', minXP: 4500  },
  { title: 'Icon',         minXP: 7500  },
  { title: 'Legend',       minXP: 12000 },
];

export function getRank(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) { if (xp >= r.minXP) rank = r; else break; }
  return rank;
}
export function getNextRankXP(xp) {
  for (const r of RANKS) { if (r.minXP > xp) return r.minXP; }
  return null;
}
export function getXPProgress(xp) {
  const cur = getRank(xp), next = getNextRankXP(xp);
  if (!next) return 100;
  return Math.round(((xp - cur.minXP) / (next - cur.minXP)) * 100);
}
export function getInitials(name) {
  const parts = (name || 'MQ').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getBadges(player) {
  const stats = player.categoryStats || {};
  const getAcc = (cat) => {
    const s = stats[cat];
    if (!s || !s.total) return 0;
    return s.correct / s.total;
  };
  const getLvl = (cat) => {
    const s = stats[cat];
    return s ? s.bestLevel : 0;
  };

  return [
    {
      id: 'general_guru',
      title: 'General Music Guru',
      emoji: '🎵',
      description: 'Achieve Level 3+ with 75%+ accuracy in General Music',
      unlocked: getLvl('general') >= 3 && getAcc('general') >= 0.75,
      color: '#7c3aed',
      req: 'Lv. 3+ & 75% Acc',
      current: `Lv. ${getLvl('general')} · ${Math.round(getAcc('general') * 100)}%`
    },
    {
      id: 'pop_legend',
      title: 'Pop Legend',
      emoji: '🌟',
      description: 'Achieve Level 3+ with 75%+ accuracy in Pop Music',
      unlocked: getLvl('pop') >= 3 && getAcc('pop') >= 0.75,
      color: '#ec4899',
      req: 'Lv. 3+ & 75% Acc',
      current: `Lv. ${getLvl('pop')} · ${Math.round(getAcc('pop') * 100)}%`
    },
    {
      id: 'hiphop_expert',
      title: 'Hip-Hop Expert',
      emoji: '🎤',
      description: 'Achieve Level 3+ with 75%+ accuracy in Hip Hop',
      unlocked: getLvl('hiphop') >= 3 && getAcc('hiphop') >= 0.75,
      color: '#f97316',
      req: 'Lv. 3+ & 75% Acc',
      current: `Lv. ${getLvl('hiphop')} · ${Math.round(getAcc('hiphop') * 100)}%`
    },
    {
      id: 'afrobeats_master',
      title: 'Afrobeats Master',
      emoji: '🌍',
      description: 'Achieve Level 3+ with 70%+ accuracy in Afrobeats',
      unlocked: getLvl('afrobeats') >= 3 && getAcc('afrobeats') >= 0.70,
      color: '#d97706',
      req: 'Lv. 3+ & 70% Acc',
      current: `Lv. ${getLvl('afrobeats')} · ${Math.round(getAcc('afrobeats') * 100)}%`
    },
    {
      id: 'rock_hero',
      title: 'Rock Hero',
      emoji: '🎸',
      description: 'Achieve Level 3+ with 75%+ accuracy in Rock Music',
      unlocked: getLvl('rock') >= 3 && getAcc('rock') >= 0.75,
      color: '#b91c1c',
      req: 'Lv. 3+ & 75% Acc',
      current: `Lv. ${getLvl('rock')} · ${Math.round(getAcc('rock') * 100)}%`
    }
  ];
}

// ─── Notifications ────────────────────────────────────────────────────────────
export function buildNotifications(player) {
  const notifs = [];
  if (player.streak > 0) {
    notifs.push({ id: 'streak', icon: '🔥', title: `${player.streak}-day streak!`, body: 'Keep it up — play today to maintain your streak.', time: 'Today', read: false });
  }
  if (player.xp >= 500 && player.xp < 520) {
    notifs.push({ id: 'rank_beatmaker', icon: '🎧', title: 'Rank Up — Beatmaker!', body: 'You reached Beatmaker rank. Keep climbing!', time: 'Just now', read: false });
  }
  if (player.gamesPlayed === 1) {
    notifs.push({ id: 'first_game', icon: '🎉', title: 'First game complete!', body: 'You played your first game. Great start!', time: '1 min ago', read: false });
  }
  notifs.push({ id: 'daily', icon: '📅', title: 'Daily Challenge', body: 'A new daily challenge is ready. Test your music knowledge!', time: '1h ago', read: true });
  notifs.push({ id: 'welcome', icon: '🎵', title: 'Welcome to Music IQ!', body: 'Explore all 4 categories and climb the leaderboard.', time: '2h ago', read: true });
  return notifs;
}

// ─── Default State ────────────────────────────────────────────────────────────
function defaultPlayer() {
  return {
    name: 'Music Quizzer', joinedAt: new Date().toISOString(),
    xp: 0, totalScore: 0, gamesPlayed: 0, levelsWon: 0,
    streak: 0, bestStreak: 0, lastPlayed: null, bestLevel: 1,
    totalCorrect: 0, totalQuestions: 0,
    categoryStats: {
      general:   { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 },
      pop:       { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 },
      hiphop:    { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 },
      afrobeats: { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 },
      rock:      { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 },
    },
    settings: {
      music: true, sfx: true, dailyNotif: true, lbNotif: false,
      reducedMotion: false, highContrast: false, darkMode: true,
    },
    notifsRead: [],  // IDs of read notifications
  };
}

function defaultSession() {
  return {
    category: null, currentLevel: 1, score: 0, xpEarned: 0,
    highestLevel: 1, totalCorrect: 0, totalAnswered: 0,
    answers: [], active: false, usedIndices: [],
    lastLevelIndices: [],   // indices used in the last level attempt
    levelAttempt: 0,        // incremented on restart to trigger re-fetch
  };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':      return { ...state, activeView: action.view, prevView: state.activeView };
    case 'SET_PLAYER':    return { ...state, player: action.player };
    case 'SET_SESSION':   return { ...state, session: action.session };
    case 'SET_MODAL':     return { ...state, modal: action.modal };
    case 'SET_DROPDOWN':  return { ...state, dropdownOpen: action.open };
    case 'SET_NOTIF_PANEL': return { ...state, notifOpen: action.open };
    case 'SET_THEME':
      return { ...state, player: { ...state.player, settings: { ...state.player.settings, darkMode: action.dark } } };
    default: return state;
  }
}

function loadPlayer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      const def   = defaultPlayer();
      return {
        ...def, ...saved,
        settings:      { ...def.settings,      ...(saved.settings      || {}) },
        categoryStats: { ...def.categoryStats,  ...(saved.categoryStats || {}) },
      };
    }
  } catch {}
  return defaultPlayer();
}

// ─── Context ─────────────────────────────────────────────────────────────────
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const saved = loadPlayer();
  const [state, dispatch] = useReducer(gameReducer, {
    player: saved,
    session: defaultSession(),
    activeView: 'home',
    prevView: 'home',
    modal: null,            // 'win' | 'lose' | 'endconfirm' | 'postgame' | null
    dropdownOpen: false,
    notifOpen: false,
  });

  // Background Music Controller
  const musicRef = useRef({
    ctx: null,
    masterGain: null,
    intervalId: null,
    currentOscillators: [],
    isPlaying: false
  });

  const playNextBar = useCallback(() => {
    const info = musicRef.current;
    if (!info.ctx || !info.masterGain) return;
    
    if (info.ctx.state === 'suspended') {
      info.ctx.resume();
    }
    
    const now = info.ctx.currentTime;
    
    // Clean up finished oscillators
    info.currentOscillators = info.currentOscillators.filter(osc => {
      try { return osc.stopTime > now; } catch { return false; }
    });

    const bpm = 126;
    const stepDuration = 60 / bpm / 2; // 8th note step duration
    
    // Upbeat chords progression loop (4 bars loop)
    // Bar 0: C major, Bar 1: F major, Bar 2: G major, Bar 3: A minor
    const chords = [
      { // C major
        bassRoot: 130.81, // C3
        bassFifth: 196.00, // G3
        notes: [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5
      },
      { // F major
        bassRoot: 174.61, // F3
        bassFifth: 261.63, // C4
        notes: [349.23, 440.00, 523.25, 698.46] // F4, A4, C5, F5
      },
      { // G major
        bassRoot: 196.00, // G3
        bassFifth: 293.66, // D4
        notes: [392.00, 493.88, 587.33, 783.99] // G4, B4, D5, G5
      },
      { // A minor
        bassRoot: 220.00, // A3
        bassFifth: 329.63, // E4
        notes: [440.00, 523.25, 659.25, 880.00] // A4, C5, E5, A5
      }
    ];

    if (info.barIndex === undefined) info.barIndex = 0;
    const currentChord = chords[info.barIndex];
    info.barIndex = (info.barIndex + 1) % chords.length;

    // Schedule 8 steps for the upcoming bar
    for (let step = 0; step < 8; step++) {
      const time = now + step * stepDuration;

      // ─── 1. Bouncy Bassline (triangle wave with a lowpass filter) ───
      // Bass plays on every quarter note (step 0, 2, 4, 6)
      if (step % 2 === 0) {
        const bassOsc = info.ctx.createOscillator();
        const bassGain = info.ctx.createGain();
        const bassFilter = info.ctx.createBiquadFilter();

        bassOsc.type = 'triangle';
        // Alternating root and fifth for a fun bouncy vibe
        const isRoot = step === 0 || step === 4;
        bassOsc.frequency.setValueAtTime(isRoot ? currentChord.bassRoot : currentChord.bassFifth, time);

        // Lowpass filter to keep bass warm and avoid clicking
        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(220, time);

        // Envelope
        bassGain.gain.setValueAtTime(0, time);
        bassGain.gain.linearRampToValueAtTime(0.08, time + 0.015);
        bassGain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 0.9);

        bassOsc.connect(bassGain);
        bassGain.connect(bassFilter);
        bassFilter.connect(info.masterGain);

        bassOsc.start(time);
        bassOsc.stop(time + stepDuration * 0.9);
        bassOsc.stopTime = time + stepDuration * 0.9;
        info.currentOscillators.push(bassOsc);
      }

      // ─── 2. Upbeat Arpeggiator (crisp sine wave plucks) ───
      // Plays on all 8 steps to drive momentum
      const pattern = [0, 2, 1, 3, 2, 1, 3, 2];
      const noteFreq = currentChord.notes[pattern[step]];

      const pluckOsc = info.ctx.createOscillator();
      const pluckGain = info.ctx.createGain();

      pluckOsc.type = 'sine';
      pluckOsc.frequency.setValueAtTime(noteFreq, time);

      // Fast decay envelope for high energy plucks
      pluckGain.gain.setValueAtTime(0, time);
      pluckGain.gain.linearRampToValueAtTime(0.02, time + 0.008);
      pluckGain.gain.exponentialRampToValueAtTime(0.0001, time + stepDuration * 0.8);

      pluckOsc.connect(pluckGain);
      pluckGain.connect(info.masterGain);

      pluckOsc.start(time);
      pluckOsc.stop(time + stepDuration * 0.8);
      pluckOsc.stopTime = time + stepDuration * 0.8;
      info.currentOscillators.push(pluckOsc);

      // ─── 3. Driving Hi-Hats / clicks ───
      // Hi-hats on off-beats (steps 1, 3, 5, 7) for upbeat syncopation
      if (step % 2 === 1) {
        const hatOsc = info.ctx.createOscillator();
        const hatGain = info.ctx.createGain();
        const hatFilter = info.ctx.createBiquadFilter();

        hatOsc.type = 'triangle';
        hatOsc.frequency.setValueAtTime(9000, time);

        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(4500, time);

        hatGain.gain.setValueAtTime(0, time);
        hatGain.gain.linearRampToValueAtTime(0.012, time + 0.003);
        hatGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

        hatOsc.connect(hatGain);
        hatGain.connect(hatFilter);
        hatFilter.connect(info.masterGain);

        hatOsc.start(time);
        hatOsc.stop(time + 0.05);
        hatOsc.stopTime = time + 0.05;
        info.currentOscillators.push(hatOsc);
      }
    }
  }, []);

  const startMusic = useCallback(() => {
    const info = musicRef.current;
    if (info.isPlaying) return;
    
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      
      info.ctx = new Ctx();
      info.masterGain = info.ctx.createGain();
      info.masterGain.gain.setValueAtTime(0, info.ctx.currentTime);
      info.masterGain.connect(info.ctx.destination);
      info.masterGain.gain.linearRampToValueAtTime(0.12, info.ctx.currentTime + 1.0);
      
      info.isPlaying = true;
      info.barIndex = 0;
      
      const bpm = 126;
      const stepDuration = 60 / bpm / 2;
      const barDurationMs = stepDuration * 8 * 1000; // time in ms for 8 eighth notes
      
      playNextBar();
      info.intervalId = setInterval(playNextBar, barDurationMs);
    } catch (e) {
      console.error("Failed to start background music:", e);
    }
  }, [playNextBar]);

  const stopMusic = useCallback(() => {
    const info = musicRef.current;
    if (!info.isPlaying) return;
    
    info.isPlaying = false;
    if (info.intervalId) {
      clearInterval(info.intervalId);
      info.intervalId = null;
    }
    
    if (info.masterGain && info.ctx) {
      const now = info.ctx.currentTime;
      try {
        info.masterGain.gain.cancelScheduledValues(now);
        info.masterGain.gain.setValueAtTime(info.masterGain.gain.value, now);
        info.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
      } catch {}
      
      setTimeout(() => {
        info.currentOscillators.forEach(osc => { try { osc.stop(); } catch {} });
        info.currentOscillators = [];
        try {
          if (info.ctx && info.ctx.state !== 'closed') {
            info.ctx.close();
          }
        } catch {}
        info.ctx = null;
        info.masterGain = null;
      }, 1100);
    }
  }, []);

  useEffect(() => {
    const isGameplayActive = state.session.active;
    const isMusicEnabled = state.player.settings.music;
    
    if (isGameplayActive && isMusicEnabled) {
      startMusic();
    } else {
      stopMusic();
    }
    
    return () => {
      if (!isGameplayActive || !isMusicEnabled) {
        stopMusic();
      }
    };
  }, [state.session.active, state.player.settings.music, startMusic, stopMusic]);

  // Persist player
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.player));
  }, [state.player]);

  // Apply theme to DOM
  useEffect(() => {
    const theme = state.player.settings.darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, [state.player.settings.darkMode]);

  // Derived
  const rank          = getRank(state.player.xp);
  const nextRankXP    = getNextRankXP(state.player.xp);
  const xpProgress    = getXPProgress(state.player.xp);
  const initials      = getInitials(state.player.name);
  const accuracy      = state.player.totalQuestions
    ? Math.round((state.player.totalCorrect  / state.player.totalQuestions)  * 100) : 0;
  const sessionAccuracy = state.session.totalAnswered
    ? Math.round((state.session.totalCorrect / state.session.totalAnswered)  * 100) : 0;

  const notifications = buildNotifications(state.player);
  const unreadCount   = notifications.filter(n => !n.read && !state.player.notifsRead?.includes(n.id)).length;

  // ─── Actions ───────────────────────────────────────────────────────────────
  const navigateTo = useCallback((view) => {
    dispatch({ type: 'SET_MODAL',    modal: null });
    dispatch({ type: 'SET_DROPDOWN', open: false });
    dispatch({ type: 'SET_NOTIF_PANEL', open: false });
    dispatch({ type: 'SET_VIEW',     view });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'SET_THEME', dark: !state.player.settings.darkMode });
  }, [state.player.settings.darkMode]);

  const updateSetting = useCallback((key, value) => {
    dispatch({ type: 'SET_PLAYER', player: { ...state.player, settings: { ...state.player.settings, [key]: value } } });
  }, [state.player]);

  const saveName = useCallback((name) => {
    dispatch({ type: 'SET_PLAYER', player: { ...state.player, name } });
  }, [state.player]);

  const markNotifsRead = useCallback(() => {
    const allIds = notifications.map(n => n.id);
    dispatch({ type: 'SET_PLAYER', player: { ...state.player, notifsRead: allIds } });
  }, [state.player, notifications]);

  const startSession = useCallback((category) => {
    const p    = { ...state.player };
    const today = new Date().toDateString();
    const last  = p.lastPlayed ? new Date(p.lastPlayed).toDateString() : null;
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      p.streak = (last === yesterday) ? p.streak + 1 : 1;
      if (p.streak > p.bestStreak) p.bestStreak = p.streak;
      p.lastPlayed = new Date().toISOString();
      p.gamesPlayed++;
      if (p.categoryStats[category]) p.categoryStats[category].played++;
    }
    const currentBest = p.categoryStats[category]?.bestLevel || 0;
    const startLevel = currentBest + 1;
    dispatch({ type: 'SET_PLAYER',  player: p });
    dispatch({ type: 'SET_SESSION', session: { 
      ...defaultSession(), 
      category, 
      active: true,
      currentLevel: startLevel,
      highestLevel: startLevel
    } });
    dispatch({ type: 'SET_VIEW',    view: 'gameplay' });
  }, [state.player]);

  const getLevelQuestions = useCallback(() => {
    return getQuestionsForLevel(state.session.category, state.session.usedIndices, state.session.currentLevel);
  }, [state.session.category, state.session.usedIndices, state.session.currentLevel]);

  const recordAnswer = useCallback((isCorrect, timedOut = false) => {
    const s = { ...state.session };
    const p = { ...state.player };
    const oldXP = p.xp;
    s.totalAnswered++;
    p.totalQuestions++;
    if (isCorrect) {
      s.totalCorrect++;
      p.totalCorrect++;
      s.score    += 10; s.xpEarned += 10;
      p.xp       += 10; p.totalScore += 10;
    } else {
      s.xpEarned += 2;
      p.xp       += 2;
      p.totalScore += 2;
    }

    // Check rank up
    const oldRank = getRank(oldXP);
    const newRank = getRank(p.xp);
    if (newRank.minXP > oldRank.minXP) {
      s.rankUpDetails = {
        oldRank: oldRank.title,
        newRank: newRank.title,
        currentLevel: s.currentLevel,
      };
      dispatch({ type: 'SET_MODAL', modal: 'rankup' });
    }

    s.answers = [...s.answers, { correct: isCorrect, timedOut }];
    dispatch({ type: 'SET_SESSION', session: s });
    dispatch({ type: 'SET_PLAYER',  player: p });
  }, [state.session, state.player]);

  const advanceLevel = useCallback(() => {
    const s = { ...state.session };
    const p = { ...state.player };
    s.currentLevel++;
    if (s.currentLevel > s.highestLevel) s.highestLevel = s.currentLevel;
    if (s.currentLevel > p.bestLevel)    p.bestLevel    = s.currentLevel;
    // NOTE: No bonus XP for advancing — players already earn 10 XP per correct answer
    p.levelsWon++;
    const cs = p.categoryStats[s.category];
    if (cs) { cs.wins++; if (s.currentLevel - 1 > cs.bestLevel) cs.bestLevel = s.currentLevel - 1; }
    dispatch({ type: 'SET_SESSION', session: s });
    dispatch({ type: 'SET_PLAYER',  player: p });
  }, [state.session, state.player]);

  // Restart the current level (undo used indices from last attempt)
  const restartLevel = useCallback(() => {
    const s = { ...state.session };
    // Remove last-level's indices so questions can be drawn again
    s.usedIndices    = s.usedIndices.filter(i => !s.lastLevelIndices.includes(i));
    s.lastLevelIndices = [];
    s.levelAttempt   = (s.levelAttempt || 0) + 1;
    dispatch({ type: 'SET_SESSION', session: s });
  }, [state.session]);

  const endSession = useCallback(() => {
    const s = state.session;
    const p = { ...state.player };
    const cs = p.categoryStats[s.category];
    if (cs) { cs.correct += s.totalCorrect; cs.total += s.totalAnswered; }
    const history = (() => {
      try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
    })();
    history.unshift({ category: s.category, level: s.highestLevel, correct: s.totalCorrect, total: s.totalAnswered, xp: s.xpEarned, score: s.score, ts: Date.now() });
    if (history.length > 20) history.splice(20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    dispatch({ type: 'SET_PLAYER',  player: p });
    dispatch({ type: 'SET_SESSION', session: { ...s, active: false } });
  }, [state.session, state.player]);

  const markUsedIndices = useCallback((indices) => {
    dispatch({
      type: 'SET_SESSION',
      session: {
        ...state.session,
        usedIndices:       [...state.session.usedIndices, ...indices],
        lastLevelIndices:  indices,  // remember for potential restart
      },
    });
  }, [state.session]);

  const showModal    = useCallback((modal) => dispatch({ type: 'SET_MODAL',       modal }), []);
  const hideModal    = useCallback(()       => dispatch({ type: 'SET_MODAL',       modal: null }), []);
  const toggleDropdown  = useCallback((open) => dispatch({ type: 'SET_DROPDOWN',   open }), []);
  const toggleNotifPanel = useCallback((open) => dispatch({ type: 'SET_NOTIF_PANEL', open }), []);

  // ─── Daily Reward ──────────────────────────────────────────────────────────
  const getDailyKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };

  const hasDailyReward = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}');
      return saved.claimedDay !== getDailyKey() && saved.playedToday === getDailyKey();
    } catch { return false; }
  })();

  const markPlayedToday = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}');
      localStorage.setItem(DAILY_KEY, JSON.stringify({ ...saved, playedToday: getDailyKey() }));
    } catch {}
  }, []);

  const claimDailyReward = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}');
      localStorage.setItem(DAILY_KEY, JSON.stringify({ ...saved, claimedDay: getDailyKey() }));
      // Award 10 XP
      const p = { ...state.player };
      const oldXP = p.xp;
      p.xp += 10; p.totalScore += 10;

      const oldRank = getRank(oldXP);
      const newRank = getRank(p.xp);
      if (newRank.minXP > oldRank.minXP) {
        dispatch({
          type: 'SET_SESSION',
          session: {
            ...state.session,
            rankUpDetails: {
              oldRank: oldRank.title,
              newRank: newRank.title,
              currentLevel: state.session.currentLevel || 1,
            }
          }
        });
        dispatch({ type: 'SET_MODAL', modal: 'rankup' });
      }

      dispatch({ type: 'SET_PLAYER', player: p });
    } catch {}
  }, [state.player, state.session]);

  // Audio synth
  const playSFX = useCallback((type) => {
    if (!state.player.settings.sfx) return;
    try {
      const Ctx  = window.AudioContext || window.webkitAudioContext;
      const ctx  = new Ctx();
      const plays = {
        correct: [[523.25,'triangle',0],[659.25,'triangle',80],[783.99,'triangle',160]],
        wrong:   [[293.66,'sawtooth',0],[220,'sawtooth',120]],
        win:     [[261.63,'sine',0],[329.63,'sine',100],[392,'sine',200],[523.25,'sine',300],[659.25,'sine',400],[783.99,'sine',500],[1046.5,'sine',600]],
        lose:    [[220,'sine',0],[196,'sine',150],[146.83,'sine',300]],
        click:   [[600,'sine',0]],
      };
      (plays[type] || []).forEach(([freq, waveType, delay]) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const g2  = ctx.createGain();
          osc.type  = waveType;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          g2.gain.setValueAtTime(0.09, ctx.currentTime);
          g2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
          osc.connect(g2); g2.connect(ctx.destination);
          osc.start(); osc.stop(ctx.currentTime + 0.35);
        }, delay);
      });
    } catch {}
  }, [state.player.settings.sfx]);

  const badges = getBadges(state.player);

  const value = {
    // state
    player: state.player, session: state.session,
    activeView: state.activeView, prevView: state.prevView,
    modal: state.modal, dropdownOpen: state.dropdownOpen,
    notifOpen: state.notifOpen,
    // derived
    rank, nextRankXP, xpProgress, initials, accuracy, sessionAccuracy,
    notifications, unreadCount, badges,
    // daily reward
    hasDailyReward, claimDailyReward, markPlayedToday,
    // actions
    navigateTo, toggleTheme, updateSetting, saveName,
    startSession, getLevelQuestions, recordAnswer,
    advanceLevel, restartLevel, endSession, markUsedIndices,
    showModal, hideModal, toggleDropdown, toggleNotifPanel,
    markNotifsRead, playSFX,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
