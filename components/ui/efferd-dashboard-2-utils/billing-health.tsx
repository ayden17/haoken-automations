"use client";

import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { clientById } from "@/lib/agency";
import { useAgency } from "@/lib/agency-store";
import { formatFullCurrency } from "@/lib/formater";
import { DashboardCard } from "./dashboard-card";

export function BillingHealth() {
  const { clients, invoices } = useAgency();
  const overdue = invoices.filter((invoice) => invoice.status === "Overdue");

  return (
    <DashboardCard>
      <CardHeader className="border-b">
        <CardTitle>Billing health</CardTitle>
        <CardDescription>
          {overdue.length
            ? `${overdue.length} invoice needs a reminder.`
            : "Nothing urgent needs your attention."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-full items-center">
        {overdue.length ? (
          <ul className="flex w-full flex-col gap-3">
            {overdue.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium">{clientById(invoice.clientId, clients)?.name}</p>
                  <p className="text-muted-foreground text-xs">Invoice #{invoice.id}</p>
                </div>
                <p className="font-medium text-destructive tabular-nums">
                  {formatFullCurrency(invoice.amount)}
                </p>
              </li>
            ))}
            <Button asChild className="mt-2" variant="outline">
              <Link href="/automasi">
                Draft reminder
                <ArrowRight />
              </Link>
            </Button>
          </ul>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleCheck aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>You&apos;re caught up.</EmptyTitle>
              <EmptyDescription>Balances and payouts look fine.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="ghost">
                <Link href="/invoice">
                  Review invoices
                  <ArrowRight />
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </CardContent>
    </DashboardCard>
  );
}
