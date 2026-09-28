"use client";

import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/ui/efferd-dashboard-2-utils/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ChatImage = { mimeType: string; data: string };
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: ChatImage;
};

const starters = [
  { label: "Ideasi kampanye", image: false, text: "Give me three campaign ideas for a neighborhood coffee brand launching a seasonal drink." },
  { label: "Arah brand", image: false, text: "Propose a brand direction: audience, tone, three colors, and a tagline for a B2B analytics product." },
  { label: "Iklan feed", image: true, text: "A square Instagram ad for a fashion lookbook. Clean studio light, one garment, short headline." },
  { label: "Konsep logo", image: true, text: "A simple logo mark for a coastal logistics company named Harbor. Flat, geometric, no tiny text." },
];

export default function PemasaranPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask for campaign ideas, a tagline, a color direction, or an image ad. Image prompts come back as a picture.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function send(text: string, image: boolean) {
    const content = text.trim();
    if (!content || loading) return;
    const nextMessages: ChatMessage[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content },
    ];
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          messages: nextMessages
            .filter((message) => message.id !== "welcome")
            .map((message) => ({ role: message.role, content: message.content })),
        }),
      });
      const data = (await response.json()) as {
        text?: string;
        error?: string;
        image?: ChatImage;
      };
      if (!response.ok || !data.text) {
        setError(data.error || "Gemini could not answer.");
        return;
      }
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.text || "",
          image: data.image,
        },
      ]);
    } catch {
      setError("The request did not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const wantsImage = /\b(image|gambar|iklan|logo|ad|visual)\b/i.test(draft);
    void send(draft, wantsImage);
  }

  return (
    <AppShell>
      <PageHeader
        action={
          <a
            className="inline-flex h-8 items-center rounded-lg border px-2.5 text-sm"
            href="https://www.facebook.com/ads/library"
            rel="noreferrer"
            target="_blank"
          >
            Lihat Ads Kompetitor
          </a>
        }
        description="Ideation and brand assets. Competitor ads open in Meta's public library."
        eyebrow="Growth"
        title="Pemasaran"
      />
      <div className="flex min-h-[calc(100svh-8.5rem)] flex-col">
        <div className="flex flex-wrap gap-2 border-b px-4 py-3 sm:px-6">
          {starters.map((starter) => (
            <Button
              key={starter.label}
              onClick={() => void send(starter.text, starter.image)}
              size="sm"
              type="button"
              variant="outline"
            >
              {starter.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-4 px-4 py-5 sm:px-6">
          {messages.map((message) => (
            <article
              className={message.role === "user" ? "ms-auto max-w-xl" : "max-w-2xl"}
              key={message.id}
            >
              <p className="mb-1 text-muted-foreground text-xs">
                {message.role === "user" ? "You" : "Haoken"}
              </p>
              <div className="rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed">
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.image ? (
                  <img
                    alt="Generated brand asset"
                    className="mt-3 w-full max-w-sm rounded-md"
                    src={`data:${message.image.mimeType};base64,${message.image.data}`}
                  />
                ) : null}
              </div>
            </article>
          ))}
          {loading ? (
            <div className="grid max-w-md gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : null}
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
        </div>
        <form className="sticky bottom-0 flex gap-2 border-t bg-background px-4 py-3 sm:px-6" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="pemasaran-draft">
            Message
          </label>
          <textarea
            className="min-h-16 flex-1 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            id="pemasaran-draft"
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Describe the brand, offer, or asset you want."
            value={draft}
          />
          <Button disabled={loading} type="submit">
            Kirim
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
