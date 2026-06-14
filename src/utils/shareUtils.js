/**
 * Utility functions to generate shareable cards using HTML5 Canvas.
 * getXxxDataURL  — returns { dataURL, fileName } for preview modals.
 * exportXxx      — triggers an immediate download (calls getXxx internally).
 */

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const CAT_COLORS = {
  'pop':              ['#ec4899', '#f59e0b'],
  'hip hop':          ['#f59e0b', '#ef4444'],
  'r&b':              ['#8b5cf6', '#ec4899'],
  'jazz':             ['#f59e0b', '#d97706'],
  'classical':        ['#06b6d4', '#6366f1'],
  'afrobeats':        ['#10b981', '#f59e0b'],
  'electronic':       ['#06b6d4', '#7c3aed'],
  'artist spotlight': ['#d97706', '#7c3aed'],
  'mj spotlight':     ['#d97706', '#7c3aed'],
};

// ─── Post-Game Summary Card ────────────────────────────────────────────────────

export function getPostGameCardDataURL({ playerName, categoryName, level, score, accuracy, starsEarned, rankTitle, avatarEmoji }) {
  const W = 800, H = 520;
  const scale = 2; // High resolution (retina support)
  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const key = (categoryName || '').toLowerCase();
  const [accentA, accentB] = CAT_COLORS[key] || ['#7c3aed', '#a855f7'];

  // 1. Deep dark background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#060017');
  bgGrad.addColorStop(0.5, '#0d0330');
  bgGrad.addColorStop(1, '#040012');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Category-color ambient glow blobs
  const blob1 = ctx.createRadialGradient(160, 130, 0, 160, 130, 260);
  blob1.addColorStop(0, hexToRgba(accentA, 0.3));
  blob1.addColorStop(1, hexToRgba(accentA, 0));
  ctx.fillStyle = blob1;
  ctx.fillRect(0, 0, W, H);

  const blob2 = ctx.createRadialGradient(640, 390, 0, 640, 390, 300);
  blob2.addColorStop(0, hexToRgba(accentB, 0.22));
  blob2.addColorStop(1, hexToRgba(accentB, 0));
  ctx.fillStyle = blob2;
  ctx.fillRect(0, 0, W, H);

  // 3. Subtle grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.028)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // 4. Outer border with glow
  ctx.shadowColor = accentA;
  ctx.shadowBlur = 22;
  ctx.strokeStyle = hexToRgba(accentA, 0.8);
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 15, W - 30, H - 30);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.strokeRect(22, 22, W - 44, H - 44);

  // 5. Top gradient strip
  const topStrip = ctx.createLinearGradient(0, 0, W, 0);
  topStrip.addColorStop(0, hexToRgba(accentA, 0));
  topStrip.addColorStop(0.3, hexToRgba(accentA, 1));
  topStrip.addColorStop(0.7, hexToRgba(accentB, 1));
  topStrip.addColorStop(1, hexToRgba(accentB, 0));
  ctx.fillStyle = topStrip;
  ctx.fillRect(15, 15, W - 30, 4);

  // 6. Sparkle dots
  [
    {x:712,y:62,r:3},{x:732,y:86,r:2},{x:698,y:108,r:1.5},
    {x:70,y:412,r:2.5},{x:55,y:442,r:1.5},{x:98,y:458,r:3},
    {x:756,y:308,r:2},{x:40,y:210,r:2},{x:750,y:185,r:1.5},
    {x:718,y:130,r:1},{x:62,y:270,r:1.5},
  ].forEach(s => {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.shadowColor = 'rgba(255,255,255,0.9)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;

  // 7. Header row: MUSIC IQ left, emoji right
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = 'bold 12px "Outfit", sans-serif';
  ctx.fillText('MUSIC IQ', 38, 54);
  ctx.textAlign = 'right';
  ctx.font = '24px sans-serif';
  ctx.fillText('🎵', 762, 56);
  ctx.textAlign = 'center';

  // 8. Performance Header (Clean, Modern, No motivating text)
  const banner = '📊  CHALLENGE PERFORMANCE';
  const bannerColor = accentA;

  rrect(ctx, 192, 68, 416, 43, 22);
  ctx.fillStyle = hexToRgba(bannerColor, 0.16);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(bannerColor, 0.65);
  ctx.lineWidth = 1.5;
  rrect(ctx, 192, 68, 416, 43, 22);
  ctx.stroke();

  ctx.shadowColor = bannerColor;
  ctx.shadowBlur = 22;
  ctx.fillStyle = bannerColor;
  ctx.font = 'bold 20px "Outfit", sans-serif';
  ctx.fillText(banner, 400, 95);
  ctx.shadowBlur = 0;

  // 9. Category subtitle
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.font = 'bold 12px "Outfit", sans-serif';
  ctx.fillText((categoryName || '').toUpperCase() + '  ·  CHALLENGE', 400, 128);

  // 10. Huge score number
  ctx.shadowColor = accentA;
  ctx.shadowBlur = 38;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 88px "Outfit", sans-serif';
  ctx.fillText((score || 0).toLocaleString(), 400, 228);
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.font = 'bold 11px "Outfit", sans-serif';
  ctx.fillText('P O I N T S', 400, 248);

  // 11. Three stat cards (Shifted up slightly since star rating is removed)
  const statY = 278, statH = 88, statW = 200, statGap = 20;
  const statStart = (W - (3 * statW + 2 * statGap)) / 2; // = 70

  const stats = [
    { label: 'LEVEL REACHED', val: `LVL ${level || 1}`,        color: '#06b6d4' },
    { label: 'ACCURACY',      val: `${accuracy || 0}%`,         color: '#a855f7' },
    { label: 'XP GAINED',     val: `+${starsEarned || 0} XP`,   color: '#10b981' },
  ];

  stats.forEach((st, i) => {
    const sx = statStart + i * (statW + statGap);
    const cx = sx + statW / 2;

    rrect(ctx, sx, statY, statW, statH, 14);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();
    ctx.strokeStyle = hexToRgba(st.color, 0.4);
    ctx.lineWidth = 1.5;
    rrect(ctx, sx, statY, statW, statH, 14);
    ctx.stroke();

    ctx.shadowColor = st.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = st.color;
    ctx.fillRect(sx + 32, statY, statW - 64, 3);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.font = 'bold 10px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(st.label, cx, statY + 23);

    ctx.shadowColor = st.color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Outfit", sans-serif';
    ctx.fillText(st.val, cx, statY + 60);
    ctx.shadowBlur = 0;
  });

  // 12. Thin divider (Shifted up)
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 395);
  ctx.lineTo(740, 395);
  ctx.stroke();

  // 13. Footer: avatar + name/rank left, tagline right (Shifted up)
  const fY = 440;
  const avX = 336, avR = 22;

  const avGrad = ctx.createLinearGradient(avX - avR, fY - avR, avX + avR, fY + avR);
  avGrad.addColorStop(0, accentA);
  avGrad.addColorStop(1, accentB);
  ctx.beginPath();
  ctx.arc(avX, fY, avR, 0, Math.PI * 2);
  ctx.fillStyle = avGrad;
  ctx.shadowColor = accentA;
  ctx.shadowBlur = 14;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.font = '17px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(avatarEmoji || '🎵', avX, fY + 7);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px "Outfit", sans-serif';
  ctx.fillText(playerName || 'Player', avX + 32, fY - 5);
  ctx.fillStyle = 'rgba(255,255,255,0.42)';
  ctx.font = '11px "Outfit", sans-serif';
  ctx.fillText(rankTitle || '', avX + 32, fY + 11);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.font = 'bold 11px "Outfit", sans-serif';
  ctx.fillText('MUSIC IQ PLAYER CARD', 762, fY + 4);

  const fileName = `music_iq_${(categoryName || 'game').toLowerCase().replace(/\s+/g, '_')}.png`;
  try {
    return { dataURL: canvas.toDataURL('image/png'), fileName };
  } catch (err) {
    console.error('Failed to generate card', err);
    return null;
  }
}

