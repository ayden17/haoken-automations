"use client";

import { useState, type FormEvent } from "react";
import { Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgency } from "@/lib/agency-store";
import {
  automationTemplates,
  templateById,
  tones,
  type Tone,
} from "@/lib/automations";

export function GeneratePanel({
  templateId: controlledTemplateId,
  onTemplateChange,
  initialTemplateId = "weekly-report",
}: {
  templateId?: string;
  onTemplateChange?: (id: string) => void;
  initialTemplateId?: string;
}) {
  const [internalTemplateId, setInternalTemplateId] = useState(initialTemplateId);
  const templateId = controlledTemplateId ?? internalTemplateId;

  function setTemplateId(id: string) {
    setInternalTemplateId(id);
    onTemplateChange?.(id);
  }
  const { clients } = useAgency();
  const [clientName, setClientName] = useState(clients[0]?.name ?? "");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const template = templateById(templateId) ?? automationTemplates[0];

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    setCopied(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          clientName,
          context,
          tone,
        }),
      });
      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || !data.text) {
        setError(data.error || "Gemini could not generate this draft.");
        return;
      }
      setResult(data.text);
    } catch {
      setError("The request did not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="grid gap-1.5">
        <Label htmlFor="template">Template</Label>
        <select
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          id="template"
          onChange={(event) => setTemplateId(event.target.value)}
          value={template?.id}
        >
          {automationTemplates.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <p className="text-muted-foreground text-xs">{template?.description}</p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="client">Klient</Label>
        <Input
          id="client"
          list="client-names"
          onChange={(event) => setClientName(event.target.value)}
          value={clientName}
        />
        <datalist id="client-names">
          {clients.map((client) => (
            <option key={client.id} value={client.name} />
          ))}
        </datalist>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="tone">Tone</Label>
        <select
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          id="tone"
          onChange={(event) => setTone(event.target.value as Tone)}
          value={tone}
        >
          {tones.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="context">Notes</Label>
        <textarea
          className="min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          id="context"
          onChange={(event) => setContext(event.target.value)}
          placeholder="Offer, audience, last conversation, or numbers to include."
          value={context}
        />
      </div>
      <Button disabled={loading} type="submit">
        <Sparkles />
        {loading ? "Writing…" : "Generate with Gemini"}
      </Button>
      {loading ? (
        <div className="grid gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : null}
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      {result ? (
        <div className="rounded-lg border bg-muted/40 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-medium text-xs">{template?.name}</p>
            <Button onClick={copyResult} size="sm" type="button" variant="outline">
              <Copy />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{result}</pre>
        </div>
      ) : null}
    </form>
  );
}
