import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";

export const dynamic = "force-dynamic";

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not set on the server." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Send a JSON body." }, { status: 400 });

  const name = clip(body.name, 120);
  if (!name) return NextResponse.json({ error: "Client name is required." }, { status: 400 });

  const question = clip(body.question, 500);
  const prompt = [
    "You are the account strategist at Haoken, a marketing agency.",
    "Write a client context brief the account lead can use before a call.",
    "Cover: what this client is buying, how they pay, who to talk to, risks, and the next useful marketing move.",
    "Use only the facts below. If a fact is missing, say what to ask instead of inventing it.",
    `Client: ${name}`,
    `Industry: ${clip(body.industry, 120)}`,
    `Status: ${clip(body.status, 40)}`,
    `Billing: ${clip(body.billing, 160)}`,
    `Client since: ${clip(body.since, 40)}`,
    `Contact: ${clip(body.contact, 120)}`,
    `Email: ${clip(body.email, 160)}`,
    `Phone: ${clip(body.phone, 40)}`,
    `Notes: ${clip(body.notes, 2000) || "None yet."}`,
    question ? `The account lead also asked: ${question}` : "No extra question.",
    "Keep it under 220 words. Use short labeled sections.",
  ].join("\n");

  const result = await generateText(apiKey, prompt, 900);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ text: result.text });
}
