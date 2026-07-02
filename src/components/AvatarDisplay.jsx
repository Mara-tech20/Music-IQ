// ─── Avatar display helper ────────────────────────────────────────────────────
// Shared between the Profile page, Home dashboard, and anywhere else a
// player's avatar (image, emoji, or initials fallback) needs to render.
export default function AvatarDisplay({ avatar, initials, size = 110, fontSize = '2.6rem' }) {
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
