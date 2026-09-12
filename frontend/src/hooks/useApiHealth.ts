"use client";
import { useState, useEffect } from "react";
export function useApiHealth() {
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [lastTrace, setLastTrace] = useState<string | null>(null);
  const [lastCacheHit, setLastCacheHit] = useState<boolean | null>(null);
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const check = async () => {
      try { const r = await fetch(`${API}/health`, { cache: "no-store" }); setBackendOk(r.ok); } catch { setBackendOk(false); }
    };
    check();
    const id = window.setInterval(check, 30000);
    return () => window.clearInterval(id);
  }, []);
  return { backendOk, setBackendOk, lastTrace, setLastTrace, lastCacheHit, setLastCacheHit };
}
export { useApiHealth as useBackendHealth };
