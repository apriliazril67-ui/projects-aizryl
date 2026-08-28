import { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext.jsx';
import '../styles/galaxy.css';

// Signature ambient layer: canvas starfield + drifting particles behind
// translucent nebula blobs. Pure CSS/canvas, no external images.
export default function GalaxyBackground() {
  const canvasRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.animations) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let width, height, dpr;
    let stars = [];
    let particles = [];

    const STAR_COUNT = 160;
    const PARTICLE_COUNT = 34;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.25,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2
      }));

      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.8 + 0.6,
        hue: Math.random() > 0.5 ? '57,246,255' : '139,92,246'
      }));
    }

    function tick(t) {
      ctx.clearRect(0, 0, width, height);

      // stars twinkle
      for (const s of stars) {
        const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,247,255,${Math.max(0, alpha)})`;
        ctx.fill();
      }

      // drifting glow particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grad.addColorStop(0, `rgba(${p.hue},0.55)`);
        grad.addColorStop(1, `rgba(${p.hue},0)`);
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    resize();
    init();
    raf = requestAnimationFrame(tick);

    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [settings.animations]);

  return (
    <div className="galaxy-bg" aria-hidden="true">
      {settings.animations && (
        <>
          <div className="nebula-blob n1" />
          <div className="nebula-blob n2" />
          <div className="nebula-blob n3" />
        </>
      )}
      <canvas ref={canvasRef} />
    </div>
  );
          }
