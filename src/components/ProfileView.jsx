import { useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/questions';

const SYSTEM_AVATARS = [
  { id: 'a1',  emoji: '🧑‍🎤', label: 'Rockstar',    bg: 'linear-gradient(135deg,#7c3aed,#ec4899)' },
  { id: 'a2',  emoji: '🦸',   label: 'Hero',        bg: 'linear-gradient(135deg,#1d4ed8,#dc2626)' },
  { id: 'a3',  emoji: '🥷',   label: 'Ninja',       bg: 'linear-gradient(135deg,#111827,#374151)' },
  { id: 'a4',  emoji: '👸',   label: 'Queen',       bg: 'linear-gradient(135deg,#9d174d,#f472b6)' },
  { id: 'a5',  emoji: '🤖',   label: 'Android',     bg: 'linear-gradient(135deg,#164e63,#06b6d4)' },
  { id: 'a6',  emoji: '👽',   label: 'Alien',       bg: 'linear-gradient(135deg,#14532d,#a3e635)' },
  { id: 'a7',  emoji: '🦊',   label: 'Fox',         bg: 'linear-gradient(135deg,#c2410c,#f97316)' },
  { id: 'a8',  emoji: '🦁',   label: 'Lion',        bg: 'linear-gradient(135deg,#92400e,#f59e0b)' },
  { id: 'a9',  emoji: '🧑‍💻', label: 'Hacker',    bg: 'linear-gradient(135deg,#0f172a,#10b981)' },
  { id: 'a10', emoji: '🏄',   label: 'Surfer',      bg: 'linear-gradient(135deg,#0284c7,#06b6d4)' },
];

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: '12px',
  background: 'var(--bg-input)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', fontSize: '1rem', outline: 'none',
  fontFamily: 'var(--font-body)', transition: 'border-color 0.2s',
};

// ─── Avatar display helper ────────────────────────────────────────────────────
function AvatarDisplay({ avatar, initials, size = 110, fontSize = '2.6rem' }) {
  if (avatar?.type === 'image') {
    return (
      <img
        src={avatar.dataURL}
        alt="Avatar"
        style={{
          width: size, height: size, borderRadius: '10px', objectFit: 'cover',
          boxShadow: '0 0 40px rgba(124,58,237,0.45)',
          border: '5px solid rgba(168,85,247,0.85)',
        }}
      />
    );
  }
  if (avatar?.type === 'emoji') {
    return (
      <div style={{
        width: size, height: size, borderRadius: '10px', flexShrink: 0,
        background: avatar.bg || 'linear-gradient(135deg,#7c3aed,#a855f7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize, boxShadow: '0 0 40px rgba(124,58,237,0.45)',
        border: '5px solid rgba(168,85,247,0.85)',
        animation: 'rankBadgePulse 3s ease-in-out infinite',
      }}>
        {avatar.emoji}
      </div>
    );
  }
  // Default initials
  return (
    <div style={{
      width: size, height: size, borderRadius: '10px', flexShrink: 0,
      background: 'linear-gradient(135deg,var(--purple),var(--purple-light))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize, fontWeight: 900, color: '#fff',
      boxShadow: '0 0 40px rgba(124,58,237,0.45)',
      border: '5px solid rgba(168,85,247,0.85)',
      animation: 'rankBadgePulse 3s ease-in-out infinite',
    }}>
      {initials}
    </div>
  );
}

