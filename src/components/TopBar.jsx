import { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/questions';
import { useIsMobile } from '../hooks/useIsMobile';

export default function TopBar() {
  const {
    player, activeView, navigateTo,
    toggleTheme, dropdownOpen, toggleDropdown, initials, rank,
    session, toggleNotifPanel, unreadCount, markNotifsRead,
    showModal, soundOn, toggleSound,
  } = useGame();

  const dropdownRef    = useRef(null);
  const notifRef       = useRef(null);
  const mobileMenuRef  = useRef(null);

  const isMobile = useIsMobile();
  const theme    = player.settings.darkMode ? 'dark' : 'light';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const viewTitles = {
    home:          'Dashboard',
    profile:       'Player Profile',
    settings:      'Game Settings',
    gameplay:      session?.category ? CATEGORIES[session.category].name : 'Game Area',
    leaderboard:   'Leaderboard',
    notifications: 'Notifications',
  };
  const currentTitle = viewTitles[activeView] || 'Music IQ';

  // Close all panels on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current   && !dropdownRef.current.contains(e.target))   toggleDropdown(false);
      if (notifRef.current      && !notifRef.current.contains(e.target))      toggleNotifPanel(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [toggleDropdown, toggleNotifPanel]);

  // Close mobile menu whenever the view changes
  useEffect(() => { setMobileMenuOpen(false); }, [activeView]);

  const handleLogout = () => {
    toggleDropdown(false);
    setMobileMenuOpen(false);
    showModal('logoutConfirm');
  };

  /* ── Desktop icon button style (unchanged) ── */
  const iconBtn = (extra = {}) => ({
    width: 'var(--topbar-icon-size)', height: 'var(--topbar-icon-size)', borderRadius: 'var(--r-full)',
    background: 'var(--bg-input)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '1.1rem', transition: 'background 0.2s',
    flexShrink: 0,
    ...extra,
  });

  /* ══════════════════════════════════════════
     MOBILE LAYOUT
  ══════════════════════════════════════════ */
  if (isMobile) {
    const menuBtnStyle = {
      width: '100%', padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: '14px',
      borderRadius: 'var(--r-sm)', fontSize: '0.97rem', fontWeight: 600,
      textAlign: 'left', background: 'transparent', color: 'var(--text-primary)',
      transition: 'background 0.15s',
    };

    return (
      <div ref={mobileMenuRef}>
        <header style={{
          height: 'var(--topbar-h)',
          position: 'fixed', top: 0, left: 0, right: 0,
          background: 'var(--bg-topbar)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', zIndex: 100,
        }}>
          {/* Left: back (optional) + page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            {activeView !== 'home' && (
              <button
                onClick={() => navigateTo('home')}
                style={{ width: '30px', height: '30px', flexShrink: 0, borderRadius: 'var(--r-full)', background: 'rgba(124,58,237,0.15)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem', fontWeight: 700, border: '1.5px solid rgba(124,58,237,0.4)' }}
              >←</button>
            )}
            <h1 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentTitle}
            </h1>
          </div>

          {/* Centre: Logo */}
          <div
            onClick={() => navigateTo('home')}
            style={{ flexShrink: 0, fontSize: '1.15rem', fontWeight: 900, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}
          >
            MUSIC IQ
          </div>

          {/* Right: sound toggle (always visible) + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
            <button
              onClick={toggleSound}
              title={soundOn ? 'Mute Sound' : 'Unmute Sound'}
              style={{ width: '34px', height: '34px', flexShrink: 0, borderRadius: 'var(--r-sm)', background: 'var(--bg-topbar-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}
            >
              {soundOn ? '🔊' : '🔇'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              style={{ width: '34px', height: '34px', flexShrink: 0, borderRadius: 'var(--r-sm)', background: mobileMenuOpen ? 'var(--bg-hover-item)' : 'var(--bg-topbar-btn)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', position: 'relative', transition: 'background 0.2s' }}
              aria-label="Open menu"
            >
              {unreadCount > 0 && !mobileMenuOpen && (
                <span style={{ position: 'absolute', top: '5px', right: '5px', width: '7px', height: '7px', background: 'var(--red)', borderRadius: '50%' }} />
              )}
              <span style={{ display: 'block', width: '16px', height: '2px', background: 'var(--text-topbar)', borderRadius: '1px', transition: 'transform 0.22s', transform: mobileMenuOpen ? 'rotate(45deg) translate(4px,4px)' : 'none' }} />
              <span style={{ display: 'block', width: '16px', height: '2px', background: 'var(--text-topbar)', borderRadius: '1px', transition: 'opacity 0.22s', opacity: mobileMenuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: '16px', height: '2px', background: 'var(--text-topbar)', borderRadius: '1px', transition: 'transform 0.22s', transform: mobileMenuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }} />
            </button>
          </div>
        </header>

        {/* ── Dim overlay behind drawer ── */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0, top: 'var(--topbar-h)',
              zIndex: 98,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(2px)',
              animation: 'fadeIn 0.2s ease',
            }}
          />
        )}

        {/* ── Mobile hamburger drawer ── */}
        {mobileMenuOpen && (
          <div style={{
            position: 'fixed', top: 'var(--topbar-h)', left: 0, right: 0,
            zIndex: 99,
            background: 'var(--bg-dropdown)',
            borderBottom: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            animation: 'dropdownOpen 0.2s ease',
          }}>
            {/* User info strip */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{player.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{rank.title} · ⭐ {player.xp.toLocaleString()}</div>
              </div>
            </div>

            {/* Nav items */}
            <div style={{ padding: '8px' }}>
              <button
                style={menuBtnStyle}
                onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover-item)'}
                onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </button>

              <button
                style={{ ...menuBtnStyle, position: 'relative' }}
                onClick={() => { navigateTo('notifications'); markNotifsRead(); setMobileMenuOpen(false); }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover-item)'}
                onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>🔔</span>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--red)', color: '#fff', borderRadius: 'var(--r-full)', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', minWidth: '20px', textAlign: 'center' }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                style={menuBtnStyle}
                onClick={() => { navigateTo('profile'); setMobileMenuOpen(false); }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover-item)'}
                onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>👤</span>
                <span>Profile</span>
              </button>

              <button
                style={menuBtnStyle}
                onClick={() => { navigateTo('settings'); setMobileMenuOpen(false); }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover-item)'}
                onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>⚙️</span>
                <span>Settings</span>
              </button>

              <div style={{ height: '1px', background: 'var(--border)', margin: '6px 0' }} />

              <button
                style={{ ...menuBtnStyle, color: 'var(--red)' }}
                onClick={handleLogout}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover-item)'}
                onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>🚪</span>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════
     DESKTOP LAYOUT  —  unchanged from before
  ══════════════════════════════════════════ */
  return (
    <header style={{
      height: 'var(--topbar-h)',
      position: 'fixed', top: 0, left: 0, right: 0,
      background: 'var(--bg-topbar)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 var(--topbar-pad)', zIndex: 100,
    }}>
      {/* Left: back + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--topbar-icon-gap)', flex: 1, minWidth: 0 }}>
        {activeView !== 'home' && (
          <button onClick={() => navigateTo('home')} style={iconBtn({ background: 'var(--bg-topbar-btn)', color: 'var(--text-topbar)' })} title="Back to Dashboard"
            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-topbar-btn-hover)'}
            onMouseOut={e  => e.currentTarget.style.background = 'var(--bg-topbar-btn)'}
          >←</button>
        )}
        <h1 style={{ fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text-topbar)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentTitle}
        </h1>
      </div>

      {/* Centre: Logo */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <div
          onClick={() => navigateTo('home')}
          style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            cursor: 'pointer', letterSpacing: '0.04em', whiteSpace: 'nowrap',
          }}
        >
          MUSIC IQ
        </div>
      </div>

      {/* Right: sound + theme + notif bell + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--topbar-icon-gap)', flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>

        {/* Sound toggle */}
        <button onClick={toggleSound} style={iconBtn({ background: 'var(--bg-topbar-btn)', color: 'var(--text-topbar)' })} title={soundOn ? 'Mute Sound' : 'Unmute Sound'}
          onMouseOver={e => e.currentTarget.style.background = 'var(--bg-topbar-btn-hover)'}
          onMouseOut={e  => e.currentTarget.style.background = 'var(--bg-topbar-btn)'}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme} style={iconBtn({ background: 'var(--bg-topbar-btn)', color: 'var(--text-topbar)' })} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          onMouseOver={e => e.currentTarget.style.background = 'var(--bg-topbar-btn-hover)'}
          onMouseOut={e  => e.currentTarget.style.background = 'var(--bg-topbar-btn)'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { toggleDropdown(false); navigateTo('notifications'); markNotifsRead(); }}
            style={iconBtn({ position: 'relative', background: 'var(--bg-topbar-btn)', color: 'var(--text-topbar)' })}
            title="Notifications"
            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-topbar-btn-hover)'}
            onMouseOut={e  => e.currentTarget.style.background = 'var(--bg-topbar-btn)'}
          >
            🔔
          </button>
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', minWidth: '18px', height: '18px', background: 'var(--red)', borderRadius: 'var(--r-full)', border: '2px solid var(--bg-topbar)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#fff', padding: '0 3px' }}>
              {unreadCount}
            </span>
          )}
        </div>

        {/* Avatar / dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { toggleDropdown(!dropdownOpen); toggleNotifPanel(false); }}
            style={{
              width: 'var(--topbar-icon-size)', height: 'var(--topbar-icon-size)', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              color: '#fff', fontWeight: 'bold', border: '3px solid var(--bg-topbar)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', transition: 'transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseOut={e  => e.currentTarget.style.transform = 'scale(1)'}
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '240px', background: 'var(--bg-dropdown)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-card)', padding: '8px', animation: 'dropdownOpen 0.2s ease forwards', transformOrigin: 'top right' }}>
              <div style={{ padding: '12px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                <div style={{ fontWeight: 700 }}>{player.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{rank.title} · ⭐ {player.xp.toLocaleString()}</div>
              </div>

              {[
                { icon: '👤', label: 'Profile',  action: () => { toggleDropdown(false); navigateTo('profile'); } },
                { icon: '⚙️', label: 'Settings', action: () => { toggleDropdown(false); navigateTo('settings'); } },
              ].map(item => (
                <button key={item.label} onClick={item.action}
                  style={{ width: '100%', padding: '10px 12px', textAlign: 'left', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover-item)'}
                  onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}

              <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />

              <button onClick={handleLogout}
                style={{ width: '100%', padding: '10px 12px', textAlign: 'left', color: 'var(--red)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover-item)'}
                onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
              >
                <span>🚪</span> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
