import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CATEGORY_LIST } from '../data/questions';
import { useIsMobile } from '../hooks/useIsMobile';

export default function HomeView() {
  const { player, rank, xpProgress, startSession, playSFX, showModal, pendingRankUp } = useGame();
  const isMobile = useIsMobile();

  // Show the deferred rank-up celebration when returning to home
  useEffect(() => {
    if (pendingRankUp) {
      const t = setTimeout(() => showModal('rankup'), 700);
      return () => clearTimeout(t);
    }
  }, [pendingRankUp, showModal]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestInput, setRequestInput] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const handleStart = (catId) => {
    playSFX('click');
    startSession(catId);
  };

  const handleRequestSubmit = () => {
    if (!requestInput.trim()) return;
    const saved = JSON.parse(localStorage.getItem('musiciq_category_requests') || '[]');
    saved.push({ category: requestInput.trim(), ts: Date.now() });
    localStorage.setItem('musiciq_category_requests', JSON.stringify(saved));
    setRequestSent(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestInput('');
      setRequestSent(false);
    }, 2200);
  };

  return (
    <>
    <style>{`
      .cat-card .cat-emoji {
        display: inline-block;
        transition: filter 0.3s ease;
      }
      .cat-card:hover .cat-emoji {
        filter: drop-shadow(0 6px 22px currentColor) brightness(1.25);
      }
    `}</style>
    <div style={{ padding: isMobile ? '20px 16px' : '24px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>

      {/* Welcome & Stats Section */}
      <section style={{ marginBottom: isMobile ? '32px' : '40px', display: 'flex', flexWrap: 'wrap', gap: isMobile ? '20px' : '24px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 className="home-welcome-heading" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Welcome back, <span style={{ background: 'linear-gradient(135deg, #7c3aed, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{player.name}</span>!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Ready to test your musical knowledge today?
          </p>
        </div>

        <div className="glass-card home-rank-card" style={{ padding: isMobile ? '22px 18px' : '20px', minWidth: '300px', flex: 1, maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: isMobile ? '6px' : '2px' }}>Current Rank</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>{rank.title}</span>
                <button 
                  onClick={() => { playSFX('click'); showModal('rankSystem'); }} 
                  style={{
                    background: 'linear-gradient(135deg, var(--purple), var(--purple-light))',
                    borderRadius: 'var(--r-full)',
                    padding: '4px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#fff',
                    border: 'none',
                    letterSpacing: '0.04em',
                    boxShadow: '0 2px 10px rgba(124,58,237,0.5)',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.7)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(124,58,237,0.5)'; }}
                  title="View Rank System"
                >
                  🏅 View Ranks
                </button>
              </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: isMobile ? '20px' : '24px' }}>
          <div>
            <h3 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', marginBottom: '6px' }}>Select Category</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? '0.9rem' : '1rem' }}>Choose a genre to start playing</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: isMobile ? '12px' : '24px' }}>
          {CATEGORY_LIST.map((cat, i) => (
            <div
              key={cat.id}
              className="glass-card cat-card"
              onClick={() => handleStart(cat.id)}
              style={{
                padding: '0', overflow: 'hidden', cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                animation: `slideInUp 0.5s ease backwards`,
                animationDelay: `${i * 0.1}s`,
                position: 'relative',
                gridColumn: isMobile && cat.id === 'artistSpotlight' ? 'span 2' : 'auto',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 24px 48px ${cat.glow}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              <div style={{
                height: isMobile ? '110px' : '160px', background: cat.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '68px', position: 'relative', overflow: 'hidden'
              }}>
                {/* Decorative blurred glow blob */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(ellipse at center, ${cat.glow} 0%, transparent 70%)`,
                  opacity: 0.6,
                  pointerEvents: 'none'
                }} />
                {/* Decorative music notes */}
                <div style={{
                  position: 'absolute', top: '12px', right: '16px',
                  fontSize: '1.1rem', opacity: 0.45,
                  animation: 'cardNoteBounce 2.8s ease-in-out infinite',
                  animationDelay: '0.4s'
                }}>♪</div>
                <div style={{
                  position: 'absolute', bottom: '14px', left: '18px',
                  fontSize: '0.85rem', opacity: 0.35,
                  animation: 'cardNoteBounce 3.2s ease-in-out infinite',
                  animationDelay: '1.1s'
                }}>♫</div>
                <span
                  className="cat-emoji"
                  style={{
                    filter: `drop-shadow(0 4px 16px ${cat.glow})`,
                    position: 'relative', zIndex: 1,
                    fontSize: isMobile ? '44px' : '72px',
                    animationDelay: `${i * 0.15}s`,
                  }}
                >{cat.emoji}</span>
              </div>
              
              <div style={{ padding: isMobile ? '12px 10px 14px' : '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? '6px' : '8px', gap: '6px' }}>
                  <h4 style={{ fontSize: isMobile ? '0.95rem' : '1.4rem', lineHeight: 1.3 }}>{cat.name}</h4>
                  <span style={{
                    fontSize: isMobile ? '0.65rem' : '0.75rem', padding: isMobile ? '3px 7px' : '4px 10px', borderRadius: 'var(--r-full)', flexShrink: 0,
                    background: cat.difficulty === 'Easy' ? 'rgba(16,185,129,0.2)' : cat.difficulty === 'Medium' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                    color: cat.difficulty === 'Easy' ? 'var(--green)' : cat.difficulty === 'Medium' ? 'var(--gold)' : 'var(--red)',
                    fontWeight: 600
                  }}>
                    {cat.difficulty}
                  </span>
                </div>
                {!isMobile && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', minHeight: '40px' }}>
                    {cat.description}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: isMobile ? '0.75rem' : '0.85rem' }}>
                  <span>{cat.questionCount}+</span>
                  <span>Lv. {player.categoryStats[cat.id]?.bestLevel || 0}</span>
                </div>
              </div>
            </div>
          ))}
        {/* ── Request a Category Card ── */}
        <div
          onClick={() => { playSFX('click'); setShowRequestModal(true); }}
          style={{
            borderRadius: 'var(--r-lg)', cursor: 'pointer', overflow: 'hidden',
            border: '2px dashed rgba(124,58,237,0.4)',
            background: 'rgba(124,58,237,0.04)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center',
            minHeight: isMobile ? 'unset' : '220px',
            gap: isMobile ? '10px' : '16px',
            padding: isMobile ? '18px 16px' : '0',
            gridColumn: isMobile ? 'span 2' : 'auto',
            transition: 'all 0.3s ease',
            animation: `slideInUp 0.5s ease backwards`,
            animationDelay: `${CATEGORY_LIST.length * 0.1}s`,
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = 'var(--purple-light)';
            e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
            e.currentTarget.style.background = 'rgba(124,58,237,0.04)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{
            width: isMobile ? '48px' : '64px', height: isMobile ? '48px' : '64px',
            borderRadius: '50%',
            background: 'rgba(124,58,237,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isMobile ? '1.5rem' : '2rem',
            border: '2px dashed rgba(124,58,237,0.4)',
            animation: 'ambientPulse 3s ease-in-out infinite',
            flexShrink: 0,
          }}>✨</div>
          <div style={{ textAlign: 'center', padding: isMobile ? '0 8px' : '0 24px' }}>
            <h4 style={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 800, marginBottom: isMobile ? '4px' : '6px', fontFamily: 'var(--font-display)' }}>
              Request a Category
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? '0.82rem' : '0.9rem', lineHeight: 1.4 }}>
              Don't see your favourite genre? Suggest it and we'll add it!
            </p>
          </div>
          <div style={{
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
            color: 'var(--purple-light)', textTransform: 'uppercase',
            background: 'rgba(124,58,237,0.15)', padding: '6px 16px',
            borderRadius: 'var(--r-full)'
          }}>+ Request</div>
        </div>
      </div>
      </section>

      {/* ── Request Category Modal ── */}
      {showRequestModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          animation: 'modalOverlayIn 0.3s ease'
        }}>
          <div className="glass-card" style={{
            width: '90%', maxWidth: '480px', padding: '36px 30px',
            animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* purple glow accent */}
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '160px', height: '160px',
              background: 'rgba(124,58,237,0.25)', filter: 'blur(50px)',
              borderRadius: '50%', pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>✨ Request a Category</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>Tell us what genre you'd love to see!</p>
              </div>
              <button
                onClick={() => { setShowRequestModal(false); setRequestInput(''); setRequestSent(false); }}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1 }}
              >✕</button>
            </div>

            {!requestSent ? (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Category / Genre Name
                  </label>
                  <input
                    type="text"
                    value={requestInput}
                    onChange={e => setRequestInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRequestSubmit()}
                    placeholder="e.g. Jazz, Classical, K-Pop, Gospel…"
                    style={{
                      width: '100%', padding: '14px 18px', borderRadius: '14px',
                      background: 'var(--bg-input)', border: '1.5px solid var(--border)',
                      color: 'var(--text-primary)', fontSize: '1rem', outline: 'none',
                      fontFamily: 'var(--font-body)', transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--purple-light)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    autoFocus
                  />
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px', background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  💡 Popular categories include Afrobeats, K-Pop, Jazz, Gospel, Classical, and more. We review submissions weekly!
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn-ghost" style={{ flex: 1 }}
                    onClick={() => { setShowRequestModal(false); setRequestInput(''); }}
                  >Cancel</button>
                  <button
                    className="btn-primary" style={{ flex: 2 }}
                    onClick={handleRequestSubmit}
                    disabled={!requestInput.trim()}
                  >Submit Request 🚀</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', animation: 'fadeIn 0.4s ease' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--green)', marginBottom: '10px' }}>Request Submitted!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Thanks for suggesting <strong style={{ color: 'var(--purple-light)' }}>"{requestInput}"</strong>!<br/>
                  We'll review it and add it to Music IQ soon.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
    </>
  );
}