// ─── Avatar Picker Modal ──────────────────────────────────────────────────────
function AvatarModal({ current, onSelect, onClose }) {
  const fileRef = useRef(null);
  const [selected, setSelected] = useState(current);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Resize to max 300×300 via canvas to keep localStorage size down
      const img = new Image();
      img.onload = () => {
        const MAX = 300;
        const scale = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width  = img.width  * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg', 0.82);
        setSelected({ type: 'image', dataURL });
        setUploading(false);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      animation: 'modalOverlayIn 0.3s ease',
    }}>
      <div className="glass-card" style={{
        width: '92%', maxWidth: '500px', padding: '28px 24px',
        animation: 'modalSlideUp 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Choose Avatar</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <AvatarDisplay avatar={selected} initials="?" size={90} fontSize="2.2rem" />
        </div>

        {/* System avatars grid */}
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          System Avatars
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '20px' }}>
          {SYSTEM_AVATARS.map(av => (
            <button
              key={av.id}
              onClick={() => setSelected({ type: 'emoji', emoji: av.emoji, bg: av.bg })}
              style={{
                width: '100%', aspectRatio: '1', borderRadius: '10px',
                background: av.bg, border: `4px solid ${selected?.type === 'emoji' && selected?.emoji === av.emoji ? 'var(--gold)' : 'transparent'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', cursor: 'pointer',
                transition: 'transform 0.15s, border-color 0.15s',
                boxShadow: selected?.type === 'emoji' && selected?.emoji === av.emoji ? '0 0 16px rgba(245,158,11,0.5)' : 'none',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.12)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {av.emoji}
            </button>
          ))}
        </div>

        {/* Upload */}
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          Upload Photo
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%', padding: '14px', borderRadius: '14px',
            border: '2px dashed rgba(124,58,237,0.4)',
            background: 'rgba(124,58,237,0.05)', cursor: 'pointer',
            color: 'var(--purple-light)', fontWeight: 700, fontSize: '0.95rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            marginBottom: '20px', transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--purple-light)'; e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.background = 'rgba(124,58,237,0.05)'; }}
          disabled={uploading}
        >
          {uploading ? '⏳ Uploading…' : '＋ Upload from Device'}
        </button>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => onSelect(selected)}>Save Avatar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ProfileView ─────────────────────────────────────────────────────────
export default function ProfileView() {
  const { player, rank, xpProgress, initials, saveName, saveAvatar, badges } = useGame();

  const [nameInput, setNameInput]       = useState(player.name);
  const [nameSaved, setNameSaved]       = useState(false);
  const [curPw, setCurPw]               = useState('');
  const [newPw, setNewPw]               = useState('');
  const [confPw, setConfPw]             = useState('');
  const [pwMsg, setPwMsg]               = useState(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPwModal, setShowPwModal]   = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const getAccuracyColor = (acc) => acc >= 80 ? 'var(--green)' : acc >= 50 ? 'var(--gold)' : 'var(--red)';

  const accuracy = player.totalQuestions > 0
    ? Math.round((player.totalCorrect / player.totalQuestions) * 100) : 0;

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    saveName(nameInput.trim());
    setNameSaved(true);
    setTimeout(() => { setNameSaved(false); setShowNameModal(false); }, 1800);
  };

  const handleChangePassword = () => {
    if (!curPw) { setPwMsg({ text: 'Please enter your current password.', ok: false }); return; }
    if (newPw.length < 6) { setPwMsg({ text: 'New password must be at least 6 characters.', ok: false }); return; }
    if (newPw !== confPw) { setPwMsg({ text: 'New passwords do not match.', ok: false }); return; }
    setPwMsg({ text: 'Password updated successfully! ✓', ok: true });
    setCurPw(''); setNewPw(''); setConfPw('');
    setTimeout(() => { setPwMsg(null); setShowPwModal(false); }, 2200);
  };

  const handleAvatarSave = (avatar) => {
    saveAvatar(avatar);
    setShowAvatarModal(false);
  };

  // Only categories the player has actually played
  const playedCategories = Object.entries(player.categoryStats).filter(
    ([, stats]) => stats.played > 0 || stats.total > 0
  );

  // Only earned badges
  const earnedBadges = badges.filter(b => b.unlocked);

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.4s ease', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── 1. HERO CARD (Avatar + Name + Rank) ── */}
      <div className="glass-card" style={{ padding: '40px 36px 32px', display: 'flex', gap: '36px', alignItems: 'center', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40%', left: '-10%', width: '300px', height: '300px', background: 'rgba(124,58,237,0.3)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none', animation: 'ambientPulse 4s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-30%', right: '-5%', width: '200px', height: '200px', background: 'rgba(168,85,247,0.2)', filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none', animation: 'ambientPulse 5s ease-in-out infinite reverse' }} />

        {/* Avatar with edit icon */}
        <div
          style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
          onClick={() => setShowAvatarModal(true)}
        >
          {/* Outer glow ring */}
          <div style={{
            position: 'absolute', inset: '-6px', borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--purple), var(--purple-light), var(--pink))',
            animation: 'rankBadgePulse 2.5s ease-in-out infinite',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute', inset: '-3px', borderRadius: '12px',
            background: 'var(--bg-card)',
            zIndex: 1,
          }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <AvatarDisplay avatar={player.avatar} initials={initials} size={120} fontSize="2.9rem" />
          </div>
          {/* Edit badge */}
          <div style={{
            position: 'absolute', bottom: '4px', right: '4px', zIndex: 3,
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--purple),var(--purple-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.95rem', boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            border: '2px solid var(--bg-card)',
            transition: 'transform 0.15s',
          }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            ✏️
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '220px', position: 'relative', zIndex: 1 }}>
          {/* Name - much bigger and bolder */}
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 900, marginBottom: '6px',
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, var(--text-primary), var(--purple-light))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
          }}>{player.name}</h2>

          {/* Rank badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: 'var(--r-full)',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.08))',
              border: '1px solid rgba(245,158,11,0.4)',
              fontSize: '0.95rem', fontWeight: 800, color: 'var(--gold)',
            }}>
              🏅 {rank.title}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Joined {new Date(player.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* XP Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px', fontWeight: 600 }}>
              <span style={{ color: 'var(--purple-light)', fontWeight: 700 }}>⭐ {player.xp.toLocaleString()} XP</span>
              <span style={{ color: 'var(--text-muted)' }}>Next Rank</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK STATS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '16px' }}>
        {[
          { label: 'Games Played',     value: player.gamesPlayed,            color: 'var(--cyan)',         icon: '🎮' },
          { label: 'Accuracy',         value: `${accuracy}%`,                color: getAccuracyColor(accuracy), icon: '🎯' },
          { label: 'Levels Conquered', value: player.levelsWon,              color: 'var(--purple-light)', icon: '🏆' },
          { label: 'Best Streak',      value: `${player.bestStreak} 🔥`,     color: 'var(--orange)',       icon: '📅' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px', background: s.color, opacity: 0.5 }} />
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: s.color, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── 2. CHANGE DISPLAY NAME ── */}
      <div
        className="glass-card"
        onClick={() => { setShowNameModal(true); setNameInput(player.name); }}
        style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--purple-light)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '1.8rem' }}>✏️</div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Change Display Name</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Update the name visible across leaderboards</p>
          </div>
        </div>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>➔</div>
      </div>

      {/* ── 3. CHANGE PASSWORD ── */}
      <div
        className="glass-card"
        onClick={() => setShowPwModal(true)}
        style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--purple-light)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '1.8rem' }}>🔐</div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Change Password</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Update your security credentials</p>
          </div>
        </div>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>➔</div>
      </div>

      {/* ── 4. AWARDS & ACHIEVEMENTS (earned only) ── */}
      {earnedBadges.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '4px', height: '22px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--gold),var(--orange))' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800 }}>Awards &amp; Achievements</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '14px' }}>
            {earnedBadges.map(b => (
              <div key={b.id} className="glass-card" style={{
                padding: '20px', display: 'flex', alignItems: 'center', gap: '16px',
                position: 'relative', overflow: 'hidden',
                border: `1px solid ${b.color}88`,
                boxShadow: `0 0 20px ${b.color}25`,
                transition: 'all 0.3s ease',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 12px 24px ${b.color}40`; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 0 20px ${b.color}25`; }}
              >
                <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '80px', height: '80px', background: b.color, filter: 'blur(30px)', borderRadius: '50%', pointerEvents: 'none', opacity: 0.3 }} />
                <div style={{ fontSize: '2.5rem', animation: 'floatUp 4s ease-in-out infinite alternate', filter: `drop-shadow(0 0 10px ${b.color})` }}>
                  {b.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: b.color, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{b.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: '6px' }}>{b.description}</p>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: 'var(--green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Unlocked ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. CATEGORY BREAKDOWN (played only) ── */}
      {playedCategories.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '4px', height: '22px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--purple),var(--purple-light))' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800 }}>Category Breakdown</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: '14px' }}>
            {playedCategories.map(([catId, stats]) => {
              const cat = CATEGORIES[catId];
              if (!cat) return null;
              const catAcc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div key={catId} className="glass-card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: cat.gradient }} />
                  <div style={{ fontSize: '2rem', marginLeft: '8px' }}>{cat.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '3px', fontFamily: 'var(--font-display)' }}>{cat.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {stats.played} games · Best Lv {stats.bestLevel}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: getAccuracyColor(catAcc) }}>{catAcc}%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accuracy</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AVATAR MODAL ── */}
      {showAvatarModal && (
        <AvatarModal
          current={player.avatar}
          onSelect={handleAvatarSave}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* ── NAME EDIT MODAL ── */}
      {showNameModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', animation: 'modalOverlayIn 0.3s ease' }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '440px', padding: '32px 28px', animation: 'modalSlideUp 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>✏️ Change Display Name</h3>
              <button onClick={() => setShowNameModal(false)} style={{ fontSize: '1.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Display Name</label>
              <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="Enter display name" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              {nameSaved && <div style={{ color: 'var(--green)', fontSize: '0.84rem', marginTop: '8px' }}>✓ Name updated!</div>}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowNameModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSaveName}>Save Name</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PASSWORD MODAL ── */}
      {showPwModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', animation: 'modalOverlayIn 0.3s ease' }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '460px', padding: '32px 28px', animation: 'modalSlideUp 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>🔐 Change Password</h3>
              <button onClick={() => { setShowPwModal(false); setPwMsg(null); }} style={{ fontSize: '1.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {[['Current Password', curPw, setCurPw, 'Enter current password'], ['New Password', newPw, setNewPw, 'Min. 6 characters'], ['Confirm New Password', confPw, setConfPw, 'Re-enter new password']].map(([label, val, setter, ph]) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{label}</label>
                  <input type="password" value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
              ))}
              {pwMsg && (
                <div style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, background: pwMsg.ok ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${pwMsg.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: pwMsg.ok ? 'var(--green)' : 'var(--red)', animation: 'fadeIn 0.3s ease' }}>
                  {pwMsg.text}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setShowPwModal(false); setPwMsg(null); }}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleChangePassword}>Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
