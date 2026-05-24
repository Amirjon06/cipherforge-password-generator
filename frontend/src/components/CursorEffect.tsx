import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  decay: number;
}

export default function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let mx = 0, my = 0;
    let pmx = 0, pmy = 0;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      pmx = mx;
      pmy = my;
      mx = e.clientX;
      my = e.clientY;

      // Don't spawn particles over panels or interactive elements
      const target = e.target as HTMLElement;
      const isOverPanel = target.closest("button, input, textarea, a, [data-nofx]");
      if (isOverPanel) return;

      const speed = Math.hypot(mx - pmx, my - pmy);
      const count = Math.min(Math.floor(speed * 0.5), 6);

      for (let i = 0; i < count; i++) {
        particles.push({
          x: mx,
          y: my,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 - Math.random() * 1.5,
          alpha: 0.8 + Math.random() * 0.2,
          size: Math.random() * 3 + 1,
          decay: Math.random() * 0.025 + 0.01,
        });
      }
    };

    window.addEventListener("mousemove", onMove);

    document.body.style.userSelect = "none";

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.alpha -= p.decay;
        p.size *= 0.96;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `rgba(0, 255, 70, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#00ff46";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.body.style.userSelect = "";
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}