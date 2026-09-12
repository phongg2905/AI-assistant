"use client";

import { useId, useEffect, useRef, useState, useCallback } from "react";

// ── Surface functions (kube.io) ─────────────────────────────────
const smootherstep = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
const mix = (a: number, b: number, t: number) => a * (1 - t) + b * t;

const convexCircle = (x: number) => Math.sqrt(Math.max(0, 1 - (1 - x) * (1 - x)));
const convexSquircle = (x: number) => Math.pow(Math.max(0, 1 - Math.pow(1 - x, 4)), 0.25);
const concaveFrom = (x: number, convexFn: (v: number) => number) => 1 - convexFn(x);
const lipFn = (x: number) => {
  const c = convexSquircle(x);
  const cc = concaveFrom(x, convexSquircle);
  return mix(c, cc, smootherstep(x));
};

type SurfaceType = "convexCircle" | "convexSquircle" | "concave" | "lip";

const SURFACE_FNS: Record<SurfaceType, (x: number) => number> = {
  convexCircle,
  convexSquircle,
  concave: (x) => concaveFrom(x, convexSquircle),
  lip: lipFn,
};

// ── Snell refraction precalc ────────────────────────────────────
type DisplacementSample = { raw: number; norm: number };

function precalculateDisplacements(opts: {
  bezelWidth: number;
  thickness: number;
  refractiveIndex: number;
  surface: SurfaceType;
}): { samples: number[]; max: number } {
  const { bezelWidth, thickness, refractiveIndex, surface } = opts;
  const fn = SURFACE_FNS[surface];
  const n1 = 1;
  const n2 = refractiveIndex;
  const ratio = n1 / n2;
  const SAMPLES = 127;
  const delta = 0.001;
  const raws: number[] = [];

  for (let i = 0; i < SAMPLES; i++) {
    const t = i / (SAMPLES - 1); // distanceFromSide 0..1
    // height at this distance
    const h = thickness * fn(t);
    if (h <= 0.01) {
      raws.push(0);
      continue;
    }
    // derivative dh/dx_pixel
    const y1 = fn(Math.max(0, t - delta));
    const y2 = fn(Math.min(1, t + delta));
    const dNorm = (y2 - y1) / (2 * delta); // df/dx_norm
    const dPixel = (thickness * dNorm) / bezelWidth; // dh/dx_pixel
    // normal
    const nx = -dPixel;
    const ny = 1;
    const len = Math.hypot(nx, ny);
    const Nnx = nx / len;
    const Nny = ny / len;
    // incident I = (0,-1)
    const cosI = Nny; // -dot(I,N) = Ny
    const cosIClamped = Math.max(-1, Math.min(1, cosI));
    const sinI2 = Math.max(0, 1 - cosIClamped * cosIClamped);
    const sinT2 = ratio * ratio * sinI2;
    if (sinT2 > 1) {
      raws.push(0);
      continue;
    }
    const cosT = Math.sqrt(Math.max(0, 1 - sinT2));
    // refracted direction T = ratio*I + (ratio*cosI - cosT)*N
    const coeff = ratio * cosIClamped - cosT;
    const Tx = coeff * Nnx;
    const Ty = ratio * -1 + coeff * Nny;
    if (Ty >= -1e-6) {
      raws.push(0);
      continue;
    }
    const tParam = h / -Ty;
    const disp = Math.abs(Tx * tParam);
    // concave pushes outside – we keep inside only, but for concave disp would be outward
    // For n2>n1 convex keeps inside (positive). For concave, Tx sign flips? Our calc already gives outward for concave (since surface inverted)
    // Keep magnitude but we will direct inward later; for now store absolute.
    raws.push(disp);
  }
  const max = Math.max(...raws, 0.0001);
  const normalized = raws.map((v) => v / max);
  return { samples: normalized, max };
}

// ── SDF for rounded rect (capsule) ───────────────────────────────
function sdRoundedRect(px: number, py: number, W: number, H: number, R: number): number {
  const cx = W / 2;
  const cy = H / 2;
  const bx = W / 2;
  const by = H / 2;
  const qx = Math.abs(px - cx) - bx + R;
  const qy = Math.abs(py - cy) - by + R;
  const maxQx = Math.max(qx, 0);
  const maxQy = Math.max(qy, 0);
  const len = Math.hypot(maxQx, maxQy);
  const m = Math.max(qx, qy);
  const inside = Math.min(m, 0);
  return len + inside - R;
}

// ── Main component ───────────────────────────────────────────────
type KubeLiquidGlassProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  radius?: number | string;
  frost?: number;
  bezelWidth?: number; // px
  thickness?: number; // px glass height
  refractiveIndex?: number; // 1.1..2.0
  surface?: SurfaceType;
  scaleRatio?: number; // 0..1 artistic scale
  specularAngle?: number; // deg, -180..180
  specularOpacity?: number; // 0..1
  blur?: number;
  chromatic?: boolean;
  // legacy compat from freefrontend version
  displacementScale?: number;
  withHighlight?: boolean;
  saturation?: number;
};

