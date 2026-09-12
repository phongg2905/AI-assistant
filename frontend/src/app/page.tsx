"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/chat/HomeHeroSection";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { VoiceOverlay } from "@/components/voice/VoiceOverlay";
import { useBackendHealth } from "@/hooks/useApiHealth";
import { useChat } from "@/hooks/useChat";
import { useVoice } from "@/hooks/useVoice";

export default function Home() {
  const backend = useBackendHealth();
  const chat = useChat(backend);
  const voice = useVoice((t) => chat.handleSend(t), chat.timersRef, chat.setInput);

  const [showMatrix, setShowMatrix] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasSearched = chat.messages.some((m) => m.role === "user");

  const handleSendWrapper = (textOverride?: string) => {
    voice.setVoiceTranscript("");
    const wasVoice = voice.isListening || voice.isVoiceAnalyzing || voice.isPolishing;
    if (wasVoice) voice.setIsVoiceAnalyzing(true);
    voice.setIsListening(false);
    voice.setIsPolishing(false);
    chat.handleSend(textOverride);
  };

  useEffect(() => {
    const el = listRef.current;
    const target = bottomRef.current;
    if (!el || !target) return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "end" });
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [chat.messages, chat.isStreaming, chat.isThinking, chat.typingId]);

  useEffect(() => { return () => { chat.timersRef.current.forEach((t) => clearTimeout(t)); }; }, [chat.timersRef]);

  useEffect(() => {
    if (!chat.isStreaming && voice.isVoiceAnalyzing) {
      const t = window.setTimeout(() => voice.setIsVoiceAnalyzing(false), 600);
      return () => clearTimeout(t);
    }
  }, [chat.isStreaming, voice.isVoiceAnalyzing, voice]);

  const handleClarify = (opt: string) => handleSendWrapper(opt);
  const handleQuickSend = (t: string) => handleSendWrapper(t);

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF2F7] text-[#2B2E36] selection:bg-[#FF3B00]/20 overflow-x-hidden overflow-y-visible relative">
      {/* Liquid Glass refraction background – subtle texture to make displacement visible, like freefrontend demo */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.55]"
        aria-hidden
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1551384963-cccb0b7ed94b?q=80&w=2000&auto=format&fit=crop), radial-gradient(900px 600px at 18% 20%, rgba(56,189,248,0.22), transparent 60%), radial-gradient(800px 600px at 85% 78%, rgba(168,85,247,0.18), transparent 60%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          filter: "saturate(1.15) contrast(1.05)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#EEF2F7]/72 backdrop-blur-[0.5px]" aria-hidden />
      <Header
        showHistory={showHistory}
        showAccount={showAccount}
        onToggleHistory={() => { setShowAccount(false); setShowHistory((v) => !v); }}
        onToggleAccount={() => { setShowHistory(false); setShowAccount((v) => !v); }}
        onCloseHistory={() => setShowHistory(false)}
        onCloseAccount={() => setShowAccount(false)}
        onSelectHistory={handleQuickSend}
      />

      <VoiceOverlay
        isListening={voice.isListening}
        isPolishing={voice.isPolishing}
        isVoiceAnalyzing={voice.isVoiceAnalyzing}
        voiceTranscript={voice.voiceTranscript}
        polishedDiff={voice.polishedDiff}
        waveLevels={voice.waveLevels}
        debugAudioUrl={voice.debugAudioUrl}
        debugBlobSize={voice.debugBlobSize}
        onCancel={voice.cancelVoice}
        onStop={() => { try { voice.recognitionRef.current?.stop(); } catch {} try { voice.mediaRecorderRef.current?.state === "recording" && voice.mediaRecorderRef.current.stop(); } catch {} }}
      />

      <main className="flex-1 flex flex-col min-h-0 relative pt-[56px]">
        {!hasSearched && !chat.isStreaming && !chat.isThinking && (
          <HeroSection input={chat.input} isListening={voice.isListening} onInputChange={chat.setInput} onSend={() => handleSendWrapper()} onToggleListen={() => voice.toggleListen()} onQuickSend={handleQuickSend} />
        )}
        {(hasSearched || chat.isStreaming || chat.isThinking) && (
          <MessageList messages={chat.messages} typingId={chat.typingId} isThinking={chat.isThinking} isStreaming={chat.isStreaming} showMatrix={showMatrix} backendOk={backend.backendOk} lastTrace={backend.lastTrace} lastCacheHit={backend.lastCacheHit} onToggleMatrix={() => setShowMatrix(!showMatrix)} onClarify={handleClarify} listRef={listRef} bottomRef={bottomRef} />
        )}
        {(hasSearched || chat.isStreaming || chat.isThinking) && (
          <ChatInput input={chat.input} isListening={voice.isListening} isPolishing={voice.isPolishing} isVoiceAnalyzing={voice.isVoiceAnalyzing} isThinking={chat.isThinking} isStreaming={chat.isStreaming} typingId={chat.typingId} onInputChange={chat.setInput} onSend={() => handleSendWrapper()} onToggleListen={() => voice.toggleListen()} />
        )}
      </main>

      <style>{`
        .typing-cursor{ display:inline-block; width:2px; height:1em; background:#FF3B00; margin-left:3px; vertical-align:-1px; animation:cursorBlink 1s step-end infinite; }
        @keyframes cursorBlink{ 0%,50%{ opacity:1 } 51%,100%{ opacity:0 } }
        .stagger-card{ animation:cardIn 420ms cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes cardIn{ from{ opacity:0; transform:translateY(10px) scale(0.98) } to{ opacity:1; transform:translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}
