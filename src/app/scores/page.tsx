"use client";

import { useState } from "react";
import Link from "next/link";
import { clearHighScore, loadHighScore } from "@/lib/storage";

export default function ScoresPage() {
  const [score, setScore] = useState(() => loadHighScore());

  return (
    <main className="min-h-dvh">
      <div className="mx-auto w-full max-w-md px-5 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Skorlar</h1>
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            Geri
          </Link>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs text-zinc-400">En Yüksek Skor</div>
          <div className="mt-2 text-4xl font-semibold tabular-nums">{score}</div>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Bu skor tarayıcında saklanır (LocalStorage).
          </p>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          onClick={() => {
            const ok = window.confirm("High score sıfırlansın mı?");
            if (!ok) return;
            clearHighScore();
            setScore(0);
          }}
        >
          High Score&apos;u Sıfırla
        </button>
      </div>
    </main>
  );
}
