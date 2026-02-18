import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

function getEnv(customKey?: string | null) {
  const token = customKey || process.env.HF_API_TOKEN || process.env.HF_TOKEN;
  const model = process.env.HF_MODEL_ID || "meta-llama/Llama-3.1-8B-Instruct";
  const timeoutMs = Number(process.env.HF_TIMEOUT_MS || "12000");
  return { token, model, timeoutMs };
}

function buildPrompt(input: {
  persona: string;
  angerLevel: number;
  patience: number;
  messages: Array<{ role: "user" | "partner"; text: string }>;
}) {
  const header =
    "Türkçe kısa cevap ver. Hakaret etme. Tripli ama incitmeden, 1-2 cümle. Duruma uygun, konuşmanın bağlamını koru.";
  const personaLine = `Persona: ${input.persona}, Öfke: ${input.angerLevel}, Sabır: ${input.patience}`;
  const history = input.messages
    .slice(-8)
    .map((m) => `${m.role === "partner" ? "Partner" : "Kullanıcı"}: ${m.text}`)
    .join("\n");
  const prompt = `${header}\n${personaLine}\n${history}\nPartner:`;
  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const customKey = req.headers.get("x-hf-key");
    const env = getEnv(customKey);
    if (!env.token) return NextResponse.json({ error: "no_token" }, { status: 400 });

    const body = (await req.json()) as {
      persona: string;
      angerLevel: number;
      patience: number;
      messages: Array<{ role: "user" | "partner"; text: string }>;
    };

    const client = new OpenAI({
      apiKey: env.token,
      baseURL: "https://router.huggingface.co/v1",
    });

    const prompt = buildPrompt(body);
    const resp = await client.chat.completions.create({
      model: env.model,
      messages: [
        { role: "system", content: "Tripli partner; Türkçe kısa cevap; küfür yok; bağlamı koru." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 120,
    });

    const text = resp.choices?.[0]?.message?.content ?? "";

    const sanitized = String(text).replace(/\n+/g, " ").slice(0, 400).trim();
    return NextResponse.json({ text: sanitized || "Tamam, ama bu böyle devam edemez." });

  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const customKey = req.headers.get("x-hf-key");
    const { token, model } = getEnv(customKey);
    if (!token) return NextResponse.json({ ok: false, reason: "no_token" }, { status: 200 });
    const client = new OpenAI({ apiKey: token, baseURL: "https://router.huggingface.co/v1" });
    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "Ping" },
        { role: "user", content: "Ping?" },
      ],
      max_tokens: 5,
      temperature: 0.1,
    });
    const ok = !!resp?.choices?.[0]?.message?.content;
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
