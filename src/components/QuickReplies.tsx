import type { ReplyKind, ReplyOption } from "@/types";

const kindStyles: Record<ReplyKind, string> = {
  empathy:
    "border-emerald-400/30 bg-emerald-500/10 hover:bg-emerald-500/15 focus-visible:ring-emerald-400",
  explain:
    "border-sky-400/30 bg-sky-500/10 hover:bg-sky-500/15 focus-visible:ring-sky-400",
  trigger:
    "border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/15 focus-visible:ring-amber-400",
};

export function QuickReplies({
  options,
  disabled,
  onPick,
}: {
  options: [ReplyOption, ReplyOption, ReplyOption];
  disabled: boolean;
  onPick: (opt: { label: string; kind: ReplyKind }) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`w-full rounded-xl border px-3 py-2 text-left text-sm text-zinc-100 transition focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${kindStyles[o.kind]}`}
          disabled={disabled}
          onClick={() => onPick({ label: o.label, kind: o.kind })}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

