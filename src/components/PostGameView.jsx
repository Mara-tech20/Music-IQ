import { useEffect, useRef, useState } from 'react';
import { useGame, getRank } from '../context/GameContext';
import { CATEGORIES } from '../data/questions';
import { getPostGameCardDataURL } from '../utils/shareUtils';
import { buildCategoryLeaderboard } from '../utils/leaderboard';
import LeaderboardRow from './LeaderboardRow';

// ─── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiCannon({ count = 45, active }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i / count) * 100,
      color: ['#7c3aed','#a855f7','#ec4899','#f59e0b','#10b981','#06b6d4','#f97316'][i % 7],
      size: 5 + (i % 7),
      duration: 1.8 + (i % 5) * 0.3,
      delay: (i % 9) * 0.1,
      shape: i % 2 === 0 ? 'circle' : 'rect',
    }))
  ).current;
  if (!active) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: '-20px',
          width: p.shape === 'circle' ? p.size : p.size * 0.6,
          height: p.shape === 'circle' ? p.size : p.size * 1.4,
          background: p.color, borderRadius: p.shape === 'circle' ? '50%' : '2px',
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards, confettiSway ${p.duration * 0.6}s ${p.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Daily Chest ──────────────────────────────────────────────────────────────
function DailyChest({ onClaim, claimed }) {
  const [opening, setOpening] = useState(false);
  const [stars, setStars] = useState([]);
  const [done, setDone] = useState(claimed);

  const handleOpen = () => {
    if (opening || done) return;
    setOpening(true);
    setStars(Array.from({ length: 12 }, (_, i) => ({ id: i, angle: (i / 12) * 360, dist: 50 + (i % 4) * 10, delay: (i % 3) * 0.1 })));
    setTimeout(() => { setDone(true); onClaim(); }, 900);
  };

  if (done) return (
    <div style={{
      padding: '18px 24px', borderRadius: '16px',
      background: 'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(16,185,129,0.08))',
      border: '1px solid rgba(245,158,11,0.3)',
      display: 'flex', alignItems: 'center', gap: '14px',
      animation: 'fadeIn 0.4s ease',
    }}>
      <span style={{ fontSize: '2rem' }}>✅</span>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)', marginBottom: '2px' }}>Daily Reward Claimed! +10 ⭐</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Come back tomorrow for another reward</div>
      </div>
    </div>
  );

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>🎁 Daily Reward Ready! Tap to open</div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {opening && stars.map(s => (
          <div key={s.id} style={{
            position: 'absolute', top: '50%', left: '50%', fontSize: '1.1rem',
            animation: `chestStar 0.8s ${s.delay}s ease-out forwards`,
            '--angle': `${s.angle}deg`, '--dist': `${s.dist}px`,
            pointerEvents: 'none', zIndex: 10,
          }}>⭐</div>
        ))}
        <button onClick={handleOpen} style={{
          fontSize: '4.5rem', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer',
          filter: 'drop-shadow(0 0 18px rgba(245,158,11,0.8))',
          animation: opening ? 'trophyEntrance 0.5s cubic-bezier(0.34,1.56,0.64,1)' : 'trophyFloat 2s ease-in-out infinite',
          display: 'block',
        }}>
          {opening ? '🎊' : '🎁'}
        </button>
      </div>
      <style>{`@keyframes chestStar { 0%{transform:translate(-50%,-50%) rotate(var(--angle)) translateX(0) scale(0);opacity:1} 60%{opacity:1} 100%{transform:translate(-50%,-50%) rotate(var(--angle)) translateX(var(--dist)) scale(1.2);opacity:0} }`}</style>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay || 0); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      background: 'var(--bg-input)', padding: '16px 14px', borderRadius: '16px', border: '1px solid var(--border)',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
      transition: 'opacity 0.45s cubic-bezier(.34,1.56,.64,1), transform 0.45s cubic-bezier(.34,1.56,.64,1)',
    }}>
      <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: color || 'var(--purple)', opacity: 0.6 }} />
      <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{icon}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: color || 'var(--text-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px' }}>{sub}</div>}
    </div>
  );
}

