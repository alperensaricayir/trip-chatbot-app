"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">(
    "normal",
  );

  const difficultyLabel =
    difficulty === "easy" ? "Kolay" : difficulty === "hard" ? "Zor" : "Orta";

  const gameLinks = useMemo(() => {
    const q = `difficulty=${difficulty}`;
    return {
      male: `/game?persona=male&${q}`,
      female: `/game?persona=female&${q}`,
    };
  }, [difficulty]);

  return (
    <main className="min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Tripli Partner Simülatörü
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Partnerin bugün çok huysuz! Bakalım ne kadar süre alttan
            alabileceksin yoksa engeli mi yiyeceksin?
          </p>

          <div className="mt-6">
            <p className="text-xs font-medium text-zinc-400">Zorluk</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDifficulty("easy")}
                className={`rounded-xl border px-3 py-2 text-center text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  difficulty === "easy"
                    ? "border-emerald-400/40 bg-emerald-500/15 text-zinc-50"
                    : "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                }`}
              >
                Kolay
              </button>
              <button
                type="button"
                onClick={() => setDifficulty("normal")}
                className={`rounded-xl border px-3 py-2 text-center text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  difficulty === "normal"
                    ? "border-emerald-400/40 bg-emerald-500/15 text-zinc-50"
                    : "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                }`}
              >
                Orta
              </button>
              <button
                type="button"
                onClick={() => setDifficulty("hard")}
                className={`rounded-xl border px-3 py-2 text-center text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  difficulty === "hard"
                    ? "border-emerald-400/40 bg-emerald-500/15 text-zinc-50"
                    : "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                }`}
              >
                Zor
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Seçili: <span className="font-medium text-zinc-200">{difficultyLabel}</span>
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href={gameLinks.male}
              className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/8 to-white/0 px-4 py-4 transition hover:border-white/20 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Erkek partner ile başla"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-xl">
                  E
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Erkek Partner</div>
                  <div className="mt-0.5 text-xs text-zinc-400">
                    Bugün biraz tripli.
                  </div>
                </div>
                <div className="text-sm text-zinc-400 transition group-hover:text-zinc-200">
                  →
                </div>
              </div>
            </Link>

            <Link
              href={gameLinks.female}
              className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/8 to-white/0 px-4 py-4 transition hover:border-white/20 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Kadın partner ile başla"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-xl">
                  K
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Kadın Partner</div>
                  <div className="mt-0.5 text-xs text-zinc-400">
                    Bugün biraz tripli.
                  </div>
                </div>
                <div className="text-sm text-zinc-400 transition group-hover:text-zinc-200">
                  →
                </div>
              </div>
            </Link>
          </div>
        </div>

        <footer className="pt-6 text-center text-[11px] leading-5 text-zinc-500">
          Gerçek ilişki tavsiyesi içermez. Sadece eğlence amaçlıdır.
          <div className="mt-2">
            <Link
              href="/scores"
              className="text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
            >
              En Yüksek Skor
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
