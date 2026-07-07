import { useGame } from '../context/GameContext';
import { useIsMobile } from '../hooks/useIsMobile';

export default function NotificationsView() {
  const { notifications, navigateTo, markNotifsRead, markNotifRead, playSFX } = useGame();
  const isMobile = useIsMobile();
  const hasNotifs = notifications.length > 0;

  const handleMarkAllRead = () => {
    playSFX('click');
    markNotifsRead();
  };

  const handleDismiss = (id) => {
    playSFX('click');
    markNotifRead(id);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: isMobile ? (hasNotifs ? 'space-between' : 'center') : 'flex-end', alignItems: 'center', marginBottom: '24px' }}>
        {isMobile && <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)' }}>Notifications</h2>}
        {hasNotifs && (
          <button onClick={handleMarkAllRead} style={{ fontSize: '0.9rem', color: 'var(--purple-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Mark all read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notifications.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🔔</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>You're all caught up!</div>
            <div>No notifications right now. Keep playing!</div>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="glass-card" style={{
              padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'center',
              background: 'rgba(124,58,237,0.1)',
              borderLeft: '4px solid var(--purple)',
              transition: 'transform 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ fontSize: '2rem', flexShrink: 0, width: '48px', textAlign: 'center' }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {n.title}
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--purple)', display: 'inline-block' }} />
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{n.body}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>{n.time}</div>
              </div>
              <button
                onClick={() => handleDismiss(n.id)}
                title="Mark as read"
                style={{
                  flexShrink: 0, width: '32px', height: '32px', borderRadius: 'var(--r-full)',
                  background: 'var(--bg-input)', color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button className="btn-secondary" onClick={() => navigateTo('home')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
