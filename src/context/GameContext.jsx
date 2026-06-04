import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getQuestionsForLevel } from '../data/questions';

// ─── Constants ───────────────────────────────────────────────────────────────
const STORAGE_KEY  = 'musiciq_player';
const HISTORY_KEY  = 'musiciq_history';
const NOTIF_KEY    = 'musiciq_notifs';

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
    dispatch({ type: 'SET_PLAYER',  player: p });
    dispatch({ type: 'SET_SESSION', session: { ...defaultSession(), category, active: true } });
    dispatch({ type: 'SET_VIEW',    view: 'gameplay' });
  }, [state.player]);

  const getLevelQuestions = useCallback(() => {
    return getQuestionsForLevel(state.session.category, state.session.usedIndices, state.session.currentLevel);
  }, [state.session.category, state.session.usedIndices, state.session.currentLevel]);

  const recordAnswer = useCallback((isCorrect, timedOut = false) => {
    const s = { ...state.session };
    const p = { ...state.player };
    s.totalAnswered++;
    p.totalQuestions++;
    if (isCorrect) {
      s.totalCorrect++;
      p.totalCorrect++;
      s.score    += 10; s.xpEarned += 10;
      p.xp       += 10; p.totalScore += 10;
    }
    s.answers = [...s.answers, { correct: isCorrect, timedOut }];
    dispatch({ type: 'SET_SESSION', session: s });
    dispatch({ type: 'SET_PLAYER',  player: p });
  }, [state.session, state.player]);

  const advanceLevel = useCallback(() => {
    const s = { ...state.session };
    const p = { ...state.player };
    s.currentLevel++;
    if (s.currentLevel > s.highestLevel)  s.highestLevel = s.currentLevel;
    if (s.currentLevel > p.bestLevel)     p.bestLevel    = s.currentLevel;
    s.score += 30; s.xpEarned += 30; p.xp += 30; p.totalScore += 30;
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

  const value = {
    // state
    player: state.player, session: state.session,
    activeView: state.activeView, prevView: state.prevView,
    modal: state.modal, dropdownOpen: state.dropdownOpen,
    notifOpen: state.notifOpen,
    // derived
    rank, nextRankXP, xpProgress, initials, accuracy, sessionAccuracy,
    notifications, unreadCount,
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
