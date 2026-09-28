"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AppShell } from "@/components/ui/efferd-dashboard-2-utils/app-shell";
import { ImagePicker } from "@/components/image-picker";
import { PageHeader, StatusPill } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAgency } from "@/lib/agency-store";
import { billingCaption, presentClient, type BillingModel, type ClientStatus } from "@/lib/agency";
import { formatDate } from "@/lib/formater";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function formatSince(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? formatDate(value, "full") : value;
}

export default function KlienPage() {
  const { clients, addClient, saveError } = useAgency();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [billingModel, setBillingModel] = useState<BillingModel>("retainer");
  const [amount, setAmount] = useState("");
  const [since, setSince] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ClientStatus>("Aktif");
  const [image, setImage] = useState("");
  const [formError, setFormError] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const fee = Number(amount);
    if (!name.trim() || !contact.trim() || !since || !Number.isFinite(fee) || fee < 0) {
      setFormError("Nama, kontak, tanggal, dan nominal wajib diisi.");
      return;
    }
    addClient({
      id: crypto.randomUUID(),
      name: name.trim(),
      industry: industry.trim() || "General",
      retainer: billingModel === "retainer" ? fee : 0,
      amount: fee,
      billingModel,
      status,
      contact: contact.trim(),
      email: email.trim(),
      phone: phone.trim(),
      since,
      image,
      notes: notes.trim(),
    });
    setOpen(false);
    setName("");
    setIndustry("");
    setAmount("");
    setSince("");
    setContact("");
    setEmail("");
    setPhone("");
    setNotes("");
    setImage("");
    setFormError("");
  }

  return (
    <AppShell>
      <PageHeader
        action={
          <Button onClick={() => setOpen((value) => !value)} size="sm" type="button">
            {open ? "Tutup" : "Tambah klien"}
          </Button>
        }
        description="Retainers and pay-per-lead accounts. Open a client for the full record and an AI brief."
        eyebrow="Accounts"
        title="Klien"
      />
      {saveError ? <p className="border-b px-4 py-2 text-destructive text-sm sm:px-6">{saveError}</p> : null}
      {open ? (
        <form className="grid gap-4 border-b px-4 py-5 sm:px-6 lg:grid-cols-2" onSubmit={onSubmit}>
          <div className="grid gap-3">
            <ImagePicker id="client-photo" label="Foto" onChange={setImage} value={image} />
            <div className="grid gap-1.5">
              <Label htmlFor="client-name">Nama</Label>
              <Input id="client-name" onChange={(event) => setName(event.target.value)} value={name} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="client-industry">Industri</Label>
              <Input
                id="client-industry"
                onChange={(event) => setIndustry(event.target.value)}
                value={industry}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="billing-model">Model bayar</Label>
              <select
                className={fieldClass}
                id="billing-model"
                onChange={(event) => setBillingModel(event.target.value as BillingModel)}
                value={billingModel}
              >
                <option value="retainer">Retainer</option>
                <option value="per_lead">Bayar per Prospek</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="client-amount">
                {billingModel === "per_lead" ? "Nominal per prospek" : "Retainer per bulan"}
              </Label>
              <Input
                id="client-amount"
                inputMode="decimal"
                onChange={(event) => setAmount(event.target.value)}
                value={amount}
              />
            </div>
          </div>
          <div className="grid content-start gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="client-since">Sejak</Label>
              <Input id="client-since" onChange={(event) => setSince(event.target.value)} type="date" value={since} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="client-contact">Kontak</Label>
              <Input id="client-contact" onChange={(event) => setContact(event.target.value)} value={contact} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="client-email">Email</Label>
                <Input id="client-email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="client-phone">Telepon</Label>
                <Input id="client-phone" onChange={(event) => setPhone(event.target.value)} value={phone} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="client-status">Status</Label>
              <select
                className={fieldClass}
                id="client-status"
                onChange={(event) => setStatus(event.target.value as ClientStatus)}
                value={status}
              >
                <option value="Aktif">Aktif</option>
                <option value="Pause">Pause</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="client-notes">Informasi lain</Label>
              <textarea
                className="min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                id="client-notes"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Audience, offer, approval owner, constraints."
                value={notes}
              />
            </div>
            {formError ? <p className="text-destructive text-sm">{formError}</p> : null}
            <Button type="submit">Simpan klien</Button>
          </div>
        </form>
      ) : null}
      <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
        {clients.map((client) => {
          const view = presentClient(client);
          return (
            <Link className="flex flex-col bg-background" href={`/klien/${client.id}`} key={client.id}>
              {view.image ? (
                <img alt="" className="h-40 w-full object-cover" src={view.image} />
              ) : (
                <div className="flex h-40 items-center justify-center bg-muted text-muted-foreground text-sm">
                  Belum ada foto
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium">{view.name}</h2>
                    <p className="text-muted-foreground text-sm">{view.industry}</p>
                  </div>
                  <StatusPill status={view.status} />
                </div>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground text-xs">Bayar</dt>
                    <dd>{billingCaption(view)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Sejak</dt>
                    <dd>{formatSince(view.since)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted-foreground text-xs">Kontak</dt>
                    <dd>
                      {view.contact}
                      {view.email ? <span className="text-muted-foreground"> · {view.email}</span> : null}
                    </dd>
                  </div>
                </dl>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
