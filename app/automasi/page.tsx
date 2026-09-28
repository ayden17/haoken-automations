"use client";

import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/ui/efferd-dashboard-2-utils/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const actions = [
  {
    id: "image-ads",
    name: "Generate Image Ads",
    detail: "One square ad from a short brief.",
  },
  {
    id: "video-script",
    name: "Generate Video Script",
    detail: "A 30-second script with beats and on-screen text.",
  },
  {
    id: "pitch-deck",
    name: "Create pitch deck",
    detail: "Eight slides an account lead can present.",
  },
  {
    id: "social-pack",
    name: "Social caption pack",
    detail: "Five captions with hooks and CTAs.",
  },
  {
    id: "email-sequence",
    name: "Email sequence",
    detail: "Three emails with subjects and bodies.",
  },
  {
    id: "proposal",
    name: "Client proposal",
    detail: "A one-page proposal from the brief.",
  },
] as const;

type StudioImage = { mimeType: string; data: string };

export default function AutomasiPage() {
  const [actionId, setActionId] = useState<(typeof actions)[number]["id"]>("image-ads");
  const [clientName, setClientName] = useState("");
  const [brief, setBrief] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<StudioImage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const action = actions.find((item) => item.id === actionId) ?? actions[0];

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setText("");
    setImage(null);
    try {
      const response = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId, clientName, brief }),
      });
      const data = (await response.json()) as {
        text?: string;
        error?: string;
        image?: StudioImage;
      };
      if (!response.ok || !data.text) {
        setError(data.error || "Gemini could not finish this action.");
        return;
      }
      setText(data.text);
      setImage(data.image ?? null);
    } catch {
      setError("The request did not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        description="Pick an action. Each button opens a brief and runs it with Gemini."
        eyebrow="Growth"
        title="Automasi"
      />
      <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((item) => {
          const selected = item.id === actionId;
          return (
            <button
              aria-pressed={selected}
              className={cn(
                "bg-background px-4 py-4 text-left",
                selected && "bg-muted",
              )}
              key={item.id}
              onClick={() => {
                setActionId(item.id);
                setText("");
                setImage(null);
                setError("");
              }}
              type="button"
            >
              <span className="block font-medium">{item.name}</span>
              <span className="mt-1 block text-muted-foreground text-sm">{item.detail}</span>
            </button>
          );
        })}
      </div>
      <form className="grid gap-3 border-t px-4 py-5 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)]" onSubmit={onSubmit}>
        <div className="grid content-start gap-3">
          <div>
            <p className="font-medium text-sm">{action.name}</p>
            <p className="text-muted-foreground text-sm">{action.detail}</p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="studio-client">Klien atau brand</Label>
            <Input id="studio-client" onChange={(event) => setClientName(event.target.value)} value={clientName} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="studio-brief">Brief</Label>
            <textarea
              className="min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              id="studio-brief"
              onChange={(event) => setBrief(event.target.value)}
              placeholder="Offer, audience, and anything that must appear."
              value={brief}
            />
          </div>
          <Button disabled={loading} type="submit">
            {loading ? "Working…" : action.name}
          </Button>
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
        </div>
        <div className="min-h-40 rounded-lg border bg-muted/30 p-4">
          {loading ? (
            <div className="grid gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-40 w-full max-w-sm" />
            </div>
          ) : null}
          {text ? <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{text}</pre> : null}
          {image ? (
            <img
              alt="Generated ad"
              className="mt-4 w-full max-w-sm rounded-md"
              src={`data:${image.mimeType};base64,${image.data}`}
            />
          ) : null}
          {!loading && !text ? (
            <p className="text-muted-foreground text-sm">The result lands here after you run an action.</p>
          ) : null}
        </div>
      </form>
    </AppShell>
  );
}
