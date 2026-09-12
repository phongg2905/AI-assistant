"use client";

import { useRef, useEffect } from "react";
import { LiquidGlass } from "@/components/ui/LiquidGlassEffect";
import { LogoMark } from "@/components/ui/BrandLogo";

type Props = {
  showHistory: boolean;
  showAccount: boolean;
  onToggleHistory: () => void;
  onToggleAccount: () => void;
  onCloseHistory: () => void;
  onCloseAccount: () => void;
  onSelectHistory: (title: string) => void;
};

export function Header({ showHistory, showAccount, onToggleHistory, onToggleAccount, onCloseHistory, onCloseAccount, onSelectHistory }: Props) {
  const historyRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // click-outside để đóng popup – fix lỗi trước đây chỉ đóng bằng nút ✕
  useEffect(() => {
    if (!showHistory && !showAccount) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (showHistory && historyRef.current && !historyRef.current.contains(t)) {
        // kiểm tra nút trigger có nằm ngoài không – nếu click vào nút Lịch sử thì đã handle toggle, không close ngay
        const histBtn = document.getElementById("btn-history");
        if (histBtn && histBtn.contains(t)) return;
        onCloseHistory();
      }
      if (showAccount && accountRef.current && !accountRef.current.contains(t)) {
        const accBtn = document.getElementById("btn-account");
        if (accBtn && accBtn.contains(t)) return;
        onCloseAccount();
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showHistory, showAccount, onCloseHistory, onCloseAccount]);

  return (
    <header className="fixed top-0 inset-x-0 h-[56px] flex items-center justify-between px-3 lg:px-6 bg-transparent border-0 shadow-none z-40 pointer-events-none">
        <LiquidGlass
          radius={9999}
          frost={0.52}
          saturation={1.25}
          displacementScale={18}
          blur={6}
          className="pointer-events-auto"
        >
          <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full">
            <LogoMark size={32} animated />
            <span className="font-sans font-semibold tracking-[-0.03em] text-[17px] leading-none text-[#1A1D24]">tech<span className="font-semibold text-[#FF3B00]">wise</span></span>
          </div>
        </LiquidGlass>

        {/* Wrapper tách riêng: LiquidGlass pill + popup absolute bên ngoài để không bị overflow-hidden cắt */}
        <div className="relative pointer-events-auto flex flex-col items-end">
          <LiquidGlass
            radius={9999}
            frost={0.48}
            saturation={1.2}
            displacementScale={16}
            blur={6}
            className="pointer-events-auto"
          >
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-full">
              <button id="btn-history" onClick={onToggleHistory} className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-sans font-medium tracking-[0.01em] text-[#1A1D24] bg-[#F0F2F5] rounded-full px-3.5 py-1.5 shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#C8D0E0] transition-shadow">Lịch sử</button>
              <button id="btn-account" onClick={onToggleAccount} className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[11px] font-sans font-semibold text-[#1A1D24] shadow-[4px_4px_10px_#C8D0E0,-4px_-4px_10px_#FFFFFF] hover:shadow-[5px_5px_12px_#C8D0E0] transition-shadow overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=32" alt="avatar" className="w-full h-full object-cover" />
              </button>
            </div>
          </LiquidGlass>

          {showAccount && (
            <div ref={accountRef} className="absolute top-full right-0 mt-2 w-64 rounded-[16px] bg-[#F0F2F5] shadow-[8px_8px_24px_#C8D0E0,-8px_-8px_24px_#FFFFFF] border border-white/60 p-3 z-50 animate-[cardIn_180ms_cubic-bezier(0.16,1,0.3,1)]">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/100?img=32" alt="avatar" className="w-10 h-10 rounded-full object-cover shadow-[3px_3px_8px_#C8D0E0]" />
                <div>
                  <div className="text-[13px] font-sans font-semibold text-[#1A1D24]">Tài khoản TechWise</div>
                  <div className="text-[11px] font-sans text-[#6B6F7B]">khach@techwise.vn</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E6E9EF] space-y-1">
                <div className="text-[11px] font-sans text-[#6B6F7B]">Thành viên từ 2024 · Gói Pro</div>
                <button onClick={onCloseAccount} className="w-full mt-2 h-8 rounded-full bg-[#1A1D24] text-white text-[12px] font-sans font-medium">Quản lý tài khoản</button>
              </div>
            </div>
          )}
          {showHistory && (
            <div ref={historyRef} className="absolute top-full right-0 mt-2 w-[340px] max-w-[90vw] rounded-[16px] bg-[#F0F2F5] shadow-[8px_8px_24px_#C8D0E0,-8px_-8px_24px_#FFFFFF] border border-white/60 p-3 z-50 flex flex-col max-h-[420px] animate-[cardIn_180ms_cubic-bezier(0.16,1,0.3,1)]">
              <div className="flex items-center justify-between px-1 pb-2">
                <h3 className="font-sans font-semibold text-[13px] text-[#1A1D24]">Lịch sử trò chuyện</h3>
                <button onClick={onCloseHistory} className="w-7 h-7 rounded-full bg-[#F0F2F5] shadow-[2px_2px_6px_#C8D0E0,-2px_-2px_6px_#FFFFFF] flex items-center justify-center text-[11px] text-[#6B6F7B] hover:shadow-[3px_3px_8px_#C8D0E0] transition-shadow">✕</button>
              </div>
              <div className="overflow-y-auto space-y-2 pr-1 overscroll-contain" style={{ maxHeight: "300px" }}>
                {[
                  { title: "18tr • CNTT + Valorant", preview: "3 đề xuất · hôm nay", time: "10:42" },
                  { title: "25tr • AI/Data • RTX 4060", preview: "Đã so sánh · hôm qua", time: "Hôm qua" },
                  { title: "12tr • Sinh viên • Nhẹ", preview: "2 đề xuất · 2 ngày trước", time: "2 ngày trước" },
                  { title: "20tr • Creator • OLED", preview: "1 đề xuất · 3 ngày trước", time: "3 ngày trước" },
                  { title: "14tr • Văn phòng • Pin lâu", preview: "2 đề xuất · 4 ngày trước", time: "4 ngày trước" },
                ].map((h) => (
                  <button key={h.title} onClick={() => { onCloseHistory(); onSelectHistory(h.title); }} className="w-full text-left p-2.5 rounded-[12px] bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#C8D0E0] transition-shadow">
                    <div className="text-[13px] font-sans font-medium text-[#1A1D24] truncate">{h.title}</div>
                    <div className="text-[11px] font-sans text-[#6B6F7B] truncate">{h.preview} · {h.time}</div>
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-[#E6E9EF] flex items-center justify-between">
                <span className="text-[11px] font-sans text-[#6B6F7B]">5 cuộc trò chuyện</span>
                <button onClick={onCloseHistory} className="text-[11px] font-sans text-[#FF3B00]">Đóng</button>
              </div>
            </div>
          )}
        </div>
      </header>
  );
}
