"use client";

import { useRef, useEffect } from "react";

export function VoiceSphere({ mode, levels }: { mode: "listening" | "analyzing"; levels: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const levelsRef = useRef(levels);
  useEffect(() => {
    levelsRef.current = levels;
  }, [levels]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = 340, H = 340;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    const cx = W / 2, cy = H / 2;
    const baseR = 98;
    const dotCount = 1650;
    const dots: { x: number; y: number; z: number; phi: number; theta: number }[] = [];
    const golden = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < dotCount; i++) {
      const theta = (2 * Math.PI * i) / golden;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / dotCount);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);
      dots.push({ x, y, z, phi, theta });
    }
    const t0 = performance.now();
    let smoothAvg = 0.45;
    let smoothAmp = 0.14;
    let lastT = 0;
    const render = (now: number) => {
      const t = (now - t0) * 0.001;
      const dt = lastT ? Math.min(0.032, (now - lastT) * 0.001) : 0.016;
      lastT = now;
      const rawAvg = levelsRef.current.reduce((a, b) =>a + b, 0) / Math.max(1, levelsRef.current.length);
      // mượt hóa avg để không giật cục
      smoothAvg += (rawAvg - smoothAvg) * 0.09;
      const isListening = mode === "listening";
      const targetSpeed = isListening ? 1.08 : 0.56;
      const speed = targetSpeed;
      const targetAmp = isListening ? 0.13 + smoothAvg * 0.26 : 0.11 + Math.sin(t * 0.52) * 0.025 + smoothAvg * 0.07;
      smoothAmp += (targetAmp - smoothAmp) * 0.07;
      const amp = smoothAmp;
      // trôi thời gian được lọc để không khựng
      const easedT = t;
      ctx.clearRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(cx, cy, baseR * 0.55, cx, cy, baseR * 1.75);
      glow.addColorStop(0, isListening ? "rgba(56,189,248,0.09)" : "rgba(124,58,237,0.09)");
      glow.addColorStop(0.55, isListening ? "rgba(59,130,246,0.05)" : "rgba(168,85,247,0.045)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 1.75, 0, Math.PI * 2);
      ctx.fill();
      const projected = dots.map((d) => {
        const w1 = Math.sin(d.phi * 2.15 + easedT * speed * 1.28 + d.theta * 0.95) * amp;
        const w2 = Math.cos(d.theta * 1.85 - easedT * speed * 0.95) * amp * 0.52;
        const w3 = Math.sin(d.x * 2.8 + easedT * speed * 0.72) * amp * 0.30;
        const w4 = Math.cos(d.y * 2.4 - easedT * speed * 0.68) * amp * 0.26;
        const rFactor = 1 + w1 * 0.85 + w2 * 0.45 + w3 * 0.32 + w4 * 0.28;
        let x = d.x * baseR * rFactor;
        let y = d.y * baseR * rFactor;
        let z = d.z * baseR * rFactor;
        const rotY = easedT * speed * 0.30;
        const rotX = Math.sin(easedT * 0.18) * 0.11 + (isListening ? smoothAvg * 0.055 : 0.04);
        void dt;
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        let nx = x * cosY - z * sinY;
        let nz = x * sinY + z * cosY;
        let ny = y * cosX - nz * sinX;
        nz = y * sinX + nz * cosX;
        x = nx; y = ny; z = nz;
        const persp = 440;
        const scale = persp / (persp - z);
        const x2 = cx + x * scale;
        const y2 = cy + y * scale;
        const size = Math.max(0.55, 1.35 * scale);
        const depth = (z + baseR * 1.32) / (baseR * 2.64);
        const alpha = 0.30 + depth * 0.70;
        const yNorm = (y / baseR + 1) / 2;
        let r: number, g: number, b: number;
        if (yNorm < 0.45) {
          const tt = yNorm / 0.45;
          r = 56 + (59 - 56) * tt;
          g = 189 + (130 - 189) * tt;
          b = 248 + (246 - 248) * tt;
        } else if (yNorm < 0.78) {
          const tt = (yNorm - 0.45) / 0.33;
          r = 59 + (139 - 59) * tt;
          g = 130 + (92 - 130) * tt;
          b = 246 + (246 - 246) * tt;
        } else {
          const tt = (yNorm - 0.78) / 0.22;
          r = 139 + (192 - 139) * tt;
          g = 92 + (38 - 92) * tt;
          b = 246 + (211 - 246) * tt;
        }
        if (depth > 0.78) {
          const h = (depth - 0.78) / 0.22;
          r = r + (255 - r) * h * 0.32;
          g = g + (255 - g) * h * 0.32;
          b = b + (255 - b) * h * 0.32;
        }
        return { x2, y2, size, alpha, r, g, b, depth };
      });
      projected.sort((a, b) =>a.depth - b.depth);
      for (const p of projected) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},${p.alpha})`;
        if (p.depth > 0.82) {
          ctx.shadowColor = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},0.48)`;
          ctx.shadowBlur = 5.5;
        } else ctx.shadowBlur = 0;
        ctx.arc(p.x2, p.y2, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      const core = ctx.createRadialGradient(cx - 16, cy - 20, 6, cx, cy, baseR * 0.42);
      core.addColorStop(0, "rgba(255,255,255,0.38)");
      core.addColorStop(0.24, "rgba(255,255,255,0.09)");
      core.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 0.42, 0, Math.PI * 2);
      ctx.fill();
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () =>cancelAnimationFrame(raf);
  }, [mode]);
  return <canvas ref={canvasRef} className="block select-none"style={{ width: 340, height: 340, filter: "contrast(1.08) saturate(1.14)" }} />;
}
// alias để tương thích tên cũ trước khi đổi
export { VoiceSphere as ParticleSphere };