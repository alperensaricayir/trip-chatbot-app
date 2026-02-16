import type { ChatMessage } from "@/types";

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.sender === "system") {
    return (
      <div className="flex justify-center">
        <div className="rounded-full bg-black/35 px-3 py-1 text-[11px] text-zinc-200">
          {msg.text}
        </div>
      </div>
    );
  }

  const isUser = msg.sender === "user";
  const container = isUser ? "justify-end" : "justify-start";
  const bubble = isUser
    ? "bg-emerald-500/25 text-zinc-50 rounded-tr-md"
    : "bg-white/10 text-zinc-50 rounded-tl-md";

  return (
    <div className={`flex ${container}`}>
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${bubble}`}>
        <div className="whitespace-pre-wrap text-sm leading-6">{msg.text}</div>
        <div className="mt-1 text-right text-[10px] text-zinc-300/80">
          {formatTime(msg.timestamp)}
        </div>
      </div>
    </div>
  );
}

