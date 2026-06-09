/**
 * Utility functions to generate and download shareable cards using HTML5 Canvas.
 */

export function exportRankUpCard(playerName, rankTitle, totalStars) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');

  // 1. Background Gradient
  const grad = ctx.createRadialGradient(400, 225, 50, 400, 225, 450);
  grad.addColorStop(0, '#1e1145');
  grad.addColorStop(1, '#0b051a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 450);

  // 2. Glowing Borders / Frame
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.strokeRect(15, 15, 770, 420);

  ctx.strokeStyle = 'rgba(124, 58, 237, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(25, 25, 750, 400);

  // 3. Subtle background music notes & sparkle emojis
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.font = '100px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎵', 90, 160);
  ctx.fillText('🎶', 710, 360);
  ctx.font = '40px sans-serif';
  ctx.fillText('✨', 650, 110);
  ctx.fillText('✨', 140, 330);

  // 4. Header: MUSIC IQ logo
  ctx.shadowColor = 'rgba(124, 58, 237, 0.8)';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 24px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('M U S I C   I Q', 400, 70);

  // 5. Title
  ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
  ctx.shadowBlur = 20;
  const rankGrad = ctx.createLinearGradient(200, 0, 600, 0);
  rankGrad.addColorStop(0, '#f59e0b');
  rankGrad.addColorStop(0.5, '#ec4899');
  rankGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = rankGrad;
  ctx.font = '900 48px "Outfit", sans-serif';
  ctx.fillText('RANK UP ACHIEVED!', 400, 140);
  ctx.shadowBlur = 0; // reset

  // 6. Player Name
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '300 22px "Outfit", sans-serif';
  ctx.fillText('CONGRATULATIONS TO', 400, 200);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Outfit", sans-serif';
  ctx.fillText(playerName.toUpperCase(), 400, 245);

  // 7. Large Rank Badge Display
  ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 38px "Outfit", sans-serif';
  ctx.fillText(`🏆  ${rankTitle}  🏆`, 400, 315);
  ctx.shadowBlur = 0; // reset

  // 8. Stats footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '15px "Outfit", sans-serif';
  ctx.fillText('TOTAL STARS EARNED', 400, 375);

  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 26px "Outfit", sans-serif';
  ctx.fillText(`⭐ ${totalStars.toLocaleString()} STARS`, 400, 405);

  // Download trigger
  try {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `music_iq_rankup_${rankTitle.toLowerCase().replace(/\s+/g, '_')}.png`;
    a.click();
  } catch (err) {
    console.error('Failed to export card image', err);
  }
}

export function exportPostGameCard({ playerName, categoryName, level, score, accuracy, starsEarned, rankTitle }) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');

  // 1. Background Gradient
  const grad = ctx.createRadialGradient(400, 225, 50, 400, 225, 450);
  grad.addColorStop(0, '#130d2b');
  grad.addColorStop(1, '#070412');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 450);

  // 2. Borders
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 6;
  ctx.strokeRect(15, 15, 770, 420);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.strokeRect(25, 25, 750, 400);

  // 3. Decorative notes / backgrounds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.font = '120px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏆', 90, 170);
  ctx.fillText('⚡', 710, 370);

  // 4. Logo / Top Title
  ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 20px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('M U S I C   I Q   -   G A M E   S U M M A R Y', 400, 60);
  ctx.shadowBlur = 0;

  // 5. Category Title & Feedback
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 32px "Outfit", sans-serif';
  ctx.fillText(categoryName.toUpperCase() + ' CHALLENGE', 400, 110);

  // Feedback Text
  let feedback = 'Outstanding!';
  let feedbackColor = '#a855f7';
  if (accuracy >= 90) { feedback = 'Flawless Victory! 🏆'; feedbackColor = '#f59e0b'; }
  else if (accuracy >= 75) { feedback = 'Outstanding Run! 🌟'; feedbackColor = '#a855f7'; }
  else if (accuracy >= 50) { feedback = 'On Key! 🎧'; feedbackColor = '#06b6d4'; }
  else { feedback = 'Practice Makes Perfect! 😔'; feedbackColor = '#ef4444'; }

  ctx.fillStyle = feedbackColor;
  ctx.font = 'bold 22px "Outfit", sans-serif';
  ctx.fillText(feedback, 400, 145);

  // 6. Stats Grid
  const cardW = 160;
  const cardH = 100;
  const cardY = 180;
  const gap = 20;
  const startX = 400 - (2 * cardW + 1.5 * gap); // center them

  const stats = [
    { label: 'SCORE', val: `${score.toLocaleString()}`, unit: 'pts', color: '#a855f7' },
    { label: 'ACCURACY', val: `${accuracy}%`, unit: 'accuracy', color: feedbackColor },
    { label: 'LEVEL REACHED', val: `Lvl ${level}`, unit: '', color: '#06b6d4' },
    { label: 'STARS EARNED', val: `+${starsEarned}`, unit: 'stars', color: '#10b981' }
  ];

  stats.forEach((stat, i) => {
    const x = startX + i * (cardW + gap);
    
    // Draw Box background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, cardY, cardW, cardH, 12);
    } else {
      ctx.rect(x, cardY, cardW, cardH);
    }
    ctx.fill();
    ctx.stroke();

    // Box top color line
    ctx.fillStyle = stat.color;
    ctx.fillRect(x + 20, cardY, cardW - 40, 2.5);

    // Box text label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 11px "Outfit", sans-serif';
    ctx.fillText(stat.label, x + cardW/2, cardY + 28);

    // Box text value
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Outfit", sans-serif';
    ctx.fillText(stat.val, x + cardW/2, cardY + 58);

    // Box text sub
    if (stat.unit) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '10px "Outfit", sans-serif';
      ctx.fillText(stat.unit, x + cardW/2, cardY + 80);
    }
  });

  // 7. Player profile footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '15px "Outfit", sans-serif';
  ctx.fillText(`PLAYER: ${playerName.toUpperCase()}   |   CURRENT RANK: ${rankTitle.toUpperCase()}`, 400, 345);

  // 8. Footer tagline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = 'italic 13px "Outfit", sans-serif';
  ctx.fillText('Show off your Music IQ! Join the music challenge today.', 400, 395);

  // Download
  try {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `music_iq_summary_${categoryName.toLowerCase().replace(/\s+/g, '_')}.png`;
    a.click();
  } catch (err) {
    console.error('Failed to export card image', err);
  }
}
