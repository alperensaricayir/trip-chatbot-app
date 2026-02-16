import Link from "next/link";

export function GameOverScreen({
  score,
  highScore,
  onRestart,
}: {
  score: number;
  highScore: number;
  onRestart: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
        <div className="mx-auto w-fit -rotate-6 rounded-2xl border-2 border-rose-400/70 px-5 py-3 text-center">
          <div className="text-2xl font-black tracking-widest text-rose-200">
            ENGELLENDİN
          </div>
        </div>

        <h2 className="mt-5 text-center text-lg font-semibold">Eyvah! Oyun bitti</h2>
        <p className="mt-2 text-center text-sm leading-6 text-zinc-300">
          Partnerin sabrının sonuna geldi. Artık ona ulaşamazsın!
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-zinc-400">HAYATTA KALMA SKORU</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {score} <span className="text-base font-medium text-zinc-300">Mesaj</span>
          </div>
          <div className="mt-3 text-xs text-zinc-400">En Yüksek Skor</div>
          <div className="mt-1 text-lg font-semibold tabular-nums">{highScore}</div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-5 w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          Bir Şans Daha Dene
        </button>
        <Link
          href="/"
          className="mt-3 block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-zinc-100 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}
