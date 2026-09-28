"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/ui/efferd-dashboard-2-utils/app-shell";
import { ImagePicker } from "@/components/image-picker";
import { PageHeader, StatusPill } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { leadStages, type LeadStage } from "@/lib/agency";
import { useAgency } from "@/lib/agency-store";
import { formatCurrency } from "@/lib/formater";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ProspekBoard() {
  const params = useSearchParams();
  const query = (params.get("q") || "").trim().toLowerCase();
  const { leads, addLead, importLeads } = useAgency();
  const [adding, setAdding] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [source, setSource] = useState("Manual");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState<LeadStage>("Baru");
  const [owner, setOwner] = useState("");
  const [image, setImage] = useState("");
  const [formError, setFormError] = useState("");
  const [adAccountId, setAdAccountId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [metaError, setMetaError] = useState("");
  const [metaNote, setMetaNote] = useState("");
  const [metaLoading, setMetaLoading] = useState(false);

  const visible = query
    ? leads.filter((lead) =>
        `${lead.name} ${lead.company} ${lead.source}`.toLowerCase().includes(query),
      )
    : leads;

  function onAdd(event: FormEvent) {
    event.preventDefault();
    const amount = Number(value || 0);
    if (!name.trim() || !company.trim()) {
      setFormError("Name and company are required.");
      return;
    }
    addLead({
      id: crypto.randomUUID(),
      name: name.trim(),
      company: company.trim(),
      source: source.trim() || "Manual",
      value: Number.isFinite(amount) ? amount : 0,
      stage,
      owner: owner.trim() || "You",
      image,
    });
    setAdding(false);
    setName("");
    setCompany("");
    setValue("");
    setOwner("");
    setImage("");
    setFormError("");
  }

  async function onConnect(event: FormEvent) {
    event.preventDefault();
    setMetaLoading(true);
    setMetaError("");
    setMetaNote("");
    try {
      const response = await fetch("/api/meta-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adAccountId, accessToken }),
      });
      const data = (await response.json()) as {
        error?: string;
        forms?: number;
        leads?: { externalId: string; name: string; company: string; source: string }[];
      };
      if (!response.ok || !data.leads) {
        setMetaError(data.error || "Meta did not return leads.");
        return;
      }
      const added = importLeads(
        data.leads.map((lead) => ({
          id: `meta-${lead.externalId}`,
          externalId: lead.externalId,
          name: lead.name,
          company: lead.company,
          source: lead.source,
          value: 0,
          stage: "Baru" as const,
          owner: "Meta",
          image: "",
        })),
      );
      setMetaNote(
        data.leads.length
          ? `Imported ${added} new lead${added === 1 ? "" : "s"} from ${data.forms ?? 0} forms.`
          : "Connected, but those forms have no leads yet. You can still add one yourself.",
      );
    } catch {
      setMetaError("The request did not reach the server.");
    } finally {
      setMetaLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        action={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setMetaOpen(true)} size="sm" type="button" variant="outline">
              Hubungkan Meta Ads
            </Button>
            <Button onClick={() => setAdding((value) => !value)} size="sm" type="button">
              {adding ? "Tutup" : "Tambah prospek"}
            </Button>
          </div>
        }
        description={
          query
            ? `Showing matches for “${params.get("q")?.trim()}”.`
            : "Pull leads from a Meta ad account, or add them yourself."
        }
        eyebrow="Growth"
        title="Prospek"
      />
      {adding ? (
        <form className="grid gap-3 border-b px-4 py-4 sm:grid-cols-2 sm:px-6" onSubmit={onAdd}>
          <ImagePicker id="lead-photo" label="Foto" onChange={setImage} value={image} />
          <div className="grid content-start gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="lead-name">Nama</Label>
              <Input id="lead-name" onChange={(event) => setName(event.target.value)} value={name} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lead-company">Perusahaan</Label>
              <Input id="lead-company" onChange={(event) => setCompany(event.target.value)} value={company} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-source">Sumber</Label>
            <Input id="lead-source" onChange={(event) => setSource(event.target.value)} value={source} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-value">Nilai</Label>
            <Input id="lead-value" inputMode="decimal" onChange={(event) => setValue(event.target.value)} value={value} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-stage">Tahap</Label>
            <select
              className={fieldClass}
              id="lead-stage"
              onChange={(event) => setStage(event.target.value as LeadStage)}
              value={stage}
            >
              {leadStages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-owner">Owner</Label>
            <Input id="lead-owner" onChange={(event) => setOwner(event.target.value)} value={owner} />
          </div>
          <div className="sm:col-span-2">
            {formError ? <p className="mb-2 text-destructive text-sm">{formError}</p> : null}
            <Button type="submit">Simpan prospek</Button>
          </div>
        </form>
      ) : null}
      <div className="grid gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
        {leadStages.map((columnStage) => {
          const column = visible.filter((lead) => lead.stage === columnStage);
          const total = column.reduce((sum, lead) => sum + lead.value, 0);
          return (
            <section className="min-h-80 bg-background" key={columnStage}>
              <header className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="font-medium text-sm">{columnStage}</h2>
                <p className="text-muted-foreground text-xs tabular-nums">{formatCurrency(total)}</p>
              </header>
              <ul className="flex flex-col gap-2 p-3">
                {column.length === 0 ? (
                  <li className="px-1 py-6 text-center text-muted-foreground text-sm">No leads</li>
                ) : (
                  column.map((lead) => (
                    <li className="rounded-lg border p-3" key={lead.id}>
                      <div className="flex items-center gap-2">
                        {lead.image ? (
                          <img alt="" className="size-8 rounded-full object-cover" src={lead.image} />
                        ) : (
                          <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs">
                            {lead.name.slice(0, 1)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm">{lead.name}</p>
                          <p className="truncate text-muted-foreground text-xs">{lead.company}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <StatusPill status={lead.source} />
                        <p className="text-sm tabular-nums">{formatCurrency(lead.value)}</p>
                      </div>
                      <p className="mt-2 text-muted-foreground text-xs">Owner {lead.owner}</p>
                    </li>
                  ))
                )}
              </ul>
            </section>
          );
        })}
      </div>
      <Sheet onOpenChange={setMetaOpen} open={metaOpen}>
        <SheetContent className="overflow-y-auto data-[side=right]:sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Hubungkan Meta Ads</SheetTitle>
            <SheetDescription>
              Paste an ad account ID and a token that can read lead forms. The token is used once for this request and is not saved.
            </SheetDescription>
          </SheetHeader>
          <form className="grid gap-3 px-4 pb-4" onSubmit={onConnect}>
            <div className="grid gap-1.5">
              <Label htmlFor="ad-account">Ad account ID</Label>
              <Input
                id="ad-account"
                onChange={(event) => setAdAccountId(event.target.value)}
                placeholder="act_1234567890"
                value={adAccountId}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="meta-token">Access token</Label>
              <Input
                id="meta-token"
                onChange={(event) => setAccessToken(event.target.value)}
                type="password"
                value={accessToken}
              />
            </div>
            {metaError ? <p className="text-destructive text-sm">{metaError}</p> : null}
            {metaNote ? <p className="text-sm">{metaNote}</p> : null}
            <Button disabled={metaLoading} type="submit">
              {metaLoading ? "Connecting…" : "Tampilkan leads"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
