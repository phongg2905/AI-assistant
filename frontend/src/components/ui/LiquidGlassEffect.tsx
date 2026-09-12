"use client";
// Wrapper giữ tương thích import cũ "@/components/ui/LiquidGlassEffect"
// Thực chất trỏ sang bản vật lý kube.io (Snell + 127 samples) ở LiquidGlassKube.tsx
export { KubeLiquidGlass as LiquidGlass } from "./LiquidGlassKube";
export { KubeLiquidGlass as LiquidGlassEffect } from "./LiquidGlassKube";
export { KubeLiquidGlass as default } from "./LiquidGlassKube";
