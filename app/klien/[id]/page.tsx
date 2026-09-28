"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/ui/efferd-dashboard-2-utils/app-shell";
import { PageHeader, StatusPill } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { billingCaption, presentClient } from "@/lib/agency";
import { useAgency } from "@/lib/agency-store";
import { formatDate } from "@/lib/formater";

function formatSince(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? formatDate(value, "full") : value;
}

export default function KlienDetailPage() {
  const params = useParams<{ id: string }>();
  const { clients, invoices } = useAgency();
  const client = clients.find((item) => item.id === params.id);
  const view = client ? presentClient(client) : null;
  const related = invoices.filter((invoice) => invoice.clientId === params.id);
  const [brief, setBrief] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  async function loadBrief(extra = "") {
    if (!view) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/client-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: view.name,
          industry: view.industry,
          status: view.status,
          billing: billingCaption(view),
          since: formatSince(view.since),
          contact: view.contact,
          email: view.email,
          phone: view.phone,
          notes: view.notes,
          question: extra,
        }),
      });
      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || !data.text) {
        setError(data.error || "Gemini could not write this brief.");
        return;
      }
      setBrief(data.text);
    } catch {
      setError("The request did not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!view) return;
    void loadBrief();
    // The brief should refresh when a different client is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view?.id]);

  function onAsk(event: FormEvent) {
    event.preventDefault();
    void loadBrief(question);
  }

  if (!view) {
    return (
      <AppShell>
        <PageHeader description="That client is not in this browser's book." eyebrow="Accounts" title="Klien" />
        <div className="p-6">
          <Link className="text-sm underline-offset-4 hover:underline" href="/klien">
            Back to Klien
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        action={
          <Link className="text-sm underline-offset-4 hover:underline" href="/klien">
            Semua klien
          </Link>
        }
        description={view.industry}
        eyebrow="Klien"
        title={view.name}
      />
      <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          {view.image ? (
            <img alt="" className="h-64 w-full object-cover" src={view.image} />
          ) : (
            <div className="flex h-64 items-center justify-center bg-muted text-muted-foreground">
              Belum ada foto
            </div>
          )}
          <dl className="grid gap-px bg-border sm:grid-cols-2">
            {[
              ["Status", view.status],
              ["Bayar", billingCaption(view)],
              ["Sejak", formatSince(view.since)],
              ["Kontak", view.contact],
              ["Email", view.email || "—"],
              ["Telepon", view.phone || "—"],
            ].map(([label, value]) => (
              <div className="bg-background px-4 py-3 sm:px-6" key={label}>
                <dt className="text-muted-foreground text-xs">{label}</dt>
                <dd className="mt-1 text-sm">
                  {label === "Status" ? <StatusPill status={value} /> : value}
                </dd>
              </div>
            ))}
          </dl>
          <section className="border-t px-4 py-5 sm:px-6">
            <h2 className="font-medium text-sm">Informasi lain</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
              {view.notes || "Belum ada catatan."}
            </p>
          </section>
          <section className="border-t px-4 py-5 sm:px-6">
            <h2 className="font-medium text-sm">Invoice</h2>
            <ul className="mt-3 divide-y">
              {related.length === 0 ? (
                <li className="py-3 text-muted-foreground text-sm">No invoices yet.</li>
              ) : (
                related.map((invoice) => (
                  <li className="flex items-center justify-between py-3 text-sm" key={invoice.id}>
                    <span>#{invoice.id}</span>
                    <StatusPill status={invoice.status} />
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
        <aside className="border-t p-4 lg:border-t-0 lg:border-l">
          <h2 className="font-medium">Konteks AI</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Gemini reads this client record and writes the working context.
          </p>
          <div className="mt-4">
            {loading ? (
              <div className="grid gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : null}
            {error ? <p className="text-destructive text-sm">{error}</p> : null}
            {brief ? <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{brief}</pre> : null}
          </div>
          <form className="mt-4 grid gap-2" onSubmit={onAsk}>
            <Input
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about this client"
              value={question}
            />
            <Button disabled={loading} type="submit" variant="outline">
              Tanya lagi
            </Button>
          </form>
        </aside>
      </div>
    </AppShell>
  );
}
