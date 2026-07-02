import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { buildLevelLeaderboard } from '../utils/leaderboard';
import LeaderboardRow from './LeaderboardRow';

export default function LeaderboardView() {
  const { player } = useGame();
  const [rowsVisible, setRowsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRowsVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  const { tierTitle, entries } = buildLevelLeaderboard(player.name, player.xp);
  const playerEntry  = entries.find(e => e.isPlayer);
  const playerLbRank = playerEntry?.rank || entries.length;

  const rows = entries.map(e => ({
    ...e,
    value: e.xp,
    valueLabel: 'stars',
    icon: '⭐',
    subtitle: `${tierTitle} · Lv ${e.level}`,
  }));

  return (
    <div style={{ padding: '24px', maxWidth: '760px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.9rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
            🏆 Leaderboard
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Ranked by XP among fellow <strong style={{ color: 'var(--gold)' }}>{tierTitle}s</strong></p>
        </div>
        <div style={{ padding: '6px 16px', borderRadius: 'var(--r-full)', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
          YOUR RANK: #{playerLbRank}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '18px 20px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '44px 40px 1fr auto', gap: '12px', padding: '0 4px 10px', borderBottom: '1px solid var(--border)', marginBottom: '10px' }}>
          {['Rank', '', 'Player', '⭐ Stars'].map((h, i) => (
            <div key={i} style={{ fontSize: '0.63rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: i === 3 ? 'right' : 'left' }}>{h}</div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {rows.map((entry, i) => (
            <LeaderboardRow key={entry.name + i} entry={entry} index={i} isVisible={rowsVisible} />
          ))}
        </div>
      </div>
    </div>
  );
}
