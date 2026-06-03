/* ============================================
   GAMECONTEXT.JSX — Global State & Sound Engines
   ============================================ */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameContext = createContext();

const STORAGE_KEY = 'musiciq_player_react';
const HISTORY_KEY = 'musiciq_history_react';

const RANKS = [
  { title: 'Rookie',       minXP: 0     },
  { title: 'Beatmaker',    minXP: 500   },
  { title: 'Track Star',   minXP: 1200  },
  { title: 'Hitmaker',     minXP: 2500  },
  { title: 'Chart Topper', minXP: 4500  },
  { title: 'Icon',         minXP: 7500  },
  { title: 'Legend',       minXP: 12000 },
];

function getRank(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXP) rank = r;
    else break;
  }
  return rank;
}

function getNextRankXP(xp) {
  for (const r of RANKS) {
    if (r.minXP > xp) return r.minXP;
  }
  return null;
}

const defaultPlayer = () => ({
  name: 'Music Quizzer',
  joinedAt: new Date().toISOString(),
  xp: 0,
  totalScore: 0,
  gamesPlayed: 0,
  levelsWon: 0,
  streak: 0,
  bestStreak: 0,
  lastPlayed: null,
  bestLevel: 1,
  totalCorrect: 0,
  totalQuestions: 0,
  categoryStats: {
    general:   { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 },
    pop:       { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 },
    hiphop:    { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 },
    afrobeats: { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 },
  },
  settings: {
    music: true,
    sfx: true,
    dailyNotif: true,
    lbNotif: false,
    reducedMotion: false,
    highContrast: false,
    darkMode: true,
  }
});

const defaultSession = () => ({
  category: null,
  currentLevel: 1,
  score: 0,
  xpEarned: 0,
  highestLevel: 1,
  totalCorrect: 0,
  totalAnswered: 0,
  totalQuestions: 0,
  answers: [], // { correct, timedOut }
  active: false,
});

