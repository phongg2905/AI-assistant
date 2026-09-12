"use client";

import { AvatarSphere } from "../spheres/ChatAvatarSphere";
import { ThinkingSphere } from "../spheres/ChatThinkingSphere";

export function ThinkingIndicator() {
  return (
    <div className="flex gap-3 overflow-visible">
      <div className="w-8 h-8 flex items-center justify-center shrink-0 overflow-visible relative"><AvatarSphere /></div>
      <div className="pl-2 pr-4 py-2 rounded-2xl bg-[#F0F2F5]/85 backdrop-blur-md shadow-[6px_6px_16px_#C8D0E0,-6px_-6px_16px_#FFFFFF] border border-white/60 flex items-center gap-3 overflow-hidden">
        <div className="w-14 h-14 rounded-full bg-[#F0F2F5] shadow-[3px_3px_8px_#C8D0E0,-3px_-3px_8px_#FFFFFF] flex items-center justify-center shrink-0 overflow-hidden relative"><ThinkingSphere /></div>
        <div className="flex flex-col relative z-10">
          <span className="text-[13px] font-medium text-[#1A1D24]">Đang suy nghĩ</span>
          <span className="text-[11px] font-mono text-[#8A90A2]">Đang phân tích yêu cầu...</span>
        </div>
        <span className="inline-flex gap-1 ml-1 relative z-10"><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:150ms]" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:300ms]" /></span>
      </div>
    </div>
  );
}

export function StreamingIndicator() {
  return (
    <div className="flex gap-3 overflow-visible">
      <div className="w-8 h-8 flex items-center justify-center shrink-0 overflow-visible relative"><AvatarSphere /></div>
      <div className="px-4 py-3 rounded-2xl bg-[#F0F2F5]/85 backdrop-blur-md shadow-[6px_6px_16px_#C8D0E0,-6px_-6px_16px_#FFFFFF] border border-white/60 text-[#6B6F7B] text-[13px] flex items-center gap-2 overflow-hidden">
        <span className="flex items-center gap-2">Đang tìm thông tin phù hợp<span className="inline-flex gap-1 ml-1"><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:120ms]" /><span className="w-1 h-1 bg-[#FF3B00] rounded-full animate-bounce [animation-delay:240ms]" /></span></span>
      </div>
    </div>
  );
}
