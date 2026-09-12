"use client";

import { useRef, useEffect } from "react";

export function ChatThinkingSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = 56, H = 56;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    const cx = W / 2, cy = H / 2;
    const baseR = 18;
    const dotCount = 420;
    const dots: { x: number; y: number; z: number; phi: number; theta: number }[] = [];
    const golden = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < dotCount; i++) {
      const theta = (2 * Math.PI * i) / golden;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / dotCount);
      dots.push({ x: Math.sin(phi) * Math.cos(theta), y: Math.sin(phi) * Math.sin(theta), z: Math.cos(phi), phi, theta });
    }
    const t0 = performance.now();
    const render = (now: number) => {
      const t = (now - t0) * 0.001;
      ctx.clearRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(cx, cy, baseR * 0.45, cx, cy, baseR * 1.45);
      glow.addColorStop(0, "rgba(56,189,248,0.16)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 1.45, 0, Math.PI * 2);
      ctx.fill();
      const amp = 0.12 + Math.sin(t * 0.85) * 0.022 + Math.cos(t * 0.55) * 0.015;
      const speed = 0.68;
      const projected = dots.map((d) => {
        const w1 = Math.sin(d.phi * 2.0 + t * speed * 1.05) * amp;
        const w2 = Math.cos(d.theta * 1.65 - t * speed * 0.8) * amp * 0.48;
        const rFactor = 1 + w1 * 0.68 + w2 * 0.34;
        let x = d.x * baseR * rFactor, y = d.y * baseR * rFactor, z = d.z * baseR * rFactor;
        const rotY = t * speed * 0.32, rotX = Math.sin(t * 0.28) * 0.09;
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY), cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        let nx = x * cosY - z * sinY, nz = x * sinY + z * cosY, ny = y * cosX - nz * sinX;
        nz = y * sinX + nz * cosX; x = nx; y = ny; z = nz;
        const persp = 110, scale = persp / (persp - z), x2 = cx + x * scale, y2 = cy + y * scale;
        const size = Math.max(0.45, 0.95 * scale);
        const depth = (z + baseR) / (baseR * 2);
        const alpha = 0.38 + depth * 0.62;
        const yNorm = (y / baseR + 1) / 2;
        let r, g, b;
        if (yNorm < 0.5) { const tt = yNorm / 0.5; r = 56 + (59 - 56) * tt; g = 189 + (130 - 189) * tt; b = 248 + (246 - 248) * tt; }
        else { const tt = (yNorm - 0.5) / 0.5; r = 59 + (168 - 59) * tt; g = 130 + (85 - 130) * tt; b = 246 + (247 - 246) * tt; }
        if (depth > 0.75) { const h = (depth - 0.75) / 0.25; r = r + (255 - r) * h * 0.28; g = g + (255 - g) * h * 0.28; b = b + (255 - b) * h * 0.28; }
        return { x2, y2, size, alpha, r, g, b, depth };
      });
      projected.sort((a, b) =>a.depth - b.depth);
      for (const p of projected) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},${p.alpha})`;
        if (p.depth > 0.82) { ctx.shadowColor = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},0.42)`; ctx.shadowBlur = 3.2; } else ctx.shadowBlur = 0;
        ctx.arc(p.x2, p.y2, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () =>cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="block select-none"style={{ width: 56, height: 56, filter: "contrast(1.06) saturate(1.08)" }} />;
}
export { ChatThinkingSphere as ThinkingSphere };