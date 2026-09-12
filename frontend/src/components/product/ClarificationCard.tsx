"use client";

type Props = { question: string; options: string[]; hasText: boolean; onSelect: (opt: string) => void };

export function ClarificationCard({ question, options, hasText, onSelect }: Props) {
  return (
    <div className={`p-3.5 rounded-[16px] bg-[#F0F2F5] shadow-[6px_6px_16px_#C8D0E0,-6px_-6px_16px_#FFFFFF] border border-white/60 stagger-card max-w-[760px] overflow-hidden ${hasText ? "mt-3" : "mt-0"}`} style={{ animationDelay: "80ms" }}>
      <div className="text-[11px] font-mono tracking-widest text-[#6B6F7B] mb-1.5 relative z-10">GỢI Ý TINH CHỈNH</div>
      <div className="text-[13px] text-[#1A1D24] leading-snug relative z-10">{question}</div>
      <div className="flex flex-wrap gap-2 mt-2.5 relative z-10">
        {options.map((o) => (<button key={o} onClick={() => onSelect(o)} className="text-[12px] px-3.5 py-1.5 rounded-full bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] text-[#2B2E36] hover:shadow-[5px_5px_10px_#C8D0E0] transition-shadow relative z-10 overflow-hidden"><span className="relative z-10">{o}</span></button>))}
      </div>
    </div>
  );
}
