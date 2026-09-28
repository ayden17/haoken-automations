import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { DashboardCard } from "./dashboard-card";

const stats = [
  { label: "Active retainers", value: "5", delta: 1 },
  { label: "Attributed revenue", value: "$48,290", delta: 12.4 },
  { label: "Lead conversion", value: "18.4%", delta: -0.4 },
  { label: "New prospek", value: "14", delta: 8.7 },
] as const;

export function DashboardStats() {
  return (
    <>
      {stats.map((stat) => (
        <DashboardCard key={stat.label}>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-xs tracking-wide">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl tabular-nums">{stat.value}</p>
          </CardContent>
          <CardFooter className="rounded-none bg-background text-xs">
            <Delta value={stat.delta}>
              <DeltaIcon />
              <DeltaValue />
            </Delta>
            <span className="text-muted-foreground">vs last week</span>
          </CardFooter>
        </DashboardCard>
      ))}
    </>
  );
}
