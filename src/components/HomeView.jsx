import { useGame } from '../context/GameContext';
import { CATEGORY_LIST } from '../data/questions';

export default function HomeView() {
  const { player, rank, xpProgress, startSession, playSFX } = useGame();

  const handleStart = (catId) => {
    playSFX('click');
    startSession(catId);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      
      {/* Welcome & Stats Section */}
      <section style={{ marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Welcome back, <span style={{ background: 'linear-gradient(135deg, #7c3aed, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{player.name}</span>!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Ready to test your musical knowledge today?
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px', minWidth: '300px', flex: 1, maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Rank</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>{rank.title}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Stars</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>⭐ {player.xp.toLocaleString()}</div>
            </div>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>⭐ {player.xp}</span>
            <span>Next Rank</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Select Category</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Choose a genre to start playing</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {CATEGORY_LIST.map((cat, i) => (
            <div 
              key={cat.id} 
              className="glass-card"
              onClick={() => handleStart(cat.id)}
              style={{
                padding: '0', overflow: 'hidden', cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                animation: `slideInUp 0.5s ease backwards`,
                animationDelay: `${i * 0.1}s`,
                position: 'relative'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${cat.glow}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              <div style={{ 
                height: '140px', background: cat.gradient, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '64px', position: 'relative'
              }}>
                <span style={{ 
                  animation: 'floatUp 6s ease-in-out infinite alternate',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
                }}>{cat.emoji}</span>
              </div>
              
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.4rem' }}>{cat.name}</h4>
                  <span style={{ 
                    fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--r-full)',
                    background: cat.difficulty === 'Easy' ? 'rgba(16,185,129,0.2)' : cat.difficulty === 'Medium' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                    color: cat.difficulty === 'Easy' ? 'var(--green)' : cat.difficulty === 'Medium' ? 'var(--gold)' : 'var(--red)',
                    fontWeight: 600
                  }}>
                    {cat.difficulty}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', minHeight: '40px' }}>
                  {cat.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span>{cat.questionCount}+ Questions</span>
                  <span>Lv. {player.categoryStats[cat.id]?.bestLevel || 0} Best</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
