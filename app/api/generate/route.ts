import { NextResponse } from "next/server";
import { templateById, tones, type Tone } from "@/lib/automations";

export const dynamic = "force-dynamic";

const MODEL = "gemini-3.8-flash";

function clip(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set on the server." },
      { status: 500 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a JSON body." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const template = templateById(clip(body.templateId, 80));
  const clientName = clip(body.clientName, 120);
  const context = clip(body.context, 2000);
  const tone = clip(body.tone, 40);

  if (!template) {
    return NextResponse.json({ error: "Unknown automation template." }, { status: 400 });
  }
  if (!clientName) {
    return NextResponse.json({ error: "Add a client name." }, { status: 400 });
  }
  if (!tones.includes(tone as Tone)) {
    return NextResponse.json({ error: "Choose a supported tone." }, { status: 400 });
  }

  const prompt = [
    "You write operational marketing copy for Haoken, a boutique agency.",
    `Template: ${template.name} (${template.channel}).`,
    `Instructions: ${template.instructions}`,
    `Client: ${clientName}.`,
    `Tone: ${tone}.`,
    context ? `Notes from the account lead:\n${context}` : "No extra notes were provided.",
    "Return only the finished draft. Do not mention that you are an AI model.",
  ].join("\n\n");

  let response: Response | null = null;
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          }),
        },
      );
      if (response.ok || (response.status !== 429 && response.status !== 503)) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    }
  } catch {
    return NextResponse.json(
      { error: "Could not reach the Gemini API." },
      { status: 502 },
    );
  }

  if (!response) {
    return NextResponse.json(
      { error: "Could not reach the Gemini API." },
      { status: 502 },
    );
  }

  const data = (await response.json().catch(() => null)) as {
    error?: { message?: string };
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  } | null;

  if (!response.ok) {
    const raw = (data?.error?.message || "Gemini rejected the request.").replaceAll(
      apiKey,
      "[redacted]",
    );
    const message =
      response.status === 429 || response.status === 503
        ? "Gemini is busy right now. Try the draft again in a moment."
        : raw;
    return NextResponse.json({ error: message }, { status: response.status });
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    return NextResponse.json(
      { error: "Gemini returned an empty draft. Try again with more notes." },
      { status: 502 },
    );
  }

  return NextResponse.json({ text });
}
