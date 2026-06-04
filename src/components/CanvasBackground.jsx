import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

export default function CanvasBackground() {
  const canvasRef = useRef(null);
  const { player } = useGame();
  const particlesRef = useRef([]);
  const animRef = useRef(null);
  const theme = player.settings.darkMode ? 'dark' : 'light';
  const reduced = player.settings.reducedMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const darkColors = ['rgba(124,58,237,0.45)','rgba(6,182,212,0.4)','rgba(245,158,11,0.35)','rgba(236,72,153,0.38)','rgba(16,185,129,0.3)'];
    const lightColors = ['rgba(109,40,217,0.14)','rgba(8,145,178,0.13)','rgba(217,119,6,0.13)','rgba(219,39,119,0.12)'];

    const createParticle = (randomY = false) => {
      const colors = theme === 'dark' ? darkColors : lightColors;
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + 20,
        size: Math.random() * 4.5 + 1.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -(Math.random() * 0.45 + 0.12),
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const createParticles = () => {
      particlesRef.current = Array.from({ length: 55 }, () => createParticle(true));
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = theme === 'dark';

      particlesRef.current.forEach((p, i) => {
        if (!reduced) { p.x += p.speedX; p.y += p.speedY; }
        if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particlesRef.current[i] = createParticle(false);
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        if (isDark && !reduced) {
          ctx.shadowBlur = p.size * 2.5;
          ctx.shadowColor = p.color;
        } else { ctx.shadowBlur = 0; }
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      animRef.current = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [theme, reduced]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
