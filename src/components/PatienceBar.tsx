import { clamp } from "@/lib/gameEngine";

export function PatienceBar({ value }: { value: number }) {
  const v = clamp(value, 0, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-zinc-300">
        <span className="font-medium">Sabır</span>
        <span className="tabular-nums">{v}/100</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
          style={{ width: `${v}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

