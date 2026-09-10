"use client";

import { useState, useRef, useEffect } from "react";

// Types
type ReasoningStep = {
  id: string;
  label: string;
  status: "pending" | "active" | "done";
  detail: string;
  time?: string;
};

type Product = {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  display: string;
  weight: string;
  weightNum?: number;
  batteryWh?: number;
  ppScore: number;
  regret: "Thấp" | "Trung bình" | "Cao";
  regretColor: string;
  benchmark: string;
  pros: string[];
  cons: string[];
  affiliate: string;
  badge?: string;
  category: string;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Lenovo IdeaPad Gaming 3 15ARH7",
    price: "17.490.000₫",
    priceNum: 17490000,
    cpu: "Ryzen 5 7535HS",
    gpu: "RTX 3050 95W",
    ram: "16GB DDR5 (8+8)",
    storage: "512GB NVMe",
    display: "15.6″ 144Hz 100% sRGB",
    weight: "2.32kg · Nhựa",
    ppScore: 8.7,
    regret: "Thấp",
    regretColor: "#22c55e",
    benchmark: "Cinebench R23 14.2k · Valorant 210fps",
    pros: ["GPU rời 95W chiến game tốt", "RAM dual-channel sẵn", "Tản 2 quạt ổn"],
    cons: ["Vỏ nhựa flex nhẹ", "Pin 45Wh ~4h"],
    affiliate: "Shopee",
    badge: "BEST P/P",
    category: "GAMING",
  },
  {
    id: "2",
    name: "Acer Swift Go 14 OLED",
    price: "18.990.000₫",
    priceNum: 18990000,
    cpu: "Ultra 7 155H",
    gpu: "Arc 8-core",
    ram: "16GB LPDDR5 (hàn chết)",
    storage: "512GB NVMe",
    display: "14″ 2.8K OLED 90Hz",
    weight: "1.32kg · Nhôm",
    ppScore: 7.9,
    regret: "Trung bình",
    regretColor: "#eab308",
    benchmark: "Geekbench 14.8k · Valorant 110fps",
    pros: ["Siêu nhẹ 1.32kg, OLED đẹp", "Pin 65Wh ~8h", "Build nhôm"],
    cons: ["RAM hàn chết ko nâng", "GPU tích hợp yếu hơn RTX"],
    affiliate: "CellphoneS",
    category: "ULTRABOOK",
  },
  {
    id: "3",
    name: "HP Victus 15-fa1xxx",
    price: "16.290.000₫",
    priceNum: 16290000,
    cpu: "i5-13420H",
    gpu: "RTX 2050 45W",
    ram: "8GB DDR4 (1 khe trống)",
    storage: "512GB NVMe",
    display: "15.6″ 144Hz 45% NTSC",
    weight: "2.29kg · Nhựa",
    ppScore: 7.2,
    regret: "Cao",
    regretColor: "#ef4444",
    benchmark: "Cinebench R23 12.1k · Valorant 145fps",
    pros: ["Rẻ nhất, nâng RAM dễ", "Màn 144Hz"],
    cons: ["Màn 45% NTSC nhạt", "2050 yếu hơn 3050 35%"],
    affiliate: "GearVN",
    category: "ENTRY GAMING",
  },
];

const FINAL_TEXT = "Đã phân tích xong yêu cầu **“18 triệu · học CNTT · chơi Valorant”**\n\n- **Ngân sách:** 16–19tr (linh động ±1tr để tối ưu P/P)\n- **Nhu cầu ẩn:** Code đa nhiệm (RAM 16GB), bàn phím hành trình tốt, mang vác hàng ngày\n- **Game:** Valorant 1080p 144Hz+ → cần GPU ≥ RTX 2050 hoặc iGPU 780M+";

function buildFallbackSummary(query: string): string {
  const lower = query.toLowerCase();
  const budgetMatch = lower.match(/(\d{1,2})\s*(?:tr|triệu)/);
  const budget = budgetMatch ? `tối đa ${budgetMatch[1]}tr` : "linh động";
  const tags: string[] = [];
  if (lower.includes("cntt") || lower.includes("lập trình") || lower.includes("code")) tags.push("CNTT");
  if (lower.includes("valorant")) tags.push("Valorant");
  if (lower.includes("genshin")) tags.push("Genshin");
  if (lower.includes("ai") || lower.includes("data")) tags.push("AI");
  if (lower.includes("mỏng") || lower.includes("nhẹ")) tags.push("nhẹ");
  const useCases = tags.join(", ") || "đa dụng";
  return `Đã phân tích yêu cầu **“${budget} · ${useCases}”**\n\n- **Ngân sách:** ${budget}\n- **Nhu cầu:** ${query.slice(0, 90)}\n- **Gợi ý:** ${tags.length ? tags.join(" + ") : "phù hợp"} — 3 lựa chọn bên dưới`;
}
function getFallbackProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  let pool = [...MOCK_PRODUCTS];
  // thêm biến thể để không lặp y hệt
  const extra: Product[] = [
    { ...MOCK_PRODUCTS[0], id: "4", name: "ASUS TUF Gaming A15 FA507NU", price: "19.990.000₫", priceNum: 19990000, cpu: "Ryzen 7 7735HS", gpu: "RTX 4050 95W", ppScore: 8.9, regret: "Thấp" as const, regretColor: "#22c55e", benchmark: "Cyberpunk 68fps", pros: ["RTX 4050 DLSS 3"], cons: ["Pin 4.5h"], affiliate: "Phong Vũ", badge: "NEW", category: "GAMING" as const, weightNum: 2.2, batteryWh: 56 },
    { ...MOCK_PRODUCTS[1], id: "5", name: "Lenovo ThinkBook 14 G6", price: "15.900.000₫", priceNum: 15900000, cpu: "i5-1335U", gpu: "Iris Xe", ppScore: 7.4, regret: "Thấp" as const, regretColor: "#22c55e", benchmark: "Valorant 62fps", pros: ["Bàn phím tốt"], cons: ["Không GPU rời"], affiliate: "CellphoneS", category: "ULTRABOOK" as const, weightNum: 1.39, batteryWh: 45 },
  ];
  pool = [...MOCK_PRODUCTS, ...extra];
  const m = lower.match(/(\d{1,2})\s*(?:tr|triệu)/);
  if (m) {
    const v = parseInt(m[1], 10) * 1_000_000;
    const inBudget = pool.filter((p) => p.priceNum <= v + 2_000_000 && p.priceNum >= Math.max(0, v - 3_000_000));
    if (inBudget.length) pool = inBudget;
    else pool = [...pool].sort((a, b) => Math.abs(a.priceNum - v) - Math.abs(b.priceNum - v));
  }
  if (lower.includes("valorant") || lower.includes("gaming") || lower.includes("game")) {
    const gaming = pool.filter((p) => p.gpu.includes("RTX"));
    if (gaming.length) pool = gaming;
  }
  if (lower.includes("mỏng") || lower.includes("nhẹ")) pool = [...pool].sort((a, b) => parseFloat(a.weight) - parseFloat(b.weight));
  return pool.slice(0, 3);
}

function ParticleSphere({ mode, levels }: { mode: "listening" | "analyzing"; levels: number[] }) {
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
      const rawAvg = levelsRef.current.reduce((a, b) => a + b, 0) / Math.max(1, levelsRef.current.length);
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
      projected.sort((a, b) => a.depth - b.depth);
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
    return () => cancelAnimationFrame(raf);
  }, [mode]);
  return <canvas ref={canvasRef} className="block select-none" style={{ width: 340, height: 340, filter: "contrast(1.08) saturate(1.14)" }} />;
}

function ThinkingSphere() {
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
      projected.sort((a, b) => a.depth - b.depth);
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
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="block select-none" style={{ width: 56, height: 56, filter: "contrast(1.06) saturate(1.08)" }} />;
}

function AvatarSphere() {
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
      projected.sort((a, b) => a.depth - b.depth);
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
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="block select-none" style={{ width: 72, height: 72, margin: -20, filter: "contrast(1.10) saturate(1.16) drop-shadow(0 0 4px rgba(56,189,248,0.15))" }} />;
}

