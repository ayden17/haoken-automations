import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-1 text-muted-foreground text-xs tracking-wide">{eyebrow}</p>
        ) : null}
        <h1 className="font-heading text-xl font-medium tracking-tight">{title}</h1>
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
      </div>
      {action ? <div className={cn("shrink-0")}>{action}</div> : null}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Paid" || status === "Aktif" || status === "Live" || status === "Menang"
      ? "bg-success/15 text-success-foreground"
      : status === "Pending" ||
          status === "Dihubungi" ||
          status === "Scheduled" ||
          status === "Proposal"
        ? "bg-warning/20 text-warning-foreground"
        : status === "Overdue" || status === "Pause"
          ? "bg-destructive/10 text-destructive"
          : "bg-info/15 text-info-foreground";

  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs", tone)}>{status}</span>
  );
}
