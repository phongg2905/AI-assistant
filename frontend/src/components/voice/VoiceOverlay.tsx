"use client";

import { ParticleSphere } from "../spheres/VoiceSphere";

type Props = {
  isListening: boolean;
  isPolishing: boolean;
  isVoiceAnalyzing: boolean;
  voiceTranscript: string;
  polishedDiff: boolean;
  waveLevels: number[];
  debugAudioUrl: string | null;
  debugBlobSize: number | null;
  onCancel: () => void;
  onStop: () => void;
};

export function VoiceOverlay({ isListening, isPolishing, isVoiceAnalyzing, voiceTranscript, polishedDiff, waveLevels, debugAudioUrl, debugBlobSize, onCancel, onStop }: Props) {
  if (!isListening && !isPolishing && !isVoiceAnalyzing) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050507]/85 backdrop-blur-xl px-6">
      <button onClick={onCancel} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#9A9A9A] hover:text-white transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <div className="flex flex-col items-center w-full max-w-[560px]">
        <div className="relative flex items-center justify-center" style={{ width: 360, height: 360 }}>
          <div className={`absolute rounded-full border ${isListening ? "border-[#38BDF8]/18" : isPolishing ? "border-[#F59E0B]/18" : "border-[#7C3AED]/18"} ${isListening ? "siri-ping" : "siri-ping-slow"}`} style={{ width: 285, height: 285 }} />
          <div className={`absolute rounded-full border ${isListening ? "border-[#3B82F6]/12" : isPolishing ? "border-[#F59E0B]/12" : "border-[#A855F7]/12"} ${isListening ? "siri-ping-delayed" : "siri-ping-slow-delayed"}`} style={{ width: 365, height: 365 }} />
          <ParticleSphere mode={isListening ? "listening" : "analyzing"} levels={waveLevels} />
        </div>
        <div className="flex items-center justify-center gap-[5px] h-[40px] mt-10">
          {waveLevels.map((lvl, i) => (
            <span key={i} className={`w-[4px] rounded-full transition-all duration-150 ${isListening ? "bg-white" : isPolishing ? "bg-[#F59E0B]" : "bg-gradient-to-t from-[#FF3B00] via-[#7C3AED] to-[#06B6D4]"}`} style={{ height: `${12 + lvl * 28}px`, opacity: 0.9 - i * 0.04 }} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <div className="text-[15px] font-medium tracking-tight text-white">{isListening ? "Đang lắng nghe..." : isPolishing ? "Đang chuẩn hóa với Whisper..." : "Đang tìm kiếm và phân tích..."}</div>
          {voiceTranscript && (
            <div className={`mt-4 px-4 py-3 rounded-2xl bg-[#141414] border text-[13px] leading-relaxed max-w-[520px] mx-auto transition-all ${polishedDiff ? "border-[#F59E0B]/40 bg-[#1A1505] text-[#FDE68A]" : "border-[#1E1E1E] text-[#EDEDED]"}`}>
              “{voiceTranscript}”
              {polishedDiff && <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-sans font-medium text-[#F59E0B]">Whisper đã chuẩn hóa</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 mt-8">
          <button onClick={onCancel} className="px-5 py-2 rounded-full bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-[13px] font-mono text-[#EDEDED]">Hủy</button>
          {isListening && <button onClick={onStop} className="px-6 py-2 rounded-full bg-white text-black text-[13px] font-medium">Kết thúc và tìm</button>}
        </div>
        {debugAudioUrl && (
          <div className="mt-6 w-full max-w-[520px] p-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A]">
            <div className="text-[11px] font-mono text-[#9A9A9A] mb-1">Debug: blob {debugBlobSize} bytes</div>
            <audio controls src={debugAudioUrl} className="w-full h-8" />
          </div>
        )}
      </div>
      <style>{`.siri-ping{animation:siriPing 1.9s cubic-bezier(0,0,0.2,1) infinite} .siri-ping-delayed{animation:siriPing 1.9s cubic-bezier(0,0,0.2,1) infinite 0.45s} .siri-ping-slow{animation:siriPing 2.8s cubic-bezier(0,0,0.2,1) infinite} .siri-ping-slow-delayed{animation:siriPing 2.8s cubic-bezier(0,0,0.2,1) infinite 0.6s} @keyframes siriPing{0%{transform:scale(0.92);opacity:0.9}100%{transform:scale(1.08);opacity:0}}`}</style>
    </div>
  );
}
