"use client";

import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import { MapPin, CreditCard, Clock, Calendar, CheckSquare } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { cn } from "@/lib/utils";

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const tax = order.tax || 0;
  const shipping = order.shipping || 0;
  const discount = order.discount || 0;
  const subtotal = order.subtotal || order.total;

  const timelineSteps = [
    { label: "Order Placed", desc: "We received your order request", done: true },
    { label: "Payment Processed", desc: "Successfully billed via card gateway", done: true },
    {
      label: "Shipped",
      desc: order.status === "Shipped" || order.status === "Delivered" ? "Dispatched from facility" : "Awaiting dispatch",
      done: order.status === "Shipped" || order.status === "Delivered",
    },
    {
      label: "Delivered",
      desc: order.status === "Delivered" ? "Package dropped off" : "Transit in progress",
      done: order.status === "Delivered",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-gray-50/50 border-t border-gray-100 text-xs font-semibold select-none text-left">
      
      {/* 1. Destination Info */}
      <div className="space-y-3.5">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#007BFF]" />
          Destination Address
        </h4>
        <div className="bg-white border border-gray-150 p-4 rounded-2xl leading-relaxed">
          <p className="text-gray-900 font-black">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p className="text-[10px] text-gray-500 mt-1 leading-snug">
            {order.shippingAddress.street}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
          </p>
        </div>
      </div>

      {/* 2. Billing Breakdown */}
      <div className="space-y-3.5">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-[#007BFF]" />
          Billing Overview
        </h4>
        <div className="bg-white border border-gray-150 p-4 rounded-2xl space-y-2 leading-relaxed">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Subtotal</span>
            <span className="text-gray-900 font-bold">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-[10px] text-emerald-600 font-bold">
              <span>Coupon Discount</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Shipping</span>
            <span className="text-gray-900 font-bold">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Estimated Tax</span>
            <span className="text-gray-900 font-bold">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-2 text-xs font-black text-gray-900">
            <span>Grand Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* 3. Shipment Milestone progress */}
      <div className="space-y-3.5">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#007BFF]" />
          Transit History
        </h4>
        <div className="bg-white border border-gray-150 p-4 rounded-2xl space-y-4">
          {timelineSteps.map((step, idx) => (
            <div key={step.label} className="flex gap-3 relative last:pb-0 pb-1">
              {idx < timelineSteps.length - 1 && (
                <div className={cn(
                  "w-0.5 absolute left-1.5 top-3.5 bottom-0",
                  step.done ? "bg-emerald-500" : "bg-gray-100"
                )} />
              )}
              {/* Checkmark bubble */}
              <div className={cn(
                "w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border z-10 mt-0.5",
                step.done
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "bg-white border-gray-200 text-gray-300"
              )}>
                {step.done && <span className="text-[7px]">✓</span>}
              </div>

              <div className="min-w-0 leading-none">
                <p className={cn(
                  "text-[10px] font-black",
                  step.done ? "text-gray-900" : "text-gray-400"
                )}>
                  {step.label}
                </p>
                <p className="text-[8px] text-gray-400 font-bold mt-1">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
