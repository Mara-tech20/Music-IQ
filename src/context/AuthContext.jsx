import { createContext, useContext, useState, useCallback } from 'react';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const AUTH_SESSION = 'musiciq_auth';
const USERS_DB     = 'musiciq_users';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const delay    = ms => new Promise(r => setTimeout(r, ms));
const getDB    = ()   => { try { return JSON.parse(localStorage.getItem(USERS_DB) || '[]'); } catch { return []; } };
const saveDB   = db  => localStorage.setItem(USERS_DB, JSON.stringify(db));
const encode   = pw  => btoa(unescape(encodeURIComponent(pw)));

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try { const s = localStorage.getItem(AUTH_SESSION); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError,   setAuthError]   = useState('');

  const persist = (user) => {
    setCurrentUser(user);
    if (user) localStorage.setItem(AUTH_SESSION, JSON.stringify(user));
    else       localStorage.removeItem(AUTH_SESSION);
  };

  const clearError = useCallback(() => setAuthError(''), []);

  // ── Sign Up ──────────────────────────────────────────────────────────────────
  const signup = useCallback(async ({ email, password, name }) => {
    setAuthLoading(true); setAuthError('');
    await delay(750);
    const db = getDB();
    if (db.find(u => u.email === email.toLowerCase().trim())) {
      setAuthError('An account with this email already exists.');
      setAuthLoading(false); return false;
    }
    const user = {
      id:        `u_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      name:      (name?.trim() || email.split('@')[0]).trim(),
      email:     email.toLowerCase().trim(),
      password:  encode(password),
      method:    'email',
      createdAt: Date.now(),
    };
    db.push(user); saveDB(db);
    const { password: _, ...safe } = user;
    persist(safe); setAuthLoading(false); return true;
  }, []);

  // ── Login with Email/Password ─────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    setAuthLoading(true); setAuthError('');
    await delay(750);
    const db   = getDB();
    const user = db.find(u =>
      u.email === email.toLowerCase().trim() && u.password === encode(password)
    );
    if (!user) {
      setAuthError('Incorrect email or password. Please try again.');
      setAuthLoading(false); return false;
    }
    const { password: _, ...safe } = user;
    persist(safe); setAuthLoading(false); return true;
  }, []);

  // ── Login with Name (Guest) ───────────────────────────────────────────────
  const loginWithName = useCallback(async (name) => {
    setAuthLoading(true); setAuthError('');
    await delay(450);
    if (!name?.trim()) {
      setAuthError('Please enter your name to continue.');
      setAuthLoading(false); return false;
    }
    persist({
      id:        `guest_${Date.now()}`,
      name:      name.trim(),
      method:    'guest',
      createdAt: Date.now(),
    });
    setAuthLoading(false); return true;
  }, []);

  // ── Login with Google (Simulated OAuth) ──────────────────────────────────
  const loginWithGoogle = useCallback(async (account) => {
    setAuthLoading(true); setAuthError('');
    await delay(950);
    persist({
      id:        `google_${Date.now()}`,
      name:      account.name,
      email:     account.email,
      method:    'google',
      avatar:    account.name[0].toUpperCase(),
      createdAt: Date.now(),
    });
    setAuthLoading(false); return true;
  }, []);

  // ── Reset Password (Simulated) ────────────────────────────────────────────
  const resetPassword = useCallback(async (/* email */) => {
    setAuthLoading(true); setAuthError('');
    await delay(900);
    setAuthLoading(false); return true;   // always succeed (security best‑practice)
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{
      currentUser, authLoading, authError,
      signup, login, loginWithName, loginWithGoogle, resetPassword,
      logout, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
