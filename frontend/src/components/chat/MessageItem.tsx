"use client";

import type { ChatMessage } from "@/lib/domain.types";
import { AvatarSphere } from "../spheres/ChatAvatarSphere";
import { ClarificationCard } from "../product/ClarificationCard";
import { ComparisonMatrix } from "../product/ProductComparisonMatrix";
import { ProductCard } from "../product/ProductCard";

type Props = {
  message: ChatMessage;
  isTyping: boolean;
  showMatrix: boolean;
  onToggleMatrix: () =>void;
  onClarify: (opt: string) =>void;
  backendOk: boolean | null;
  lastTrace: string | null;
  lastCacheHit: boolean | null;
};

export function MessageItem({ message: m, isTyping, showMatrix, onToggleMatrix, onClarify, backendOk, lastTrace, lastCacheHit }: Props) {
  const hasProducts = !!m.products?.length;
  return (
    <div className={`flex gap-2.5 sm:gap-3 overflow-visible ${m.role === "user" ? "justify-end" : "justify-start"}`}>
      {m.role === "assistant" && (
        isTyping ? (
          <div className="w-8 h-8 flex items-center justify-center shrink-0 mt-1 overflow-visible relative"><AvatarSphere /></div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] flex items-center justify-center text-[11px] font-mono font-black text-[#1A1D24] shrink-0 mt-1 overflow-hidden relative">TW</div>
        )
      )}
      <div className={`flex-1 ${hasProducts ? "max-w-none" : "max-w-[760px]"} ${m.role === "user" ? "flex justify-end" : ""}`}>
        {m.role === "user" ? (
          <div className="max-w-[560px] rounded-[18px] rounded-br-md px-4 py-2.5 bg-[#F0F2F5]/90 backdrop-blur-md shadow-[6px_6px_16px_#C8D0E0,-6px_-6px_16px_#FFFFFF] border border-white/60 text-[#1A1D24] text-[13.5px] leading-[1.65] whitespace-pre-wrap">
            {m.text.split("**").map((part, i) => (i % 2 === 1 ? <span key={i} className="font-semibold text-[#1A1D24]">{part}</span> : part))}
          </div>
        ) : hasProducts ? (
          <div className="bg-transparent px-0 py-0 w-full">
            {m.text && (
              <div className="max-w-[760px] rounded-2xl px-4 py-3 bg-[#F0F2F5]/85 backdrop-blur-md shadow-[6px_6px_16px_#C8D0E0,-6px_-6px_16px_#FFFFFF] border border-white/60 text-[13.5px] leading-[1.65] whitespace-pre-wrap text-[#2B2E36]">
                {m.text.split("**").map((part, i) => (i % 2 === 1 ? <span key={i} className="font-semibold text-[#1A1D24]">{part}</span> : part))}
                {isTyping && <span className="typing-cursor"aria-hidden />}
              </div>
            )}
            {isTyping && m.text && (
              <div className="flex items-center gap-2 text-[11px] font-sans font-medium tracking-[0.08em] text-[#1A1D24] mt-2 ml-1 max-w-[760px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B00] animate-pulse" />
                <span className="tracking-[0.08em]">Đang phản hồi</span>
                <span className="inline-flex gap-1 ml-1"><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:120ms]" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:240ms]" /></span>
              </div>
            )}
            {m.clarification && <ClarificationCard question={m.clarification.question} options={m.clarification.options} hasText={!!m.text} onSelect={onClarify} />}
            {m.products && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between stagger-card max-w-[760px]">
                  <div className="text-[11px] font-sans font-semibold tracking-[0.04em] text-[#1A1D24] flex items-center gap-1.5">Gợi ý dành riêng cho bạn – đọc 10 giây là hiểu</div>
                  <button onClick={onToggleMatrix} className="text-[11px] font-sans font-medium text-[#3B82F6] bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] rounded-full px-3 py-1.5 hover:shadow-[5px_5px_10px_#C8D0E0] transition-shadow relative overflow-hidden"><span className="relative z-10">{showMatrix ? "Ẩn bảng so sánh" : "Xem bảng so sánh dễ hiểu"}</span></button>
                </div>
                {lastTrace && backendOk && (
                  <div className="flex items-center gap-2 text-[11px] font-sans text-[#0F5132] bg-[#E6F4EA] px-2.5 py-1 rounded-full max-w-[760px] w-fit">
                    <span>Đã kiểm tra {m.products?.length || 3} máy thật lúc {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} – không lo giá ảo</span>
                    {lastCacheHit && <span className="px-1.5 py-0.5 rounded-full bg-white text-[#166534] text-[9px] font-semibold border border-[#BBF7D0]">Trả lời siêu nhanh</span>}
                  </div>
                )}
                {showMatrix && m.matrix && <ComparisonMatrix />}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {m.products.map((p, idx) => (<ProductCard key={p.id} product={p} index={idx} />))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full rounded-2xl px-4 py-3 bg-[#F0F2F5]/85 backdrop-blur-md shadow-[6px_6px_16px_#C8D0E0,-6px_-6px_16px_#FFFFFF] border border-white/60 text-[13.5px] leading-[1.65] whitespace-pre-wrap text-[#2B2E36]">
            {m.text.split("**").map((part, i) => (i % 2 === 1 ? <span key={i} className="font-semibold text-[#1A1D24]">{part}</span> : part))}
            {isTyping && <span className="typing-cursor"aria-hidden />}
          </div>
        )}
        {m.role !== "user" && !hasProducts && isTyping && (
          <div className="flex items-center gap-2 text-[11px] font-sans font-medium tracking-[0.08em] text-[#1A1D24] mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B00] animate-pulse" />
            <span className="tracking-[0.08em]">Đang phản hồi</span>
            <span className="inline-flex gap-1 ml-1"><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:120ms]" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:240ms]" /></span>
          </div>
        )}
        {!hasProducts && m.clarification && <ClarificationCard question={m.clarification.question} options={m.clarification.options} hasText={!!m.text} onSelect={onClarify} />}
      </div>
      {m.role === "user" && <div className="w-8 h-8 rounded-full bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] flex items-center justify-center text-[11px] font-mono text-[#6B6F7B] shrink-0 mt-1 overflow-hidden relative">Bạn</div>}
    </div>
  );
}
