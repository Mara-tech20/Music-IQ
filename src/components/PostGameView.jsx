import { useEffect, useRef, useState } from 'react';
import { useGame, getRank } from '../context/GameContext';
import { CATEGORIES } from '../data/questions';
import { exportPostGameCard } from '../utils/shareUtils';

// ─── Simulated global leaderboard data ──────────────────────────────────────
function buildLeaderboard(playerName, playerXP, playerCategory) {
  const bots = [
    { name: 'DJ Nova',       xp: 14800, level: 18, category: 'general'   },
    { name: 'BeatLegend',    xp: 12500, level: 15, category: 'hiphop'    },
    { name: 'RhythmQueen',   xp: 11200, level: 14, category: 'pop'       },
    { name: 'AfroKing',      xp: 9600,  level: 12, category: 'afrobeats' },
    { name: 'SoundSurfer',   xp: 8400,  level: 11, category: 'general'   },
    { name: 'MelodyMaestro', xp: 7100,  level: 10, category: 'pop'       },
    { name: 'GrooveMaster',  xp: 5900,  level: 8,  category: 'hiphop'    },
    { name: 'BassDrop',      xp: 4700,  level: 7,  category: 'afrobeats' },
    { name: 'VocalStar',     xp: 3600,  level: 6,  category: 'general'   },
    { name: 'ChartTopper',   xp: 2800,  level: 5,  category: 'pop'       },
    { name: 'TrackStar',     xp: 2100,  level: 4,  category: 'hiphop'    },
    { name: 'NotePerfect',   xp: 1500,  level: 3,  category: 'afrobeats' },
    { name: 'BeatMaker',     xp: 900,   level: 2,  category: 'general'   },
  ];
  const entries = [
    ...bots,
    { name: playerName, xp: playerXP, level: 1, category: playerCategory, isPlayer: true },
  ].sort((a, b) => b.xp - a.xp);
  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

function getInitials(name) {
  const parts = (name || 'MQ').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getMedalEmoji(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiCannon({ count = 45, active }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#7c3aed','#a855f7','#ec4899','#f59e0b','#10b981','#06b6d4','#f97316'][Math.floor(Math.random() * 7)],
      size: 5 + Math.random() * 7,
      duration: 1.8 + Math.random() * 1.6,
      delay: Math.random() * 0.9,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
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

// ─── Daily Chest Reward ────────────────────────────────────────────────────────
function DailyChest({ onClaim, claimed }) {
  const [opening, setOpening] = useState(false);
  const [stars, setStars] = useState([]);
  const [done, setDone] = useState(claimed);

  const handleOpen = () => {
    if (opening || done) return;
    setOpening(true);
    // spawn star particles
    const s = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * 360,
      dist: 50 + Math.random() * 40,
      delay: Math.random() * 0.3,
    }));
    setStars(s);
    setTimeout(() => {
      setDone(true);
      onClaim();
    }, 900);
  };

  if (done) {
    return (
      <div style={{
        padding: '18px 24px', borderRadius: '16px',
        background: 'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(16,185,129,0.08))',
        border: '1px solid rgba(245,158,11,0.3)',
        display: 'flex', alignItems: 'center', gap: '14px',
        animation: 'fadeIn 0.4s ease',
      }}>
        <span style={{ fontSize: '2rem' }}>✅</span>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)', marginBottom: '2px' }}>
            Daily Reward Claimed! +10 ⭐
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Come back tomorrow for another reward
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        🎁 Daily Reward Ready! Tap to open
      </div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Star burst particles */}
        {opening && stars.map(s => (
          <div key={s.id} style={{
            position: 'absolute',
            top: '50%', left: '50%',
            fontSize: '1.1rem',
            animation: `chestStar 0.8s ${s.delay}s ease-out forwards`,
            '--angle': `${s.angle}deg`,
            '--dist': `${s.dist}px`,
            pointerEvents: 'none',
            zIndex: 10,
          }}>⭐</div>
        ))}
        <button
          onClick={handleOpen}
          style={{
            fontSize: '4.5rem', lineHeight: 1,
            background: 'none', border: 'none', cursor: 'pointer',
            filter: 'drop-shadow(0 0 18px rgba(245,158,11,0.8))',
            animation: opening ? 'trophyEntrance 0.5s cubic-bezier(0.34,1.56,0.64,1)' : 'trophyFloat 2s ease-in-out infinite',
            transition: 'filter 0.2s',
            display: 'block',
          }}
          title="Open your daily reward!"
        >
          {opening ? '🎊' : '🎁'}
        </button>
      </div>
      <style>{`
        @keyframes chestStar {
          0%   { transform: translate(-50%,-50%) rotate(var(--angle)) translateX(0) scale(0); opacity:1; }
          60%  { opacity: 1; }
          100% { transform: translate(-50%,-50%) rotate(var(--angle)) translateX(var(--dist)) scale(1.2); opacity:0; }
        }
      `}</style>
    </div>
  );
}