export function exportPostGameCard(params) {
  const result = getPostGameCardDataURL(params);
  if (!result) return;
  const a = document.createElement('a');
  a.href = result.dataURL;
  a.download = result.fileName;
  a.click();
}

// ─── Rank-Up Card ─────────────────────────────────────────────────────────────

export function getRankUpCardDataURL(playerName, oldRank, newRank, totalStars) {
  const W = 800, H = 480;
  const scale = 2; // High resolution
  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // 1. Background
  const grad = ctx.createRadialGradient(400, 240, 60, 400, 240, 480);
  grad.addColorStop(0, '#1e1145');
  grad.addColorStop(1, '#0b051a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // 2. Gold top glow strip
  const topGlow = ctx.createLinearGradient(0, 0, W, 0);
  topGlow.addColorStop(0, 'rgba(245,158,11,0)');
  topGlow.addColorStop(0.5, 'rgba(245,158,11,0.5)');
  topGlow.addColorStop(1, 'rgba(245,158,11,0)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, W, 4);

  // 3. Decorative background emojis
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.font = '110px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎵', 85, 160);
  ctx.fillText('🎶', 715, 370);
  ctx.font = '45px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillText('✨', 660, 115);
  ctx.fillText('✨', 135, 340);

  // 4. Borders
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 18;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.strokeRect(15, 15, W - 30, H - 30);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(124,58,237,0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(24, 24, W - 48, H - 48);

  // 5. MUSIC IQ logo
  ctx.shadowColor = 'rgba(124,58,237,0.9)';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 18px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('M U S I C   I Q', 400, 68);
  ctx.shadowBlur = 0;

  // 6. RANK UP title
  ctx.shadowColor = 'rgba(245,158,11,0.8)';
  ctx.shadowBlur = 24;
  const titleGrad = ctx.createLinearGradient(150, 0, 650, 0);
  titleGrad.addColorStop(0, '#f59e0b');
  titleGrad.addColorStop(0.5, '#fcd34d');
  titleGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = titleGrad;
  ctx.font = '900 46px "Outfit", sans-serif';
  ctx.fillText('🏆  RANK UP!  🏆', 400, 138);
  ctx.shadowBlur = 0;

  // 7. Rank transition
  const arrowY = 228;

  // Old rank pill
  rrect(ctx, 118, arrowY - 28, 204, 56, 28);
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1.5;
  rrect(ctx, 118, arrowY - 28, 204, 56, 28);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = 'bold 13px "Outfit", sans-serif';
  ctx.fillText('FROM', 220, arrowY - 7);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Outfit", sans-serif';
  ctx.fillText(oldRank || 'Rookie', 220, arrowY + 18);

  // Arrow
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('→', 400, arrowY + 14);

  // New rank pill (gold highlighted)
  ctx.shadowColor = 'rgba(245,158,11,0.5)';
  ctx.shadowBlur = 18;
  const newPillGrad = ctx.createLinearGradient(478, arrowY - 28, 682, arrowY + 28);
  newPillGrad.addColorStop(0, 'rgba(245,158,11,0.25)');
  newPillGrad.addColorStop(1, 'rgba(124,58,237,0.25)');
  rrect(ctx, 478, arrowY - 28, 204, 56, 28);
  ctx.fillStyle = newPillGrad;
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  rrect(ctx, 478, arrowY - 28, 204, 56, 28);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = 'bold 13px "Outfit", sans-serif';
  ctx.fillText('NOW', 580, arrowY - 7);
  ctx.shadowColor = 'rgba(245,158,11,0.4)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 20px "Outfit", sans-serif';
  ctx.fillText(newRank || 'Beatmaker', 580, arrowY + 18);
  ctx.shadowBlur = 0;

  // 8. Congratulations + player name
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '14px "Outfit", sans-serif';
  ctx.fillText('CONGRATULATIONS,', 400, 308);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px "Outfit", sans-serif';
  ctx.fillText((playerName || '').toUpperCase(), 400, 344);

  // 9. Stars
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '13px "Outfit", sans-serif';
  ctx.fillText('TOTAL STARS EARNED', 400, 390);
  ctx.fillStyle = '#fcd34d';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 12;
  ctx.font = 'bold 24px "Outfit", sans-serif';
  ctx.fillText(`⭐ ${(totalStars || 0).toLocaleString()} STARS`, 400, 420);
  ctx.shadowBlur = 0;

  // 10. Footer
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = 'italic 12px "Outfit", sans-serif';
  ctx.fillText('Share your achievement! Music IQ', 400, 460);

  const fileName = `music_iq_rankup_${(newRank || 'rank').toLowerCase().replace(/\s+/g, '_')}.png`;
  try {
    return { dataURL: canvas.toDataURL('image/png'), fileName };
  } catch (err) {
    console.error('Failed to generate rank-up card', err);
    return null;
  }
}

export function exportRankUpCard(playerName, oldRank, newRank, totalStars) {
  const result = getRankUpCardDataURL(playerName, oldRank, newRank, totalStars);
  if (!result) return;
  const a = document.createElement('a');
  a.href = result.dataURL;
  a.download = result.fileName;
  a.click();
}
