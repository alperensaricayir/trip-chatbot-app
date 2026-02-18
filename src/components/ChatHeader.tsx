import type { DifficultyConfig, PersonaMeta } from "@/types";
import Link from "next/link";
import { useState } from "react";

export function ChatHeader({
  persona,
  difficulty,
  score,
  isWhatsappMode,
  onToggleWhatsapp,
}: {
  persona: PersonaMeta;
  difficulty: DifficultyConfig;
  score: number;
  isWhatsappMode?: boolean;
  onToggleWhatsapp?: () => void;
}) {
  const [aiStatus, setAiStatus] = useState<"idle" | "ok" | "fail">("idle");
  async function checkAi() {
    setAiStatus("idle");
    try {
      const storedKey = localStorage.getItem("hf_api_key");
      const headers: Record<string, string> = {};
      if (storedKey) headers["x-hf-key"] = storedKey;

      const res = await fetch("/api/hf", {
        method: "GET",
        headers
      });
      const data = await res.json();
      setAiStatus(data.ok ? "ok" : "fail");
    } catch {
      setAiStatus("fail");
    }
  }
  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-emerald-600/20 backdrop-blur tps-header">
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

        {onToggleWhatsapp && (
          <button
            type="button"
            onClick={onToggleWhatsapp}
            className={`rounded-lg px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${isWhatsappMode ? "bg-[#25D366]" : "bg-zinc-700"
              }`}
            aria-label="What's Up Modu"
          >
            What's Up
          </button>
        )}

        <button
          type="button"
          onClick={checkAi}
          className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          aria-label="API Testi yap"
        >
          API Test
        </button>

        <div
          className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-zinc-100"
          aria-live="polite"
        >
          Skor: <span className="tabular-nums">{score}</span>
        </div>

        {aiStatus !== "idle" && (
          <div
            className={`rounded-full px-2 py-1 text-[11px] font-semibold shadow-sm ${aiStatus === "ok" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
              }`}
          >
            {aiStatus === "ok" ? "API Başarılı" : "API Hatası"}
          </div>
        )}
      </div>
    </div>
  );
}