// ─── Leaderboard row ──────────────────────────────────────────────────────────
function LeaderboardRow({ entry, index, isVisible }) {
  const medal = getMedalEmoji(entry.rank);
  const rankInfo = getRank(entry.xp);
  const catInfo = CATEGORIES[entry.category] || CATEGORIES['general'];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '11px 14px', borderRadius: '14px',
      background: entry.isPlayer
        ? 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(168,85,247,0.15))'
        : 'transparent',
      border: `1px solid ${entry.isPlayer ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.06)'}`,
      position: 'relative', overflow: 'hidden',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
      transition: `opacity 0.4s ease ${index * 45}ms, transform 0.4s ease ${index * 45}ms`,
    }}>
      {entry.isPlayer && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg,rgba(124,58,237,0.07),transparent)',
          pointerEvents: 'none',
        }} />
      )}
      {/* Rank */}
      <div style={{
        minWidth: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: entry.rank <= 3 ? '1.25rem' : '0.9rem',
        color: entry.rank === 1 ? '#f59e0b' : entry.rank === 2 ? '#94a3b8' : entry.rank === 3 ? '#cd7c3a' : 'var(--text-muted)',
      }}>
        {medal || `#${entry.rank}`}
      </div>
      {/* Avatar */}
      <div style={{
        width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
        background: entry.isPlayer
          ? 'linear-gradient(135deg,var(--purple),var(--purple-light))'
          : `linear-gradient(135deg,${catInfo.colorA || '#555'},${catInfo.colorB || '#888'})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', color: '#fff',
        boxShadow: entry.isPlayer ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
        border: entry.isPlayer ? '2px solid rgba(168,85,247,0.6)' : '2px solid transparent',
      }}>
        {getInitials(entry.name)}
      </div>
      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem',
            color: entry.isPlayer ? 'var(--purple-light)' : 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{entry.name}</span>
          {entry.isPlayer && (
            <span style={{
              fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.05em',
              background: 'linear-gradient(135deg,var(--purple),var(--purple-light))',
              color: '#fff', borderRadius: '4px', padding: '1px 5px',
            }}>YOU</span>
          )}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>
          {rankInfo.title} · Lv {entry.level}
        </div>
      </div>
      {/* XP */}
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.88rem',
        color: entry.isPlayer ? 'var(--purple-light)' : 'var(--text-secondary)',
        textAlign: 'right', minWidth: '70px',
      }}>
        ⭐ {entry.xp.toLocaleString()}
        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 500 }}>stars</div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay || 0);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      background: 'var(--bg-input)', padding: '16px 14px',
      borderRadius: '16px', border: '1px solid var(--border)',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
      transition: 'opacity 0.45s cubic-bezier(.34,1.56,.64,1), transform 0.45s cubic-bezier(.34,1.56,.64,1)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: color || 'var(--purple)', opacity: 0.6,
      }} />
      <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{icon}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: color || 'var(--text-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px' }}>{sub}</div>}
    </div>
  );
}

// ─── Main PostGameView ────────────────────────────────────────────────────────
export default function PostGameView() {
  const { session, player, navigateTo, startSession, playSFX, claimDailyReward, hasDailyReward } = useGame();
  const [confetti, setConfetti] = useState(false);
  const [rowsVisible, setRowsVisible] = useState(false);
  const [chestClaimed, setChestClaimed] = useState(!hasDailyReward);

  const category  = CATEGORIES[session.category] || CATEGORIES['general'];
  const total     = session.totalAnswered || 0;
  const correct   = session.totalCorrect  || 0;
  const accuracy  = total > 0 ? Math.round((correct / total) * 100) : 0;
  const score     = session.score     || 0;
  const level     = session.highestLevel || 1;
  const xp        = session.xpEarned  || 0;
  const rankInfo  = getRank(player.xp);

  const leaderboard  = buildLeaderboard(player.name, player.xp, session.category);
  const playerEntry  = leaderboard.find(e => e.isPlayer);
  const playerLbRank = playerEntry?.rank || leaderboard.length;

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

  useEffect(() => {
    const t = setTimeout(() => setRowsVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handlePlayAgain = () => { playSFX('click'); startSession(session.category); };
  const handleHome      = () => { playSFX('click'); navigateTo('home'); };

  const handleChestClaim = () => {
    playSFX('win');
    setChestClaimed(true);
    if (claimDailyReward) claimDailyReward();
  };

  // Display rows: top 3 + separator + rows around player
  const topThree    = leaderboard.slice(0, 3);
  const playerIdx   = leaderboard.findIndex(e => e.isPlayer);
  const start       = Math.max(3, playerIdx - 2);
  const end         = Math.min(leaderboard.length, playerIdx + 3);
  const aroundRows  = leaderboard.slice(start, end);
  const hasSep      = start > 3;

  return (
    <>
      <ConfettiCannon active={confetti} />

      <div style={{
        padding: '20px 20px 48px',
        maxWidth: '860px',
        margin: '0 auto',
        animation: 'slideInUp 0.5s cubic-bezier(0.34,1.1,0.64,1)',
        display: 'flex', flexDirection: 'column', gap: '22px',
      }}>

        {/* ── HERO CARD ─────────────────────────────────────────────── */}
        <div className="glass-card" style={{ padding: '36px 32px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
            width: '300px', height: '300px',
            background: category.glow || 'rgba(124,58,237,0.35)',
            filter: 'blur(75px)', borderRadius: '50%', pointerEvents: 'none', opacity: 0.4,
            animation: 'ambientPulse 3s ease-in-out infinite',
          }} />

          {/* category pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', borderRadius: 'var(--r-full)',
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)',
            marginBottom: '20px',
          }}>
            <span>{category.emoji}</span><span>{category.name}</span>
          </div>

          {/* icon */}
          <div style={{
            fontSize: '72px', lineHeight: 1, marginBottom: '16px',
            animation: 'trophyEntrance 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.1s both', display: 'block',
          }}>
            {accuracy >= 75 ? '🏆' : accuracy >= 50 ? '🎧' : '😔'}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,5vw,2.2rem)', fontWeight: 900, marginBottom: '8px',
            background: `linear-gradient(135deg,${feedback.color},#fff)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{feedback.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 28px' }}>
            {feedback.desc}
          </p>

          {/* accuracy bar */}
          <div style={{ marginBottom: '28px', textAlign: 'left', maxWidth: '500px', margin: '0 auto 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '7px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Accuracy</span>
              <span style={{ color: feedback.color }}>{correct}/{total} correct · {accuracy}%</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${accuracy}%`, background: `linear-gradient(90deg,${feedback.color},${feedback.color}aa)` }} />
            </div>
          </div>

          {/* buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={handlePlayAgain}
              style={{ flex: '1 1 180px', maxWidth: '260px', fontSize: '1rem', padding: '15px 20px' }}>
              🔄 &nbsp;Restart Game
            </button>
            <button className="btn-secondary" onClick={handleHome}
              style={{ flex: '1 1 140px', maxWidth: '200px', fontSize: '1rem', padding: '15px 20px' }}>
              🏠 &nbsp;Home
            </button>
            <button 
              className="btn-ghost" 
              onClick={() => {
                playSFX('click');
                exportPostGameCard({
                  playerName: player.name,
                  categoryName: category.name,
                  level,
                  score,
                  accuracy,
                  starsEarned: xp,
                  rankTitle: rankInfo.title
                });
              }}
              style={{ flex: '1 1 180px', maxWidth: '240px', fontSize: '1rem', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              📥 &nbsp;Share Summary Card
            </button>
          </div>
        </div>

        {/* ── DAILY CHEST ────────────────────────────────────────────── */}
        {hasDailyReward !== undefined && (
          <div className="glass-card" style={{
            padding: '24px 28px',
            background: chestClaimed
              ? 'linear-gradient(135deg,rgba(16,185,129,0.07),rgba(245,158,11,0.05))'
              : 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(124,58,237,0.06))',
            border: `1px solid ${chestClaimed ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.35)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '4px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--gold),var(--orange))' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800 }}>Daily Reward</h3>
            </div>
            <DailyChest onClaim={handleChestClaim} claimed={chestClaimed} />
          </div>
        )}

        {/* ── GAME DETAILS — 3×2 grid ──────────────────────────────── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ width: '4px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--purple),var(--purple-light))' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800 }}>Game Details</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <StatCard label="Category"     value={category.shortName || category.name}   icon={category.emoji} color={category.colorA}        delay={80}  />
            <StatCard label="Level Reached" value={`Level ${level}`}                      icon="🎯"             color="var(--cyan)"           delay={150} />
            <StatCard label="Final Score"  value={`${score.toLocaleString()} pts`}        icon="⚡"             color="var(--purple-light)"   delay={220} />
            <StatCard label="Your Rank"    value={rankInfo.title} sub={`${player.xp.toLocaleString()} ⭐`} icon="🏅" color="var(--gold)"    delay={290} />
            <StatCard label="⭐ Earned"    value={`+${xp} ⭐`}                            icon="✨"             color="var(--green)"          delay={360} />
            <StatCard label="Leaderboard"  value={`#${playerLbRank}`} sub="Global ranking" icon="📊"            color="var(--pink)"           delay={430} />
          </div>
        </section>

        {/* ── GLOBAL LEADERBOARD ────────────────────────────────────── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '4px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--gold),var(--orange))' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800 }}>Global Leaderboard</h3>
            </div>
            <div style={{
              padding: '4px 12px', borderRadius: 'var(--r-full)',
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
              fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.04em',
            }}>
              YOUR RANK: #{playerLbRank}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px 20px', overflow: 'hidden' }}>
            {/* header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '44px 40px 1fr auto',
              gap: '12px', padding: '0 4px 10px',
              borderBottom: '1px solid var(--border)', marginBottom: '10px',
            }}>
              {['Rank', '', 'Player', '⭐ Stars'].map((h, i) => (
                <div key={i} style={{
                  fontSize: '0.63rem', fontWeight: 700, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  textAlign: i === 3 ? 'right' : 'left',
                }}>{h}</div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {topThree.map((entry, i) => (
                <LeaderboardRow key={entry.name + i} entry={entry} index={i} isVisible={rowsVisible} />
              ))}

              {hasSep && (
                <div style={{
                  textAlign: 'center', padding: '6px 0',
                  color: 'var(--text-muted)', fontSize: '1rem', letterSpacing: '4px',
                  opacity: rowsVisible ? 1 : 0, transition: 'opacity 0.4s ease 300ms',
                }}>· · ·</div>
              )}

              {aroundRows.map((entry, i) => (
                <LeaderboardRow key={entry.name + 'ar' + i} entry={entry} index={topThree.length + (hasSep ? 1 : 0) + i} isVisible={rowsVisible} />
              ))}
            </div>

            {playerLbRank > topThree.length + aroundRows.length + 1 && (
              <div style={{
                marginTop: '12px', padding: '10px 14px', borderRadius: '12px',
                background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(168,85,247,0.08))',
                border: '1px dashed rgba(168,85,247,0.4)',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '0.82rem', color: 'var(--text-secondary)',
              }}>
                <span style={{ fontSize: '1.1rem' }}>📍</span>
                <span>You are ranked <strong style={{ color: 'var(--purple-light)' }}>#{playerLbRank}</strong> globally. Keep playing to climb!</span>
              </div>
            )}
          </div>
        </section>

        {/* ── BOTTOM BUTTONS ────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', animation: 'slideInUp 0.5s ease 0.3s both' }}>
          <button className="btn-primary" onClick={handlePlayAgain}
            style={{ flex: '1 1 200px', fontSize: '1rem', padding: '16px 20px' }}>
            🔄 &nbsp;Restart Game
          </button>
          <button className="btn-secondary" onClick={handleHome}
            style={{ flex: '1 1 160px', fontSize: '1rem', padding: '16px 20px' }}>
            🏠 &nbsp;Back to Home
          </button>
          <button 
            className="btn-ghost" 
            onClick={() => {
              playSFX('click');
              exportPostGameCard({
                playerName: player.name,
                categoryName: category.name,
                level,
                score,
                accuracy,
                starsEarned: xp,
                rankTitle: rankInfo.title
              });
            }}
            style={{ flex: '1 1 180px', fontSize: '1rem', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            📥 &nbsp;Share Summary Card
          </button>
        </div>

      </div>
    </>
  );
}
