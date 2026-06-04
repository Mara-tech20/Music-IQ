import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/questions';

export default function ProfileView() {
  const { player, rank, xpProgress, initials } = useGame();

  const getAccuracyColor = (acc) => {
    if (acc >= 80) return 'var(--green)';
    if (acc >= 50) return 'var(--gold)';
    return 'var(--red)';
  };

  const accuracy = player.totalQuestions > 0 ? Math.round((player.totalCorrect / player.totalQuestions) * 100) : 0;

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      
      {/* Header Info */}
      <div className="glass-card" style={{ padding: '40px', marginBottom: '32px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--purple), var(--purple-light))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem', fontWeight: 'bold', color: '#fff',
          boxShadow: '0 0 40px rgba(124,58,237,0.4)'
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{player.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>{rank.title}</span>
            <span>•</span>
            <span>Joined {new Date(player.joinedAt).toLocaleDateString()}</span>
          </div>
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span>Total XP: {player.xp.toLocaleString()}</span>
              <span>Next Rank Progress</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Global Stats */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--cyan)', marginBottom: '8px' }}>{player.gamesPlayed}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Games Played</div>
        </div>
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: getAccuracyColor(accuracy), marginBottom: '8px' }}>{accuracy}%</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Accuracy</div>
        </div>
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--purple-light)', marginBottom: '8px' }}>{player.levelsWon}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Levels Conquered</div>
        </div>
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--orange)', marginBottom: '8px' }}>{player.bestStreak} 🔥</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Best Day Streak</div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Category Breakdown</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {Object.entries(player.categoryStats).map(([catId, stats]) => {
          const cat = CATEGORIES[catId];
          if (!cat) return null;
          const catAcc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
          return (
            <div key={catId} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ fontSize: '2rem' }}>{cat.emoji}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{cat.name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Played: {stats.played} • Best Lv: {stats.bestLevel}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: getAccuracyColor(catAcc) }}>
                  {catAcc}%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accuracy</div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
