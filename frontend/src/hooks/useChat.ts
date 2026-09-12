"use client";
import { useState, useRef } from "react";
import type { ChatMessage, Product } from "@/lib/domain.types";
import { buildFallbackSummary, getFallbackProducts } from "@/lib/fallbackRecommendation";
export function useChat(
  backendControls: { setBackendOk: (v: boolean) => void; setLastTrace: (v: string | null) => void; setLastCacheHit: (v: boolean | null) => void },
) {
  const [messages, setMessages] = useState<ChatMessage[]>([
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
  const timersRef = useRef<number[]>([]);
  const handleSend = (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || isStreaming || isThinking) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsStreaming(true);
    setIsThinking(true);
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
          backendControls.setBackendOk(true);
          if (backend?.traceId) backendControls.setLastTrace(backend.traceId);
          backendControls.setLastCacheHit(!!backend?.cache?.hit);
        } else backendControls.setBackendOk(false);
      } catch (e) {
        console.warn("Backend not reachable, fallback to mock", e);
        backendControls.setBackendOk(false);
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
  return { messages, input, setInput, isStreaming, isThinking, typingId, timersRef, handleSend };
}
