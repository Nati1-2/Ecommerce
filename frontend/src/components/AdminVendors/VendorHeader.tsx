"use client";

import { useAdminVendorStore } from "@/store/adminVendorStore";
import { Download, Plus } from "lucide-react";
import AdminPageHeader from "@/components/AdminShared/AdminPageHeader";

export default function VendorHeader() {
  const setIsAddModalOpen = useAdminVendorStore((state) => state.setIsAddModalOpen);
  const setIsExportModalOpen = useAdminVendorStore((state) => state.setIsExportModalOpen);

  return (
    <AdminPageHeader
      title="Vendor Network & Governance"
      description="Review seller applications, verify business licenses, monitor store performance, and manage approvals."
      breadcrumbs={[{ label: "Vendors" }]}
      badge="Marketplace Merchants"
      badgeVariant="violet"
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Vendors</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vendor</span>
          </button>
        </div>
      }
    />
  );
}
