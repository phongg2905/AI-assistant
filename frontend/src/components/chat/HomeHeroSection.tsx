"use client";

import { useState } from "react";
import { LiquidGlass } from "@/components/ui/LiquidGlassEffect";

type Props = {
  input: string;
  isListening: boolean;
  onInputChange: (v: string) =>void;
  onSend: () =>void;
  onToggleListen: () =>void;
  onQuickSend: (text: string) =>void;
};

export function HomeHeroSection({ input, isListening, onInputChange, onSend, onToggleListen, onQuickSend }: Props) {
  const [pressed, setPressed] = useState(false);
  const triggerPress = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 520);
  };
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-[760px] flex flex-col items-center text-center">
        <h1 className="mt-5 text-[30px] lg:text-[44px] font-black tracking-tight leading-none text-[#1A1D24]"><span className="text-[#1A1D24]">Tìm kiếm</span> <span className="text-[#FF3B00]">thiết bị</span> <span className="text-[#1A1D24]">thông minh</span></h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-[#6B6F7B] max-w-[620px]">Chỉ cần nói hoặc gõ nhu cầu như khi bạn trò chuyện hằng ngày — TechWise sẽ tự hiểu và gợi ý cho bạn những lựa chọn dễ chọn nhất, so sánh rõ ràng được gì và mất gì.</p>
        <div className="w-full mt-8 relative">
          <LiquidGlass radius={24} frost={0.48} saturation={1.15} bezelWidth={14} thickness={10} refractiveIndex={1.65} surface="convexSquircle" scaleRatio={1.32} specularOpacity={0.38} blur={1.1} className={`w-full ${pressed ? "animate-[iosLiquidPress_520ms_cubic-bezier(0.34,1.56,0.64,1)] will-change-transform" : "will-change-transform"}`}>
            <div className="group relative flex items-center gap-2 p-2 pl-3 rounded-[24px] transition-all overflow-hidden" onClick={triggerPress}>
              <span className="w-9 h-9 rounded-full bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] flex items-center justify-center text-[#7A7E8A] shrink-0 relative z-10 overflow-hidden"><svg width="16"height="16"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="1.7"><circle cx="11"cy="11"r="7" /><path d="M20 20l-3.5-3.5" /></svg></span>
              <input value={input} onChange={(e) =>onInputChange(e.target.value)} onFocus={triggerPress} onClick={triggerPress} onKeyDown={(e) => { if (e.key === "Enter") onSend(); }} placeholder="Ví dụ: 18 triệu học CNTT, cần nhẹ, chơi Valorant 144Hz..."className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#9AA0AE] py-2 text-[#1A1D24] relative z-10" />
              <div className="flex items-center gap-2 shrink-0 relative z-10">
                <button onClick={onToggleListen} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative overflow-hidden ${isListening ? "bg-[#FF3B00] text-white shadow-[0_6px_16px_rgba(255,59,0,0.35)] animate-pulse" : "bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] text-[#6B6F7B]"}`} aria-label="Tìm kiếm bằng giọng nói"><svg width="18"height="18"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="1.7"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" /><path d="M19 10a7 7 0 0 1-14 0" /><path d="M12 18v3" /><path d="M8 21h8" /></svg></button>
                <button onClick={onSend} disabled={!input.trim()} className="h-10 px-5 rounded-full bg-[#1A1D24] text-white text-[13px] font-semibold shadow-[0_4px_16px_rgba(26,29,36,0.18)] disabled:bg-[#E6E9EF] disabled:text-[#9AA0AE] flex items-center gap-1.5 relative z-10">Tìm kiếm<svg width="14"height="14"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg></button>
              </div>
            </div>
          </LiquidGlass>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-6">{["15tr học CNTT", "Gaming 20tr RTX 4060", "Mỏng nhẹ <1.4kg OLED", "PC 25tr render Premiere"].map((s) => (
          <button key={s} onClick={() =>onQuickSend(s)} className="text-[12.5px] px-3.5 py-2 rounded-full bg-[#F0F2F5]/85 backdrop-blur-md shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] border border-white/60 text-[#6B6F7B] hover:shadow-[5px_5px_10px_#C8D0E0] transition-shadow">{s}</button>
        ))}</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-10 text-left">{[{ t: "Hiểu đúng ý bạn", d: "Bạn nói kiểu thường ngày là được, TechWise tự hiểu và lọc ra máy hợp với bạn nhất" }, { t: "So sánh dễ hiểu", d: "Thấy ngay mỗi máy được gì, mất gì và có dễ hối hận sau này không" }, { t: "Đáng tiền thực tế", d: "Gợi ý dựa trên trải nghiệm dùng thật và giá bán, không chỉ thông số trên giấy" }].map((f) => (
          <div key={f.t} className="rounded-[20px] bg-[#F0F2F5]/85 backdrop-blur-md shadow-[6px_6px_16px_#C8D0E0,-6px_-6px_16px_#FFFFFF] border border-white/60 p-4"><div className="text-[12px] font-semibold text-[#1A1D24] tracking-tight">{f.t}</div><div className="text-[12px] leading-relaxed text-[#6B6F7B] mt-1">{f.d}</div></div>
        ))}</div>
      </div>
    </div>
  );
}
export { HomeHeroSection as HeroSection };
