"use client";

import { useRef, useEffect } from "react";

type LogoProps = {
  size?: number; // px
  animated?: boolean;
  className?: string;
};

/**
 * TechWise Logo – dotted fluid sphere, inspired by `effect_sphere.png`
 * Reuses same Fibonacci + wave math as ParticleSphere/AvatarSphere but scaled for 28–40px.
 * Colors: cyan 38BDF8 → blue 3B82F6 → purple A855F7, organic deformation via 4 wave layers.
 */
export function Logo({ size = 32, animated = true, className = "" }: LogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = size;
    const H = size;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2;
    // scale baseR proportionally: 32px -> 11.2, 28px -> 9.8 etc
    const baseR = size * 0.34;
    const dotCount = size <= 28 ? 180 : size <= 32 ? 220 : 320;
    const persp = size * 2.8;

    const golden = (1 + Math.sqrt(5)) / 2;
    const dots: { x: number; y: number; z: number; phi: number; theta: number }[] = [];
    for (let i = 0; i < dotCount; i++) {
      const theta = (2 * Math.PI * i) / golden;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / dotCount);
      dots.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
        phi,
        theta,
      });
    }

    const t0 = performance.now();

    const render = (now: number) => {
      const t = (now - t0) * 0.001;
      ctx.clearRect(0, 0, W, H);

      // subtle outer glow – matches ParticleSphere glow but smaller
      const glow = ctx.createRadialGradient(cx, cy, baseR * 0.35, cx, cy, baseR * 1.6);
      glow.addColorStop(0, "rgba(56,189,248,0.16)");
      glow.addColorStop(0.5, "rgba(59,130,246,0.09)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 1.6, 0, Math.PI * 2);
      ctx.fill();

      const speed = animated ? 0.78 : 0;
      const amp = animated ? 0.18 + Math.sin(t * 0.9) * 0.015 : 0.12;

      const projected = dots.map((d) => {
        const w1 = Math.sin(d.phi * 2.2 + t * speed * 1.35 + d.theta * 0.9) * amp;
        const w2 = Math.cos(d.theta * 1.9 - t * speed * 1.0) * amp * 0.55;
        const w3 = Math.sin(d.x * 2.6 + t * speed * 0.7) * amp * 0.32;
        const rFactor = 1 + w1 * 0.72 + w2 * 0.38 + w3 * 0.22;
        let x = d.x * baseR * rFactor;
        let y = d.y * baseR * rFactor;
        let z = d.z * baseR * rFactor;

        // gentle rotation – same axis as effect_sphere.png tilt
        const rotY = t * speed * 0.42;
        const rotX = Math.sin(t * 0.35) * 0.12;
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        let nx = x * cosY - z * sinY;
        let nz = x * sinY + z * cosY;
        let ny = y * cosX - nz * sinX;
        nz = y * sinX + nz * cosX;
        x = nx; y = ny; z = nz;

        const scale = persp / (persp - z);
        const x2 = cx + x * scale;
        const y2 = cy + y * scale;
        const dotSize = Math.max(0.45, (size * 0.028) * scale);
        const depth = (z + baseR) / (baseR * 2);
        const alpha = 0.32 + depth * 0.68;

        // gradient cyan → blue → purple by yNorm (mirrors effect_sphere)
        const yNorm = (y / baseR + 1) / 2;
        let r: number, g: number, b: number;
        if (yNorm < 0.46) {
          const tt = yNorm / 0.46;
          r = 56 + (59 - 56) * tt;
          g = 189 + (130 - 189) * tt;
          b = 248 + (246 - 248) * tt;
        } else if (yNorm < 0.78) {
          const tt = (yNorm - 0.46) / 0.32;
          r = 59 + (139 - 59) * tt;
          g = 130 + (92 - 130) * tt;
          b = 246 + (246 - 246) * tt;
        } else {
          const tt = (yNorm - 0.78) / 0.22;
          r = 139 + (192 - 139) * tt;
          g = 92 + (38 - 92) * tt;
          b = 246 + (211 - 246) * tt;
        }
        if (depth > 0.8) {
          const h = (depth - 0.8) / 0.2;
          r += (255 - r) * h * 0.28;
          g += (255 - g) * h * 0.28;
          b += (255 - b) * h * 0.28;
        }
        return { x2, y2, dotSize, alpha, r, g, b, depth };
      });

      projected.sort((a, b) =>a.depth - b.depth);
      for (const p of projected) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},${p.alpha})`;
        if (p.depth > 0.82) {
          ctx.shadowColor = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},0.45)`;
          ctx.shadowBlur = size * 0.07;
        } else ctx.shadowBlur = 0;
        ctx.arc(p.x2, p.y2, p.dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    // single animation loop
    const loop = (now: number) => {
      render(now);
      if (animated) raf = requestAnimationFrame(loop);
    };
    if (animated) raf = requestAnimationFrame(loop);
    else render(performance.now());

    return () =>cancelAnimationFrame(raf);
  }, [size, animated]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`block select-none ${className}`}
      style={{
        width: size,
        height: size,
        filter: "contrast(1.06) saturate(1.12)",
      }}
      aria-label="TechWise logo"
    />
  );
}

export function LogoMark({ size = 32, animated = true }: { size?: number; animated?: boolean }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.38,
        background: "#F0F2F5",
        boxShadow: "4px 4px 10px #CBD5E6, -4px -4px 10px #FFFFFF",
      }}
    >
      <Logo size={Math.round(size * 0.88)} animated={animated} />
    </div>
  );
}
