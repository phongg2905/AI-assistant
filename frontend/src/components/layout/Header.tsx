"use client";

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
  return (
    <header className="fixed top-0 inset-x-0 h-[56px] flex items-center justify-between px-3 lg:px-6 bg-transparent border-0 shadow-none z-40 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-[#F0F2F5]/78 backdrop-blur-xl rounded-full pl-2 pr-3 py-1.5 shadow-[6px_6px_16px_rgba(180,190,210,0.38),-6px_-6px_16px_rgba(255,255,255,0.85)] border border-white/55 pointer-events-auto">
          <div className="w-8 h-8 rounded-[12px] bg-[#F0F2F5] flex items-center justify-center shadow-[4px_4px_10px_#CBD5E6,-4px_-4px_10px_#FFFFFF] overflow-hidden shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" className="w-[28px] h-[28px]">
              <defs>
                <radialGradient id="twLogoGrad" cx="30%" cy="22%" r="78%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="48%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#A855F7" />
                </radialGradient>
              </defs>
              <circle cx="16" cy="16" r="11.2" fill="url(#twLogoGrad)" />
              <circle cx="12.2" cy="11.4" r="2.7" fill="white" opacity="0.92" />
              <circle cx="12.2" cy="11.4" r="0.9" fill="white" />
            </svg>
          </div>
          <span className="font-sans font-semibold tracking-[-0.03em] text-[17px] leading-none text-[#1A1D24]">tech<span className="font-semibold text-[#FF3B00]">wise</span></span>
        </div>
        <div className="flex items-center gap-2 bg-[#F0F2F5]/75 backdrop-blur-xl rounded-full px-2 py-1.5 shadow-[6px_6px_16px_rgba(180,190,210,0.38),-6px_-6px_16px_rgba(255,255,255,0.85)] border border-white/55 pointer-events-auto relative">
          <button onClick={onToggleHistory} className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-sans font-medium tracking-[0.01em] text-[#1A1D24] bg-[#F0F2F5] rounded-full px-3.5 py-1.5 shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#C8D0E0] transition-shadow">Lịch sử</button>
          <button onClick={onToggleAccount} className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[11px] font-sans font-semibold text-[#1A1D24] shadow-[4px_4px_10px_#C8D0E0,-4px_-4px_10px_#FFFFFF] hover:shadow-[5px_5px_12px_#C8D0E0] transition-shadow overflow-hidden">
            <img src="https://i.pravatar.cc/100?img=32" alt="avatar" className="w-full h-full object-cover" />
          </button>
          {showAccount && (
            <div className="absolute top-full right-0 mt-2 w-64 rounded-[16px] bg-[#F0F2F5] shadow-[8px_8px_24px_#C8D0E0,-8px_-8px_24px_#FFFFFF] border border-white/60 p-3 z-50">
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
            <div className="absolute top-full right-0 mt-2 w-[340px] max-w-[90vw] rounded-[16px] bg-[#F0F2F5] shadow-[8px_8px_24px_#C8D0E0,-8px_-8px_24px_#FFFFFF] border border-white/60 p-3 z-50 flex flex-col max-h-[420px]">
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
