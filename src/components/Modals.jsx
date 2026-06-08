import { useEffect } from 'react';
import { useGame, RANKS } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

export default function Modals() {
  const { modal, hideModal, advanceLevel, restartLevel, endSession, playSFX, session, navigateTo, player, rank } = useGame();
  const { logout } = useAuth();

  useEffect(() => {
    if (modal === 'win') playSFX('win');
    if (modal === 'lose') playSFX('lose');
  }, [modal, playSFX]);

  if (!modal) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      animation: 'modalOverlayIn 0.3s ease'
    }}>
      {/* ── WIN (Success) MODAL ── */}
      {modal === 'win' && (
        <div className="glass-card" style={{
          width: '90%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
            {/* Confetti */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute', width: '8px', height: '16px',
                background: ['#f59e0b', '#ec4899', '#10b981', '#06b6d4', '#7c3aed'][Math.floor(Math.random() * 5)],
                left: `${10 + Math.random() * 80}%`, top: '-20px',
                animation: `confettiFall ${1 + Math.random()}s linear forwards, confettiSway 2s ease-in-out infinite`,
                animationDelay: `${Math.random() * 0.5}s`
              }}></div>
            ))}
            {/* Trophy */}
            <div style={{
              fontSize: '80px', lineHeight: 1, position: 'relative', zIndex: 2,
              animation: 'trophyEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), trophyFloat 3s ease-in-out infinite 0.8s',
              filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.6))'
            }}>🏆</div>
          </div>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '12px', background: 'linear-gradient(135deg, #f59e0b, #fcd34d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Level {session.currentLevel} Cleared!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem' }}>
            Amazing job! You scored {session.score} points so far.
            <br/>
            <strong>+{session.xpEarned} XP</strong> earned!
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" onClick={() => { hideModal(); advanceLevel(); }}>
              Next Level 🚀
            </button>
            <button className="btn-secondary" onClick={() => { hideModal(); endSession(); navigateTo('postgame'); }}>
              End Game
            </button>
          </div>
        </div>
      )}

      {/* ── LOSE (Fail) MODAL ── */}
      {modal === 'lose' && (
        <div className="glass-card" style={{
          width: '90%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          border: '1px solid rgba(239,68,68,0.3)'
        }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
            <div style={{
              fontSize: '80px', lineHeight: 1,
              animation: 'sadEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), sadFloat 3s ease-in-out infinite 0.6s'
            }}>😔</div>
            <div style={{
              position: 'absolute', top: '60px', right: '30px',
              width: '8px', height: '12px', background: '#3b82f6', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animation: 'tearDrop 2s ease-in infinite'
            }}></div>
          </div>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '12px', color: 'var(--red)' }}>
            Level Failed
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem' }}>
            You need all 4 correct answers to advance.
            <br/>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>But you still earned <strong>+{session.xpEarned} XP</strong> this run!</span>
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" onClick={() => { hideModal(); restartLevel(); }}>
              Retry Level 🔄
            </button>
            <button className="btn-ghost" onClick={() => { hideModal(); endSession(); navigateTo('postgame'); }}>
              End Game
            </button>
          </div>
        </div>
      )}



      {/* ── END CONFIRM MODAL ── */}
      {modal === 'endconfirm' && (
        <div className="glass-card" style={{
          width: '90%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center',
          animation: 'modalSlideUp 0.3s ease'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'exitBounce 2s infinite' }}>🏃</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Leaving so soon?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Your current level progress will be lost. Are you sure you want to end this session?
          </p>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={hideModal}>
              Cancel
            </button>
            <button className="btn-primary" style={{ flex: 1, background: 'var(--red)', boxShadow: 'none' }} 
              onClick={() => { hideModal(); endSession(); navigateTo('postgame'); }}
            >
              End Game
            </button>
          </div>
        </div>
      )}

      {/* ── RANK SYSTEM MODAL ── */}
      {modal === 'rankSystem' && (
        <div className="glass-card" style={{
          width: '95%', maxWidth: '480px', padding: '30px 24px',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          maxHeight: '85vh', overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.8rem', background: 'linear-gradient(135deg, var(--gold), var(--orange))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900 }}>
              Rank System
            </h2>
            <button onClick={hideModal} style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Earn stars (XP) to climb the ranks. Correct answers grant +10 ⭐, and missed questions grant +2 ⭐!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {RANKS.map((r, i) => {
              const isActive = rank.title === r.title;
              const nextRank = RANKS[i + 1];
              const scoreRange = nextRank ? `${r.minXP.toLocaleString()} - ${(nextRank.minXP - 1).toLocaleString()}` : `${r.minXP.toLocaleString()}+`;
              
              return (
                <div key={r.title} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '12px',
                  background: isActive ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,58,237,0.15))' : 'var(--bg-input)',
                  border: isActive ? '1px solid var(--gold)' : '1px solid var(--border)',
                  position: 'relative'
                }}>
                  {isActive && (
                    <span style={{
                      position: 'absolute', left: '-6px', top: '50%', transform: 'translateY(-50%)',
                      width: '4px', height: '24px', background: 'var(--gold)', borderRadius: '2px'
                    }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, color: isActive ? 'var(--gold)' : 'var(--text-primary)' }}>
                      {r.title} {isActive && '🏆'}
                    </div>
                    {isActive && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Your current rank
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
                    {scoreRange} <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>⭐</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="btn-primary btn-block" onClick={hideModal} style={{ marginTop: '24px' }}>
            Got It!
          </button>
        </div>
      )}

      {/* ── RANK UP (CONGRATULATIONS) MODAL ── */}
      {modal === 'rankup' && (
        <div className="glass-card" style={{
          width: '90%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          border: '2px solid var(--gold)'
        }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
            {/* Confetti */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute', width: '8px', height: '16px',
                background: ['#f59e0b', '#ec4899', '#10b981', '#06b6d4', '#7c3aed'][Math.floor(Math.random() * 5)],
                left: `${10 + Math.random() * 80}%`, top: '-20px',
                animation: `confettiFall ${1 + Math.random()}s linear forwards, confettiSway 2s ease-in-out infinite`,
                animationDelay: `${Math.random() * 0.5}s`
              }}></div>
            ))}
            {/* Rank badge / Star */}
            <div style={{
              fontSize: '80px', lineHeight: 1, position: 'relative', zIndex: 2,
              animation: 'heartbeat 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.7))'
            }}>⭐</div>
          </div>
          
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px', background: 'linear-gradient(135deg, var(--gold), #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900 }}>
            Congratulations!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem', lineHeight: 1.5 }}>
            You've reached Level {session.currentLevel}!
            <br/>
            You have promoted to the next rank:
            <br/>
            <strong style={{ fontSize: '1.6rem', color: 'var(--gold)', display: 'block', marginTop: '10px', textShadow: '0 0 10px rgba(245,158,11,0.3)' }}>
              🎉 {session.rankUpDetails?.newRank} 🎉
            </strong>
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" onClick={() => {
              if (session) {
                session.rankUpDetails = null;
              }
              hideModal();
            }}>
              Awesome! 🚀
            </button>
          </div>
        </div>
      )}

      {/* ── LOG OUT CONFIRM MODAL ── */}
      {modal === 'logoutConfirm' && (
        <div className="glass-card" style={{
          width: '90%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center',
          animation: 'modalSlideUp 0.3s ease'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚪</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', fontWeight: 800 }}>Confirm Log Out</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Are you sure you want to log out of your Music IQ account?
          </p>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={hideModal}>
              Cancel
            </button>
            <button className="btn-primary" style={{ flex: 1, background: 'var(--red)', boxShadow: 'none' }} 
              onClick={() => { hideModal(); logout(); }}
            >
              🚪 Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
