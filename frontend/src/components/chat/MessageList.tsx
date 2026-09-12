"use client";

import type { ChatMessage } from "@/lib/domain.types";
import { MessageItem } from "./MessageItem";
import { ThinkingIndicator, StreamingIndicator } from "./ThinkingIndicator";

type Props = {
  messages: ChatMessage[];
  typingId: string | null;
  isThinking: boolean;
  isStreaming: boolean;
  showMatrix: boolean;
  backendOk: boolean | null;
  lastTrace: string | null;
  lastCacheHit: boolean | null;
  onToggleMatrix: () => void;
  onClarify: (opt: string) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
};

export function MessageList({ messages, typingId, isThinking, isStreaming, showMatrix, backendOk, lastTrace, lastCacheHit, onToggleMatrix, onClarify, listRef, bottomRef }: Props) {
  return (
    <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-visible px-3 sm:px-4 lg:px-8 py-5 pb-[96px] space-y-4 scroll-smooth bg-transparent relative z-10">
      <div className="w-full max-w-none space-y-4 overflow-visible relative z-10">
        {messages.map((m) => {
          const isTyping = typingId === m.id && m.role === "assistant";
          return <MessageItem key={m.id} message={m} isTyping={isTyping} showMatrix={showMatrix} onToggleMatrix={onToggleMatrix} onClarify={onClarify} backendOk={backendOk} lastTrace={lastTrace} lastCacheHit={lastCacheHit} />;
        })}
        {isThinking && <ThinkingIndicator />}
        {isStreaming && !isThinking && !typingId && <StreamingIndicator />}
      </div>
      <div ref={bottomRef} className="h-1 shrink-0" aria-hidden />
    </div>
  );
}
