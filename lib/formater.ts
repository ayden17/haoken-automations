/** Shared locale for dashboard charts, KPIs, and tables. */
export const DASHBOARD_LOCALE = "en-US";
export const DASHBOARD_CURRENCY = "USD";

/** Noon anchor avoids off-by-one labels around timezone boundaries for ISO date strings. */
export function parseIsoCalendarDate(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00`);
}

export type DashboardDateStyle = "month" | "day-month" | "full";

export function formatDate(isoDate: string, style: DashboardDateStyle): string {
  const date = parseIsoCalendarDate(isoDate);
  if (style === "month") {
    return date.toLocaleDateString(DASHBOARD_LOCALE, { month: "short" });
  }
  if (style === "day-month") {
    return date.toLocaleDateString(DASHBOARD_LOCALE, {
      day: "numeric",
      month: "short",
    });
  }
  return date.toLocaleDateString(DASHBOARD_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat(DASHBOARD_LOCALE, {
    currency: DASHBOARD_CURRENCY,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatFullCurrency(value: number) {
  return new Intl.NumberFormat(DASHBOARD_LOCALE, {
    currency: DASHBOARD_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}
