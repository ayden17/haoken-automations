"use client";

import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/ui/efferd-dashboard-2-utils/app-shell";
import { PageHeader, StatusPill } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clientById, invoiceStatuses, type InvoiceStatus } from "@/lib/agency";
import { useAgency } from "@/lib/agency-store";
import { formatDate, formatFullCurrency } from "@/lib/formater";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export default function InvoicePage() {
  const { clients, invoices, addInvoice, removeInvoice, setInvoiceStatus } = useAgency();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [issued, setIssued] = useState("");
  const [status, setStatus] = useState<InvoiceStatus>("Pending");
  const [error, setError] = useState("");

  const outstanding = invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const value = Number(amount);
    if (!clientId || !issued || !Number.isFinite(value) || value <= 0) {
      setError("Choose a client, a date, and an amount.");
      return;
    }
    addInvoice({
      id: String(Date.now()).slice(-6),
      clientId,
      amount: value,
      status,
      issued,
    });
    setAmount("");
    setIssued("");
    setError("");
  }

  return (
    <AppShell>
      <PageHeader
        description={`${formatFullCurrency(outstanding)} still open across pending and overdue invoices.`}
        eyebrow="Accounts"
        title="Invoice"
      />
      <form className="grid gap-3 border-b px-4 py-4 sm:grid-cols-5 sm:px-6" onSubmit={onSubmit}>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="invoice-client">Klien</Label>
          <select
            className={fieldClass}
            id="invoice-client"
            onChange={(event) => setClientId(event.target.value)}
            value={clientId}
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="invoice-amount">Amount</Label>
          <Input
            id="invoice-amount"
            inputMode="decimal"
            onChange={(event) => setAmount(event.target.value)}
            value={amount}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="invoice-date">Date</Label>
          <Input id="invoice-date" onChange={(event) => setIssued(event.target.value)} type="date" value={issued} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="invoice-status">Status</Label>
          <select
            className={fieldClass}
            id="invoice-status"
            onChange={(event) => setStatus(event.target.value as InvoiceStatus)}
            value={status}
          >
            {invoiceStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-5">
          {error ? <p className="mb-2 text-destructive text-sm">{error}</p> : null}
          <Button type="submit">Tambah invoice</Button>
        </div>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="ps-4">Klien</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Issued</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="pe-4 text-right"> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="ps-4 font-medium">
                {clientById(invoice.clientId, clients)?.name ?? "Removed client"}
              </TableCell>
              <TableCell className="tabular-nums">#{invoice.id}</TableCell>
              <TableCell>{formatDate(invoice.issued, "full")}</TableCell>
              <TableCell>
                <label className="sr-only" htmlFor={`status-${invoice.id}`}>
                  Status for invoice {invoice.id}
                </label>
                <select
                  className="rounded-lg border border-input bg-transparent px-2 py-1 text-sm"
                  id={`status-${invoice.id}`}
                  onChange={(event) =>
                    setInvoiceStatus(invoice.id, event.target.value as InvoiceStatus)
                  }
                  value={invoice.status}
                >
                  {invoiceStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <span className="ms-2">
                  <StatusPill status={invoice.status} />
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatFullCurrency(invoice.amount)}
              </TableCell>
              <TableCell className="pe-4 text-right">
                <Button onClick={() => removeInvoice(invoice.id)} size="sm" type="button" variant="ghost">
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AppShell>
  );
}
