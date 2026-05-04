import { useEffect, useRef } from "react";

/**
 * Full-page layered background:
 *  (1) Navy base (2) floating orbs (3) drifting grid
 *  (4) canvas neural network (5) sweeping scanline (6) vignette
 *
 * Fixed-position behind all content. Content sits at z-index 2.
 */
export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const NODE_COUNT = 60;
    const LINK_DIST = 160;
    type Node = { x: number; y: number; vx: number; vy: number; phase: number };
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      phase: Math.random() * Math.PI * 2,
    }));

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);

      const m = mouseRef.current;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        if (m.active) {
          const dx = m.x - n.x;
          const dy = m.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 240 * 240) {
            const f = 0.0006;
            n.vx += dx * f;
            n.vy += dy * f;
          }
        }
        // gentle damping
        n.vx *= 0.995;
        n.vy *= 0.995;
        // keep some baseline drift
        if (Math.abs(n.vx) < 0.05) n.vx += (Math.random() - 0.5) * 0.02;
        if (Math.abs(n.vy) < 0.05) n.vy += (Math.random() - 0.5) * 0.02;
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.35;
            ctx.strokeStyle = `rgba(194,91,58,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.02 + n.phase);
        const alpha = 0.35 + pulse * 0.45;
        ctx.fillStyle = `rgba(217,108,71,${alpha * 0.55})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, backgroundColor: "#0f1722" }}
    >
      {/* Orbs */}
      <div className="cc-orb cc-orb-1" />
      <div className="cc-orb cc-orb-2" />
      <div className="cc-orb cc-orb-3" />

      {/* Drifting grid */}
      <div className="cc-grid" />

      {/* Neural network canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }} />

      {/* Scanline */}
      <div className="cc-scanline" />

      {/* Vignette */}
      <div className="cc-vignette" />
    </div>
  );
}
