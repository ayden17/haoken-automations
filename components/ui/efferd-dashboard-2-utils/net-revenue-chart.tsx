"use client";

import { Bar, BarChart, XAxis } from "recharts";
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
import { formatCurrency } from "@/lib/formater";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { DashboardCard } from "./dashboard-card";

const salesDaily7 = [
  { day: "Mon", sales: 4200 },
  { day: "Tue", sales: 5100 },
  { day: "Wed", sales: 3800 },
  { day: "Thu", sales: 6400 },
  { day: "Fri", sales: 7200 },
  { day: "Sat", sales: 2900 },
  { day: "Sun", sales: 4600 },
] as const;

const chartRows = salesDaily7.map((row) => ({ ...row }));
const firstDay = salesDaily7[0].sales;
const lastDay = salesDaily7.at(-1)?.sales ?? firstDay;
const growthPct = ((lastDay - firstDay) / firstDay) * 100;

const chartConfig = {
  sales: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function CustomGradientBar(props: {
  fill?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  dataKey?: string | number;
  index?: number;
}) {
  const { fill, x = 0, y = 0, width = 0, height = 0, dataKey = "sales", index = 0 } =
    props;
  const gid = `gradient-bar-${String(dataKey)}-${index}`;

  return (
    <>
      <rect fill={`url(#${gid})`} height={height} stroke="none" width={width} x={x} y={y} />
      <rect fill={fill} height={2} stroke="none" width={width} x={x} y={y} />
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={0.5} />
          <stop offset="100%" stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
    </>
  );
}

export function NetRevenueChart() {
  return (
    <DashboardCard className="md:col-span-2">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Attributed revenue</CardTitle>
          <Delta value={growthPct} variant="badge">
            <DeltaIcon variant="trend" />
            <DeltaValue />
          </Delta>
        </div>
        <CardDescription>Client revenue influenced by live campaigns, last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="aspect-auto h-60 w-full md:h-72" config={chartConfig}>
          <BarChart accessibilityLayer data={chartRows}>
            <XAxis
              axisLine={false}
              dataKey="day"
              interval={0}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-medium tabular-nums">
                      {formatCurrency(Number(value))}
                    </span>
                  )}
                  hideLabel
                />
              }
              cursor={false}
            />
            <Bar dataKey="sales" fill="var(--color-sales)" shape={CustomGradientBar} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </DashboardCard>
  );
}
