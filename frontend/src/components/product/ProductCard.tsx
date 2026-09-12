"use client";

import type { Product } from "@/lib/types";

type Props = { product: Product; index: number };

export function ProductCard({ product: p, index }: Props) {
  const wNum = (p as any).weightNum != null ? (p as any).weightNum : (parseFloat(p.weight) || 2.0);
  const bWh = (p as any).batteryWh != null ? (p as any).batteryWh : 50;
  const weightPlain = wNum <= 1.5 ? "Nhẹ, dễ mang theo" : wNum > 2.2 ? "Hơi nặng" : "Vừa phải";
  const batteryPlain = bWh >= 60 ? "Pin lâu ~8 tiếng" : bWh >= 50 ? "Pin vừa ~5 tiếng" : "Pin ~4 tiếng";
  const screenPlain = p.display.includes("OLED") ? "Màn đẹp, màu rực rỡ" : p.display.includes("144Hz") ? "Màn mượt 144Hz" : "Màn rõ nét";
  const worthPlain = p.ppScore >= 8.5 ? "Rất đáng tiền" : p.ppScore >= 7.8 ? "Đáng tiền" : "Giá ổn";
  const categoryPlain = p.category === "GAMING" ? "Chơi game" : p.category === "ULTRABOOK" ? "Mỏng nhẹ" : p.category === "ENTRY GAMING" ? "Phổ thông" : p.category;
  const regretPlain = p.regret === "Thấp" ? "Yên tâm dùng lâu" : p.regret === "Trung bình" ? "Cân nhắc" : "Dễ tiếc sau này";
  return (
    <div className="rounded-[20px] bg-[#F0F2F5] shadow-[8px_8px_24px_#C8D0E0,-8px_-8px_24px_#FFFFFF] border border-white/60 flex flex-col stagger-card hover:shadow-[12px_12px_28px_#C8D0E0] transition-shadow overflow-hidden" style={{ animationDelay: `${180 + index * 110}ms` }}>
      <div className="flex items-center justify-between px-4 py-3 relative z-10">
        <span className="text-[11px] font-sans font-semibold tracking-[0.04em] text-[#1A1D24] flex items-center gap-1.5">{p.badge && <span className="bg-[#FF3B00] text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm">{p.badge}</span>}{categoryPlain}</span>
        <span className="text-[11px] font-sans font-medium text-[#6B6F7B] bg-[#F0F2F5] shadow-[2px_2px_6px_#C8D0E0,-2px_-2px_6px_#FFFFFF] px-2.5 py-1 rounded-full relative z-10 overflow-hidden"><span className="relative z-10">{p.affiliate}</span></span>
      </div>
      <div className="px-4 pb-4 flex-1 flex flex-col gap-3">
        <div className="text-[14px] font-sans font-semibold text-[#1A1D24] leading-snug line-clamp-2 min-h-[40px]">{p.name}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-[18px] font-sans font-bold text-[#1A1D24] tracking-tight">{p.price}</span>
          <span className="text-[11px] font-sans font-medium px-2.5 py-1 rounded-full text-white" style={{ background: p.regretColor }}>{regretPlain}</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-sans relative z-10">
          <span className="px-2.5 py-1 rounded-full bg-[#F0F2F5] shadow-[2px_2px_6px_#C8D0E0,-2px_-2px_6px_#FFFFFF] font-medium text-[#1A1D24] relative overflow-hidden"><span className="relative z-10">{worthPlain} · {p.ppScore}/10</span></span>
          <span className="text-[11px] font-sans text-[#6B6F7B]">{p.benchmark.split("·")[0].replace("Cinebench", "Tốc độ").replace("Geekbench", "Tốc độ")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[12px] font-sans leading-relaxed relative z-10">
          <div className="bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] rounded-xl p-2.5 text-center relative overflow-hidden">
            <div className="text-[11px] font-sans text-[#6B6F7B] relative z-10">Cân nặng</div>
            <div className="text-[12px] font-sans font-medium text-[#1A1D24] mt-1 relative z-10">{weightPlain}</div>
            <div className="text-[10px] font-sans text-[#8A90A2] relative z-10">{wNum}kg</div>
          </div>
          <div className="bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] rounded-xl p-2.5 text-center relative overflow-hidden">
            <div className="text-[11px] font-sans text-[#6B6F7B] relative z-10">Pin</div>
            <div className="text-[12px] font-sans font-medium text-[#1A1D24] mt-1 relative z-10">{batteryPlain}</div>
          </div>
          <div className="bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] rounded-xl p-2.5 text-center col-span-2 relative overflow-hidden">
            <div className="text-[11px] font-sans text-[#6B6F7B] relative z-10">Màn hình</div>
            <div className="text-[12px] font-sans font-medium text-[#1A1D24] mt-1 relative z-10">{screenPlain}</div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-[11px] font-sans font-medium text-[#0F5132] bg-[#E6F4EA] px-3 py-1.5 rounded-full">✓ {p.pros[0]}</div>
          <div className="text-[11px] font-sans font-medium text-[#842029] bg-[#FCE8E9] px-3 py-1.5 rounded-full">• {p.cons[0]}</div>
        </div>
      </div>
      <div className="flex gap-2 px-4 pb-4 relative z-10">
        <button className="flex-1 h-10 rounded-full bg-[#1A1D24] text-white text-[13px] font-sans font-semibold shadow-[0_4px_16px_rgba(26,29,36,0.18)]">Xem giá tại {p.affiliate} →</button>
        <button className="h-10 px-4 rounded-full bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] text-[#1A1D24] text-[12px] font-sans font-medium">So sánh</button>
      </div>
    </div>
  );
}
