"use client";

import { useState } from "react";
import { LiquidGlass } from "@/components/ui/LiquidGlassEffect";

type Props = {
  input: string;
  isListening: boolean;
  isPolishing: boolean;
  isVoiceAnalyzing: boolean;
  isThinking: boolean;
  isStreaming: boolean;
  typingId: string | null;
  onInputChange: (v: string) =>void;
  onSend: () =>void;
  onToggleListen: () =>void;
};

export function ChatInput({ input, isListening, isPolishing, isVoiceAnalyzing, isThinking, isStreaming, typingId, onInputChange, onSend, onToggleListen }: Props) {
  const [pressed, setPressed] = useState(false);
  const triggerPress = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 520);
  };
  return (
    <div className="fixed bottom-0 inset-x-0 bg-transparent border-0 p-3 lg:p-4 z-30 pointer-events-none">
      <div className="max-w-[820px] mx-auto pointer-events-auto relative">
        <LiquidGlass radius={24} frost={0.48} saturation={1.18} bezelWidth={14} thickness={10} refractiveIndex={1.65} surface="convexSquircle" scaleRatio={1.32} specularOpacity={0.38} blur={1.1} className={pressed ? "animate-[iosLiquidPress_520ms_cubic-bezier(0.34,1.56,0.64,1)] will-change-transform" : "will-change-transform"}>
          <div className="relative flex items-center gap-2 p-2 pl-3 rounded-[24px] transition-all overflow-hidden" onClick={triggerPress}>
          <button onClick={(e) => { e.stopPropagation(); triggerPress(); onToggleListen(); }} className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all relative overflow-hidden z-10 ${isListening ? "bg-[#FF3B00] text-white shadow-[0_4px_12px_rgba(255,59,0,0.35)] animate-pulse" : isPolishing ? "bg-[#F59E0B] text-white shadow-[0_4px_12px_rgba(245,158,11,0.35)] animate-pulse" : isVoiceAnalyzing ? "bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] text-[#FF3B00]" : "bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] text-[#6B6F7B]"}`} aria-label="Tìm kiếm bằng giọng nói"><svg width="16"height="16"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="1.7"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" /><path d="M19 10a7 7 0 0 1-14 0" /><path d="M12 18v3" /></svg></button>
          <input value={input} onChange={(e) =>onInputChange(e.target.value)} onFocus={triggerPress} onClick={triggerPress} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }} placeholder={isListening ? "Đang nghe... nói tới đâu hiện tới đó" : isPolishing ? "Đang Whisper polish..." : isVoiceAnalyzing ? "Đang phân tích giọng nói..." : isThinking ? "Hệ thống đang suy nghĩ..." : typingId ? "Hệ thống đang phản hồi..." : "Tiếp tục tìm kiếm — ví dụ: “So sánh 2 máy trên về tản nhiệt”"} className="flex-1 bg-transparent outline-none text-[13.5px] placeholder:text-[#9AA0AE] py-1.5 text-[#1A1D24] relative z-10"disabled={isVoiceAnalyzing || isPolishing || isThinking} />
            <button onClick={onSend} disabled={!input.trim() || isStreaming || isThinking || isVoiceAnalyzing || !!typingId} className="w-9 h-9 rounded-full bg-[#1A1D24] hover:bg-[#2A2E3A] disabled:bg-[#E6E9EF] disabled:text-[#9AA0AE] text-white flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(26,29,36,0.18)] transition-all relative z-10"><svg width="16"height="16"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg></button>
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
}