export function KubeLiquidGlass({
  children,
  className = "",
  style,
  radius = 24,
  frost = 0.06,
  bezelWidth: bezelWidthProp,
  thickness: thicknessProp,
  refractiveIndex = 1.5,
  surface = "convexSquircle",
  scaleRatio = 1,
  specularAngle = -60,
  specularOpacity = 0.42,
  blur = 1.2,
  chromatic = false,
  displacementScale,
  saturation,
  withHighlight,
}: KubeLiquidGlassProps) {
  // map legacy props
  const bezelWidth = bezelWidthProp ?? (displacementScale ? Math.max(8, Math.min(24, displacementScale)) : 14);
  const thickness = thicknessProp ?? (displacementScale ? Math.max(6, displacementScale * 0.55) : 10);
  const saturate = saturation ?? 1.15;
  const autoId = useId().replace(/:/g, "");
  const filterId = `kube-liquid-${autoId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [maps, setMaps] = useState<{ dispUrl: string | null; specularUrl: string | null; maxDisp: number }>({
    dispUrl: null,
    specularUrl: null,
    maxDisp: 12,
  });

  const r = typeof radius === "number" ? `${radius}px` : radius;

  const generateMaps = useCallback(
    (W: number, H: number) => {
      const Rraw = typeof radius === "number" ? radius : 24;
      // resolve radius for SDF: if radius string "9999px" treat as pill -> R = H/2
      let R = Rraw;
      if (typeof radius === "string" && radius.includes("9999")) R = H / 2;
      else if (typeof radius === "string") R = parseFloat(radius) || 24;
      R = Math.min(R, Math.min(W, H) / 2);

      const { samples, max } = precalculateDisplacements({
        bezelWidth,
        thickness,
        refractiveIndex,
        surface,
      });
      const maxDisp = max * scaleRatio;

      // canvas for displacement map
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(W));
      c.height = Math.max(1, Math.round(H));
      const ctx = c.getContext("2d");
      if (!ctx) return { dispUrl: null, specularUrl: null, maxDisp };
      const img = ctx.createImageData(c.width, c.height);
      const sCanvas = document.createElement("canvas");
      sCanvas.width = c.width;
      sCanvas.height = c.height;
      const sCtx = sCanvas.getContext("2d");
      const sImg = sCtx ? sCtx.createImageData(c.width, c.height) : null;

      const lightRad = (specularAngle * Math.PI) / 180;
      const lightX = Math.cos(lightRad);
      const lightY = Math.sin(lightRad);

      // helper to sample magnitude at normalized distance
      const sampleMag = (norm: number) => {
        const f = norm * (samples.length - 1);
        const i0 = Math.floor(f);
        const i1 = Math.min(samples.length - 1, i0 + 1);
        const t = f - i0;
        return samples[i0] * (1 - t) + samples[i1] * t;
      };

      for (let y = 0; y < c.height; y++) {
        for (let x = 0; x < c.width; x++) {
          const idx = (y * c.width + x) * 4;
          const sdf = sdRoundedRect(x + 0.5, y + 0.5, W, H, R);
          const inside = sdf < 0;
          if (!inside) {
            img.data[idx] = 128;
            img.data[idx + 1] = 128;
            img.data[idx + 2] = 128;
            img.data[idx + 3] = 255;
            if (sImg) {
              sImg.data[idx] = 255;
              sImg.data[idx + 1] = 255;
              sImg.data[idx + 2] = 255;
              sImg.data[idx + 3] = 0;
            }
            continue;
          }
          const distToEdge = -sdf;
          if (distToEdge > bezelWidth) {
            // flat interior – no displacement, no specular
            img.data[idx] = 128;
            img.data[idx + 1] = 128;
            img.data[idx + 2] = 128;
            img.data[idx + 3] = 255;
            if (sImg) {
              sImg.data[idx] = 255;
              sImg.data[idx + 1] = 255;
              sImg.data[idx + 2] = 255;
              sImg.data[idx + 3] = 0;
            }
            continue;
          }
          const normDist = distToEdge / bezelWidth; // 0 at edge, 1 at inner
          const magNorm = sampleMag(normDist);

          // gradient for direction (inward)
          const eps = 1;
          const sdfL = sdRoundedRect(x - eps + 0.5, y + 0.5, W, H, R);
          const sdfR = sdRoundedRect(x + eps + 0.5, y + 0.5, W, H, R);
          const sdfT = sdRoundedRect(x + 0.5, y - eps + 0.5, W, H, R);
          const sdfB = sdRoundedRect(x + 0.5, y + eps + 0.5, W, H, R);
          const gx = (sdfR - sdfL) / (2 * eps);
          const gy = (sdfB - sdfT) / (2 * eps);
          const glen = Math.hypot(gx, gy) || 1;
          // inward
          const ix = -gx / glen;
          const iy = -gy / glen;

          const vx = ix * magNorm;
          const vy = iy * magNorm;
          const rr = Math.round(128 + vx * 127);
          const gg = Math.round(128 + vy * 127);
          img.data[idx] = Math.max(0, Math.min(255, rr));
          img.data[idx + 1] = Math.max(0, Math.min(255, gg));
          img.data[idx + 2] = 128;
          img.data[idx + 3] = 255;

          if (sImg) {
            // specular: rim highlight
            const dot = ix * lightX + iy * lightY;
            const rim = Math.pow(Math.max(0, dot), 2.2);
            // falloff from edge
            const edgeFalloff = 1 - normDist; // 1 at edge
            const intensity = rim * edgeFalloff * specularOpacity;
            const a = Math.round(Math.max(0, Math.min(1, intensity)) * 255);
            // slight warm white
            sImg.data[idx] = 255;
            sImg.data[idx + 1] = 255;
            sImg.data[idx + 2] = 255;
            sImg.data[idx + 3] = a;
          }
        }
      }
      ctx.putImageData(img, 0, 0);
      let specularUrl: string | null = null;
      if (sCtx && sImg) {
        sCtx.putImageData(sImg, 0, 0);
        specularUrl = sCanvas.toDataURL("image/png");
      }
      return { dispUrl: c.toDataURL("image/png"), specularUrl, maxDisp };
    },
    [radius, bezelWidth, thickness, refractiveIndex, surface, scaleRatio, specularAngle, specularOpacity]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = Math.round(e.contentRect.width);
        const h = Math.round(e.contentRect.height);
        if (w > 0 && h > 0) setSize({ w, h });
      }
    });
    ro.observe(el);
    // initial
    const rect = el.getBoundingClientRect();
    if (rect.width && rect.height) setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!size) return;
    const { dispUrl, specularUrl, maxDisp } = generateMaps(size.w, size.h);
    setMaps({ dispUrl, specularUrl, maxDisp });
  }, [size, generateMaps]);

  // Fix hydration mismatch: server always renders fallback (isChrome=false).
  // Client determines Chrome after mount so initial HTML matches server.
  const [isChrome, setIsChrome] = useState(false);
  useEffect(() => {
    setIsChrome(typeof navigator !== "undefined" && /Chrome/.test(navigator.userAgent));
  }, []);

  return (
    <div ref={containerRef} className={`relative isolate ${className}`} style={{ borderRadius: r, contain: "layout paint style" as any, ...style }}>
      {/* SVG filter – only Chrome supports backdrop-filter:url(#id) */}
      <svg width={0} height={0} aria-hidden style={{ position: "absolute", pointerEvents: "none", opacity: 0 }}>
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            primitiveUnits="userSpaceOnUse"
          >
            {maps.dispUrl && (
              <>
                <feImage href={maps.dispUrl} x={0} y={0} width="100%" height="100%" preserveAspectRatio="none" result="dispMap" />
                {/* chromatic split: if enabled, could do 3 maps, here single */}
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="dispMap"
                  scale={maps.maxDisp}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="refracted"
                />
                {maps.specularUrl && (
                  <>
                    <feImage href={maps.specularUrl} x={0} y={0} width="100%" height="100%" preserveAspectRatio="none" result="specMap" />
                    <feColorMatrix in="specMap" type="matrix" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${specularOpacity} 0`} result="specAlpha" />
                    <feBlend in="refracted" in2="specAlpha" mode="screen" result="withSpecular" />
                    <feGaussianBlur in="withSpecular" stdDeviation={blur} result="final" />
                  </>
                )}
                {!maps.specularUrl && <feGaussianBlur in="refracted" stdDeviation={blur} result="final" />}
              </>
            )}
          </filter>
        </defs>
      </svg>

      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: r,
          background: `hsl(0 0% 100% / ${frost})`,
          // kube spec: backdrop-filter: url(#id) – Chrome only
          backdropFilter: maps.dispUrl && isChrome ? `url(#${filterId}) saturate(${saturate})` : `blur(${Math.max(8, blur * 6)}px) saturate(${saturate})`,
          WebkitBackdropFilter: maps.dispUrl && isChrome ? `url(#${filterId}) saturate(${saturate})` as any : `blur(${Math.max(8, blur * 6)}px) saturate(${saturate})` as any,
          boxShadow: `inset 0 0 1.5px 1px rgba(255,255,255,0.42), inset 0 1px 8px rgba(255,255,255,0.22), inset 0 -1px 6px rgba(0,0,0,0.06), 0 8px 28px rgba(31,38,135,0.09)`,
          border: "1px solid rgba(255,255,255,0.48)",
          willChange: "backdrop-filter, transform",
          transform: "translateZ(0)",
        }}
      >
        {/* fallback subtle top highlight for non-Chrome */}
        {!isChrome && <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-60" style={{ borderRadius: r }} />}
        <div className="relative z-10 w-full h-full">{children}</div>
      </div>

      {/* debug overlay for Chrome check – can remove */}
      <style>{`@supports not (backdrop-filter: url(#${filterId})) {}`}</style>
    </div>
  );
}

// Keep old export name for compatibility
export { KubeLiquidGlass as LiquidGlass };
export { KubeLiquidGlass as LiquidGlassKube };
