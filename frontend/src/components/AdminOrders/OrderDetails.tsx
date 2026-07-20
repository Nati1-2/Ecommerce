"use client";

import { useAdminOrderStore } from "@/store/adminOrderStore";
import OrderTimeline from "./OrderTimeline";
import {
  X,
  ShoppingBag,
  User,
  Store,
  CreditCard,
  Truck,
  DollarSign,
  MapPin,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderDetails() {
  const { orderDetailsModal, setOrderDetailsModal, setStatusModalOrder, setRefundModalOrder } =
    useAdminOrderStore();

  if (!orderDetailsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Transaction Order Details
              </h3>
              <span className="font-mono font-bold text-blue-600 text-xs px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 rounded-full">
                {orderDetailsModal.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Placed on {orderDetailsModal.createdAt}</p>
          </div>
          <button onClick={() => setOrderDetailsModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Microservices Event Timeline */}
        <OrderTimeline order={orderDetailsModal} />

        {/* Customer & Vendor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Customer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-500" /> Customer Information
            </h4>
            <p className="font-bold text-slate-800 dark:text-slate-200">{orderDetailsModal.customerName}</p>
            <p className="text-slate-400">{orderDetailsModal.customerEmail}</p>
            <p className="text-slate-400">{orderDetailsModal.customerPhone}</p>
            <div className="flex items-start gap-1 text-slate-500 pt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{orderDetailsModal.shippingAddress}</span>
            </div>
          </div>

          {/* Vendor & Shipping */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Store className="w-4 h-4 text-blue-500" /> Vendor & Logistics
            </h4>
            <p className="font-bold text-slate-800 dark:text-slate-200">{orderDetailsModal.vendorStore}</p>
            <div className="flex items-center gap-2 pt-1 text-slate-600 dark:text-slate-300">
              <Truck className="w-4 h-4 text-purple-500" />
              <span>{orderDetailsModal.carrier}: <strong className="font-mono">{orderDetailsModal.trackingNumber}</strong></span>
            </div>
            <p className="text-slate-400">Est. Delivery: {orderDetailsModal.estimatedDelivery}</p>
            <p className="text-slate-400 font-mono text-[11px]">Stripe ID: {orderDetailsModal.stripeChargeId}</p>
          </div>
        </div>

        {/* Itemized Product List */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white">Itemized Order Products</h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            {orderDetailsModal.products.map((item) => (
              <div key={item.id} className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-400">Variant: {item.variant}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">${item.price.toLocaleString()} x {item.quantity}</p>
                  <p className="font-extrabold text-blue-600 dark:text-blue-400">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 max-w-sm ml-auto">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span>${orderDetailsModal.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax:</span>
            <span>${orderDetailsModal.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Shipping:</span>
            <span>${orderDetailsModal.shippingFee.toLocaleString()}</span>
          </div>
          {orderDetailsModal.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount:</span>
              <span>-${orderDetailsModal.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
            <span>Total Amount Paid:</span>
            <span>${orderDetailsModal.amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              setStatusModalOrder(orderDetailsModal);
              setOrderDetailsModal(null);
            }}
            className="px-4 py-2 font-bold text-xs bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCcw className="w-4 h-4" />
            Update Order Status
          </button>

          <button
            onClick={() => {
              setRefundModalOrder(orderDetailsModal);
              setOrderDetailsModal(null);
            }}
            className="px-4 py-2 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            Process Refund
          </button>
        </div>
      </div>
    </div>
  );
}
