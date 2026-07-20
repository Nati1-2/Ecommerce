"use client";

import { use } from "react";
import { useOrderDetail, useCancelOrder } from "@/hooks/useAdminOrderQuery";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import OrderTimeline from "@/components/AdminOrders/OrderTimeline";
import ShippingManager from "@/components/AdminOrders/ShippingManager";
import StatusUpdateModal from "@/components/AdminOrders/StatusUpdateModal";
import RefundModal from "@/components/AdminOrders/RefundModal";
import OrderSkeleton from "@/components/AdminOrders/OrderSkeleton";

import {
  ArrowLeft,
  User,
  Store,
  CreditCard,
  Truck,
  DollarSign,
  MapPin,
  RefreshCcw,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function SingleOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading, isError } = useOrderDetail(id);
  const { setStatusModalOrder, setRefundModalOrder } = useAdminOrderStore();
  const cancelOrderMutation = useCancelOrder();

  if (isLoading) return <OrderSkeleton />;

  if (isError || !order) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">Order Not Found</h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">Order ID {id} does not exist in the database.</p>
        <Link
          href="/admin/orders"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order Control Center</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Back Link & Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusModalOrder(order)}
            className="px-3.5 py-2 text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCcw className="w-4 h-4" />
            Update Status
          </button>

          <button
            onClick={() => setRefundModalOrder(order)}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            Process Refund
          </button>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Transaction Order Details
              </h1>
              <span className="font-mono font-bold text-blue-600 text-xs px-3 py-0.5 bg-blue-50 dark:bg-blue-950/40 rounded-full">
                {order.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Placed on {order.createdAt}</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 font-bold rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200">
              Payment: {order.paymentStatus}
            </span>
            <span className="px-3 py-1 font-bold rounded-full border bg-blue-50 text-blue-600 border-blue-200">
              Order: {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Event Timeline */}
        <OrderTimeline order={order} />

        {/* Carrier Shipping Tracking Manager */}
        <ShippingManager
          orderId={order.id}
          currentCarrier={order.carrier}
          currentTracking={order.trackingNumber}
        />

        {/* Customer & Vendor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-500" /> Customer Information
            </h4>
            <p className="font-bold text-slate-800 dark:text-slate-200">{order.customerName}</p>
            <p className="text-slate-400">{order.customerEmail}</p>
            <p className="text-slate-400">{order.customerPhone}</p>
            <div className="flex items-start gap-1 text-slate-500 pt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{order.shippingAddress}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Store className="w-4 h-4 text-blue-500" /> Marketplace Vendor & Payment
            </h4>
            <p className="font-bold text-slate-800 dark:text-slate-200">{order.vendorStore}</p>
            <p className="text-slate-500">Method: {order.paymentMethod}</p>
            <p className="text-slate-400 font-mono text-[11px]">Stripe Charge: {order.stripeChargeId}</p>
          </div>
        </div>

        {/* Itemized Products */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white">Itemized Products</h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            {order.products.map((item) => (
              <div key={item.id} className="p-4 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Variant: {item.variant}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">${item.price.toLocaleString()} x {item.quantity}</p>
                  <p className="font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 max-w-sm ml-auto">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span>${order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax:</span>
            <span>${order.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Shipping Fee:</span>
            <span>${order.shippingFee.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount Applied:</span>
              <span>-${order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
            <span>Total Paid Amount:</span>
            <span>${order.amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StatusUpdateModal />
      <RefundModal />
    </div>
  );
}
