"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatComposer } from "@/components/ChatComposer";
import { GameOverScreen } from "@/components/GameOverScreen";
import { MessageBubble } from "@/components/MessageBubble";
import { PatienceBar } from "@/components/PatienceBar";
import { TypingBubble } from "@/components/TypingBubble";
import type { PersonaId } from "@/types";
import { useTripliGame } from "@/hooks/useTripliGame";

export function ChatScreen({
  personaId,
  difficultyId,
}: {
  personaId: PersonaId;
  difficultyId: string | null | undefined;
}) {
  const {
    state,
    persona,
    difficulty,
    remainingSeconds,
    replyOptions,
    send,
    restart,
  } = useTripliGame(personaId, difficultyId);

  const isLocked = state.phase !== "playing" || state.isPartnerTyping || !state.awaitingUserSince;

  const timeColor = useMemo(() => {
    if (remainingSeconds >= 10) return "text-zinc-100";
    if (remainingSeconds >= 5) return "text-amber-200";
    return "text-rose-200";
  }, [remainingSeconds]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state.messages.length, state.isPartnerTyping]);

  return (
    <div className="min-h-dvh">
      <ChatHeader persona={persona} difficulty={difficulty} score={state.messageCount} />

      <div className="tps-chat-bg flex min-h-[calc(100dvh-56px)] flex-col">
        <div className="mx-auto w-full max-w-3xl px-4 pt-4">
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <PatienceBar value={state.patience} />
            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
              <div className="text-xs text-zinc-300">Hayatta Kalma Skoru</div>
              <div className="text-sm font-semibold tabular-nums">{state.messageCount} mesaj</div>
              <div className={`text-xs font-semibold tabular-nums ${timeColor}`}>
                {remainingSeconds}s
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 pb-3 pt-4">
          <div className="tps-scrollbar h-full flex-1 space-y-3 overflow-y-auto">
            {state.messages.map((m) => (
              <MessageBubble key={m.id} msg={m} />
            ))}
            {state.isPartnerTyping ? <TypingBubble /> : null}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="sticky bottom-0 inset-x-0">
          <ChatComposer
            options={replyOptions}
            disabled={isLocked}
            onSend={(text, kind) => send(text, kind)}
          />
        </div>
      </div>

      {state.phase === "gameover" ? (
        <GameOverScreen
          score={state.messageCount}
          highScore={state.highScore}
          onRestart={restart}
        />
      ) : null}
    </div>
  );
}
