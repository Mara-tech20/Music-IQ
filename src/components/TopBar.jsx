import { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/questions';

export default function TopBar() {
  const {
    player, activeView, navigateTo,
    toggleTheme, dropdownOpen, toggleDropdown, initials, rank,
    session, notifOpen, toggleNotifPanel, notifications, unreadCount, markNotifsRead,
    showModal,
  } = useGame();
  const { logout } = useAuth();

  const dropdownRef = useRef(null);
  const notifRef    = useRef(null);

  const theme = player.settings.darkMode ? 'dark' : 'light';

  const viewTitles = {
    home:        'Dashboard',
    profile:     'Player Profile',
    settings:    'Game Settings',
    gameplay:    session?.category ? CATEGORIES[session.category].name : 'Game Area',
    leaderboard: 'Leaderboard',
    notifications: 'Notifications',
  };
  const currentTitle = viewTitles[activeView] || 'Music IQ';

  // Close panels on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) toggleDropdown(false);
      if (notifRef.current    && !notifRef.current.contains(e.target))    toggleNotifPanel(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [toggleDropdown, toggleNotifPanel]);

  const handleLogout = () => {
    toggleDropdown(false);
    showModal('logoutConfirm');
  };

  /* ── Icon button style ── */
  const iconBtn = (extra = {}) => ({
    width: '40px', height: '40px', borderRadius: 'var(--r-full)',
    background: 'var(--bg-input)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '1.1rem', transition: 'background 0.2s',
    ...extra,
  });

  return (
    <header style={{
      height: 'var(--topbar-h)',
      position: 'fixed', top: 0, left: 0, right: 0,
      background: 'var(--bg-topbar)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', zIndex: 100,
    }}>
      {/* Left: back + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        {activeView !== 'home' && (
          <button onClick={() => navigateTo('home')} style={iconBtn({ background: 'var(--bg-topbar-btn)', color: 'var(--text-topbar)' })} title="Back to Dashboard"
            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-topbar-btn-hover)'}
            onMouseOut={e  => e.currentTarget.style.background = 'var(--bg-topbar-btn)'}
          >←</button>
        )}
        <h1 style={{ fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text-topbar)' }}>
          {currentTitle}
        </h1>
      </div>

      {/* Centre: Logo */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div
          onClick={() => navigateTo('home')}
          style={{
            fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            cursor: 'pointer', letterSpacing: '0.04em',
          }}
        >
          MUSIC IQ
        </div>
      </div>

      {/* Right: theme + notif bell + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>

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
            <span style={{
              position: 'absolute', top: '-2px', right: '-2px',
              minWidth: '18px', height: '18px', background: 'var(--red)',
              borderRadius: 'var(--r-full)', border: '2px solid var(--bg-topbar)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: '#fff', padding: '0 3px',
            }}>
              {unreadCount}
            </span>
          )}
        </div>

        {/* Avatar / dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { toggleDropdown(!dropdownOpen); toggleNotifPanel(false); }}
            style={{
              width: '40px', height: '40px', borderRadius: 'var(--r-full)',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              color: '#fff', fontWeight: 'bold', border: '2px solid var(--bg-topbar)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', transition: 'transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseOut={e  => e.currentTarget.style.transform = 'scale(1)'}
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              width: '240px', background: 'var(--bg-dropdown)',
              border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
              boxShadow: 'var(--shadow-card)', padding: '8px',
              animation: 'dropdownOpen 0.2s ease forwards', transformOrigin: 'top right',
            }}>
              {/* User info */}
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
