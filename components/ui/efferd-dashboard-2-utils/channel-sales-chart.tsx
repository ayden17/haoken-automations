"use client";

import { useId } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { formatDate } from "@/lib/formater";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { DashboardCard } from "./dashboard-card";

const VISIBLE_DAYS = 7;

type ChannelRow = {
  date: string;
  organic: number;
  paid: number;
};

const chartData: ChannelRow[] = [
  { date: "2026-09-21", organic: 18, paid: 11 },
  { date: "2026-09-22", organic: 16, paid: 14 },
  { date: "2026-09-23", organic: 21, paid: 12 },
  { date: "2026-09-24", organic: 19, paid: 17 },
  { date: "2026-09-25", organic: 24, paid: 15 },
  { date: "2026-09-26", organic: 22, paid: 19 },
  { date: "2026-09-27", organic: 27, paid: 16 },
];

const chartRows = chartData.slice(-VISIBLE_DAYS);

function growthPctForWindow(rows: readonly ChannelRow[]) {
  const first = rows[0];
  const last = rows.at(-1);
  if (!first || !last) return 0;
  const start = first.organic + first.paid;
  const end = last.organic + last.paid;
  if (!start) return 0;
  return ((end - start) / start) * 100;
}

const growthPctNum = growthPctForWindow(chartRows);

const chartConfig = {
  organic: { label: "Organic", color: "var(--chart-2)" },
  paid: { label: "Paid", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ChannelSalesChart() {
  const chartUid = useId().replace(/:/g, "");
  const idLineGlow = `channel-leads-glow-${chartUid}`;

  return (
    <DashboardCard className="md:col-span-2">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Lead channels</CardTitle>
          <Delta value={growthPctNum} variant="badge">
            <DeltaIcon variant="trend" />
            <DeltaValue />
          </Delta>
        </div>
        <CardDescription>
          New prospek by organic and paid, last {VISIBLE_DAYS} days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="aspect-auto h-60 w-full md:h-72" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartRows}
            margin={{ left: 12, right: 12, top: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              interval={0}
              tickFormatter={(value) => formatDate(String(value), "day-month")}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
            <defs>
              <filter height="140%" id={idLineGlow} width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="6" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <Line
              dataKey="paid"
              dot={false}
              filter={`url(#${idLineGlow})`}
              stroke="var(--color-paid)"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="organic"
              dot={false}
              filter={`url(#${idLineGlow})`}
              stroke="var(--color-organic)"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </DashboardCard>
  );
}
