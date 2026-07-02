import { useEffect, useState } from 'react';
import { useGame, RANKS } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { getRankUpCardDataURL } from '../utils/shareUtils';
import { buildLevelLeaderboard } from '../utils/leaderboard';

// ─── Social Share Buttons ─────────────────────────────────────────────────────
function SocialShareButtons({ dataURL, fileName, shareText }) {
  const encoded = encodeURIComponent(shareText);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener');
  };
  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank', 'noopener');
  };
  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encoded}`, '_blank', 'noopener');
  };
  const handleInstagram = () => {
    // Instagram has no direct web share API — download and instruct
    if (dataURL) {
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = fileName || 'music_iq_card.png';
      a.click();
    }
    alert('Card downloaded! Open Instagram and share it from your gallery.');
  };
  const handleDownload = () => {
    if (!dataURL) return;
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = fileName || 'music_iq_card.png';
    a.click();
  };

  const btnBase = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '7px', padding: '11px 0', borderRadius: '12px',
    border: 'none', cursor: 'pointer', fontWeight: 700,
    fontSize: '0.82rem', transition: 'opacity 0.18s, transform 0.18s',
    flex: 1,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ ...btnBase, background: '#25D366', color: '#fff' }}
          onClick={handleWhatsApp}
          onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}>
          <span style={{ fontSize: '1rem' }}>💬</span> WhatsApp
        </button>
        <button style={{ ...btnBase, background: '#1DA1F2', color: '#fff' }}
          onClick={handleTwitter}
          onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}>
          <span style={{ fontSize: '1rem' }}>𝕏</span> Twitter
        </button>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ ...btnBase, background: '#1877F2', color: '#fff' }}
          onClick={handleFacebook}
          onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}>
          <span style={{ fontSize: '1rem' }}>📘</span> Facebook
        </button>
        <button style={{ ...btnBase, background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: '#fff' }}
          onClick={handleInstagram}
          onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}>
          <span style={{ fontSize: '1rem' }}>📸</span> Instagram
        </button>
      </div>
      <button
        onClick={handleDownload}
        style={{
          ...btnBase,
          flex: 'none', width: '100%',
          background: 'var(--bg-input)', border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--purple-light)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        📥 Download Card
      </button>
    </div>
  );
}

export default function Modals() {
  const {
    modal, hideModal, advanceLevel, restartLevel, endSession, playSFX,
    session, navigateTo, player, rank, pendingRankUp, clearPendingRankUp,
  } = useGame();
  const { logout } = useAuth();

  const [cardData, setCardData] = useState(null); // { dataURL, fileName }
  const [showCardPreview, setShowCardPreview] = useState(false);

  useEffect(() => {
    if (modal === 'win') playSFX('win');
    if (modal === 'lose') playSFX('lose');
  }, [modal, playSFX]);

  // Generate the rank-up card when the modal opens
  useEffect(() => {
    if (modal === 'rankup' && pendingRankUp) {
      const result = getRankUpCardDataURL(
        player.name,
        pendingRankUp.oldRank,
        pendingRankUp.newRank,
        pendingRankUp.stars ?? player.xp,
      );
      setCardData(result);
      setShowCardPreview(false);
    }
  }, [modal, pendingRankUp, player.name, player.xp]);

  if (!modal) return null;

  const globalRank = modal === 'win'
    ? buildLevelLeaderboard(player.name, player.xp).entries.find(e => e.isPlayer)?.rank
    : null;

  const handleDismissRankUp = () => {
    clearPendingRankUp();
    hideModal();
    setCardData(null);
    setShowCardPreview(false);
  };

  const shareText = pendingRankUp
    ? `🏆 I just ranked up in Music IQ! I've advanced from ${pendingRankUp.oldRank} to ${pendingRankUp.newRank} with ⭐ ${(pendingRankUp.stars ?? player.xp).toLocaleString()} stars! Can you beat me?`
    : '';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      animation: 'modalOverlayIn 0.3s ease',
    }}>

      {/* ── WIN ── */}
      {modal === 'win' && (
        <div className="glass-card" style={{
          width: '90%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute', width: '8px', height: '16px',
                background: ['#f59e0b','#ec4899','#10b981','#06b6d4','#7c3aed'][i % 5],
                left: `${10 + (i / 12) * 80}%`, top: '-20px',
                animation: `confettiFall ${1 + (i * 0.08)}s linear forwards, confettiSway 2s ease-in-out infinite`,
                animationDelay: `${i * 0.04}s`,
              }} />
            ))}
            <div style={{
              fontSize: '80px', lineHeight: 1, position: 'relative', zIndex: 2,
              animation: 'trophyEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), trophyFloat 3s ease-in-out infinite 0.8s',
              filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.6))',
            }}>🏆</div>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px', background: 'linear-gradient(135deg,#f59e0b,#fcd34d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Level {session.currentLevel} Cleared!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '18px', fontSize: '1.1rem' }}>
            Amazing job! You scored {session.score} points so far.
            <br /><strong>+{session.xpEarned} XP</strong> earned!
          </p>
          {globalRank && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 18px', borderRadius: 'var(--r-full)', marginBottom: '24px',
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
              color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem',
            }}>
              🌍 Global Rank: #{globalRank}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" onClick={() => { hideModal(); advanceLevel(); }}>Next Level 🚀</button>
            <button className="btn-secondary" onClick={() => { hideModal(); endSession(); navigateTo('postgame'); }}>End Game</button>
          </div>
        </div>
      )}

      {/* ── LOSE ── */}
      {modal === 'lose' && (
        <div className="glass-card" style={{
          width: '90%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          border: '1px solid rgba(239,68,68,0.3)',
        }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
            <div style={{ fontSize: '80px', lineHeight: 1, animation: 'sadEntrance 0.6s cubic-bezier(0.34,1.56,0.64,1), sadFloat 3s ease-in-out infinite 0.6s' }}>😔</div>
            <div style={{
              position: 'absolute', top: '60px', right: '30px',
              width: '8px', height: '12px', background: '#3b82f6',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animation: 'tearDrop 2s ease-in infinite',
            }} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px', color: 'var(--red)' }}>Level Failed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem' }}>
            You need all 4 correct answers to advance.
            <br /><span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>But you still earned <strong>+{session.xpEarned} XP</strong> this run!</span>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" onClick={() => { hideModal(); restartLevel(); }}>Retry Level 🔄</button>
            <button className="btn-ghost" onClick={() => { hideModal(); endSession(); navigateTo('postgame'); }}>End Game</button>
          </div>
        </div>
      )}

      {/* ── END CONFIRM ── */}
      {modal === 'endconfirm' && (
        <div className="glass-card" style={{
          width: '90%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center',
          animation: 'modalSlideUp 0.3s ease',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'exitBounce 2s infinite' }}>🏃</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Leaving so soon?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Your current level progress will be lost. Are you sure you want to end this session?
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={hideModal}>Cancel</button>
            <button className="btn-primary" style={{ flex: 1, background: 'var(--red)', boxShadow: 'none' }}
              onClick={() => { hideModal(); endSession(); navigateTo('postgame'); }}>
              End Game
            </button>
          </div>
        </div>
      )}

      {/* ── RANK SYSTEM ── */}
      {modal === 'rankSystem' && (
        <div className="glass-card" style={{
          width: '95%', maxWidth: '480px', padding: '30px 24px',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          maxHeight: '85vh', overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.8rem', background: 'linear-gradient(135deg,var(--gold),var(--orange))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900 }}>
              Rank System
            </h2>
            <button onClick={hideModal} style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Earn stars (XP) to climb the ranks. Correct answers grant +10 ⭐, missed questions grant +2 ⭐!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {RANKS.map((r, i) => {
              const isActive = rank.title === r.title;
              const nextRank = RANKS[i + 1];
              const scoreRange = nextRank ? `${r.minXP.toLocaleString()} – ${(nextRank.minXP - 1).toLocaleString()}` : `${r.minXP.toLocaleString()}+`;
              return (
                <div key={r.title} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '12px',
                  background: isActive ? 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(124,58,237,0.15))' : 'var(--bg-input)',
                  border: isActive ? '1px solid var(--gold)' : '1px solid var(--border)',
                  position: 'relative',
                }}>
                  {isActive && (
                    <span style={{ position: 'absolute', left: '-6px', top: '50%', transform: 'translateY(-50%)', width: '4px', height: '24px', background: 'var(--gold)', borderRadius: '2px' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, color: isActive ? 'var(--gold)' : 'var(--text-primary)' }}>
                      {r.title} {isActive && '🏆'}
                    </div>
                    {isActive && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Your current rank</div>}
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
                    {scoreRange} <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>⭐</span>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn-primary btn-block" onClick={hideModal} style={{ marginTop: '24px' }}>Got It!</button>
        </div>
      )}

      {/* ── RANK UP CELEBRATION (shown on home screen) ── */}
      {modal === 'rankup' && (
        <div className="glass-card" style={{
          width: '92%', maxWidth: '480px',
          padding: showCardPreview ? '24px 22px' : '36px 28px',
          textAlign: 'center',
          animation: 'modalSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          border: '2px solid var(--gold)',
          boxShadow: '0 0 60px rgba(245,158,11,0.25), 0 24px 60px rgba(0,0,0,0.5)',
          maxHeight: '90vh', overflowY: 'auto',
          position: 'relative', overflow: 'hidden',
        }}>

          {/* Golden glow top */}
          <div style={{
            position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
            width: '280px', height: '280px',
            background: 'rgba(245,158,11,0.15)', filter: 'blur(60px)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          {!showCardPreview ? (
            <>
              {/* Confetti */}
              <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 20px' }}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} style={{
                    position: 'absolute', width: '7px', height: '14px',
                    background: ['#f59e0b','#ec4899','#10b981','#06b6d4','#7c3aed','#fcd34d'][i % 6],
                    left: `${5 + (i / 18) * 90}%`, top: '-20px',
                    borderRadius: '2px',
                    animation: `confettiFall ${1 + (i * 0.07)}s linear forwards, confettiSway 2s ease-in-out infinite`,
                    animationDelay: `${i * 0.05}s`,
                  }} />
                ))}
                {/* Trophy with glow */}
                <div style={{
                  fontSize: '90px', lineHeight: 1, position: 'relative', zIndex: 2,
                  animation: 'trophyEntrance 0.9s cubic-bezier(0.34,1.56,0.64,1), trophyFloat 3s ease-in-out infinite 0.9s',
                  filter: 'drop-shadow(0 0 28px rgba(245,158,11,0.8))',
                }}>🏆</div>
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: '2rem', fontWeight: 900, marginBottom: '6px',
                background: 'linear-gradient(135deg,var(--gold),#fcd34d,var(--gold))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontFamily: 'var(--font-display)',
              }}>
                Rank Up!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
                Congratulations, <strong style={{ color: '#fff' }}>{player.name}</strong>!
              </p>

              {/* Rank transition pill */}
              {pendingRankUp && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '12px', marginBottom: '20px',
                }}>
                  <div style={{
                    padding: '8px 18px', borderRadius: '20px',
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600,
                  }}>
                    {pendingRankUp.oldRank}
                  </div>
                  <span style={{ fontSize: '1.4rem', color: 'var(--gold)' }}>→</span>
                  <div style={{
                    padding: '8px 20px', borderRadius: '20px',
                    background: 'linear-gradient(135deg,rgba(245,158,11,0.25),rgba(124,58,237,0.2))',
                    border: '2px solid var(--gold)',
                    fontSize: '1rem', fontWeight: 800, color: 'var(--gold)',
                    boxShadow: '0 0 16px rgba(245,158,11,0.3)',
                  }}>
                    🎉 {pendingRankUp.newRank}
                  </div>
                </div>
              )}

              {/* Stars */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '12px', marginBottom: '24px',
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
              }}>
                <span style={{ fontSize: '1.2rem' }}>⭐</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fcd34d', fontSize: '1.1rem' }}>
                  {(pendingRankUp?.stars ?? player.xp).toLocaleString()} Stars Total
                </span>
              </div>

              {/* Card preview button */}
              {cardData && (
                <div style={{ marginBottom: '16px' }}>
                  <button
                    className="btn-primary"
                    style={{ width: '100%', marginBottom: '10px', fontSize: '1rem', padding: '14px' }}
                    onClick={() => setShowCardPreview(true)}
                  >
                    🃏 View &amp; Share Achievement Card
                  </button>
                </div>
              )}

              <button
                className="btn-ghost"
                style={{ width: '100%' }}
                onClick={handleDismissRankUp}
              >
                Continue Playing
              </button>
            </>
          ) : (
            <>
              {/* Card preview mode */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <button
                  onClick={() => setShowCardPreview(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  ← Back
                </button>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Your Achievement Card</h3>
                <div style={{ width: '60px' }} />
              </div>

              {/* Card image preview */}
              <div style={{
                borderRadius: '12px', overflow: 'hidden', marginBottom: '16px',
                border: '1px solid rgba(245,158,11,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <img
                  src={cardData.dataURL}
                  alt="Rank Up Achievement Card"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>

              <SocialShareButtons
                dataURL={cardData.dataURL}
                fileName={cardData.fileName}
                shareText={shareText}
              />
            </>
          )}
        </div>
      )}

      {/* ── LOGOUT CONFIRM ── */}
      {modal === 'logoutConfirm' && (
        <div className="glass-card" style={{
          width: '90%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center',
          animation: 'modalSlideUp 0.3s ease',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚪</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', fontWeight: 800 }}>Confirm Log Out</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Are you sure you want to log out of your Music IQ account?
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={hideModal}>Cancel</button>
            <button className="btn-primary" style={{ flex: 1, background: 'var(--red)', boxShadow: 'none' }}
              onClick={() => { hideModal(); logout(); }}>
              🚪 Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
