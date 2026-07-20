"use client";

import { useState } from "react";
import { useAdminUserStore } from "@/store/adminUserStore";
import { useChangeUserRole } from "@/hooks/useAdminUserQuery";
import { UserRole } from "@/types/adminUser";
import { X, ShieldCheck, Check } from "lucide-react";

export default function RoleManagerModal() {
  const { roleModalUser, setRoleModalUser } = useAdminUserStore();
  const changeRoleMutation = useChangeUserRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>(roleModalUser?.role || "Customer");

  if (!roleModalUser) return null;

  const rolesList: { role: UserRole; desc: string; permissions: string[] }[] = [
    {
      role: "Admin",
      desc: "Full super administrator access across all marketplace services and user profiles.",
      permissions: ["Manage users", "Manage vendors", "View payments", "Manage catalog", "Analytics"],
    },
    {
      role: "Vendor",
      desc: "Seller portal access for managing store catalog, inventory, orders, and payouts.",
      permissions: ["Manage catalog", "View orders", "View analytics"],
    },
    {
      role: "Support Staff",
      desc: "Customer support access for resolving buyer tickets, inspecting orders, and reviews.",
      permissions: ["View orders", "View users", "Manage reviews"],
    },
    {
      role: "Customer",
      desc: "Standard buyer profile for browsing products, checking out, and writing reviews.",
      permissions: ["Browse products", "Place orders", "Write reviews"],
    },
  ];

  const handleSave = () => {
    changeRoleMutation.mutate({ id: roleModalUser.id, role: selectedRole });
    setRoleModalUser(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Manage Role & Access Permissions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Editing access level for {roleModalUser.name}</p>
            </div>
          </div>
          <button onClick={() => setRoleModalUser(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="space-y-3">
          {rolesList.map((r) => {
            const isSelected = selectedRole === r.role;

            return (
              <div
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-purple-50/60 dark:bg-purple-950/30 border-purple-400 dark:border-purple-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{r.role}</span>
                  </div>
                  {isSelected && (
                    <span className="p-1 bg-purple-600 text-white rounded-full">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.permissions.map((p) => (
                    <span key={p} className="text-[10px] font-semibold px-2 py-0.5 bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 rounded-md border border-purple-200 dark:border-purple-900">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setRoleModalUser(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-500/20"
          >
            Save Role Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