// ---- Sound Synthesizer ----
function playTone(freq, type, duration, volume = 0.06, sfxEnabled = true) {
  if (!sfxEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

export function GameProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultPlayer(),
          ...parsed,
          settings: { ...defaultPlayer().settings, ...(parsed.settings || {}) },
          categoryStats: { ...defaultPlayer().categoryStats, ...(parsed.categoryStats || {}) }
        };
      }
    } catch (e) {}
    return defaultPlayer();
  });

  const [session, setSession] = useState(defaultSession);
  const [activeView, setActiveView] = useState('home');
  const [viewHistory, setViewHistory] = useState(['home']);
  const [activeModal, setActiveModal] = useState(null); // 'win' | 'lose' | 'confirm' | null
  const [modalData, setModalData] = useState({});
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Persist Player State
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }, [player]);

  // Persist History State
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Apply Theme & Accessibility Global Classes
  useEffect(() => {
    const theme = player.settings.darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#080818' : '#f0f2f5');
    }

    if (player.settings.highContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }
  }, [player.settings.darkMode, player.settings.highContrast]);

  // ---- Navigation ----
  const navigateTo = useCallback((view, isBack = false) => {
    setActiveModal(null);
    closeDropdownMenu();

    if (!isBack) {
      setViewHistory(prev => {
        if (prev[prev.length - 1] === view) return prev;
        return [...prev, view];
      });
    }
    setActiveView(view);
  }, []);

  const navigateBack = useCallback(() => {
    setViewHistory(prev => {
      if (prev.length <= 1) {
        setActiveView('home');
        return ['home'];
      }
      const nextStack = [...prev];
      nextStack.pop(); // remove current
      const last = nextStack[nextStack.length - 1];
      setActiveView(last);
      return nextStack;
    });
  }, []);

  // Dropdown helper
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdownMenu = useCallback((e) => {
    if (e) e.stopPropagation();
    setDropdownOpen(prev => !prev);
  }, []);
  const closeDropdownMenu = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  // ---- Chimes Synthesizer API ----
  const playCorrectSound = useCallback(() => {
    playTone(523.25, 'triangle', 0.12, 0.08, player.settings.sfx);
    setTimeout(() => playTone(659.25, 'triangle', 0.12, 0.08, player.settings.sfx), 80);
    setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.08, player.settings.sfx), 160);
  }, [player.settings.sfx]);

  const playWrongSound = useCallback(() => {
    playTone(293.66, 'sawtooth', 0.15, 0.06, player.settings.sfx);
    setTimeout(() => playTone(220.00, 'sawtooth', 0.3, 0.06, player.settings.sfx), 120);
  }, [player.settings.sfx]);

  const playWinSound = useCallback(() => {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'sine', 0.4, 0.1, player.settings.sfx), idx * 100);
    });
  }, [player.settings.sfx]);

  const playLoseSound = useCallback(() => {
    playTone(220, 'sine', 0.2, 0.08, player.settings.sfx);
    setTimeout(() => playTone(196, 'sine', 0.2, 0.08, player.settings.sfx), 150);
    setTimeout(() => playTone(146.83, 'sine', 0.5, 0.1, player.settings.sfx), 300);
  }, [player.settings.sfx]);

  const playClickSound = useCallback(() => {
    playTone(600, 'sine', 0.08, 0.03, player.settings.sfx);
  }, [player.settings.sfx]);

  // ---- Game Actions ----
  const startSession = useCallback((category) => {
    setSession({
      ...defaultSession(),
      category,
      active: true,
      currentLevel: 1,
      highestLevel: 1,
    });

    // Update streak and games count
    setPlayer(prev => {
      const today = new Date().toDateString();
      const last = prev.lastPlayed ? new Date(prev.lastPlayed).toDateString() : null;
      let newStreak = prev.streak;

      if (last !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        newStreak = (last === yesterday) ? prev.streak + 1 : 1;
      }

      const cs = prev.categoryStats[category] || { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 };
      const updatedStats = {
        ...prev.categoryStats,
        [category]: {
          ...cs,
          played: cs.played + 1
        }
      };

      return {
        ...prev,
        streak: newStreak,
        bestStreak: Math.max(newStreak, prev.bestStreak),
        lastPlayed: new Date().toISOString(),
        gamesPlayed: prev.gamesPlayed + 1,
        categoryStats: updatedStats
      };
    });

    navigateTo('gameplay');
  }, [navigateTo]);

  const addXP = useCallback((amount) => {
    setPlayer(prev => ({
      ...prev,
      xp: prev.xp + amount,
      totalScore: prev.totalScore + amount,
    }));
    setSession(prev => ({
      ...prev,
      xpEarned: prev.xpEarned + amount,
      score: prev.score + amount,
    }));
  }, []);

  const recordAnswer = useCallback((isCorrect, timedOut = false) => {
    setSession(prev => ({
      ...prev,
      totalAnswered: prev.totalAnswered + 1,
      totalQuestions: prev.totalQuestions + 1,
      totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
      answers: [...prev.answers, { correct: isCorrect, timedOut }],
    }));

    setPlayer(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
    }));

    if (isCorrect) {
      addXP(10);
    }
  }, [addXP]);

  const advanceLevel = useCallback(() => {
    setSession(prev => {
      const nextLvl = prev.currentLevel + 1;
      return {
        ...prev,
        currentLevel: nextLvl,
        highestLevel: Math.max(nextLvl, prev.highestLevel)
      };
    });

    setPlayer(prev => {
      const cat = session.category;
      const nextLvl = session.currentLevel + 1;
      const cs = prev.categoryStats[cat] || { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 };
      
      const updatedStats = {
        ...prev.categoryStats,
        [cat]: {
          ...cs,
          wins: cs.wins + 1,
          bestLevel: Math.max(session.currentLevel, cs.bestLevel)
        }
      };

      return {
        ...prev,
        levelsWon: prev.levelsWon + 1,
        bestLevel: Math.max(nextLvl, prev.bestLevel),
        categoryStats: updatedStats
      };
    });

    addXP(30); // Level win bonus
  }, [session.category, session.currentLevel, addXP]);

  const endSession = useCallback(() => {
    if (!session.category) return;
    
    // Accumulate metrics to history
    setHistory(prev => [
      {
        category: session.category,
        level: session.highestLevel,
        correct: session.totalCorrect,
        total: session.totalAnswered,
        xp: session.xpEarned,
        score: session.score,
        ts: Date.now(),
      },
      ...prev.slice(0, 19)
    ]);

    setPlayer(prev => {
      const cat = session.category;
      const cs = prev.categoryStats[cat] || { played: 0, wins: 0, bestLevel: 0, correct: 0, total: 0 };
      
      return {
        ...prev,
        categoryStats: {
          ...prev.categoryStats,
          [cat]: {
            ...cs,
            correct: cs.correct + session.totalCorrect,
            total: cs.total + session.totalAnswered
          }
        }
      };
    });

    setSession(prev => ({ ...prev, active: false }));
  }, [session]);

  const updateName = useCallback((name) => {
    setPlayer(prev => ({ ...prev, name }));
  }, []);

  const updateSetting = useCallback((key, value) => {
    setPlayer(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  }, []);

  const resetAccount = useCallback(() => {
    if (window.confirm('Are you sure you want to log out? This will reset all your stats.')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  }, []);

  // Helpers
  const rank = getRank(player.xp);
  const nextRankXP = getNextRankXP(player.xp);
  const xpProgress = getXPProgress(player.xp);

  function getXPProgress(xp) {
    const current = getRank(xp);
    const nextXP = getNextRankXP(xp);
    if (!nextXP) return 100;
    return Math.round(((xp - current.minXP) / (nextXP - current.minXP)) * 100);
  }

  const accuracy = player.totalQuestions ? Math.round((player.totalCorrect / player.totalQuestions) * 100) : 0;
  const sessionAccuracy = session.totalAnswered ? Math.round((session.totalCorrect / session.totalAnswered) * 100) : 0;
  
  const initials = (() => {
    const parts = player.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  })();

  return (
    <GameContext.Provider value={{
      player,
      session,
      activeView,
      viewHistory,
      activeModal,
      modalData,
      history,
      dropdownOpen,
      rank,
      nextRankXP,
      xpProgress,
      accuracy,
      sessionAccuracy,
      initials,
      navigateTo,
      navigateBack,
      toggleDropdownMenu,
      closeDropdownMenu,
      startSession,
      recordAnswer,
      advanceLevel,
      endSession,
      updateName,
      updateSetting,
      resetAccount,
      setActiveModal,
      setModalData,
      playCorrectSound,
      playWrongSound,
      playWinSound,
      playLoseSound,
      playClickSound
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
export { RANKS };
