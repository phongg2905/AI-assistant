"use client";

import { useRef, useEffect } from "react";

export function ChatAvatarSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = 72, H = 72;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    const cx = W / 2, cy = H / 2;
    const baseR = 16.5;
    const dotCount = 380;
    const dots: { x: number; y: number; z: number; phi: number; theta: number }[] = [];
    const golden = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < dotCount; i++) {
      const theta = (2 * Math.PI * i) / golden;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / dotCount);
      dots.push({ x: Math.sin(phi) * Math.cos(theta), y: Math.sin(phi) * Math.sin(theta), z: Math.cos(phi), phi, theta });
    }
    const t0 = performance.now();
    let smooth = 0;
    const render = (now: number) => {
      const t = (now - t0) * 0.001;
      ctx.clearRect(0, 0, W, H);
      const rawAmp = 0.20 + Math.sin(t * 1.18) * 0.035 + Math.cos(t * 0.72) * 0.022;
      const rawSpeed = 1.32;
      smooth += (rawAmp - smooth) * 0.11;
      const a = smooth;
      const speed = rawSpeed;
      const projected = dots.map((d) => {
        const w1 = Math.sin(d.phi * 2.35 + t * speed * 1.42) * a;
        const w2 = Math.cos(d.theta * 1.95 - t * speed * 1.08) * a * 0.58;
        const rFactor = 1 + w1 * 0.72 + w2 * 0.38;
        let x = d.x * baseR * rFactor, y = d.y * baseR * rFactor, z = d.z * baseR * rFactor;
        const rotY = t * speed * 0.52, rotX = Math.sin(t * 0.38) * 0.13;
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY), cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        let nx = x * cosY - z * sinY, nz = x * sinY + z * cosY, ny = y * cosX - nz * sinX;
        nz = y * sinX + nz * cosX; x = nx; y = ny; z = nz;
        const persp = 85, scale = persp / (persp - z), x2 = cx + x * scale, y2 = cy + y * scale;
        const size = Math.max(0.45, 0.85 * scale);
        const depth = (z + baseR) / (baseR * 2);
        const alpha = 0.42 + depth * 0.58;
        const yNorm = (y / baseR + 1) / 2;
        let r, g, b;
        if (yNorm < 0.5) { const tt = yNorm / 0.5; r = 56 + (59 - 56) * tt; g = 189 + (130 - 189) * tt; b = 248 + (246 - 248) * tt; }
        else { const tt = (yNorm - 0.5) / 0.5; r = 59 + (168 - 59) * tt; g = 130 + (85 - 130) * tt; b = 246 + (247 - 246) * tt; }
        if (depth > 0.78) { const h = (depth - 0.75) / 0.25; r = r + (255 - r) * h * 0.3; g = g + (255 - g) * h * 0.3; b = b + (255 - b) * h * 0.3; }
        return { x2, y2, size, alpha, r, g, b, depth };
      });
      projected.sort((a, b) =>a.depth - b.depth);
      for (const p of projected) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},${p.alpha})`;
        if (p.depth > 0.80) { ctx.shadowColor = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},0.40)`; ctx.shadowBlur = 2.5; } else ctx.shadowBlur = 0;
        ctx.arc(p.x2, p.y2, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () =>cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="block select-none"style={{ width: 72, height: 72, margin: -20, filter: "contrast(1.10) saturate(1.16) drop-shadow(0 0 4px rgba(56,189,248,0.15))" }} />;
}
export { ChatAvatarSphere as AvatarSphere };