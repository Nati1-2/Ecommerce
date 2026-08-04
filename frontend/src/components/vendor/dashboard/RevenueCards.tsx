"use client";

import { VendorMetrics } from "@/types/vendor";
import { DollarSign, ShoppingBag, PackageCheck, Users, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  metrics: VendorMetrics;
}

export default function RevenueCards({ metrics }: Props) {
  const cards = [
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `+${metrics.revenueChangePercent}%`,
      isUp: metrics.revenueChangePercent >= 0,
      icon: DollarSign,
      color: "text-blue-500 bg-white border border-slate-100 ",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders.toLocaleString(),
      change: `+${metrics.ordersChangePercent}%`,
      isUp: metrics.ordersChangePercent >= 0,
      icon: ShoppingBag,
      color: "text-emerald-500 bg-white border border-slate-100 ",
    },
    {
      title: "Products Sold",
      value: metrics.productsSold.toLocaleString(),
      change: `+${metrics.productsSoldChangePercent}%`,
      isUp: metrics.productsSoldChangePercent >= 0,
      icon: PackageCheck,
      color: "text-purple-500 bg-white border border-slate-100 ",
    },
    {
      title: "Total Customers",
      value: metrics.totalCustomers.toLocaleString(),
      change: `+${metrics.customersChangePercent}%`,
      isUp: metrics.customersChangePercent >= 0,
      icon: Users,
      color: "text-amber-500 bg-white border border-slate-100 ",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white  p-6 rounded-3xl border border-slate-100  shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 ">{card.title}</span>
              <div className={`p-2.5 rounded-xl ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-900  tracking-tight">{card.value}</h3>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={`text-xs font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
                    card.isUp
                      ? "text-emerald-600 bg-emerald-50  "
                      : "text-red-600 bg-red-50  "
                  }`}
                >
                  {card.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {card.change}
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
