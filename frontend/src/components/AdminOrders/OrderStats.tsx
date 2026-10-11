"use client";

import { OrderStatsData } from "@/types/adminOrder";
import { ShoppingBag, Clock, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import AdminMetricCard from "@/components/AdminShared/AdminMetricCard";

interface Props {
  stats: OrderStatsData;
}

export default function OrderStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <AdminMetricCard
        title="Total Orders"
        value={stats.totalOrders}
        growth={stats.totalGrowth}
        comparison="vs last mo"
        icon={ShoppingBag}
        variant="primary"
      />
      <AdminMetricCard
        title="Today's Orders"
        value={`+${stats.todayOrders}`}
        growth={stats.todayGrowth}
        comparison="today"
        icon={Clock}
        variant="violet"
      />
      <AdminMetricCard
        title="Pending Fulfillment"
        value={stats.pendingOrders}
        growth={4.2}
        comparison="in queue"
        icon={Clock}
        variant="amber"
      />
      <AdminMetricCard
        title="Delivered & Complete"
        value={stats.completedOrders}
        growth={12.1}
        comparison="dispatched"
        icon={CheckCircle2}
        variant="emerald"
      />
      <AdminMetricCard
        title="Cancelled / Returns"
        value={stats.cancelledOrders}
        growth={stats.cancelledChange}
        comparison="vs last mo"
        icon={XCircle}
        variant="slate"
      />
      <AdminMetricCard
        title="Transaction GMV"
        value={`$${(stats.totalRevenue / 1000000).toFixed(1)}M`}
        growth={stats.revenueGrowth}
        comparison="gross vol"
        icon={DollarSign}
        variant="emerald"
      />
    </div>
  );
}
