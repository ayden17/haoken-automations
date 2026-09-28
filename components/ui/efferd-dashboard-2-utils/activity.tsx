import { CreditCard, FileText, Rocket, UserPlus } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "./dashboard-card";

const items = [
  {
    title: "Invoice #1048 marked paid",
    time: "About 2 hours ago",
    icon: CreditCard,
  },
  {
    title: "Nadia Rahman moved to Proposal",
    time: "This morning",
    icon: UserPlus,
  },
  {
    title: "Weekly report drafted for Kanvas",
    time: "Yesterday",
    icon: FileText,
  },
  {
    title: "Enrollment sprint went live",
    time: "2 days ago",
    icon: Rocket,
  },
];

export function DashboardActivity() {
  return (
    <DashboardCard>
      <CardHeader className="border-b">
        <CardTitle>Activity</CardTitle>
        <CardDescription>Latest updates across retainers.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <ul className="flex flex-col divide-y divide-border">
          {items.map((item) => (
            <li className="flex items-center gap-3 px-4 py-3" key={item.title}>
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted"
              >
                <item.icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </DashboardCard>
  );
}
