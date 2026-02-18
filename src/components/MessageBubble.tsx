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

  // Base classes (Default Dark Mode)
  // Partner: bg-white/10 text-zinc-50
  // User: bg-emerald-500/25 text-zinc-50
  const bubbleBase = isUser
    ? "bg-emerald-500/25 text-zinc-50 rounded-tr-md tps-message-user"
    : "bg-white/10 text-zinc-50 rounded-tl-md tps-message-partner";

  return (
    <div className={`flex ${container}`}>
      <div className={`max-w-[78%] rounded-2xl px-4 py-2 ${bubbleBase}`}>
        <div className="whitespace-pre-wrap text-sm leading-6">{msg.text}</div>
        <div className={`mt-0.5 text-right text-[10px] ${isUser ? "text-zinc-300/80" : "text-zinc-400"} tps-time`}>
          {formatTime(msg.timestamp)}
        </div>
      </div>
    </div>
  );
}

