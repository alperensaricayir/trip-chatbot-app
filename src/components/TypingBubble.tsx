export function TypingBubble() {
  return (
    <div className="max-w-[78%] rounded-2xl rounded-tl-md bg-white/10 px-4 py-3">
      <div className="flex items-center gap-1" aria-label="Yazıyor">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 [animation-delay:-0.2s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 [animation-delay:-0.1s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300" />
      </div>
    </div>
  );
}

