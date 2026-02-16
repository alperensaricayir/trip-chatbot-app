"use client";

import { useMemo, useState } from "react";
import type { ReplyKind, ReplyOption } from "@/types";
import { classifyReplyKind } from "@/lib/sentiment";
import { QuickReplies } from "@/components/QuickReplies";

export function ChatComposer({
  options,
  disabled,
  onSend,
}: {
  options: [ReplyOption, ReplyOption, ReplyOption];
  disabled: boolean;
  onSend: (text: string, kind: ReplyKind) => void;
}) {
  const [text, setText] = useState("");

  const placeholder = useMemo(() => {
    if (disabled) return "...";
    return "Mesaj yaz";
  }, [disabled]);

  return (
    <div className="border-t border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto w-full max-w-3xl px-4 py-3">
        <div className="mb-3">
          <div className="text-xs font-medium text-zinc-400">Hızlı Cevaplar</div>
          <div className="mt-2">
            <QuickReplies
              options={options}
              disabled={disabled}
              onPick={(o) => onSend(o.label, o.kind)}
            />
          </div>
        </div>

        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = text.trim();
            if (!trimmed || disabled) return;
            onSend(trimmed, classifyReplyKind(trimmed));
            setText("");
          }}
        >
          <label className="sr-only" htmlFor="tps-message">
            Mesaj
          </label>
          <textarea
            id="tps-message"
            rows={1}
            value={text}
            disabled={disabled}
            onChange={(e) => setText(e.target.value)}
            className="max-h-28 flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20 disabled:opacity-60"
            placeholder={placeholder}
          />
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
}

