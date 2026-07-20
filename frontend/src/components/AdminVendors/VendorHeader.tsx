"use client";

import { useAdminVendorStore } from "@/store/adminVendorStore";
import { Store, Download, Plus } from "lucide-react";

export default function VendorHeader() {
  const setIsAddModalOpen = useAdminVendorStore((state) => state.setIsAddModalOpen);
  const setIsExportModalOpen = useAdminVendorStore((state) => state.setIsExportModalOpen);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vendor Management</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review seller applications, verify business licenses, monitor store performance, and manage approvals.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Vendors</span>
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/25 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor</span>
        </button>
      </div>
    </div>
  );
}
