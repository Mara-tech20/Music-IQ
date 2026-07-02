import { getInitials } from '../context/GameContext';
import { getMedalEmoji } from '../utils/leaderboard';

// entry: { rank, name, isPlayer, subtitle, icon, value, valueLabel }
export default function LeaderboardRow({ entry, index, isVisible }) {
  const medal = getMedalEmoji(entry.rank);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '11px 14px', borderRadius: '14px',
      background: entry.isPlayer ? 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(168,85,247,0.15))' : 'transparent',
      border: `1px solid ${entry.isPlayer ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.06)'}`,
      position: 'relative', overflow: 'hidden',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
      transition: `opacity 0.4s ease ${index * 45}ms, transform 0.4s ease ${index * 45}ms`,
    }}>
      {entry.isPlayer && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(124,58,237,0.07),transparent)', pointerEvents: 'none' }} />}
      <div style={{ minWidth: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: entry.rank <= 3 ? '1.25rem' : '0.9rem', color: entry.rank === 1 ? '#f59e0b' : entry.rank === 2 ? '#94a3b8' : entry.rank === 3 ? '#cd7c3a' : 'var(--text-muted)' }}>
        {medal || `#${entry.rank}`}
      </div>
      <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: entry.isPlayer ? 'linear-gradient(135deg,var(--purple),var(--purple-light))' : 'linear-gradient(135deg,#4b5563,#9ca3af)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', color: '#fff', boxShadow: entry.isPlayer ? '0 0 12px rgba(124,58,237,0.5)' : 'none', border: entry.isPlayer ? '2px solid rgba(168,85,247,0.6)' : '2px solid transparent' }}>
        {getInitials(entry.name)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem', color: entry.isPlayer ? 'var(--purple-light)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</span>
          {entry.isPlayer && <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.05em', background: 'linear-gradient(135deg,var(--purple),var(--purple-light))', color: '#fff', borderRadius: '4px', padding: '1px 5px' }}>YOU</span>}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>{entry.subtitle}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.88rem', color: entry.isPlayer ? 'var(--purple-light)' : 'var(--text-secondary)', textAlign: 'right', minWidth: '70px' }}>
        {entry.icon} {entry.value.toLocaleString()}
        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 500 }}>{entry.valueLabel}</div>
      </div>
    </div>
  );
}
