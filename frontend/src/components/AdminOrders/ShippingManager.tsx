"use client";

import { useState } from "react";
import { useUpdateTracking } from "@/hooks/useAdminOrderQuery";
import { Truck, ExternalLink, Save } from "lucide-react";

interface Props {
  orderId: string;
  currentCarrier: string;
  currentTracking: string;
}

export default function ShippingManager({ orderId, currentCarrier, currentTracking }: Props) {
  const updateTrackingMutation = useUpdateTracking();
  const [carrier, setCarrier] = useState(currentCarrier || "FedEx Express");
  const [trackingNumber, setTrackingNumber] = useState(currentTracking || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      updateTrackingMutation.mutate({ id: orderId, carrier, trackingNumber: trackingNumber.trim() });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-purple-500" />
          Carrier & Logistics Tracking Manager
        </h4>
        {trackingNumber && (
          <span className="font-mono text-[10px] text-slate-400">Code: {trackingNumber}</span>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
        >
          <option value="FedEx Express">FedEx Express</option>
          <option value="UPS Ground">UPS Ground</option>
          <option value="DHL Express">DHL Express</option>
          <option value="USPS Priority">USPS Priority</option>
        </select>

        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number (e.g. 789123049102)"
          className="px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono"
        />

        <button
          type="submit"
          disabled={!trackingNumber.trim()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Update Tracking</span>
        </button>
      </form>
    </div>
  );
}
