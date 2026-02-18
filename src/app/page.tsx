"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">(
    "normal",
  );

  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("hf_api_key");
    setHasKey(!!key);
  }, []);

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
                className={`rounded-xl border px-3 py-2 text-center text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${difficulty === "easy"
                  ? "border-emerald-400/40 bg-emerald-500/15 text-zinc-50"
                  : "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                  }`}
              >
                Kolay
              </button>
              <button
                type="button"
                onClick={() => setDifficulty("normal")}
                className={`rounded-xl border px-3 py-2 text-center text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${difficulty === "normal"
                  ? "border-emerald-400/40 bg-emerald-500/15 text-zinc-50"
                  : "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                  }`}
              >
                Orta
              </button>
              <button
                type="button"
                onClick={() => setDifficulty("hard")}
                className={`rounded-xl border px-3 py-2 text-center text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${difficulty === "hard"
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

        <footer className="py-6 text-center text-[11px] leading-5 text-zinc-500">
          <p>Gerçek ilişki tavsiyesi içermez. Sadece eğlence amaçlıdır.</p>
          <div className="mt-2 space-y-3">
            <div>
              <Link
                href="/scores"
                className="text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
              >
                En Yüksek Skor
              </Link>
            </div>
            <div>
              <Link
                href="/admin"
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${hasKey
                  ? "bg-emerald-900/30 text-emerald-400 ring-1 ring-emerald-500/50 hover:bg-emerald-900/50"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
              >
                API Configuration
                {hasKey && (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </Link>
            </div>
          </div>
        </footer>
      </div >
    </main >
  );
}
