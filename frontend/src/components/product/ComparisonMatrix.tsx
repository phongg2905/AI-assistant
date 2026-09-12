"use client";

export function ComparisonMatrix() {
  return (
    <div className="overflow-hidden rounded-[16px] bg-[#F0F2F5] shadow-[6px_6px_16px_#C8D0E0,-6px_-6px_16px_#FFFFFF] border border-white/60 stagger-card max-w-[760px]" style={{ animationDelay: "120ms" }}>
      <div className="grid grid-cols-3 divide-x divide-[#E6E9EF] text-[12px] font-sans relative z-10">
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
      <div className="px-3 py-2.5 bg-[#E6E9EF]/60 backdrop-blur-md border-t border-[#E6E9EF] text-[12px] font-sans text-[#1A1D24] leading-snug relative z-10"><span className="font-semibold text-[#FF3B00]">Gợi ý dễ hiểu:</span> Muốn nhẹ mang đi học → chọn Swift Go. Muốn chơi game mượt và đáng tiền → chọn Lenovo.</div>
    </div>
  );
}
