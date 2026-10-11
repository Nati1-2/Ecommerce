"use client";

import { useAdminUserStore } from "@/store/adminUserStore";
import { UserPlus, Download } from "lucide-react";
import AdminPageHeader from "@/components/AdminShared/AdminPageHeader";

export default function UserHeader() {
  const setIsCreateModalOpen = useAdminUserStore((state) => state.setIsCreateModalOpen);
  const setIsExportModalOpen = useAdminUserStore((state) => state.setIsExportModalOpen);

  return (
    <AdminPageHeader
      title="User Directory & Access Control"
      description="Manage customers, vendors, admins, support staff, and platform access permissions."
      breadcrumbs={[{ label: "Users" }]}
      badge="Identity & RBAC"
      badgeVariant="blue"
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Users</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create User</span>
          </button>
        </div>
      }
    />
  );
}
