import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/* ── Tiny helpers ─────────────────────────────────────────────────────────── */
const Input = ({ label, type = 'text', value, onChange, icon, rightEl, placeholder, autoComplete }) => (
  <div style={{ marginBottom: '18px', position: 'relative' }}>
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      {icon && (
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none', opacity: 0.5 }}>{icon}</span>
      )}
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete={autoComplete}
        style={{
          width: '100%', padding: `14px ${rightEl ? '48px' : '16px'} 14px ${icon ? '42px' : '16px'}`,
          borderRadius: '12px', border: '1px solid var(--border)',
          background: 'var(--bg-input)', color: 'var(--text-primary)',
          fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
          fontFamily: 'var(--font-body)',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--purple)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
      />
      {rightEl && (
        <button type="button" onClick={rightEl.onClick}
          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.5, padding: '2px' }}>
          {rightEl.icon}
        </button>
      )}
    </div>
  </div>
);

const ErrorMsg = ({ msg }) =>
  msg ? <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px 14px', color: 'var(--red)', fontSize: '0.88rem', marginBottom: '16px', animation: 'fadeIn 0.2s' }}>{msg}</div> : null;

const Spinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="60" strokeDashoffset="15" />
  </svg>
);

const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
  </div>
);

/* ── Google Account Picker ────────────────────────────────────────────────── */
function GooglePicker({ onSelect, onClose }) {
  const [email, setEmail] = useState('');
  const [name,  setName]  = useState('');
  const [step,  setStep]  = useState('email'); // 'email' | 'name'

  const handleContinue = () => {
    if (step === 'email') {
      if (!email.trim() || !email.includes('@')) return;
      setStep('name');
    } else {
      if (!name.trim()) return;
      onSelect({ name: name.trim(), email: email.trim() });
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', animation: 'fadeIn 0.2s' }}>
      <div style={{ width: '360px', background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', animation: 'modalSlideUp 0.35s cubic-bezier(0.34,1.3,0.64,1)' }}>
        {/* Google header */}
        <div style={{ padding: '28px 28px 0', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#3c4043', fontFamily: 'sans-serif' }}>Sign in with Google</span>
          </div>
          {step === 'email'
            ? <p style={{ fontSize: '0.85rem', color: '#5f6368', marginBottom: '20px' }}>Enter your Google account email</p>
            : <p style={{ fontSize: '0.85rem', color: '#5f6368', marginBottom: '20px' }}>Enter your display name for <strong>{email}</strong></p>
          }
        </div>

        <div style={{ padding: '0 28px 24px' }}>
          {step === 'email' ? (
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email or phone"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleContinue()}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '1rem', outline: 'none', color: '#3c4043', fontFamily: 'sans-serif', marginBottom: '20px', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#1a73e8'}
              onBlur={e => e.target.style.borderColor = '#dadce0'}
            />
          ) : (
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleContinue()}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '1rem', outline: 'none', color: '#3c4043', fontFamily: 'sans-serif', marginBottom: '20px', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#1a73e8'}
              onBlur={e => e.target.style.borderColor = '#dadce0'}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', background: 'none', color: '#1a73e8', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>Cancel</button>
            <button onClick={handleContinue}
              style={{ padding: '10px 24px', borderRadius: '20px', border: 'none', background: '#1a73e8', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Auth Component ──────────────────────────────────────────────────── */
export default function AuthView() {
  const { login, signup, loginWithName, loginWithGoogle, resetPassword, authLoading, authError, clearError } = useAuth();

  const [screen, setScreen] = useState('login'); // 'login' | 'signup' | 'reset'
  const [resetSuccess,    setResetSuccess]    = useState(false);
  const [showGooglePick,  setShowGooglePick]  = useState(false);
  const [formError,       setFormError]       = useState('');

  // Login form
  const [lEmail, setLEmail] = useState('');
  const [lPass,  setLPass]  = useState('');
  const [showLP, setShowLP] = useState(false);

  // Guest form
  const [guestName, setGuestName] = useState('');

  // Signup form
  const [sName,    setSName]    = useState('');
  const [sEmail,   setSEmail]   = useState('');
  const [sPass,    setSPass]    = useState('');
  const [sConfirm, setSConfirm] = useState('');
  const [showSP,   setShowSP]   = useState(false);

  // Reset form
  const [resetEmail, setResetEmail] = useState('');

  const go = (s) => { clearError(); setFormError(''); setResetSuccess(false); setScreen(s); };

  /* ── Handlers ── */
  const handleLogin = async (e) => {
    e.preventDefault(); setFormError('');
    if (!lEmail.trim() || !lPass) { setFormError('Please fill in all fields.'); return; }
    await login({ email: lEmail, password: lPass });
  };

  const handleGuest = async (e) => {
    e.preventDefault(); setFormError('');
    await loginWithName(guestName);
  };

  const handleSignup = async (e) => {
    e.preventDefault(); setFormError('');
    if (!sName.trim() || !sEmail.trim() || !sPass) { setFormError('Please fill in all fields.'); return; }
    if (!sEmail.includes('@')) { setFormError('Please enter a valid email address.'); return; }
    if (sPass.length < 6)   { setFormError('Password must be at least 6 characters.'); return; }
    if (sPass !== sConfirm) { setFormError('Passwords do not match.'); return; }
    await signup({ name: sName, email: sEmail, password: sPass });
  };

  const handleReset = async (e) => {
    e.preventDefault(); setFormError('');
    if (!resetEmail.trim()) { setFormError('Please enter your email address.'); return; }
    const ok = await resetPassword(resetEmail);
    if (ok) setResetSuccess(true);
  };

  const handleGoogleSelect = async (account) => {
    setShowGooglePick(false);
    await loginWithGoogle(account);
  };

  const displayError = formError || authError;

  /* ── Background gradient orbs ── */
  const orbs = [
    { color: 'rgba(124,58,237,0.35)', size: 480, x: '-10%', y: '-15%', delay: '0s'   },
    { color: 'rgba(236,72,153,0.25)', size: 380, x: '70%',  y: '55%',  delay: '1.5s' },
    { color: 'rgba(6,182,212,0.18)',  size: 300, x: '55%',  y: '-5%',  delay: '3s'   },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg-base)', overflow: 'hidden' }}>
      {/* Animated background orbs */}
      {orbs.map((o, i) => (
        <div key={i} style={{ position: 'fixed', width: o.size, height: o.size, borderRadius: '50%', background: o.color, left: o.x, top: o.y, filter: 'blur(90px)', pointerEvents: 'none', animation: `ambientPulse 6s ${o.delay} ease-in-out infinite` }} />
      ))}

      {/* Card */}
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '40px 36px', position: 'relative', zIndex: 1, animation: 'modalSlideUp 0.5s cubic-bezier(0.34,1.3,0.64,1)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1, marginBottom: '4px' }}>
            MUSIC IQ
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {screen === 'login'  && 'Welcome back — sign in to continue'}
            {screen === 'signup' && 'Create your account'}
            {screen === 'reset'  && 'Reset your password'}
            {screen === 'guest'  && 'Play as a guest'}
          </div>
        </div>

        {/* ── LOGIN SCREEN ── */}
        {screen === 'login' && (
          <>
            <form onSubmit={handleLogin}>
              <ErrorMsg msg={displayError} />
              <Input label="Email" type="email" value={lEmail} onChange={e => setLEmail(e.target.value)} icon="📧" placeholder="you@example.com" autoComplete="email" />
              <Input label="Password" type={showLP ? 'text' : 'password'} value={lPass} onChange={e => setLPass(e.target.value)} icon="🔒" placeholder="••••••••" autoComplete="current-password"
                rightEl={{ icon: showLP ? '🙈' : '👁', onClick: () => setShowLP(p => !p) }} />
              <div style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '20px' }}>
                <button type="button" onClick={() => go('reset')} style={{ fontSize: '0.82rem', color: 'var(--purple-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</button>
              </div>
              <button type="submit" disabled={authLoading} className="btn-primary btn-block" style={{ marginBottom: '0' }}>
                {authLoading ? <Spinner /> : '🎵 Sign In'}
              </button>
            </form>

            <Divider label="or sign in with" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {/* Google button */}
              <button type="button" onClick={() => setShowGooglePick(true)} disabled={authLoading}
                style={{ width: '100%', padding: '13px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--bg-input)'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

              {/* Sign in with Name button */}
              <button type="button" onClick={() => go('guest')} disabled={authLoading}
                style={{ width: '100%', padding: '13px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--bg-input)'}
              >
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>👤</span>
                Sign In as Guest
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <button type="button" onClick={() => go('signup')} style={{ color: 'var(--purple-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Sign up free</button>
            </p>
          </>
        )}

        {/* ── GUEST SCREEN ── */}
        {screen === 'guest' && (
          <form onSubmit={handleGuest}>
            <ErrorMsg msg={displayError} />

            {/* Focused guest onboarding */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 16px',
                background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(168,85,247,0.15))',
                border: '2px solid rgba(168,85,247,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', animation: 'ambientPulse 3s ease-in-out infinite',
              }}>👤</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Enter the name you'd like to be known as
              </p>
            </div>

            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <input
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                autoFocus
                style={{
                  width: '100%', padding: '16px 20px', borderRadius: '14px',
                  border: '2px solid var(--border)', background: 'var(--bg-input)',
                  color: 'var(--text-primary)', fontSize: '1.05rem', outline: 'none',
                  fontFamily: 'var(--font-body)', transition: 'border-color 0.2s, box-shadow 0.2s',
                  textAlign: 'center', letterSpacing: '0.02em',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--purple)'; e.target.style.boxShadow = '0 0 0 4px rgba(124,58,237,0.15)'; }}
                onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button type="submit" disabled={authLoading} className="btn-primary btn-block" style={{ fontSize: '1.05rem', padding: '15px' }}>
              {authLoading ? <Spinner /> : '🎮 Join as Guest'}
            </button>
            <button type="button" onClick={() => go('login')} className="btn-ghost btn-block" style={{ marginTop: '12px' }}>
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* ── SIGN UP SCREEN ── */}
        {screen === 'signup' && (
          <>
            <form onSubmit={handleSignup}>
              <ErrorMsg msg={displayError} />
              <Input label="Full Name" value={sName} onChange={e => setSName(e.target.value)} icon="👤" placeholder="Your name" autoComplete="name" />
              <Input label="Email" type="email" value={sEmail} onChange={e => setSEmail(e.target.value)} icon="📧" placeholder="you@example.com" autoComplete="email" />
              <Input label="Password" type={showSP ? 'text' : 'password'} value={sPass} onChange={e => setSPass(e.target.value)} icon="🔒" placeholder="Min. 6 characters" autoComplete="new-password"
                rightEl={{ icon: showSP ? '🙈' : '👁', onClick: () => setShowSP(p => !p) }} />
              <Input label="Confirm Password" type={showSP ? 'text' : 'password'} value={sConfirm} onChange={e => setSConfirm(e.target.value)} icon="🔑" placeholder="Repeat password" autoComplete="new-password" />
              <button type="submit" disabled={authLoading} className="btn-primary btn-block">
                {authLoading ? <Spinner /> : '🚀 Create Account'}
              </button>
            </form>

            <Divider label="or" />

            <button onClick={() => setShowGooglePick(true)} disabled={authLoading}
              style={{ width: '100%', padding: '13px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--bg-input)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button type="button" onClick={() => go('login')} style={{ color: 'var(--purple-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Sign in</button>
            </p>
          </>
        )}

        {/* ── RESET PASSWORD SCREEN ── */}
        {screen === 'reset' && (
          <>
            {resetSuccess ? (
              <div style={{ textAlign: 'center', animation: 'fadeIn 0.4s' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px', animation: 'trophyEntrance 0.6s ease' }}>📬</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Check your inbox!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                  We've sent a password reset link to <strong>{resetEmail}</strong>. Follow the link in the email to reset your password.
                </p>
                <button onClick={() => go('login')} className="btn-primary btn-block">← Back to Sign In</button>
              </div>
            ) : (
              <form onSubmit={handleReset}>
                <ErrorMsg msg={displayError} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
                  Enter your account email and we'll send you a link to reset your password.
                </p>
                <Input label="Email Address" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} icon="📧" placeholder="you@example.com" autoComplete="email" />
                <button type="submit" disabled={authLoading} className="btn-primary btn-block">
                  {authLoading ? <Spinner /> : '📨 Send Reset Link'}
                </button>
                <button type="button" onClick={() => go('login')} className="btn-ghost btn-block" style={{ marginTop: '12px' }}>← Back to Sign In</button>
              </form>
            )}
          </>
        )}
      </div>

      {/* Google Picker Overlay */}
      {showGooglePick && (
        <GooglePicker
          onSelect={handleGoogleSelect}
          onClose={() => setShowGooglePick(false)}
        />
      )}
    </div>
  );
}