function BackgroundSphere() {
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

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      text: string;
      reasoning?: ReasoningStep[];
      products?: Product[];
      clarification?: { question: string; options: string[] };
      matrix?: boolean;
    }>
  >([
    {
      id: "m0",
      role: "assistant",
      text: "Xin chào. Mình là TechWise — trợ lý tìm kiếm thiết bị công nghệ.\nBạn mô tả nhu cầu theo ngôn ngữ tự nhiên, mình sẽ phân tích GraphRAG + Multi-Agent, đối chiếu Benchmark thực tế và đưa ra ma trận đánh đổi kèm chỉ số hối hận sau 1 năm.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [typingId, setTypingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceAnalyzing, setIsVoiceAnalyzing] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [polishedDiff, setPolishedDiff] = useState(false);
  const [debugAudioUrl, setDebugAudioUrl] = useState<string | null>(null);
  const [debugBlobSize, setDebugBlobSize] = useState<number | null>(null);
  const [showMatrix, setShowMatrix] = useState(true);
  const [waveLevels, setWaveLevels] = useState<number[]>([0.3, 0.6, 0.9, 0.6, 0.3, 0.7, 0.4]);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [lastTrace, setLastTrace] = useState<string | null>(null);
  const [lastCacheHit, setLastCacheHit] = useState<boolean | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const isListeningRef = useRef(false);
  const transcriptRef = useRef("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioRafRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const hasSearched = messages.some((m) => m.role === "user");

  useEffect(() => {
    const el = listRef.current;
    const target = bottomRef.current;
    if (!el || !target) return;
    // focus ngay phần kết quả vừa trả ra
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "end" });
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [messages, isStreaming, isThinking, typingId]);

  useEffect(() => {
    return () => { timersRef.current.forEach((t) => clearTimeout(t)); };
  }, []);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Voice wave animation — chạy cả khi listening + polishing + analyzing
  useEffect(() => {
    if (!isListening && !isVoiceAnalyzing && !isPolishing) return;
    if ((isListening || isPolishing) && analyserRef.current) {
      let raf: number | null = null;
      const tick = () => {
        const analyser = analyserRef.current;
        if (!analyser || !isListeningRef.current) return;
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const bands = 7;
        const step = Math.floor(data.length / bands);
        const levels: number[] = [];
        let rms = 0;
        for (let i = 0; i < bands; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) sum += data[i * step + j];
          const avg = sum / step / 255;
          rms += avg * avg;
          levels.push(Math.min(1, 0.18 + avg * 0.88));
        }
        rms = Math.sqrt(rms / bands);
        const boosted = levels.map((l) => Math.min(1, l * (0.75 + rms * 0.85)));
        setWaveLevels(boosted);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => { if (raf) cancelAnimationFrame(raf); };
    }
    if (isListening) {
      const id = window.setInterval(() => {
        setWaveLevels(Array.from({ length: 7 }, () => 0.25 + Math.random() * 0.55));
      }, 120);
      return () => clearInterval(id);
    }
    const id = window.setInterval(() => {
      setWaveLevels((prev) => prev.map((_, i) => 0.35 + Math.abs(Math.sin(Date.now() / 380 + i)) * 0.55));
    }, 120);
    return () => clearInterval(id);
  }, [isListening, isVoiceAnalyzing]);

  useEffect(() => {
    if (!isStreaming && isVoiceAnalyzing) {
      const t = window.setTimeout(() => setIsVoiceAnalyzing(false), 600);
      return () => clearTimeout(t);
    }
  }, [isStreaming, isVoiceAnalyzing]);
  useEffect(() => {
    if (!isPolishing) setPolishedDiff(false);
  }, [isPolishing]);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const check = async () => {
      try {
        const r = await fetch(`${API}/health`, { cache: "no-store" });
        setBackendOk(r.ok);
      } catch {
        setBackendOk(false);
      }
    };
    check();
    const id = window.setInterval(check, 30000);
    return () => window.clearInterval(id);
  }, []);

  const handleSend = (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || isStreaming || isThinking) return;
    const userMsg = { id: Date.now().toString(), role: "user" as const, text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setVoiceTranscript("");
    setIsStreaming(true);
    setIsThinking(true);
    const wasVoice = isVoiceAnalyzing || isListening || isPolishing;
    if (wasVoice) setIsVoiceAnalyzing(true);
    setIsListening(false);
    setIsPolishing(false);

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const thinkTimer = window.setTimeout(async () => {
      setIsThinking(false);
      const assistantId = (Date.now() + 1).toString();
      setMessages((m) => [...m, { id: assistantId, role: "assistant", text: "", reasoning: [] }]);
      setTypingId(assistantId);

      let backend: any = null;
      try {
        const res = await fetch(`${API}/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text }),
        });
        if (res.ok) {
          backend = await res.json();
          setBackendOk(true);
          if (backend?.traceId) setLastTrace(backend.traceId);
          setLastCacheHit(!!backend?.cache?.hit);
        } else setBackendOk(false);
      } catch (e) {
        console.warn("Backend not reachable, fallback to mock", e);
        setBackendOk(false);
      }

      const finalText: string = backend?.summary || buildFallbackSummary(text);
      const backendProducts: Product[] | null = backend?.products
        ? (backend.products as any[]).slice(0, 3).map((p: any) => ({
            id: String(p.id),
            name: p.name,
            price: p.price,
            priceNum: p.priceNum,
            cpu: p.cpu,
            gpu: p.gpu,
            ram: p.ram,
            storage: p.storage,
            display: p.display,
            weight: p.weight,
            weightNum: (p as any).weightNum,
            batteryWh: (p as any).batteryWh,
            ppScore: typeof p.ppScore === "number" ? p.ppScore : 7.5,
            regret: p.regret as Product["regret"],
            regretColor: p.regretColor,
            benchmark: p.benchmark,
            pros: p.pros,
            cons: p.cons,
            affiliate: p.affiliate,
            badge: p.badge,
            category: p.category,
          }))
        : null;
      const products = backendProducts && backendProducts.length ? backendProducts : getFallbackProducts(text);
      const clarification =
        backend?.clarification !== undefined
          ? backend.clarification
          : text.toLowerCase().includes("cntt") || text.toLowerCase().includes("học")
            ? {
                question: "Để chốt chính xác hơn, bạn học chuyên ngành nào và có ưu tiên mỏng nhẹ không?",
                options: ["Web/App - ưu tiên nhẹ & pin", "AI/Data - ưu tiên CPU/RAM mạnh", "Game nặng thêm - ưu tiên GPU rời"],
              }
            : null;

      let idx = 0;
      const typeNext = () => {
        idx++;
        const char = finalText[idx - 1] || "";
        const isPauseChar = char === "·" || char === ":" || char === "—" || char === "\n";
        setMessages((prev) => prev.map((msg) => (msg.id === assistantId ? { ...msg, text: finalText.slice(0, idx) } : msg)));
        if (idx < finalText.length) {
          let delay = 18 + Math.random() * 18;
          if (isPauseChar) delay = 160 + Math.random() * 120;
          if (char === ".") delay = 220;
          const t = window.setTimeout(typeNext, delay);
          timersRef.current.push(t);
        } else {
          const c1 = window.setTimeout(() => {
            if (clarification)
              setMessages((prev) => prev.map((msg) => (msg.id === assistantId ? { ...msg, clarification } : msg)));
          }, 420);
          timersRef.current.push(c1);
          const c2 = window.setTimeout(() => {
            setMessages((prev) => prev.map((msg) => (msg.id === assistantId ? { ...msg, products, matrix: true } : msg)));
            setTypingId(null);
            setIsStreaming(false);
          }, 900);
          timersRef.current.push(c2);
        }
      };
      const first = window.setTimeout(typeNext, 180);
      timersRef.current.push(first);
    }, 760);
    timersRef.current.push(thinkTimer);
  };

  const handleClarify = (opt: string) => handleSend(opt);

  const startVoiceAnalyzingFlow = (transcript: string) => {
    setVoiceTranscript(transcript);
    setIsListening(false);
    setIsVoiceAnalyzing(true);
    setInput(transcript);
    const t = window.setTimeout(() => handleSend(transcript), 900);
    timersRef.current.push(t);
  };

  const toggleListen = async () => {
    if (isListeningRef.current) {
      try { recognitionRef.current?.stop(); } catch {}
      try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {}
      try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
      try { audioContextRef.current?.close(); } catch {}
      audioContextRef.current = null;
      analyserRef.current = null;
      setIsListening(false);
      return;
    }

    const startTime = Date.now();
    let mediaOk = false;
    // Debug: log trạng thái getUserMedia
    console.log("[Voice] Requesting mic...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: 16000 } as any,
          channelCount: { ideal: 1 } as any,
        } as any,
      });
      console.log("[Voice] Mic granted, tracks:", stream.getAudioTracks().map(t=>`${t.label} ${t.readyState}`));
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "audio/webm";
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      try {
        const ac = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = ac;
        const analyser = ac.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.72;
        const src = ac.createMediaStreamSource(stream);
        src.connect(analyser);
        analyserRef.current = analyser;
      } catch {}
      mr.onstop = async () => {
        const wasListening = isListeningRef.current;
        const blob = new Blob(audioChunksRef.current, { type: mime });
        const webText = (transcriptRef.current || voiceTranscript || "").trim();
        const durationSec = (Date.now() - startTime) / 1000;
        console.log(`[Voice] onstop: blob ${blob.size} bytes, ${durationSec.toFixed(2)}s, chunks ${audioChunksRef.current.length}, webText: "${webText}"`);
        // Debug: tạo URL để user có thể nghe lại xem mic có thu được không
        try {
          if (blob.size > 0) {
            const url = URL.createObjectURL(blob);
            setDebugAudioUrl(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
            setDebugBlobSize(blob.size);
          }
        } catch {}
        // Luôn dừng tracks sớm để mic không giữ, nhưng giữ UI state theo wasListening
        const stopTracks = () => {
          try { stream.getTracks().forEach((t) => t.stop()); } catch {}
          try { audioContextRef.current?.close(); } catch {}
          audioContextRef.current = null;
          analyserRef.current = null;
        };
        // Nếu blob quá nhỏ mà vẫn có transcript từ Web Speech thì dùng ngay (không cần Whisper)
        if (blob.size < 1000) {
          setIsListening(false);
          setIsPolishing(false);
          isListeningRef.current = false;
          if (webText && wasListening) startVoiceAnalyzingFlow(webText);
          else if (!webText && wasListening) {
            setVoiceTranscript("Không nghe rõ, vui lòng thử lại hoặc gõ...");
            window.setTimeout(() => setVoiceTranscript(""), 2500);
          }
          stopTracks();
          return;
        }
        // Hybrid A: hiện polishing ngay để user thấy realtime word-by-word vẫn giữ, đang chuẩn hóa cuối
        // Dùng wasListening thay vì isListeningRef.current vì ref sẽ bị set false ngay sau
        setIsListening(false);
        isListeningRef.current = false;
        setIsPolishing(true);
        if (webText) setVoiceTranscript(webText);

        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
        let backendText: string | null = null;
        let rawWhisper: string | null = null;
        let polished = false;
        try {
          const fd = new FormData();
          fd.append("audio", blob, `voice-${Date.now()}.webm`);
          if (webText) fd.append("webSpeechText", webText);
          console.log(`[Voice] Sending to Whisper: ${blob.size} bytes, webText: "${webText}"`);
          const ctrl = new AbortController();
          const to = window.setTimeout(() => ctrl.abort(), 6500);
          const res = await fetch(`${API}/voice/transcribe`, { method: "POST", body: fd, signal: ctrl.signal as any });
          window.clearTimeout(to);
          if (res.ok) {
            const data = await res.json();
            console.log("[Voice] Whisper response:", data);
            if (data.text) { backendText = data.text; rawWhisper = data.rawWhisper || null; polished = !!data.polished; }
            else console.warn("Whisper empty:", data);
          } else {
            const txt = await res.text().catch(()=> "");
            console.warn("Whisper HTTP", res.status, txt);
          }
        } catch (e: any) {
          if (e?.name === 'AbortError') console.warn("Whisper timeout 6.5s -> fallback WebSpeech", webText);
          else console.warn("Whisper fetch fail", e);
        }
        // Ưu tiên bản polish (đã merge), fallback Web Speech — dùng wasListening, không check ref nữa để không kẹt
        const final = (backendText || webText || "").trim();
        stopTracks();
        if (final && wasListening) {
          // Nếu Whisper sửa khác Web Speech, hiện diff 600ms trước khi search để user thấy từng chữ được chuẩn hóa
          if (polished && rawWhisper && webText && backendText && backendText !== webText) {
            setVoiceTranscript(backendText);
            setPolishedDiff(true);
            window.setTimeout(() => {
              setIsPolishing(false);
              startVoiceAnalyzingFlow(final);
            }, 650);
          } else {
            setVoiceTranscript(final);
            setIsPolishing(false);
            startVoiceAnalyzingFlow(final);
          }
        } else if (wasListening) {
          console.warn("No transcript from both SR and Whisper, blob", blob.size, "webText:", webText);
          setIsPolishing(false);
          setVoiceTranscript("Không nghe rõ, vui lòng thử lại hoặc gõ...");
          window.setTimeout(() => setVoiceTranscript(""), 2500);
        } else {
          setIsPolishing(false);
        }
      };
      mr.start(200);
      mediaOk = true;
    } catch (e) { console.warn("MediaRecorder not available", e); }

    const SR: any = (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    if (SR) {
      const rec = new SR();
      recognitionRef.current = rec;
      rec.lang = "vi-VN";
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 3;
      let finalTranscript = "";
      let lastSpeechAt = Date.now();
      rec.onstart = () => { setIsListening(true); setVoiceTranscript(""); transcriptRef.current = ""; setIsVoiceAnalyzing(false); lastSpeechAt = Date.now(); };
      rec.onresult = (e: any) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalTranscript += t + " ";
          else interim += t;
        }
        // Hiện từng chữ: final + interim cùng lúc (không dùng || để không mất interim)
        const cur = (finalTranscript + interim).trim();
        if (cur) lastSpeechAt = Date.now();
        // Cập nhật ngay để overlay hiện word-by-word
        setVoiceTranscript(cur);
        transcriptRef.current = cur;
        // Đồng bộ input ẩn để fallback nếu Whisper fail
        if (cur) setInput(cur);
      };
      rec.onerror = (e: any) => {
        const err = e?.error || "";
        if (err === "no-speech" || err === "aborted") return;
        if (err === "network") {
          if ((rec as any)._fatal) return;
          console.warn("SpeechRecognition network error, fallback to Whisper embedded", err);
          (rec as any)._fatal = true;
          try { rec.stop(); } catch {}
          // Whisper-only: chỉ dừng khi im 1.5s hoặc max 8s — bỏ timer 2.2s cứng để không cắt câu dài gây hallucination "một mức tất cả mọi người"
          let silenceMs = 0;
          const checkSilence = window.setInterval(() => {
            const analyser = analyserRef.current;
            if (!analyser || mediaRecorderRef.current?.state !== "recording") { window.clearInterval(checkSilence); return; }
            const data = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(data);
            let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i];
            const avg = sum / data.length / 255;
            if (avg < 0.06) silenceMs += 120;
            else silenceMs = 0;
            if (silenceMs >= 1500) {
              window.clearInterval(checkSilence);
              try { mediaRecorderRef.current?.stop(); } catch {}
            }
            if (Date.now() - startTime > 8000) window.clearInterval(checkSilence);
          }, 120);
          // Fallback max 8s nếu silence detector không kịp (tránh treo)
          const whisperStopTimer = window.setTimeout(() => {
            window.clearInterval(checkSilence);
            try { if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop(); } catch {}
          }, 8000);
          timersRef.current.push(whisperStopTimer);
          return;
        }
        if (err === "not-allowed" || err === "service-not-allowed" || err === "audio-capture" || err === "not-supported") {
          console.warn("SpeechRecognition not allowed:", err);
          (rec as any)._fatal = true;
          setIsListening(false);
          try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {}
          return;
        }
        console.warn("SpeechRecognition error", err, e);
      };
      let restartCount = 0;
      rec.onend = () => {
        if (!isListeningRef.current) return;
        // Nếu đã lỗi not-allowed thì không restart
        if ((rec as any)._fatal) return;
        if (Date.now() - startTime > 15000) {
          try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {}
          setIsListening(false);
          const t = (finalTranscript || transcriptRef.current || voiceTranscript).trim();
          if (t) startVoiceAnalyzingFlow(t);
          return;
        }
        if (Date.now() - lastSpeechAt < 1500 && finalTranscript.trim()) {
          try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {}
          setIsListening(false);
          startVoiceAnalyzingFlow(finalTranscript.trim());
          return;
        }
        // Tránh loop vô hạn khi liên tục no-speech: giới hạn restart
        if (!finalTranscript.trim() && Date.now() - startTime < 12000 && restartCount < 3) {
          restartCount++;
          window.setTimeout(() => { try { rec.start(); } catch {} }, 300);
          return;
        }
        const t = (finalTranscript || transcriptRef.current || voiceTranscript).trim();
        if (t) {
          try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {}
          setIsListening(false);
          startVoiceAnalyzingFlow(t);
        } else if (Date.now() - startTime < 8000 && restartCount < 2) {
          restartCount++;
          window.setTimeout(() => { try { rec.start(); } catch {} }, 300);
        } else {
          // Hết thời gian không có transcript -> fallback sang MediaRecorder/Whisper sẽ xử lý
          setIsListening(false);
        }
      };
      try { rec.start(); } catch { /* fallback to MediaRecorder */ }
      const to = window.setTimeout(() => {
        if (isListeningRef.current) {
          try { rec.stop(); } catch {}
          try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {}
        }
      }, 15000);
      timersRef.current.push(to);
      setIsListening(true);
      return;
    }

    if (mediaOk) {
      setIsListening(true);
      setVoiceTranscript("");
      transcriptRef.current = "";
      // Whisper-only fallback: tự dừng khi im 1.5s thay vì treo 15s
      let silenceMs2 = 0;
      const sid2 = window.setInterval(() => {
        const analyser = analyserRef.current;
        if (!analyser || mediaRecorderRef.current?.state !== "recording") { window.clearInterval(sid2); return; }
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i];
        const avg = sum / data.length / 255;
        if (avg < 0.08) silenceMs2 += 150;
        else silenceMs2 = 0;
        if (silenceMs2 >= 1500) {
          window.clearInterval(sid2);
          try { mediaRecorderRef.current?.stop(); } catch {}
        }
        if (Date.now() - startTime > 8500) window.clearInterval(sid2);
      }, 150);
      const to = window.setTimeout(() => {
        window.clearInterval(sid2);
        if (isListeningRef.current) {
          try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {}
          setIsListening(false);
        }
      }, 15000);
      timersRef.current.push(to);
    }
  };

  const cancelVoice = () => {
    try { recognitionRef.current?.stop(); } catch {}
    try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {}
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
    try { audioContextRef.current?.close(); } catch {}
    audioContextRef.current = null;
    analyserRef.current = null;
    setIsListening(false);
    setIsPolishing(false);
    setIsVoiceAnalyzing(false);
    setVoiceTranscript("");
    setPolishedDiff(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#2B2E36] selection:bg-[#FF3B00]/20 overflow-hidden relative">
      <header className="fixed top-0 inset-x-0 h-[56px] flex items-center justify-between px-3 lg:px-6 bg-transparent border-0 shadow-none z-40 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-[#F0F2F5]/78 backdrop-blur-xl rounded-full pl-2 pr-3 py-1.5 shadow-[6px_6px_16px_rgba(180,190,210,0.38),-6px_-6px_16px_rgba(255,255,255,0.85)] border border-white/55 pointer-events-auto">
          <div className="w-8 h-8 rounded-[12px] bg-[#F0F2F5] flex items-center justify-center shadow-[4px_4px_10px_#CBD5E6,-4px_-4px_10px_#FFFFFF] overflow-hidden shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" className="w-[28px] h-[28px]">
              <defs>
                <radialGradient id="twLogoGrad" cx="30%" cy="22%" r="78%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="48%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#A855F7" />
                </radialGradient>
              </defs>
              <circle cx="16" cy="16" r="11.2" fill="url(#twLogoGrad)" />
              <circle cx="12.2" cy="11.4" r="2.7" fill="white" opacity="0.92" />
              <circle cx="12.2" cy="11.4" r="0.9" fill="white" />
            </svg>
          </div>
          <span className="font-sans font-semibold tracking-[-0.03em] text-[17px] leading-none text-[#1A1D24]">tech<span className="font-semibold text-[#FF3B00]">wise</span></span>
        </div>
        <div className="flex items-center gap-2 bg-[#F0F2F5]/75 backdrop-blur-xl rounded-full px-2 py-1.5 shadow-[6px_6px_16px_rgba(180,190,210,0.38),-6px_-6px_16px_rgba(255,255,255,0.85)] border border-white/55 pointer-events-auto relative">
          <button onClick={() => { setShowAccount(false); setShowHistory((v) => !v); }} className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-sans font-medium tracking-[0.01em] text-[#1A1D24] bg-[#F0F2F5] rounded-full px-3.5 py-1.5 shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#C8D0E0] transition-shadow">Lịch sử</button>
          <button onClick={() => { setShowHistory(false); setShowAccount((v) => !v); }} className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[11px] font-sans font-semibold text-[#1A1D24] shadow-[4px_4px_10px_#C8D0E0,-4px_-4px_10px_#FFFFFF] hover:shadow-[5px_5px_12px_#C8D0E0] transition-shadow overflow-hidden">
            <img src="https://i.pravatar.cc/100?img=32" alt="avatar" className="w-full h-full object-cover" />
          </button>
          {showAccount && (
            <div className="absolute top-full right-0 mt-2 w-64 rounded-[16px] bg-[#F0F2F5] shadow-[8px_8px_24px_#C8D0E0,-8px_-8px_24px_#FFFFFF] border border-white/60 p-3 z-50">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/100?img=32" alt="avatar" className="w-10 h-10 rounded-full object-cover shadow-[3px_3px_8px_#C8D0E0]" />
                <div>
                  <div className="text-[13px] font-sans font-semibold text-[#1A1D24]">Tài khoản TechWise</div>
                  <div className="text-[11px] font-sans text-[#6B6F7B]">khach@techwise.vn</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E6E9EF] space-y-1">
                <div className="text-[11px] font-sans text-[#6B6F7B]">Thành viên từ 2024 · Gói Pro</div>
                <button onClick={() => setShowAccount(false)} className="w-full mt-2 h-8 rounded-full bg-[#1A1D24] text-white text-[12px] font-sans font-medium">Quản lý tài khoản</button>
              </div>
            </div>
          )}
          {showHistory && (
            <div className="absolute top-full right-0 mt-2 w-[340px] max-w-[90vw] rounded-[16px] bg-[#F0F2F5] shadow-[8px_8px_24px_#C8D0E0,-8px_-8px_24px_#FFFFFF] border border-white/60 p-3 z-50 flex flex-col max-h-[420px]">
              <div className="flex items-center justify-between px-1 pb-2">
                <h3 className="font-sans font-semibold text-[13px] text-[#1A1D24]">Lịch sử trò chuyện</h3>
                <button onClick={() => setShowHistory(false)} className="w-7 h-7 rounded-full bg-[#F0F2F5] shadow-[2px_2px_6px_#C8D0E0,-2px_-2px_6px_#FFFFFF] flex items-center justify-center text-[11px] text-[#6B6F7B] hover:shadow-[3px_3px_8px_#C8D0E0] transition-shadow">✕</button>
              </div>
              <div className="overflow-y-auto space-y-2 pr-1 overscroll-contain" style={{ maxHeight: "300px" }}>
                {[
                  { title: "18tr • CNTT + Valorant", preview: "3 đề xuất · hôm nay", time: "10:42" },
                  { title: "25tr • AI/Data • RTX 4060", preview: "Đã so sánh · hôm qua", time: "Hôm qua" },
                  { title: "12tr • Sinh viên • Nhẹ", preview: "2 đề xuất · 2 ngày trước", time: "2 ngày trước" },
                  { title: "20tr • Creator • OLED", preview: "1 đề xuất · 3 ngày trước", time: "3 ngày trước" },
                  { title: "14tr • Văn phòng • Pin lâu", preview: "2 đề xuất · 4 ngày trước", time: "4 ngày trước" },
                  { title: "22tr • Gaming • 144Hz", preview: "3 đề xuất · 5 ngày trước", time: "5 ngày trước" },
                  { title: "16tr • Mỏng nhẹ 1.4kg", preview: "2 đề xuất · 6 ngày trước", time: "6 ngày trước" },
                ].map((h) => (
                  <button key={h.title} onClick={() => { setShowHistory(false); handleSend(h.title); }} className="w-full text-left p-3 rounded-[14px] bg-[#F0F2F5] shadow-[4px_4px_10px_#CBD5E6,-4px_-4px_10px_#FFFFFF] hover:shadow-[6px_6px_14px_#CBD5E6] transition-shadow">
                    <div className="text-[13px] font-sans font-medium text-[#1A1D24] truncate">{h.title}</div>
                    <div className="text-[11px] font-sans text-[#6B6F7B] mt-1">{h.preview} · {h.time}</div>
                  </button>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-[#E6E9EF]">
                <button onClick={() => setShowHistory(false)} className="w-full h-8 rounded-full bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0] text-[12px] font-sans font-medium text-[#6B6F7B]">Xóa lịch sử</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {(showAccount || showHistory) && <div className="fixed inset-0 z-30" onClick={() => { setShowAccount(false); setShowHistory(false); }} aria-hidden />}


      {(isListening || isPolishing || isVoiceAnalyzing) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050507]/85 backdrop-blur-xl px-6">
          <button onClick={cancelVoice} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#9A9A9A] hover:text-white hover:border-[#3A3A3A] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <div className="flex flex-col items-center w-full max-w-[560px]">
            <div className="relative flex items-center justify-center" style={{ width: 360, height: 360 }}>
              <div className={`absolute rounded-full border ${isListening ? "border-[#38BDF8]/18" : isPolishing ? "border-[#F59E0B]/18" : "border-[#7C3AED]/18"} ${isListening ? "siri-ping" : isPolishing ? "siri-ping" : "siri-ping-slow"}`} style={{ width: 285, height: 285 }} />
              <div className={`absolute rounded-full border ${isListening ? "border-[#3B82F6]/12" : isPolishing ? "border-[#F59E0B]/12" : "border-[#A855F7]/12"} ${isListening ? "siri-ping-delayed" : isPolishing ? "siri-ping-delayed" : "siri-ping-slow-delayed"}`} style={{ width: 365, height: 365 }} />
              <div className="absolute rounded-full pointer-events-none" style={{ width: 340, height: 340, background: "radial-gradient(circle, rgba(56,189,248,0.07), transparent 72%)", filter: "blur(18px)" }} />
              <ParticleSphere mode={isListening ? "listening" : "analyzing"} levels={waveLevels} />
            </div>
            <div className="flex items-center justify-center gap-[5px] h-[40px] mt-10">
              {waveLevels.map((lvl, i) => (
                <span key={i} className={`w-[4px] rounded-full transition-all duration-150 ${isListening ? "bg-white" : isPolishing ? "bg-[#F59E0B]" : "bg-gradient-to-t from-[#FF3B00] via-[#7C3AED] to-[#06B6D4]"}`} style={{ height: `${12 + lvl * 28}px`, opacity: 0.9 - i * 0.04, boxShadow: isListening ? "0 0 10px rgba(255,255,255,0.5)" : isPolishing ? "0 0 10px rgba(245,158,11,0.6)" : "0 0 10px rgba(124,58,237,0.6)" }} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <div className="text-[15px] font-medium tracking-tight text-white">{isListening ? "Đang lắng nghe..." : isPolishing ? "Đang chuẩn hóa với Whisper..." : "Đang tìm kiếm và phân tích..."}</div>
              {isListening && <div className="text-[12px] font-sans font-normal tracking-[0.01em] text-[#6B6F7B] mt-1.5">Nói tới đâu hiện tới đó · ví dụ: “18 triệu học CNTT, chơi Valorant”</div>}
              {isPolishing && <div className="text-[12px] font-sans font-normal tracking-[0.01em] text-[#F59E0B] mt-1.5">Giữ Web Speech realtime, Whisper đang polish 1-2s...</div>}
              {voiceTranscript && (
                <div className={`mt-4 px-4 py-3 rounded-2xl bg-[#141414] border text-[13px] leading-relaxed max-w-[520px] mx-auto transition-all ${polishedDiff ? "border-[#F59E0B]/40 bg-[#1A1505] text-[#FDE68A]" : "border-[#1E1E1E] text-[#EDEDED]"}`}>
                  “{voiceTranscript}”
                  {polishedDiff && <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-sans font-medium text-[#F59E0B]"><span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-pulse" />Whisper đã chuẩn hóa</span>}
                  {!isListening && !isPolishing && <span className="inline-flex ml-2 align-middle"><span className="w-1.5 h-1.5 bg-[#FF3B00] rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:120ms] ml-1" /><span className="w-1.5 h-1.5 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:240ms] ml-1" /></span>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mt-8">
              <button onClick={cancelVoice} className="px-5 py-2 rounded-full bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-[13px] font-mono text-[#EDEDED] transition-colors">Hủy</button>
              {isListening && <button onClick={() => { try { recognitionRef.current?.stop(); } catch {} try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {} }} className="px-6 py-2 rounded-full bg-white text-black text-[13px] font-medium hover:bg-[#EDEDED] transition-colors">Kết thúc và tìm</button>}
            </div>
            {debugAudioUrl && (
              <div className="mt-6 w-full max-w-[520px] p-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A]">
                <div className="text-[11px] font-mono text-[#9A9A9A] mb-1">Debug: blob {debugBlobSize} bytes · nghe lại để kiểm tra mic</div>
                <audio controls src={debugAudioUrl} className="w-full h-8" />
                <div className="text-[10px] font-mono text-[#666] mt-1">Nếu không nghe thấy giọng bạn → mic chưa thu, kiểm tra quyền mic / thử Chrome https://localhost:3000</div>
              </div>
            )}

          </div>
          <style>{`
            .siri-ping{ animation:siriPing 1.9s cubic-bezier(0,0,0.2,1) infinite; }
            .siri-ping-delayed{ animation:siriPing 1.9s cubic-bezier(0,0,0.2,1) infinite 0.45s; }
            .siri-ping-slow{ animation:siriPing 2.8s cubic-bezier(0,0,0.2,1) infinite; }
            .siri-ping-slow-delayed{ animation:siriPing 2.8s cubic-bezier(0,0,0.2,1) infinite 0.6s; }
            @keyframes siriPing{ 0%{ transform:scale(0.92); opacity:0.9 } 100%{ transform:scale(1.08); opacity:0 } }
          `}</style>
        </div>
      )}

      <main className="flex-1 flex flex-col min-h-0 relative pt-[56px]">
        {!hasSearched && !isStreaming && !isThinking && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 lg:py-12">
            <div className="w-full max-w-[760px] flex flex-col items-center text-center">
              <h1 className="mt-5 text-[30px] lg:text-[44px] font-black tracking-tight leading-none text-[#1A1D24]"><span className="text-[#1A1D24]">Tìm kiếm</span> <span className="text-[#FF3B00]">thiết bị</span> <span className="text-[#1A1D24]">thông minh</span></h1>
              <p className="mt-3 text-[13.5px] leading-relaxed text-[#6B6F7B] max-w-[620px]">Chỉ cần nói hoặc gõ nhu cầu như khi bạn trò chuyện hằng ngày — TechWise sẽ tự hiểu và gợi ý cho bạn những lựa chọn dễ chọn nhất, so sánh rõ ràng được gì và mất gì.</p>
              <div className="w-full mt-8 relative">
                <div className="absolute -inset-2 rounded-[28px] search-spread-outer pointer-events-none" aria-hidden />
                <div className="absolute -inset-2 rounded-[28px] search-spread-inner pointer-events-none" aria-hidden />
                <div className={`group relative flex items-center gap-2 p-2 pl-3 rounded-[24px] bg-[#F0F2F5] shadow-[6px_6px_16px_#D1D9E6,-6px_-6px_16px_#FFFFFF] transition-all ${isListening ? "shadow-[6px_6px_16px_#D1D9E6,-6px_-6px_16px_#FFFFFF,0_0_0_3px_rgba(255,59,0,0.18)]" : "focus-within:shadow-[8px_8px_20px_#D1D9E6,-8px_-8px_20px_#FFFFFF]"}`}>
                  <span className="w-9 h-9 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[#7A7E8A] shrink-0 shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg></span>
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }} placeholder="Ví dụ: 18 triệu học CNTT, cần nhẹ, chơi Valorant 144Hz..." className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#9AA0AE] py-2 text-[#1A1D24]" />
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={toggleListen} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? "bg-[#FF3B00] text-white shadow-[0_6px_16px_rgba(255,59,0,0.35),4px_4px_10px_#D1D9E6] animate-pulse" : "bg-[#F0F2F5] text-[#6B6F7B] shadow-[4px_4px_10px_#D1D9E6,-4px_-4px_10px_#FFFFFF] hover:shadow-[6px_6px_14px_#D1D9E6,-6px_-6px_14px_#FFFFFF]"}`} title="Tìm kiếm bằng giọng nói" aria-label="Tìm kiếm bằng giọng nói"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" /><path d="M19 10a7 7 0 0 1-14 0" /><path d="M12 18v3" /><path d="M8 21h8" /></svg></button>
                    <button onClick={() => handleSend()} disabled={!input.trim()} className="h-10 px-5 rounded-full bg-[#1A1D24] text-white text-[13px] font-semibold shadow-[4px_4px_12px_#D1D9E6,-4px_-4px_12px_#FFFFFF] hover:shadow-[6px_6px_16px_#D1D9E6] disabled:bg-[#E0E4EA] disabled:text-[#9AA0AE] disabled:shadow-none transition-all flex items-center gap-1.5">Tìm kiếm<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg></button>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-6">{["15tr học CNTT", "Gaming 20tr RTX 4060", "Mỏng nhẹ <1.4kg OLED", "PC 25tr render Premiere"].map((s) => (<button key={s} onClick={() => handleSend(s)} className="text-[12.5px] px-3.5 py-2 rounded-full bg-[#F0F2F5] text-[#6B6F7B] shadow-[4px_4px_10px_#D1D9E6,-4px_-4px_10px_#FFFFFF] hover:shadow-[6px_6px_14px_#D1D9E6,-6px_-6px_14px_#FFFFFF] transition-shadow">{s}</button>))}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-10 text-left">{[{ t: "Hiểu đúng ý bạn", d: "Bạn nói kiểu thường ngày là được, TechWise tự hiểu và lọc ra máy hợp với bạn nhất" }, { t: "So sánh dễ hiểu", d: "Thấy ngay mỗi máy được gì, mất gì và có dễ hối hận sau này không" }, { t: "Đáng tiền thực tế", d: "Gợi ý dựa trên trải nghiệm dùng thật và giá bán, không chỉ thông số trên giấy" }].map((f) => (<div key={f.t} className="rounded-[20px] bg-[#F0F2F5] p-4 shadow-[6px_6px_16px_#D1D9E6,-6px_-6px_16px_#FFFFFF]"><div className="text-[12px] font-semibold text-[#1A1D24] tracking-tight">{f.t}</div><div className="text-[12px] leading-relaxed text-[#6B6F7B] mt-1">{f.d}</div></div>))}</div>
            </div>
          </div>
        )}

        {(hasSearched || isStreaming || isThinking) && (
          <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-visible px-3 sm:px-4 lg:px-8 py-5 pb-[96px] space-y-4 scroll-smooth bg-transparent relative z-10">
            <div className="w-full max-w-none space-y-4 overflow-visible relative z-10">
              {messages.map((m) => {
                const isTyping = typingId === m.id && m.role === "assistant";
                const hasProducts = !!m.products?.length;
                return (
                <div key={m.id} className={`flex gap-2.5 sm:gap-3 overflow-visible ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    isTyping ? (
                      <div className="w-8 h-8 flex items-center justify-center shrink-0 mt-1 overflow-visible relative">
                        <AvatarSphere />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#FF3B00] flex items-center justify-center text-[11px] font-mono font-black text-white shrink-0 mt-1 shadow-[3px_3px_8px_#C8D2E3,-3px_-3px_8px_#FFFFFF]">TW</div>
                    )
                  )}
                  <div className={`flex-1 ${hasProducts ? "max-w-none" : "max-w-[760px]"} ${m.role === "user" ? "flex justify-end" : ""}`}>
                    <div className={`${m.role === "user" ? "bg-[#F0F2F5] rounded-[18px] rounded-br-md px-4 py-2.5 max-w-[560px] shadow-[5px_5px_12px_#D1D9E6,-5px_-5px_12px_#FFFFFF] text-[#1A1D24]" : hasProducts ? "bg-transparent px-0 py-0 w-full" : "bg-[#F0F2F5] rounded-2xl px-4 py-3 w-full shadow-[5px_5px_14px_#D1D9E6,-5px_-5px_14px_#FFFFFF] text-[#2B2E36]"} `}>
                      {m.text && (
                        <div className={`${hasProducts ? "bg-[#F0F2F5] rounded-2xl px-4 py-3 max-w-[760px] shadow-[5px_5px_14px_#D1D9E6,-5px_-5px_14px_#FFFFFF]" : ""} text-[13.5px] leading-[1.65] whitespace-pre-wrap text-[#2B2E36]`}>
                          {m.text.split("**").map((part, i) => (i % 2 === 1 ? <span key={i} className="font-semibold text-[#1A1D24]">{part}</span> : part))}
                          {isTyping && <span className="typing-cursor" aria-hidden />}
                        </div>
                      )}
                      {isTyping && (
                        <div className={`flex items-center gap-2 text-[11px] font-sans font-medium tracking-[0.08em] text-[#1A1D24] ${hasProducts ? "mt-2 ml-1 max-w-[760px]" : "mt-2"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B00] animate-pulse" />
                          <span className="tracking-[0.08em]">Đang phản hồi</span>
                          <span className="inline-flex gap-1 ml-1"><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:120ms]" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:240ms]" /></span>
                        </div>
                      )}

                      {m.clarification && (
                        <div className={`p-3.5 rounded-[16px] bg-[#F0F2F5] stagger-card max-w-[760px] shadow-[5px_5px_12px_#D1D9E6,-5px_-5px_12px_#FFFFFF] ${m.text ? "mt-3" : "mt-0"}`} style={{ animationDelay: "80ms" }}>
                          <div className="text-[11px] font-mono tracking-widest text-[#6B6F7B] mb-1.5">GỢI Ý TINH CHỈNH</div>
                          <div className="text-[13px] text-[#1A1D24] leading-snug">{m.clarification.question}</div>
                          <div className="flex flex-wrap gap-2 mt-2.5">
                            {m.clarification.options.map((o) => (<button key={o} onClick={() => handleClarify(o)} className="text-[12px] px-3.5 py-1.5 rounded-full bg-[#F0F2F5] text-[#2B2E36] shadow-[3px_3px_8px_#D1D9E6,-3px_-3px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#D1D9E6,-5px_-5px_10px_#FFFFFF] transition-shadow">{o}</button>))}
                          </div>
                        </div>
                      )}

                      {m.products && (
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center justify-between stagger-card max-w-[760px]">
                            <div className="text-[11px] font-mono tracking-[0.14em] text-[#6B6F7B]">KẾT QUẢ PHÙ HỢP NHẤT</div>
                            <button onClick={() => setShowMatrix(!showMatrix)} className="text-[11px] font-mono text-[#6B6F7B] bg-[#F0F2F5] rounded-full px-3 py-1 shadow-[3px_3px_8px_#D1D9E6,-3px_-3px_8px_#FFFFFF] hover:shadow-[4px_4px_10px_#D1D9E6] transition-shadow">{showMatrix ? "Ẩn so sánh" : "So sánh nhanh"}</button>
                          </div>
                          {lastTrace && backendOk && (
                            <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A90A2] max-w-[760px]">
                              <span>Nguồn: Backend LIVE</span>
                              <span className="opacity-60 truncate">· {lastTrace.slice(0, 16)}</span>
                              {lastCacheHit && <span className="px-1.5 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[9px] font-medium">CACHE HIT &lt;50ms</span>}
                            </div>
                          )}

                          {showMatrix && m.matrix && (
                            <div className="overflow-hidden rounded-[16px] bg-[#F0F2F5] stagger-card max-w-[760px] shadow-[6px_6px_16px_#D1D9E6,-6px_-6px_16px_#FFFFFF]" style={{ animationDelay: "120ms" }}>
                              <div className="grid grid-cols-3 divide-x divide-[#E6E9EF] text-[12px] font-sans">
                                {[
                                  { name: "Lenovo Gaming 3", pp: "Rất đáng tiền 8.7", w: "Hơi nặng 2.3kg", pin: "Pin ~4 tiếng", regret: "Yên tâm", color: "#22c55e" },
                                  { name: "Swift Go 14", pp: "Đáng tiền 7.9", w: "Nhẹ 1.3kg", pin: "Pin lâu 8 tiếng", regret: "Cân nhắc", color: "#eab308" },
                                  { name: "HP Victus", pp: "Tạm ổn 7.2", w: "Hơi nặng 2.3kg", pin: "Pin ~5 tiếng", regret: "Dễ tiếc", color: "#ef4444" },
                                ].map((c) => (
                                  <div key={c.name} className="p-3">
                                    <div className="text-[#1A1D24] font-sans font-semibold truncate text-[12px]">{c.name}</div>
                                    <div className="mt-1.5 space-y-1 text-[#1A1D24]">
                                      <div className="text-[11px] font-sans text-[#6B6F7B]">Đáng tiền <span className="text-[#1A1D24] font-semibold">{c.pp}</span></div>
                                      <div className="text-[11px] font-sans text-[#6B6F7B]">{c.w} · {c.pin}</div>
                                      <div><span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold text-white" style={{ background: c.color }}>{c.regret}</span></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="px-3 py-2.5 bg-[#F0F2F5] border-t border-[#E6E9EF] text-[12px] font-sans text-[#1A1D24] leading-snug"><span className="font-semibold text-[#FF3B00]">Gợi ý dễ hiểu:</span> Muốn nhẹ mang đi học → chọn Swift Go. Muốn chơi game mượt và đáng tiền → chọn Lenovo.</div>
                            </div>
                          )}

                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                            {m.products.map((p, idx) => {
                              const wNum = (p as any).weightNum != null ? (p as any).weightNum : (parseFloat(p.weight) || 2.0);
                              const bWh = (p as any).batteryWh != null ? (p as any).batteryWh : 50;
                              const weightPlain = wNum <= 1.5 ? "Nhẹ, dễ mang theo" : wNum > 2.2 ? "Hơi nặng" : "Vừa phải";
                              const batteryPlain = bWh >= 60 ? "Pin lâu ~8 tiếng" : bWh >= 50 ? "Pin vừa ~5 tiếng" : "Pin ~4 tiếng";
                              const screenPlain = p.display.includes("OLED") ? "Màn đẹp, màu rực rỡ" : p.display.includes("144Hz") ? "Màn mượt 144Hz" : "Màn rõ nét";
                              const worthPlain = p.ppScore >= 8.5 ? "Rất đáng tiền" : p.ppScore >= 7.8 ? "Đáng tiền" : "Giá ổn";
                              const categoryPlain = p.category === "GAMING" ? "Chơi game" : p.category === "ULTRABOOK" ? "Mỏng nhẹ" : p.category === "ENTRY GAMING" ? "Phổ thông" : p.category;
                              const regretPlain = p.regret === "Thấp" ? "Yên tâm dùng lâu" : p.regret === "Trung bình" ? "Cân nhắc" : "Dễ tiếc sau này";
                              return (
                              <div key={p.id} className="rounded-[20px] bg-[#F0F2F5] flex flex-col stagger-card shadow-[7px_7px_18px_#CBD5E6,-7px_-7px_18px_#FFFFFF] hover:shadow-[9px_9px_22px_#CBD5E6] transition-shadow" style={{ animationDelay: `${180 + idx * 110}ms` }}>
                                <div className="flex items-center justify-between px-4 py-3">
                                  <span className="text-[11px] font-sans font-semibold tracking-[0.04em] text-[#1A1D24] flex items-center gap-1.5">{p.badge && <span className="bg-[#FF3B00] text-white px-2 py-0.5 rounded-full text-[9px] font-bold">{p.badge}</span>}{categoryPlain}</span>
                                  <span className="text-[11px] font-sans font-medium text-[#6B6F7B] bg-[#F0F2F5] px-2.5 py-1 rounded-full shadow-[inset_2px_2px_4px_#C8D0E0,inset_-2px_-2px_4px_#FFFFFF]">{p.affiliate}</span>
                                </div>
                                <div className="px-4 pb-4 flex-1 flex flex-col gap-3">
                                  <div className="text-[14px] font-sans font-semibold text-[#1A1D24] leading-snug line-clamp-2 min-h-[40px]">{p.name}</div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-[18px] font-sans font-bold text-[#1A1D24] tracking-tight">{p.price}</span>
                                    <span className="text-[11px] font-sans font-medium px-2.5 py-1 rounded-full text-white" style={{ background: p.regretColor }}>{regretPlain}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[12px] font-sans">
                                    <span className="px-2.5 py-1 rounded-full bg-[#F0F2F5] shadow-[3px_3px_8px_#CBD5E6,-3px_-3px_8px_#FFFFFF] font-medium text-[#1A1D24]">{worthPlain} · {p.ppScore}/10</span>
                                    <span className="text-[11px] font-sans text-[#6B6F7B]">{p.benchmark.split("·")[0].replace("Cinebench","Tốc độ").replace("Geekbench","Tốc độ")}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-[12px] font-sans leading-relaxed">
                                    <div className="bg-[#F0F2F5] rounded-xl p-2.5 shadow-[inset_3px_3px_6px_#CBD5E6,inset_-3px_-3px_6px_#FFFFFF] text-center">
                                      <div className="text-[11px] font-sans text-[#6B6F7B]">Cân nặng</div>
                                      <div className="text-[12px] font-sans font-medium text-[#1A1D24] mt-1">{weightPlain}</div>
                                      <div className="text-[10px] font-sans text-[#8A90A2]">{wNum}kg</div>
                                    </div>
                                    <div className="bg-[#F0F2F5] rounded-xl p-2.5 shadow-[inset_3px_3px_6px_#CBD5E6,inset_-3px_-3px_6px_#FFFFFF] text-center">
                                      <div className="text-[11px] font-sans text-[#6B6F7B]">Pin</div>
                                      <div className="text-[12px] font-sans font-medium text-[#1A1D24] mt-1">{batteryPlain}</div>
                                    </div>
                                    <div className="bg-[#F0F2F5] rounded-xl p-2.5 shadow-[inset_3px_3px_6px_#CBD5E6,inset_-3px_-3px_6px_#FFFFFF] text-center col-span-2">
                                      <div className="text-[11px] font-sans text-[#6B6F7B]">Màn hình</div>
                                      <div className="text-[12px] font-sans font-medium text-[#1A1D24] mt-1">{screenPlain}</div>
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="text-[11px] font-sans font-medium text-[#0F5132] bg-[#E6F4EA] px-3 py-1.5 rounded-full">✓ {p.pros[0].replace("GPU rời","Chơi game tốt").replace("RAM dual-channel","Mở nhiều tab mượt").replace("Tản 2 quạt","Máy mát")}</div>
                                    <div className="text-[11px] font-sans font-medium text-[#842029] bg-[#FCE8E9] px-3 py-1.5 rounded-full">• {p.cons[0].replace("Vỏ nhựa flex","Vỏ hơi ọp ẹp").replace("Pin 45Wh","Pin hơi yếu").replace("RAM hàn chết","Không nâng cấp được")}</div>
                                  </div>
                                </div>
                                <div className="flex gap-2 px-4 pb-4">
                                  <button className="flex-1 h-10 rounded-full bg-[#1A1D24] text-white text-[13px] font-sans font-semibold shadow-[4px_4px_10px_#CBD5E6]">Xem giá tại {p.affiliate} →</button>
                                  <button className="h-10 px-4 rounded-full bg-[#F0F2F5] text-[#1A1D24] text-[12px] font-sans font-medium shadow-[3px_3px_8px_#CBD5E6]">So sánh</button>
                                </div>
                              </div>
                            )})}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {m.role === "user" && <div className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[11px] font-mono text-[#6B6F7B] shrink-0 mt-1 shadow-[3px_3px_8px_#D1D9E6,-3px_-3px_8px_#FFFFFF]">Bạn</div>}
                </div>
                );
              })}
              {/* Trạng thái suy nghĩ / đang phản hồi tách biệt để người dùng thấy độ khựng */}
              {isThinking && (
                <div className="flex gap-3 overflow-visible">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0 overflow-visible relative">
                    <AvatarSphere />
                  </div>
                  <div className="pl-2 pr-4 py-2 rounded-2xl bg-[#F0F2F5] flex items-center gap-3 shadow-[5px_5px_14px_#D1D9E6,-5px_-5px_14px_#FFFFFF]">
                    <div className="w-14 h-14 rounded-full bg-[#F0F2F5] flex items-center justify-center shrink-0 shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF] overflow-hidden">
                      <ThinkingSphere />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-[#1A1D24]">Đang suy nghĩ</span>
                      <span className="text-[11px] font-mono text-[#8A90A2]">Đang phân tích yêu cầu...</span>
                    </div>
                    <span className="inline-flex gap-1 ml-1"><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:150ms]" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:300ms]" /></span>
                  </div>
                </div>
              )}
              {isStreaming && !isThinking && !typingId && (
                <div className="flex gap-3 overflow-visible">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0 overflow-visible relative">
                    <AvatarSphere />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-[#F0F2F5] text-[#6B6F7B] text-[13px] flex items-center gap-2 shadow-[5px_5px_12px_#D1D9E6,-5px_-5px_12px_#FFFFFF]">
                    Đang tìm thông tin phù hợp
                    <span className="inline-flex gap-1 ml-1"><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:120ms]" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:240ms]" /></span>
                  </div>
                </div>
              )}
            </div>
            <div ref={bottomRef} className="h-1 shrink-0" aria-hidden />
          </div>
        )}

        {(hasSearched || isStreaming || isThinking) && (
          <div className="fixed bottom-0 inset-x-0 bg-transparent border-0 p-3 lg:p-4 z-30 pointer-events-none">
            <div className="max-w-[820px] mx-auto pointer-events-auto relative">
              <div className="absolute -inset-2 rounded-[28px] chat-spread-1 pointer-events-none" aria-hidden />
              <div className="absolute -inset-2 rounded-[28px] chat-spread-2 pointer-events-none" aria-hidden />
              <div className={`relative flex items-center gap-2 p-2 pl-3 rounded-[24px] bg-[#F0F2F5] shadow-[7px_7px_18px_#CBD5E6,-7px_-7px_18px_#FFFFFF] transition-all ${isListening || isVoiceAnalyzing ? "shadow-[7px_7px_18px_#CBD5E6,-7px_-7px_18px_#FFFFFF,0_0_0_3px_rgba(255,59,0,0.16)]" : "focus-within:shadow-[9px_9px_22px_#CBD5E6,-9px_-9px_22px_#FFFFFF]"}`}>
                <button onClick={toggleListen} className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${isListening ? "bg-[#FF3B00] text-white shadow-[0_4px_12px_rgba(255,59,0,0.35)] animate-pulse" : isPolishing ? "bg-[#F59E0B] text-white shadow-[0_4px_12px_rgba(245,158,11,0.35)] animate-pulse" : isVoiceAnalyzing ? "bg-[#F0F2F5] text-[#FF3B00] shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF]" : "bg-[#F0F2F5] text-[#6B6F7B] shadow-[4px_4px_10px_#D1D9E6,-4px_-4px_10px_#FFFFFF] hover:shadow-[5px_5px_12px_#D1D9E6]"}`} aria-label="Tìm kiếm bằng giọng nói"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" /><path d="M19 10a7 7 0 0 1-14 0" /><path d="M12 18v3" /></svg></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder={isListening ? "Đang nghe... nói tới đâu hiện tới đó" : isPolishing ? "Đang Whisper polish..." : isVoiceAnalyzing ? "Đang phân tích giọng nói..." : isThinking ? "Hệ thống đang suy nghĩ..." : typingId ? "Hệ thống đang phản hồi..." : "Tiếp tục tìm kiếm — ví dụ: “So sánh 2 máy trên về tản nhiệt”"} className="flex-1 bg-transparent outline-none text-[13.5px] placeholder:text-[#9AA0AE] py-1.5 text-[#1A1D24]" disabled={isVoiceAnalyzing || isPolishing || isThinking} />
                <button onClick={() => handleSend()} disabled={!input.trim() || isStreaming || isThinking || isVoiceAnalyzing || !!typingId} className="w-9 h-9 rounded-full bg-[#1A1D24] hover:bg-[#2A2E3A] disabled:bg-[#E0E4EA] disabled:text-[#9AA0AE] text-white flex items-center justify-center shrink-0 shadow-[4px_4px_10px_#D1D9E6,-4px_-4px_10px_#FFFFFF] transition-all"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg></button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .typing-cursor{ display:inline-block; width:2px; height:1em; background:#FF3B00; margin-left:3px; vertical-align:-1px; animation:cursorBlink 1s step-end infinite; }
        @keyframes cursorBlink{ 0%,50%{ opacity:1 } 51%,100%{ opacity:0 } }
        .stagger-card{ animation:cardIn 420ms cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes cardIn{ from{ opacity:0; transform:translateY(10px) scale(0.98) } to{ opacity:1; transform:translateY(0) scale(1) } }
        .chat-spread-1{ background: radial-gradient(ellipse at center, rgba(255,59,0,0.06), transparent 68%); animation: chatSpread 3.8s cubic-bezier(0.33,0,0.67,1) infinite; }
        .chat-spread-2{ border: 1px solid rgba(255,59,0,0.05); animation: chatSpread 3.8s cubic-bezier(0.33,0,0.67,1) infinite 1.2s; }
        @keyframes chatSpread{ 0%{ transform: scale(0.96); opacity: 0.22 } 100%{ transform: scale(1.07); opacity: 0 } }
        .search-spread-outer{ background: radial-gradient(ellipse at center, rgba(59,130,246,0.09), transparent 72%); filter: blur(8px); animation: searchLoang 4.6s ease-in-out infinite; }
        .search-spread-inner{ border: 1px solid rgba(59,130,246,0.07); animation: searchLoang 4.6s ease-in-out infinite 1.5s; }
        @keyframes searchLoang{ 0%{ transform: scale(0.98); opacity: 0.28 } 50%{ transform: scale(1.035); opacity: 0.13 } 100%{ transform: scale(0.98); opacity: 0.28 } }
      `}</style>
    </div>
  );
}
