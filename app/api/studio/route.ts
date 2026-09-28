import { NextResponse } from "next/server";
import { generateImage, generateText } from "@/lib/gemini";

export const dynamic = "force-dynamic";

const actions = {
  "image-ads": {
    kind: "image" as const,
    instructions:
      "Design one feed ad. Show the offer visually. If you include type, keep it to a short headline. Do not invent a logo lockup that needs tiny legal text.",
  },
  "video-script": {
    kind: "text" as const,
    instructions:
      "Write a 30-second video script with timed beats, on-screen text, voiceover, and a final CTA. Label each beat.",
  },
  "pitch-deck": {
    kind: "text" as const,
    instructions:
      "Write a 8-slide pitch deck outline. For each slide give the title and the 3 lines that belong on the slide. Slides: title, problem, audience, idea, channels, proof, investment, next step.",
  },
  "social-pack": {
    kind: "text" as const,
    instructions: "Write 5 social captions with a hook, two sentences, and a CTA. Vary the angle.",
  },
  "email-sequence": {
    kind: "text" as const,
    instructions: "Write a 3-email sequence. Label each email with subject and body.",
  },
  proposal: {
    kind: "text" as const,
    instructions:
      "Write a one-page agency proposal: situation, approach, deliverables, timeline, and fee structure. Do not invent a fee if none was given.",
  },
};

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not set on the server." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const actionId = clip(body?.actionId, 40);
  const action = actions[actionId as keyof typeof actions];
  if (!action) return NextResponse.json({ error: "Unknown action." }, { status: 400 });

  const clientName = clip(body?.clientName, 120);
  const brief = clip(body?.brief, 2000);
  if (!clientName) return NextResponse.json({ error: "Add a client or brand name." }, { status: 400 });

  const prompt = [
    "You produce work for Haoken, a marketing agency.",
    action.instructions,
    `Brand or client: ${clientName}`,
    brief ? `Brief:\n${brief}` : "No extra brief was provided. Stay general and mark assumptions.",
  ].join("\n\n");

  if (action.kind === "image") {
    const result = await generateImage(apiKey, prompt);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ text: result.text || "Ad image is ready.", image: result.image });
  }

  const result = await generateText(apiKey, prompt, 1600);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ text: result.text });
}
