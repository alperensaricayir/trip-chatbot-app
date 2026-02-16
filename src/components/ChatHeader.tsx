import type { DifficultyConfig, PersonaMeta } from "@/types";
import Link from "next/link";
import { useState } from "react";

export function ChatHeader({
  persona,
  difficulty,
  score,
}: {
  persona: PersonaMeta;
  difficulty: DifficultyConfig;
  score: number;
}) {
  const [aiStatus, setAiStatus] = useState<"idle" | "ok" | "fail">("idle");
  async function checkAi() {
    setAiStatus("idle");
    try {
      const res = await fetch("/api/hf", { method: "GET" });
      const data = await res.json();
      setAiStatus(data.ok ? "ok" : "fail");
    } catch {
      setAiStatus("fail");
    }
  }
  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-emerald-600/20 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
        <Link
          href="/"
          className="rounded-lg px-2 py-1 text-sm font-medium text-zinc-100 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          Çık
        </Link>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
          {persona.displayName.slice(0, 1).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{persona.displayName}</div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-100/90">
            <span>{persona.statusText}</span>
            <span aria-hidden="true">•</span>
            <span>{difficulty.label}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={checkAi}
          className="rounded-lg bg-black/20 px-3 py-1 text-xs font-semibold text-zinc-100 transition hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          aria-label="Yapay Zeka durumu"
        >
          Yapay Zeka
        </button>

        <div
          className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-zinc-100"
          aria-live="polite"
        >
          Skor: <span className="tabular-nums">{score}</span>
        </div>

        {aiStatus !== "idle" && (
          <div
            className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
              aiStatus === "ok" ? "bg-emerald-500/30 text-emerald-100" : "bg-red-500/30 text-red-100"
            }`}
          >
            {aiStatus === "ok" ? "AI çalışıyor" : "AI çalışmıyor"}
          </div>
        )}
      </div>
    </div>
  );
}
