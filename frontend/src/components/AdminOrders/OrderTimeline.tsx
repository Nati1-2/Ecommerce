"use client";

import { AdminOrderModel } from "@/types/adminOrder";
import { CheckCircle2, Clock, Truck, ShoppingBag, CreditCard, Server } from "lucide-react";

interface Props {
  order: AdminOrderModel;
}

export default function OrderTimeline({ order }: Props) {
  const steps = [
    {
      label: "Order Placed",
      service: "Order Service Gateway",
      timestamp: order.createdAt,
      completed: true,
      icon: ShoppingBag,
    },
    {
      label: "Payment Authorized",
      service: "Payment Service (Stripe)",
      timestamp: `${order.createdAt.split(" ")[0]} 14:25 UTC`,
      completed: order.paymentStatus === "Paid",
      icon: CreditCard,
    },
    {
      label: "Vendor Order Confirmed",
      service: `Vendor Service (${order.vendorStore})`,
      timestamp: `${order.createdAt.split(" ")[0]} 15:10 UTC`,
      completed: order.orderStatus !== "Pending",
      icon: Server,
    },
    {
      label: "Dispatched & Shipped",
      service: `Shipping Service (${order.carrier})`,
      timestamp: order.orderStatus === "Shipped" || order.orderStatus === "Delivered" ? "2026-07-20 09:30 UTC" : "Pending",
      completed: order.orderStatus === "Shipped" || order.orderStatus === "Delivered",
      icon: Truck,
    },
    {
      label: "Fulfillment Delivered",
      service: "Logistics Partner API",
      timestamp: order.orderStatus === "Delivered" ? "2026-07-21 16:00 UTC" : "Est. " + order.estimatedDelivery,
      completed: order.orderStatus === "Delivered",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Server className="w-4 h-4 text-blue-500" />
          Microservices Pipeline Event Trail
        </h4>
        <span className="text-[10px] font-mono font-bold text-slate-400">
          Trace ID: {order.stripeChargeId}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        {steps.map((st, idx) => {
          const Icon = st.icon;

          return (
            <div key={st.label} className="flex-1 space-y-1 relative">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    st.completed
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{st.label}</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate">{st.service}</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono pl-9">{st.timestamp}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
