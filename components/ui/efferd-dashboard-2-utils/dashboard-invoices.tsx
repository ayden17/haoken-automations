"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clientById, statusTone } from "@/lib/agency";
import { useAgency } from "@/lib/agency-store";
import { formatFullCurrency } from "@/lib/formater";
import { DashboardCard } from "./dashboard-card";

export function DashboardInvoices() {
  const { clients, invoices } = useAgency();

  return (
    <DashboardCard className="relative md:col-span-2">
      <CardHeader className="border-b">
        <CardTitle>Recent invoices</CardTitle>
        <CardDescription>Retainers issued this cycle.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableCaption className="sr-only">
            Recent invoices with client, number, and amount.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4">Klient</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pe-4 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.slice(0, 4).map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="max-w-40 truncate ps-4 font-medium">
                  {clientById(invoice.clientId, clients)?.name}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  #{invoice.id}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs ${statusTone(invoice.status)}`}
                  >
                    {invoice.status}
                  </span>
                </TableCell>
                <TableCell className="pe-4 text-right tabular-nums">
                  {formatFullCurrency(invoice.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <div className="flex justify-center border-t py-2">
        <Button asChild variant="ghost">
          <Link href="/invoice">
            View all
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
