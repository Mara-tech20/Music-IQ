import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/questions';

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: '12px',
  background: 'var(--bg-input)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', fontSize: '1rem', outline: 'none',
  fontFamily: 'var(--font-body)',
  transition: 'border-color 0.2s',
};

export default function ProfileView() {
  const { player, rank, xpProgress, initials, saveName, badges } = useGame();

  // Edit profile state
  const [nameInput, setNameInput]     = useState(player.name);
  const [nameSaved, setNameSaved]     = useState(false);

  // Password change state (UI-only, no real auth backend)
  const [curPw,  setCurPw]  = useState('');
  const [newPw,  setNewPw]  = useState('');
  const [confPw, setConfPw] = useState('');
  const [pwMsg,  setPwMsg]  = useState(null); // { text, ok }

  const [showNameModal, setShowNameModal] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);

  const getAccuracyColor = (acc) => {
    if (acc >= 80) return 'var(--green)';
    if (acc >= 50) return 'var(--gold)';
    return 'var(--red)';
  };

  const accuracy = player.totalQuestions > 0
    ? Math.round((player.totalCorrect / player.totalQuestions) * 100) : 0;

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    saveName(nameInput.trim());
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2500);
  };

  const handleChangePassword = () => {
    // Validate (simulated — no real backend)
    if (!curPw) { setPwMsg({ text: 'Please enter your current password.', ok: false }); return; }
    if (newPw.length < 6) { setPwMsg({ text: 'New password must be at least 6 characters.', ok: false }); return; }
    if (newPw !== confPw) { setPwMsg({ text: 'New passwords do not match.', ok: false }); return; }

    // Simulate success (in production you'd call your auth service here)
    setPwMsg({ text: 'Password updated successfully! ✓', ok: true });
    setCurPw(''); setNewPw(''); setConfPw('');
    setTimeout(() => setPwMsg(null), 3000);
  };

  const SectionTitle = ({ icon, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <div style={{ width: '4px', height: '22px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--purple),var(--purple-light))' }} />
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800 }}>
        {icon} {label}
      </h3>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.4s ease', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── HERO CARD ─────────────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: '36px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
        {/* glow */}
        <div style={{
          position: 'absolute', top: '-40%', left: '-10%',
          width: '260px', height: '260px',
          background: 'rgba(124,58,237,0.25)', filter: 'blur(70px)', borderRadius: '50%', pointerEvents: 'none',
          animation: 'ambientPulse 4s ease-in-out infinite',
        }} />

        <div style={{
          width: '110px', height: '110px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,var(--purple),var(--purple-light))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.6rem', fontWeight: 900, color: '#fff',
          boxShadow: '0 0 40px rgba(124,58,237,0.45)', position: 'relative',
          animation: 'rankBadgePulse 3s ease-in-out infinite',
        }}>
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '6px', fontFamily: 'var(--font-display)' }}>{player.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-secondary)', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>{rank.title}</span>
            <span>•</span>
            <span>Joined {new Date(player.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '7px', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-secondary)' }}>⭐ {player.xp.toLocaleString()} stars</span>
              <span style={{ color: 'var(--text-muted)' }}>Next Rank Progress</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK STATS ───────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '16px' }}>
        {[
          { label: 'Games Played',     value: player.gamesPlayed,  color: 'var(--cyan)',         icon: '🎮' },
          { label: 'Accuracy',         value: `${accuracy}%`,      color: getAccuracyColor(accuracy), icon: '🎯' },
          { label: 'Levels Conquered', value: player.levelsWon,    color: 'var(--purple-light)', icon: '🏆' },
          { label: 'Best Streak',      value: `${player.bestStreak} 🔥`, color: 'var(--orange)', icon: '📅' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px', background: s.color, opacity: 0.5 }} />
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: s.color, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
          </div>
        ))}
      </div>
      
      {/* ── MUSIC BADGES & ACHIEVEMENTS ───────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '22px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--gold),var(--orange))' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800 }}>Genre & Artist Badges</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '14px' }}>
          {badges.map(b => (
            <div 
              key={b.id} 
              className="glass-card" 
              style={{ 
                padding: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                position: 'relative', 
                overflow: 'hidden',
                opacity: b.unlocked ? 1 : 0.55,
                filter: b.unlocked ? 'none' : 'grayscale(80%)',
                border: b.unlocked ? `1px solid ${b.color}88` : '1px solid var(--border)',
                boxShadow: b.unlocked ? `0 0 20px ${b.color}25` : 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={e => {
                if (b.unlocked) {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 24px ${b.color}40`;
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = b.unlocked ? `0 0 20px ${b.color}25` : 'none';
              }}
            >
              {/* background subtle glow */}
              {b.unlocked && (
                <div style={{
                  position: 'absolute', top: '-20px', left: '-20px',
                  width: '80px', height: '80px', background: b.color,
                  filter: 'blur(30px)', borderRadius: '50%', pointerEvents: 'none', opacity: 0.3
                }} />
              )}
              
              <div style={{ 
                fontSize: '2.5rem', 
                animation: b.unlocked ? 'floatUp 4s ease-in-out infinite alternate' : 'none',
                filter: b.unlocked ? `drop-shadow(0 0 10px ${b.color})` : 'none'
              }}>
                {b.emoji}
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  fontSize: '1.05rem', 
                  fontWeight: 800, 
                  color: b.unlocked ? b.color : 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  marginBottom: '4px'
                }}>
                  {b.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: '6px' }}>
                  {b.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    background: b.unlocked ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                    color: b.unlocked ? 'var(--green)' : 'var(--text-muted)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {b.unlocked ? 'Unlocked ✓' : 'Locked'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {b.unlocked ? 'Completed!' : b.current}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ACCOUNT ACTIONS CARDS ─────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Name edit card */}
        <div 
          className="glass-card"
          onClick={() => { setShowNameModal(true); setNameInput(player.name); }}
          style={{
            padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--purple-light)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '1.8rem' }}>✏️</div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Update Profile Name</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Change your display name visible across leaderboards</p>
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>➔</div>
        </div>

        {/* Password edit card */}
        <div 
          className="glass-card"
          onClick={() => setShowPwModal(true)}
          style={{
            padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
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
      </div>

      {/* ── LOCAL MODAL: NAME EDIT ── */}
      {showNameModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          animation: 'modalOverlayIn 0.3s ease'
        }}>
          <div className="glass-card" style={{
            width: '90%', maxWidth: '440px', padding: '32px 28px',
            animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>✏️ Update Profile Name</h3>
              <button onClick={() => { setShowNameModal(false); setNameSaved(false); }} style={{ fontSize: '1.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Display Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Enter display name"
                style={inputStyle}
                onFocus={e  => e.target.style.borderColor = 'var(--border-focus)'}
                onBlur={e   => e.target.style.borderColor = 'var(--border)'}
              />
              {nameSaved && (
                <div style={{ color: 'var(--green)', fontSize: '0.84rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  ✓ Display name updated!
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setShowNameModal(false); setNameSaved(false); }}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSaveName}>Save Name</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOCAL MODAL: CHANGE PASSWORD ── */}
      {showPwModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          animation: 'modalOverlayIn 0.3s ease'
        }}>
          <div className="glass-card" style={{
            width: '90%', maxWidth: '460px', padding: '32px 28px',
            animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>🔐 Change Password</h3>
              <button onClick={() => { setShowPwModal(false); setPwMsg(null); }} style={{ fontSize: '1.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Current Password</label>
                <input
                  type="password" value={curPw} onChange={e => setCurPw(e.target.value)}
                  placeholder="Enter current password"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>New Password</label>
                <input
                  type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Confirm New Password</label>
                <input
                  type="password" value={confPw} onChange={e => setConfPw(e.target.value)}
                  placeholder="Re-enter new password"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {pwMsg && (
                <div style={{
                  padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600,
                  background: pwMsg.ok ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                  border: `1px solid ${pwMsg.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  color: pwMsg.ok ? 'var(--green)' : 'var(--red)',
                  animation: 'fadeIn 0.3s ease',
                }}>
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

      {/* ── CATEGORY BREAKDOWN ────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '22px', borderRadius: '2px', background: 'linear-gradient(to bottom,var(--gold),var(--orange))' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800 }}>Category Breakdown</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))', gap: '14px' }}>
          {Object.entries(player.categoryStats).map(([catId, stats]) => {
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

    </div>
  );
}
