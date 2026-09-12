"use client";

import { useState } from "react";
import type { Product } from "@/lib/domain.types";

type Props = { product: Product; index: number };

export function ProductCard({ product: p, index }: Props) {
  const [showTech, setShowTech] = useState(false);
  const wNum = (p as any).weightNum != null ? (p as any).weightNum : (parseFloat(p.weight) || 2.0);
  const bWh = (p as any).batteryWh != null ? (p as any).batteryWh : 50;

  // Plain cho người không rành – ví dụ đời thường + icon
  const weightPlain = wNum <= 1.5 ? "Nhẹ như 2 chai nước" : wNum > 2.2 ? "Hơi nặng – để bàn chính" : "Vừa phải – mang đi học được";
  const weightSub = wNum <= 1.5 ? "Mang cả ngày không mỏi vai" : wNum > 2.2 ? "Mang đi sẽ mỏi vai" : "Cân bằng giữa nhẹ và chắc";
  const batteryPlain = bWh >= 65 ? "Pin cả ngày ~8 tiếng" : bWh >= 50 ? "Pin nửa ngày ~5 tiếng" : "Pin ~4 tiếng";
  const batterySub = bWh >= 65 ? "Sáng tới chiều không cần sạc" : bWh >= 50 ? "Trưa nên sạc một lần" : "Nhớ mang sạc theo";
  const screenPlain = p.display.includes("OLED") ? "Màn rực rỡ" : p.display.includes("144Hz") ? "Màn mượt không giật" : "Màn rõ nét";
  const screenSub = p.display.includes("OLED") ? "Xem phim, làm ảnh màu đẹp" : p.display.includes("144Hz") ? "Kéo chuột, chơi game mượt" : "Học, xem video thoải mái";
  const worthPlain = p.ppScore >= 8.5 ? "Rất đáng tiền" : p.ppScore >= 7.8 ? "Đáng tiền" : "Giá ổn";
  const worthSub = p.ppScore >= 8.5 ? "Mạnh mà giá hời – tiết kiệm ~2tr" : p.ppScore >= 7.8 ? "Cân bằng giá và sức mạnh" : "Rẻ nhưng yếu hơn chút";
  const categoryPlain = p.category === "GAMING" ? "Chơi game nặng" : p.category === "ULTRABOOK" ? "Mỏng nhẹ đi học/làm" : p.category === "ENTRY GAMING" ? "Phổ thông – học & giải trí" : p.category;
  const regretPlain = p.regret === "Thấp" ? "Yên tâm 2–3 năm" : p.regret === "Trung bình" ? "Có 1 điểm yếu nhỏ" : "Dễ tiếc sau 1 năm";
  const regretSub = p.regret === "Thấp" ? "Ít người than phiền" : p.regret === "Trung bình" ? "Cân nhắc kỹ" : "Hay bị chê nóng/ pin yếu";
  const perfPlain = p.benchmark.includes("210fps") || p.ppScore >= 8.7 ? "Mở 20 tab + Word/Excel + game mượt" : p.gpu.includes("RTX") ? "Học, code, chơi Valorant/Genshin mượt" : p.ppScore >= 7.8 ? "Học, họp online, chỉnh ảnh nhẹ mượt" : "Dùng cơ bản ổn – game nặng sẽ chậm";

  // Pros/cons plain hơn
  const plainPros = p.pros[0].replace("GPU rời 95W", "Chơi game mượt").replace("RAM dual-channel", "Mở nhiều app không lag");
  const plainCons = p.cons[0].replace("Vỏ nhựa flex", "Vỏ nhựa – không sang như nhôm").replace("Pin 45Wh", "Pin ngắn");

  return (
    <div
      className="rounded-[20px] bg-[#F0F2F5]/90 backdrop-blur-md shadow-[8px_8px_24px_#C8D0E0,-8px_-8px_24px_#FFFFFF] border border-white/60 flex flex-col stagger-card hover:shadow-[12px_12px_28px_#C8D0E0] transition-shadow overflow-hidden"
      style={{ animationDelay: `${180 + index * 110}ms` } as React.CSSProperties}
    >
        <div className="flex items-center justify-between px-4 py-3 relative z-10">
          <span className="text-[11px] font-sans font-semibold tracking-[0.04em] text-[#1A1D24] flex items-center gap-1.5">{p.badge && <span className="bg-[#FF3B00] text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm">{p.badge}</span>}{categoryPlain}</span>
          <span className="text-[11px] font-sans font-medium text-[#6B6F7B] bg-[#F0F2F5] shadow-[2px_2px_6px_#C8D0E0,-2px_-2px_6px_#FFFFFF] px-2.5 py-1 rounded-full relative z-10 overflow-hidden"><span className="relative z-10">{p.affiliate}</span></span>
        </div>
        <div className="px-4 pb-3 flex-1 flex flex-col gap-3">
          <div className="text-[14px] font-sans font-semibold text-[#1A1D24] leading-snug line-clamp-2 min-h-[40px]">{p.name}</div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[18px] font-sans font-bold text-[#1A1D24] tracking-tight">{p.price}</span>
            <span className="text-[11px] font-sans text-[#6B6F7B]">({(p.priceNum / 1_000_000).toFixed(1)} triệu)</span>
            <span className="text-[11px] font-sans font-medium px-2.5 py-1 rounded-full text-white"style={{ background: p.regretColor }}>{regretPlain}</span>
          </div>
          <div className="text-[10px] font-sans text-[#8A90A2] -mt-2">{regretSub}</div>

          <div className="flex items-center gap-2 text-[12px] font-sans relative z-10">
            <span className="px-2.5 py-1 rounded-full bg-[#F0F2F5] shadow-[2px_2px_6px_#C8D0E0,-2px_-2px_6px_#FFFFFF] font-medium text-[#1A1D24] flex items-center gap-1.5">{worthPlain} · {p.ppScore}/10</span>
          </div>
          <div className="text-[11px] font-sans text-[#6B6F7B] px-1">{worthSub} – {perfPlain}</div>

          <div className="grid grid-cols-2 gap-2 text-[12px] font-sans leading-relaxed relative z-10">
            <div className="bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] rounded-xl p-2.5 text-center">
              <div className="text-[16px]"></div>
              <div className="text-[11px] font-sans text-[#6B6F7B]">Cân nặng</div>
              <div className="text-[12px] font-sans font-medium text-[#1A1D24] mt-0.5">{weightPlain}</div>
              <div className="text-[10px] font-sans text-[#8A90A2]">{weightSub}</div>
              <div className="text-[10px] font-sans text-[#8A90A2] mt-0.5">{wNum}kg</div>
            </div>
            <div className="bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] rounded-xl p-2.5 text-center">
              <div className="text-[16px]"></div>
              <div className="text-[11px] font-sans text-[#6B6F7B]">Pin</div>
              <div className="text-[12px] font-sans font-medium text-[#1A1D24] mt-0.5">{batteryPlain}</div>
              <div className="text-[10px] font-sans text-[#8A90A2]">{batterySub}</div>
            </div>
            <div className="bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] rounded-xl p-2.5 text-center col-span-2">
              <div className="text-[16px]"></div>
              <div className="text-[11px] font-sans text-[#6B6F7B]">Màn hình</div>
              <div className="text-[12px] font-sans font-medium text-[#1A1D24] mt-0.5">{screenPlain}</div>
              <div className="text-[10px] font-sans text-[#8A90A2]">{screenSub}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-sans font-medium text-[#0F5132] bg-[#E6F4EA] px-3 py-2 rounded-xl flex gap-2"><span><b>Điểm cộng:</b> {plainPros}</span></div>
            <div className="text-[11px] font-sans font-medium text-[#842029] bg-[#FCE8E9] px-3 py-2 rounded-xl flex gap-2"><span><b>Lưu ý:</b> {plainCons}</span></div>
          </div>

          <button onClick={() =>setShowTech(!showTech)} className="text-[11px] font-sans font-medium text-[#3B82F6] flex items-center gap-1 hover:underline">
            {showTech ? "Ẩn chi tiết kỹ thuật" : "Xem chi tiết kỹ thuật cho người rành"}
          </button>
          {showTech && (
            <div className="bg-[#EEF2F7] rounded-xl p-3 text-[11px] font-mono leading-relaxed text-[#4A5568] border border-[#E6E9EF]">
              <div>CPU: {p.cpu} · GPU: {p.gpu} · RAM: {p.ram}</div>
              <div>Màn: {p.display} · Cân: {p.weight} · Pin: {bWh}Wh</div>
              <div>Benchmark: {p.benchmark}</div>
            </div>
          )}
        </div>
        <div className="flex gap-2 px-4 pb-4 relative z-10">
          <button className="flex-1 h-10 rounded-full bg-[#1A1D24] text-white text-[13px] font-sans font-semibold shadow-[0_4px_16px_rgba(26,29,36,0.18)]">Xem giá tại {p.affiliate} →</button>
          <button className="h-10 px-4 rounded-full bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] text-[#1A1D24] text-[12px] font-sans font-medium">So sánh</button>
        </div>
    </div>
  );
}
