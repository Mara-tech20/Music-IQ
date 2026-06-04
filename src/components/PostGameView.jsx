import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/questions';

export default function PostGameView() {
  const { session, navigateTo, startSession, playSFX } = useGame();
  const category = CATEGORIES[session.category] || { name: 'Music IQ', emoji: '🎵', gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)' };

  const total = session.totalAnswered || 0;
  const correct = session.totalCorrect || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const handlePlayAgain = () => {
    playSFX('click');
    startSession(session.category);
  };

  const handleDashboard = () => {
    playSFX('click');
    navigateTo('home');
  };

  const handleProfile = () => {
    playSFX('click');
    navigateTo('profile');
  };

  // Fun evaluation message based on performance
  const getFeedbackMessage = () => {
    if (accuracy >= 90) return { title: 'Flawless Performance! 🏆', desc: 'You have absolute masterclass ears! A true musical legend.' };
    if (accuracy >= 75) return { title: 'Outstanding Beat! 🌟', desc: 'Incredible job! You know your charts like a pro.' };
    if (accuracy >= 50) return { title: 'On Key! 🎧', desc: 'Solid run! A bit more practice and you\'ll top the charts.' };
    return { title: 'Off Beat 😔', desc: 'Don\'t sweat it. Even legendary musicians had off-days. Try again!' };
  };

  const feedback = getFeedbackMessage();

  return (
    <div style={{
      padding: '24px',
      maxWidth: '600px',
      margin: '0 auto',
      animation: 'fadeIn 0.4s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div className="glass-card" style={{
        width: '100%',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Genre Glow */}
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '200px', height: '200px', background: category.glow || 'rgba(124,58,237,0.3)',
          filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none', opacity: 0.5
        }} />

        {/* Header Icon */}
        <div style={{
          fontSize: '72px',
          lineHeight: 1,
          marginBottom: '20px',
          animation: 'trophyEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          {accuracy >= 75 ? '🏆' : category.emoji}
        </div>

        <h2 style={{
          fontSize: '2.4rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, var(--purple), var(--purple-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          {feedback.title}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem' }}>
          {feedback.desc}
        </p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '36px'
        }}>
          <div style={{
            background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Genre
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'capitalize' }}>
              {session.category}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Highest Level
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>
              {session.highestLevel}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Final Score
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--purple-light)' }}>
              {session.score} pts
            </div>
          </div>

          <div style={{
            background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              XP Earned
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green)' }}>
              +{session.xpEarned} XP
            </div>
          </div>
        </div>

        {/* Accuracy Radial / Bar Display */}
        <div style={{ marginBottom: '40px', padding: '0 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Accuracy Ratio</span>
            <span style={{ color: accuracy >= 75 ? 'var(--green)' : accuracy >= 50 ? 'var(--gold)' : 'var(--red)' }}>
              {correct} / {total} ({accuracy}%)
            </span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{
              width: `${accuracy}%`,
              background: accuracy >= 75 ? 'var(--green)' : accuracy >= 50 ? 'var(--gold)' : 'var(--red)'
            }}></div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn-primary" onClick={handlePlayAgain} style={{ fontSize: '1.05rem', padding: '16px' }}>
            Play Category Again 🔄
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handleDashboard} style={{ flex: 1 }}>
              Choose Genre
            </button>
            <button className="btn-ghost" onClick={handleProfile} style={{ flex: 1 }}>
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
