"use client";

import { VendorOrder } from "@/types/vendor";
import { X, CheckCircle2, Clock, Truck, PackageCheck, Printer, FileText } from "lucide-react";

interface Props {
  order: VendorOrder | null;
  onClose: () => void;
  onPrintInvoice: (order: VendorOrder) => void;
  onPrintShippingLabel: (order: VendorOrder) => void;
}

export default function OrderTimelineModal({
  order,
  onClose,
  onPrintInvoice,
  onPrintShippingLabel,
}: Props) {
  if (!order) return null;

  const steps = [
    { title: "Pending", desc: "Order placed by customer", icon: Clock },
    { title: "Confirmed", desc: "Payment verified", icon: CheckCircle2 },
    { title: "Processing", desc: "Packed at warehouse", icon: PackageCheck },
    { title: "Shipped", desc: "In transit via carrier", icon: Truck },
    { title: "Delivered", desc: "Received by customer", icon: CheckCircle2 },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Pending": return 0;
      case "Confirmed": return 1;
      case "Processing": return 2;
      case "Shipped": return 3;
      case "Delivered": return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Details & Tracking</h2>
            <p className="text-xs font-mono text-slate-500">{order.orderNumber}</p>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs">
          <div>
            <p className="font-bold text-slate-400 uppercase text-[10px]">Customer Info</p>
            <p className="font-bold text-slate-900 dark:text-white mt-1">{order.customerName}</p>
            <p className="text-slate-500">{order.customerEmail}</p>
          </div>
          <div>
            <p className="font-bold text-slate-400 uppercase text-[10px]">Fulfillment Address</p>
            <p className="text-slate-700 dark:text-slate-300 mt-1">{order.shippingAddress}</p>
            {order.trackingNumber && (
              <p className="text-blue-600 dark:text-blue-400 font-mono mt-1">
                Tracking: {order.trackingNumber} ({order.carrier})
              </p>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="mt-6 space-y-3">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Order Items ({order.items.length})</p>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl">
              <div className="flex items-center gap-3">
                <img src={item.productImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{item.productName}</p>
                  <p className="text-[11px] text-slate-500">Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Visual Timeline */}
        <div className="mt-8 space-y-4">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Fulfillment Progression</p>

          <div className="relative flex items-center justify-between">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.title} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-white dark:ring-slate-900"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-bold mt-2 ${isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-end">
          <button
            onClick={() => onPrintInvoice(order)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print Invoice PDF
          </button>
          <button
            onClick={() => onPrintShippingLabel(order)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4" />
            Generate Shipping Label
          </button>
        </div>
      </div>
    </div>
  );
}
