"use client";

import { useState } from "react";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import { useUpdateOrderStatus } from "@/hooks/useAdminOrderQuery";
import { OrderStatus } from "@/types/adminOrder";
import { RefreshCcw, X, AlertTriangle } from "lucide-react";

export default function StatusUpdateModal() {
  const { statusModalOrder, setStatusModalOrder } = useAdminOrderStore();
  const updateStatusMutation = useUpdateOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    statusModalOrder?.orderStatus || "Processing"
  );
  const [errorMsg, setErrorMsg] = useState("");

  if (!statusModalOrder) return null;

  const validStatuses: OrderStatus[] = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const handleUpdate = () => {
    // Transition validation rule: Cannot transition Delivered -> Processing or Pending -> Delivered directly
    if (statusModalOrder.orderStatus === "Delivered" && selectedStatus === "Processing") {
      setErrorMsg("Invalid Transition: Cannot revert a Delivered order back to Processing.");
      return;
    }
    if (statusModalOrder.orderStatus === "Pending" && selectedStatus === "Delivered") {
      setErrorMsg("Invalid Transition: Order must be Processing & Shipped before Delivered.");
      return;
    }

    updateStatusMutation.mutate({ id: statusModalOrder.id, status: selectedStatus });
    setStatusModalOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Update Order Status State
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Order ID: {statusModalOrder.id}</p>
            </div>
          </div>
          <button onClick={() => setStatusModalOrder(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-semibold">
            <span className="text-slate-500">Current Status:</span>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-full font-bold">
              {statusModalOrder.orderStatus}
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Select Target State *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as OrderStatus);
                setErrorMsg("");
              }}
              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-600 font-medium"
            >
              {validStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setStatusModalOrder(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-500/20 flex items-center gap-1.5"
          >
            <RefreshCcw className="w-4 h-4" />
            Update State Transition
          </button>
        </div>
      </div>
    </div>
  );
}
