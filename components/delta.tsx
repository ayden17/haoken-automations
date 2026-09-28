"use client";

import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";

type DeltaIconVariant = "default" | "trend" | "arrow";
type DeltaVariant = "default" | "badge";

type DeltaContextValue = {
  value: number;
};

const DeltaContext = React.createContext<DeltaContextValue | null>(null);

function useDeltaValue() {
  const context = React.useContext(DeltaContext);
  if (!context) {
    throw new Error("DeltaIcon and DeltaValue must be used inside a Delta component.");
  }
  return context.value;
}

function Delta({
  className,
  value,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  value: number;
  variant?: DeltaVariant;
}) {
  return (
    <DeltaContext.Provider value={{ value }}>
      {variant === "badge" ? (
        <Badge
          className={cn(
            "gap-1 border-none tabular-nums",
            value > 0
              ? "bg-success/15 text-success-foreground"
              : "bg-destructive/10 text-destructive",
            className,
          )}
          data-slot="delta"
          variant="secondary"
          {...(props as React.ComponentProps<typeof Badge>)}
        />
      ) : (
        <div
          className={cn(
            "inline-flex items-center gap-1 text-muted-foreground tabular-nums [&_svg]:size-3 [&_svg]:shrink-0",
            value > 0 && "text-success-foreground",
            value < 0 && "text-destructive",
            className,
          )}
          data-slot="delta"
          {...props}
        />
      )}
    </DeltaContext.Provider>
  );
}

function DeltaIcon({
  variant = "default",
  className,
}: {
  variant?: DeltaIconVariant;
  className?: string;
}) {
  const value = useDeltaValue();
  const iconClass = cn("size-3", className);

  if (!value) {
    return <Minus aria-hidden="true" className={iconClass} />;
  }
  if (value > 0) {
    if (variant === "trend") return <TrendingUp aria-hidden="true" className={iconClass} />;
    if (variant === "arrow") return <ArrowUp aria-hidden="true" className={iconClass} />;
    return <ChevronUp aria-hidden="true" className={iconClass} />;
  }
  if (variant === "trend") return <TrendingDown aria-hidden="true" className={iconClass} />;
  if (variant === "arrow") return <ArrowDown aria-hidden="true" className={iconClass} />;
  return <ChevronDown aria-hidden="true" className={iconClass} />;
}

function DeltaValue({
  className,
  precision = 1,
  suffix = "%",
  absolute = true,
  ...props
}: React.ComponentProps<"span"> & {
  precision?: number;
  suffix?: string;
  absolute?: boolean;
}) {
  const resolvedValue = useDeltaValue();
  const formattedValue = (absolute ? Math.abs(resolvedValue) : resolvedValue).toFixed(
    precision,
  );

  return (
    <span className={cn("tabular-nums", className)} data-slot="delta-value" {...props}>
      {formattedValue}
      {suffix}
    </span>
  );
}

export { Delta, DeltaIcon, DeltaValue };