// ─── Share Card Modal ─────────────────────────────────────────────────────────
function ShareCardModal({ cardData, onClose, shareText }) {
  const encoded = encodeURIComponent(shareText);

  const handleWhatsApp  = () => window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener');
  const handleTwitter   = () => window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank', 'noopener');
  const handleFacebook  = () => window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encoded}`, '_blank', 'noopener');
  const handleInstagram = () => {
    const a = document.createElement('a');
    a.href = cardData.dataURL; a.download = cardData.fileName; a.click();
    setTimeout(() => alert('Card downloaded! Open Instagram and share from your gallery.'), 200);
  };
  const handleDownload  = () => {
    const a = document.createElement('a');
    a.href = cardData.dataURL; a.download = cardData.fileName; a.click();
  };

  const btnBase = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
    padding: '12px 0', borderRadius: '12px', border: 'none', cursor: 'pointer',
    fontWeight: 700, fontSize: '0.85rem', flex: 1,
    transition: 'opacity 0.18s',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      animation: 'modalOverlayIn 0.3s ease',
    }}>
      <div className="glass-card" style={{
        width: '92%', maxWidth: '480px', padding: '24px 22px',
        animation: 'modalSlideUp 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>📤 Share Summary Card</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}>✕</button>
        </div>

        {/* Card preview */}
        <div style={{
          borderRadius: '12px', overflow: 'hidden', marginBottom: '18px',
          border: '1px solid rgba(168,85,247,0.35)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.15)',
        }}>
          <img src={cardData.dataURL} alt="Game Summary Card" style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Social share row 1 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button style={{ ...btnBase, background: '#25D366', color: '#fff' }} onClick={handleWhatsApp}
            onMouseOver={e => e.currentTarget.style.opacity='0.88'} onMouseOut={e => e.currentTarget.style.opacity='1'}>
            <span>💬</span> WhatsApp
          </button>
          <button style={{ ...btnBase, background: '#1DA1F2', color: '#fff' }} onClick={handleTwitter}
            onMouseOver={e => e.currentTarget.style.opacity='0.88'} onMouseOut={e => e.currentTarget.style.opacity='1'}>
            <span>𝕏</span> Twitter
          </button>
        </div>
        {/* Social share row 2 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <button style={{ ...btnBase, background: '#1877F2', color: '#fff' }} onClick={handleFacebook}
            onMouseOver={e => e.currentTarget.style.opacity='0.88'} onMouseOut={e => e.currentTarget.style.opacity='1'}>
            <span>📘</span> Facebook
          </button>
          <button style={{ ...btnBase, background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: '#fff' }} onClick={handleInstagram}
            onMouseOver={e => e.currentTarget.style.opacity='0.88'} onMouseOut={e => e.currentTarget.style.opacity='1'}>
            <span>📸</span> Instagram
          </button>
        </div>
        {/* Download */}
        <button onClick={handleDownload} style={{
          ...btnBase, flex: 'none', width: '100%',
          background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)',
        }}
          onMouseOver={e => e.currentTarget.style.borderColor='var(--purple-light)'}
          onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}>
          📥 Download Card
        </button>
      </div>
    </div>
  );
}

// ─── Main PostGameView ────────────────────────────────────────────────────────
export default function PostGameView() {
  const { session, player, navigateTo, startSession, playSFX, claimDailyReward, hasDailyReward } = useGame();
  const [confetti, setConfetti]       = useState(false);
  const [rowsVisible, setRowsVisible] = useState(false);
  const [chestClaimed, setChestClaimed] = useState(!hasDailyReward);
  const [shareModal, setShareModal]   = useState(false);
  const [cardData, setCardData]       = useState(null);

  const category  = CATEGORIES[session.category] || CATEGORIES['general'];
  const total     = session.totalAnswered || 0;
  const correct   = session.totalCorrect  || 0;
  const accuracy  = total > 0 ? Math.round((correct / total) * 100) : 0;
  const score     = session.score     || 0;
  const level     = session.highestLevel || 1;
  const xp        = session.xpEarned  || 0;
  const rankInfo  = getRank(player.xp);

  const categoryPoints = player.categoryStats[session.category]?.points || 0;
  const leaderboard  = buildCategoryLeaderboard(player.name, categoryPoints, session.category);
  const playerEntry  = leaderboard.find(e => e.isPlayer);
  const playerLbRank = playerEntry?.rank || leaderboard.length;
  const leaderboardRows = leaderboard.map(e => ({
    ...e, value: e.points, valueLabel: 'points', icon: '🏆', subtitle: `Lv ${e.level}`,
  }));

  const getFeedback = () => {
    if (accuracy >= 90) return { title: 'Flawless! 🏆', desc: 'Absolute masterclass. A true music legend!', color: '#f59e0b' };
    if (accuracy >= 75) return { title: 'Outstanding! 🌟', desc: 'You know your charts like a pro. Keep climbing!', color: '#a855f7' };
    if (accuracy >= 50) return { title: 'On Key! 🎧', desc: "Solid run! A bit more practice and you'll top the charts.", color: '#06b6d4' };
    return { title: 'Off Beat 😔', desc: "Don't sweat it. Even legends had off-days. Try again!", color: '#ef4444' };
  };
  const feedback = getFeedback();

  useEffect(() => {
    if (accuracy >= 75) {
      const t  = setTimeout(() => setConfetti(true), 400);
      const t2 = setTimeout(() => setConfetti(false), 3500);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [accuracy]);

  useEffect(() => { const t = setTimeout(() => setRowsVisible(true), 600); return () => clearTimeout(t); }, []);

  const handlePlayAgain = () => { playSFX('click'); startSession(session.category); };
  const handleHome      = () => { playSFX('click'); navigateTo('home'); };
  const handleChestClaim = () => { playSFX('win'); setChestClaimed(true); if (claimDailyReward) claimDailyReward(); };

  const handleOpenShareModal = () => {
    playSFX('click');
    const avatarEmoji = player.avatar?.type === 'emoji' ? player.avatar.emoji : '🎵';
    const result = getPostGameCardDataURL({
      playerName: player.name,
      categoryName: category.name,
      level,
      score,
      accuracy,
      starsEarned: xp,
      rankTitle: rankInfo.title,
      avatarEmoji,
    });
    if (result) { setCardData(result); setShareModal(true); }
  };

  const shareText = `🎵 I just scored ${score.toLocaleString()} pts in the ${category.name} challenge on Music IQ! Level ${level} · ${accuracy}% accuracy. Can you beat me? 🏆`;

  const topThree   = leaderboardRows.slice(0, 3);
  const playerIdx  = leaderboardRows.findIndex(e => e.isPlayer);
  const start      = Math.max(3, playerIdx - 2);
  const end        = Math.min(leaderboardRows.length, playerIdx + 3);
  const aroundRows = leaderboardRows.slice(start, end);
  const hasSep     = start > 3;

  return (
    <>
      <ConfettiCannon active={confetti} />

      {shareModal && cardData && (
        <ShareCardModal
          cardData={cardData}
          shareText={shareText}
          onClose={() => setShareModal(false)}
        />
      )}

      <div style={{
        padding: '20px 20px 48px', maxWidth: '860px', margin: '0 auto',
        animation: 'slideInUp 0.5s cubic-bezier(0.34,1.1,0.64,1)',
        display: 'flex', flexDirection: 'column', gap: '22px',
      }}>

        {/* ── HERO CARD ── */}
        <div className="glass-card" style={{ padding: '36px 32px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
            width: '300px', height: '300px',
            background: category.glow || 'rgba(124,58,237,0.35)',
            filter: 'blur(75px)', borderRadius: '50%', pointerEvents: 'none', opacity: 0.4,
            animation: 'ambientPulse 3s ease-in-out infinite',
          }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: 'var(--r-full)', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            <span>{category.emoji}</span><span>{category.name}</span>
          </div>

          <div style={{ fontSize: '72px', lineHeight: 1, marginBottom: '16px', animation: 'trophyEntrance 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.1s both', display: 'block' }}>
            {accuracy >= 75 ? '🏆' : accuracy >= 50 ? '🎧' : '😔'}
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,5vw,2.2rem)', fontWeight: 900, marginBottom: '8px', background: `linear-gradient(135deg,${feedback.color},#fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {feedback.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 28px' }}>{feedback.desc}</p>

          <div style={{ marginBottom: '28px', textAlign: 'left', maxWidth: '500px', margin: '0 auto 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '7px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Accuracy</span>
              <span style={{ color: feedback.color }}>{correct}/{total} correct · {accuracy}%</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${accuracy}%`, background: `linear-gradient(90deg,${feedback.color},${feedback.color}aa)` }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={handlePlayAgain} style={{ flex: '1 1 180px', maxWidth: '260px', fontSize: '1rem', padding: '15px 20px' }}>
              🔄 &nbsp;Restart Game
            </button>
            <button className="btn-secondary" onClick={handleHome} style={{ flex: '1 1 140px', maxWidth: '200px', fontSize: '1rem', padding: '15px 20px' }}>
              🏠 &nbsp;Home
            </button>
            <button
              className="btn-ghost"
              onClick={handleOpenShareModal}
              style={{ flex: '1 1 180px', maxWidth: '240px', fontSize: '1rem', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              📤 &nbsp;View Summary Card
            </button>
          </div>
        </div>

        {/* ── DAILY CHEST ── */}
        {hasDailyReward !== undefined && (
          <div className="glass-card" style={{
            padding: '24px 28px',
            background: chestClaimed ? 'linear-gradient(135deg,rgba(16,185,129,0.07),rgba(245,158,11,0.05))' : 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(124,58,237,0.06))',
            border: `1px solid ${chestClaimed ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.35)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '4px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--gold),var(--orange))' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800 }}>Daily Reward</h3>
            </div>
            <DailyChest onClaim={handleChestClaim} claimed={chestClaimed} />
          </div>
        )}

        {/* ── GAME DETAILS ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ width: '4px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--purple),var(--purple-light))' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800 }}>Game Details</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
            <StatCard label="Category"      value={category.shortName || category.name} icon={category.emoji}  color={category.colorA}       delay={80}  />
            <StatCard label="Level Reached" value={`Level ${level}`}                    icon="🎯"              color="var(--cyan)"           delay={150} />
            <StatCard label="Final Score"   value={`${score.toLocaleString()} pts`}     icon="⚡"              color="var(--purple-light)"   delay={220} />
            <StatCard label="Your Rank"     value={rankInfo.title} sub={`${player.xp.toLocaleString()} ⭐`} icon="🏅" color="var(--gold)" delay={290} />
            <StatCard label="⭐ XP Earned"  value={`+${xp} ⭐`}                         icon="✨"              color="var(--green)"          delay={360} />
            <StatCard label="Leaderboard"   value={`#${playerLbRank}`} sub={`${category.name} ranking`} icon="📊" color="var(--pink)"        delay={430} />
          </div>
        </section>

        {/* ── CATEGORY LEADERBOARD ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '4px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--gold),var(--orange))' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800 }}>{category.emoji} {category.name} Leaderboard</h3>
            </div>
            <div style={{ padding: '4px 12px', borderRadius: 'var(--r-full)', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.04em' }}>
              YOUR RANK: #{playerLbRank}
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '-8px', marginBottom: '14px' }}>
            Ranked by points earned in {category.name} — XP is shown separately and doesn't affect this ranking.
          </p>

          <div className="glass-card" style={{ padding: '18px 20px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '44px 40px 1fr auto', gap: '12px', padding: '0 4px 10px', borderBottom: '1px solid var(--border)', marginBottom: '10px' }}>
              {['Rank','','Player','🏆 Points'].map((h, i) => (
                <div key={i} style={{ fontSize: '0.63rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: i === 3 ? 'right' : 'left' }}>{h}</div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {topThree.map((entry, i) => <LeaderboardRow key={entry.name + i} entry={entry} index={i} isVisible={rowsVisible} />)}
              {hasSep && <div style={{ textAlign: 'center', padding: '6px 0', color: 'var(--text-muted)', fontSize: '1rem', letterSpacing: '4px', opacity: rowsVisible ? 1 : 0, transition: 'opacity 0.4s ease 300ms' }}>· · ·</div>}
              {aroundRows.map((entry, i) => <LeaderboardRow key={entry.name+'ar'+i} entry={entry} index={topThree.length + (hasSep ? 1 : 0) + i} isVisible={rowsVisible} />)}
            </div>
          </div>
        </section>

        {/* ── BOTTOM BUTTONS ── */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', animation: 'slideInUp 0.5s ease 0.3s both' }}>
          <button className="btn-primary" onClick={handlePlayAgain} style={{ flex: '1 1 200px', fontSize: '1rem', padding: '16px 20px' }}>
            🔄 &nbsp;Restart Game
          </button>
          <button className="btn-secondary" onClick={handleHome} style={{ flex: '1 1 160px', fontSize: '1rem', padding: '16px 20px' }}>
            🏠 &nbsp;Back to Home
          </button>
          <button
            className="btn-ghost"
            onClick={handleOpenShareModal}
            style={{ flex: '1 1 180px', fontSize: '1rem', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            📤 &nbsp;View Summary Card
          </button>
        </div>

      </div>
    </>
  );
}
