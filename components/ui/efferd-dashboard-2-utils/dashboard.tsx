import { BillingHealth } from "./billing-health";
import { ChannelSalesChart } from "./channel-sales-chart";
import { DashboardActivity } from "./activity";
import { DashboardInvoices } from "./dashboard-invoices";
import { DashboardMeetings } from "./dashboard-meetings";
import { NetRevenueChart } from "./net-revenue-chart";
import { DashboardStats } from "./stats";

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
      <DashboardStats />
      <NetRevenueChart />
      <ChannelSalesChart />
      <DashboardMeetings />
      <DashboardInvoices />
      <BillingHealth />
      <DashboardActivity />
    </div>
  );
}
