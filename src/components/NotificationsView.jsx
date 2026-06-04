import { useGame } from '../context/GameContext';

export default function NotificationsView() {
  const { notifications, player, navigateTo, markNotifsRead } = useGame();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)' }}>Notifications</h2>
        <button onClick={markNotifsRead} style={{ fontSize: '0.9rem', color: 'var(--purple-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Mark all read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notifications.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No notifications right now. Keep playing!
          </div>
        ) : (
          notifications.map(n => {
            const isRead = n.read || player.notifsRead?.includes(n.id);
            return (
              <div key={n.id} className="glass-card" style={{
                padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'center',
                background: isRead ? 'var(--bg-card)' : 'rgba(124,58,237,0.1)',
                borderLeft: isRead ? '4px solid transparent' : '4px solid var(--purple)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{ fontSize: '2rem', flexShrink: 0, width: '48px', textAlign: 'center' }}>{n.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {n.title}
                    {!isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--purple)', display: 'inline-block' }} />}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{n.body}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>{n.time}</div>
                </div>
              </div>
            );
          })
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
