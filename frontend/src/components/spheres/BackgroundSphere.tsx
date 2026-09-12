"use client";

import { useRef, useEffect } from "react";

export function BackgroundSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const updateSize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { W, H };
    };
    let { W, H } = updateSize();
    const onResize = () => { const s = updateSize(); W = s.W; H = s.H; };
    window.addEventListener("resize", onResize);
    const baseR = Math.hypot(W, H) * 0.42;
    const dotCount = 4200;
    const dots: { x: number; y: number; z: number; phi: number; theta: number }[] = [];
    const golden = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < dotCount; i++) {
      const theta = (2 * Math.PI * i) / golden;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / dotCount);
      dots.push({ x: Math.sin(phi) * Math.cos(theta), y: Math.sin(phi) * Math.sin(theta), z: Math.cos(phi), phi, theta });
    }
    const t0 = performance.now();
    let smoothAmp = 0.16;
    const render = (now: number) => {
      const t = (now - t0) * 0.001;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const rawAmp = 0.20 + Math.sin(t * 0.82) * 0.045 + Math.cos(t * 0.58) * 0.028;
      smoothAmp += (rawAmp - smoothAmp) * 0.08;
      const amp = smoothAmp;
      const speed = 0.78;
      const projected = dots.map((d) => {
        const w1 = Math.sin(d.phi * 1.85 + t * speed * 1.18) * amp;
        const w2 = Math.cos(d.theta * 1.6 - t * speed * 0.92) * amp * 0.55;
        const rFactor = 1 + w1 * 0.72 + w2 * 0.36;
        let x = d.x * baseR * rFactor, y = d.y * baseR * rFactor, z = d.z * baseR * rFactor;
        x *= 1.32; y *= 1.32;
        const rotY = t * speed * 0.28, rotX = Math.sin(t * 0.16) * 0.08;
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY), cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        let nx = x * cosY - z * sinY, nz = x * sinY + z * cosY, ny = y * cosX - nz * sinX;
        nz = y * sinX + nz * cosX; x = nx; y = ny; z = nz;
        const persp = 900, scale = persp / (persp - z), x2 = cx + x * scale, y2 = cy + y * scale;
        const size = Math.max(0.85, 1.55 * scale);
        const depth = (z + baseR) / (baseR * 2);
        const alpha = 0.26 + depth * 0.34;
        const yNorm = (y / baseR + 1) / 2;
        let r, g, b;
        if (yNorm < 0.42) { const tt = yNorm / 0.42; r = 56 + (59 - 56) * tt; g = 189 + (130 - 189) * tt; b = 248 + (246 - 248) * tt; }
        else if (yNorm < 0.70) { const tt = (yNorm - 0.42) / 0.28; r = 59 + (147 - 59) * tt; g = 130 + (92 - 130) * tt; b = 246 + (168 - 59) * tt; }
        else { const tt = (yNorm - 0.70) / 0.30; r = 147 + (236 - 147) * tt; g = 92 + (72 - 92) * tt; b = 168 + (153 - 168) * tt; }
        if (depth > 0.75) { const h = (depth - 0.75) / 0.25; r = r + (255 - r) * h * 0.28; g = g + (255 - g) * h * 0.28; b = b + (255 - b) * h * 0.28; }
        return { x2, y2, size, alpha, r, g, b, depth };
      });
      projected.sort((a, b) => a.depth - b.depth);
      for (const p of projected) {
        if (p.x2 < -30 || p.x2 > W + 30 || p.y2 < -30 || p.y2 > H + 30) continue;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},${p.alpha})`;
        if (p.depth > 0.78) { ctx.shadowColor = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},0.32)`; ctx.shadowBlur = 5; } else ctx.shadowBlur = 0;
        ctx.arc(p.x2, p.y2, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="block select-none absolute inset-0 w-full h-full" style={{ filter: "contrast(1.07) saturate(1.12)" }} />;
}