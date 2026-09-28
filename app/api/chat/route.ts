import { NextResponse } from "next/server";
import { generateImage, generateText } from "@/lib/gemini";

export const dynamic = "force-dynamic";

type IncomingMessage = { role?: unknown; content?: unknown };

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not set on the server." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as {
    messages?: IncomingMessage[];
    image?: unknown;
  } | null;
  const messages = Array.isArray(body?.messages) ? body.messages.slice(-8) : [];
  const transcript = messages
    .map((message) => {
      const role = message.role === "assistant" ? "Assistant" : "User";
      const content = clip(message.content, 1500);
      return content ? `${role}: ${content}` : "";
    })
    .filter(Boolean)
    .join("\n");

  if (!transcript) {
    return NextResponse.json({ error: "Write a message first." }, { status: 400 });
  }

  const latest = clip(messages.at(-1)?.content, 1500);
  if (body?.image === true) {
    const prompt = [
      "Create one square marketing image for a boutique agency client.",
      "No tiny unreadable text. Prefer a strong visual, a short headline of 4 words or fewer if type is needed, and a clean layout.",
      `Request: ${latest}`,
      transcript !== `User: ${latest}` ? `Earlier conversation:\n${transcript}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    const result = await generateImage(apiKey, prompt);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({
      text: result.text || "Image concept is ready.",
      image: result.image,
    });
  }

  const prompt = [
    "You are Haoken's creative director in a working chat.",
    "Help with campaign ideation and brand assets: names, taglines, color direction, art direction, and ad concepts.",
    "Be concrete. When you propose an asset, describe what a designer should make.",
    "Reply in the same language as the latest user message.",
    transcript,
  ].join("\n\n");

  const result = await generateText(apiKey, prompt, 900);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ text: result.text });
}
