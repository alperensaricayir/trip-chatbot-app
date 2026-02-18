import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

function getEnv(customKey?: string | null) {
  const token = customKey || process.env.HF_API_TOKEN || process.env.HF_TOKEN;
  const model = process.env.HF_MODEL_ID || "meta-llama/Llama-3.1-8B-Instruct";
  const timeoutMs = Number(process.env.HF_TIMEOUT_MS || "12000");
  return { token, model, timeoutMs };
}

export async function POST(req: NextRequest) {
  try {
    const customKey = req.headers.get("x-hf-key");
    const env = getEnv(customKey);
    if (!env.token) return NextResponse.json({ error: "no_token" }, { status: 400 });
    const client = new OpenAI({ apiKey: env.token, baseURL: "https://router.huggingface.co/v1" });
    const body = (await req.json()) as {
      persona: string;
      angerLevel: number;
      patience: number;
      userText: string;
      history: Array<{ role: "user" | "partner"; text: string }>;
    };
    const instruction =
      "Sadece JSON döndür. Şema: {\"class\":\"empathy|explain|trigger\",\"patienceDelta\":-15..10,\"angerDelta\":-1..2}. " +
      "Türkçe; kullanıcı mesajının tonuna göre değerlendir. Empati: sabır +5..+10, Açıklama: +2..+6, Tetikleyici: -8..-15 ve öfke +1.";
    const personaLine = `Persona: ${body.persona}, Öfke: ${body.angerLevel}, Sabır: ${body.patience}`;
    const historyText = body.history
      .slice(-6)
      .map((m) => `${m.role === "partner" ? "Partner" : "Kullanıcı"}: ${m.text}`)
      .join("\n");
    const prompt = `${instruction}\n${personaLine}\n${historyText}\nKullanıcı: ${body.userText}\nJSON:`;

    const resp = await client.chat.completions.create({
      model: env.model,
      messages: [
        { role: "system", content: "Sadece JSON döndür; şema ve kurallara uy." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 120,
    });
    const text = resp.choices?.[0]?.message?.content ?? "{}";
    const clean = text.replace(/^[^\\{]*\\{/, "{").replace(/\\}[^\\}]*$/, "}");
    let parsed: any = {};
    try {
      parsed = JSON.parse(clean);
    } catch {
      parsed = { class: "explain", patienceDelta: 2, angerDelta: 0 };
    }
    const cls = parsed.class === "empathy" || parsed.class === "trigger" ? parsed.class : "explain";
    const patienceDelta =
      typeof parsed.patienceDelta === "number" ? Math.max(-15, Math.min(10, parsed.patienceDelta)) : 2;
    const angerDelta =
      typeof parsed.angerDelta === "number" ? Math.max(-1, Math.min(2, parsed.angerDelta)) : 0;
    return NextResponse.json({ class: cls, patienceDelta, angerDelta });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 500 });
  }
}
