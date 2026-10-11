"use client";

import { useAdminOrderStore } from "@/store/adminOrderStore";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { Download, FileSpreadsheet } from "lucide-react";
import AdminPageHeader from "@/components/AdminShared/AdminPageHeader";

export default function OrderHeader() {
  const setIsExportModalOpen = useAdminOrderStore((state) => state.setIsExportModalOpen);
  const showToast = useAdminDashboardStore((state) => state.showToast);

  return (
    <AdminPageHeader
      title="Order Fulfillment & Transactions"
      description="Monitor marketplace transactions, track shipping, approve refunds, resolve customer disputes, and inspect microservice order states."
      breadcrumbs={[{ label: "Orders" }]}
      badge="Marketplace Ledger"
      badgeVariant="blue"
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast("Generating Executive Financial Audit Report...", "info")}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            <span>Generate Reports</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Orders</span>
          </button>
        </div>
      }
    />
  );
}
