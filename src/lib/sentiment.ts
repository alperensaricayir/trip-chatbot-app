import type { ReplyKind } from "@/types";

export function classifyReplyKind(text: string): ReplyKind {
  const t = text.trim().toLowerCase();
  if (!t) return "explain";

  const empathy = [
    "özür",
    "pardon",
    "haklısın",
    "kusura",
    "anlıyorum",
    "gönlünü",
    "seni üzdüm",
  ];
  const trigger = [
    "abartıyorsun",
    "büyütme",
    "saçma",
    "boş yapma",
    "ne var",
    "drama",
    "trip",
    "lan",
    "yeter",
    "sus",
  ];

  // Shouting or aggressive punctuation
  const exclamations = (text.match(/!+/g) ?? []).join("").length;
  const upperRatio =
    text.length > 0
      ? (text.replace(/[^A-ZÇĞİÖŞÜ]/g, "").length / text.replace(/[^A-Za-zÇĞİÖŞÜ]/g, "").length)
      : 0;

  if (trigger.some((k) => t.includes(k))) return "trigger";
  if (exclamations >= 2 || upperRatio > 0.6) return "trigger";
  if (empathy.some((k) => t.includes(k))) return "empathy";

  return "explain";
}
