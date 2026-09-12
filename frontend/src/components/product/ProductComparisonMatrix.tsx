"use client";

export function ProductComparisonMatrix() {
  return (
    <div
      className="overflow-hidden rounded-[16px] bg-[#F0F2F5]/85 backdrop-blur-md shadow-[6px_6px_16px_#C8D0E0,-6px_-6px_16px_#FFFFFF] border border-white/60 stagger-card max-w-[760px] flex flex-col"
      style={{ animationDelay: "120ms" } as React.CSSProperties}
    >
        <div className="px-3 pt-2 pb-1 text-[10px] font-sans tracking-[0.08em] text-[#6B6F7B]">SO SÁNH NHANH – AI TÓM TẮT CHO NGƯỜI KHÔNG RÀNH</div>
        <div className="grid grid-cols-3 divide-x divide-[#E6E9EF] text-[12px] font-sans relative z-10">
          {[
            { name: "Lenovo Gaming 3", icon: "", forWho: "Chơi game + học", pp: "Rất đáng tiền", ppSub: "Mạnh mà rẻ", w: "Hơi nặng", wSub: "Để bàn chính", pin: "Pin ~4 tiếng", pinSub: "Nhớ mang sạc", regret: "Yên tâm", color: "#22c55e" },
            { name: "Swift Go 14", icon: "", forWho: "Mang đi học/làm", pp: "Đáng tiền", ppSub: "Nhẹ + OLED đẹp", w: "Nhẹ 1.32kg", wSub: "Mang cả ngày", pin: "Pin ~8 tiếng", pinSub: "Cả ngày không sạc", regret: "Cân nhắc", color: "#eab308" },
            { name: "HP Victus", icon: "", forWho: "Phổ thông tiết kiệm", pp: "Giá ổn", ppSub: "Rẻ nhất", w: "Hơi nặng", wSub: "Để bàn", pin: "Pin ~5 tiếng", pinSub: "Trưa sạc", regret: "Dễ tiếc", color: "#ef4444" },
          ].map((c) => (
            <div key={c.name} className="p-3 flex flex-col gap-1.5">
              <div className="text-[16px]">{c.icon}</div>
              <div className="text-[#1A1D24] font-sans font-semibold truncate text-[12px]">{c.name}</div>
              <div className="text-[10px] font-sans text-[#3B82F6] bg-[#EFF6FF] px-2 py-1 rounded-full text-center">{c.forWho}</div>
              <div className="space-y-1 mt-1">
                <div><div className="text-[11px] font-sans font-medium text-[#1A1D24]"> {c.pp}</div><div className="text-[10px] font-sans text-[#6B6F7B]">{c.ppSub}</div></div>
                <div><div className="text-[11px] font-sans font-medium text-[#1A1D24]"> {c.w}</div><div className="text-[10px] font-sans text-[#6B6F7B]">{c.wSub}</div></div>
                <div><div className="text-[11px] font-sans font-medium text-[#1A1D24]"> {c.pin}</div><div className="text-[10px] font-sans text-[#6B6F7B]">{c.pinSub}</div></div>
                <div><span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold text-white"style={{ background: c.color }}>{c.regret}</span></div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 py-3 bg-[#E6F4EA] border-t border-[#C8E6D0] text-[12px] font-sans text-[#0F5132] leading-snug">
          <div className="font-semibold">Gợi ý dễ hiểu:</div>
          <div className="mt-1">Nếu bạn <b>đi học mỗi ngày, cần nhẹ và pin lâu</b> → chọn <b>Swift Go</b> (nhẹ như 2 chai nước, pin cả ngày). Nếu <b>thích chơi game, muốn mạnh mà tiết kiệm</b> → chọn <b>Lenovo Gaming 3</b> (chơi Valorant mượt 140fps mà rẻ hơn 2tr). <b>HP Victus</b> chỉ nên chọn nếu bạn cần <b>rẻ nhất</b> và chấp nhận màn hình nhạt màu hơn.</div>
        </div>
    </div>
  );
}
export { ProductComparisonMatrix as ComparisonMatrix };
