"use client";

import { useState } from "react";
import { AdminUser } from "@/types/adminUser";
import { useAdminUserStore } from "@/store/adminUserStore";
import {
  Eye,
  Edit3,
  Shield,
  UserX,
  UserCheck,
  Trash2,
  Activity,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  user: AdminUser;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function UserRow({
  user,
  isSelected,
  onToggleSelect,
  onActivate,
  onDelete,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const { setDrawerUser, setBlockUserModalUser, setRoleModalUser } = useAdminUserStore();

  const getRoleBadge = (role: AdminUser["role"]) => {
    switch (role) {
      case "Admin":
        return "bg-purple-50 text-purple-600 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800";
      case "Vendor":
        return "bg-blue-50 text-blue-600 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800";
      case "Support Staff":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700";
    }
  };

  const getStatusBadge = (status: AdminUser["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
      case "Blocked":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
      default:
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
    }
  };

  return (
    <tr className={cn("hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors", isSelected && "bg-blue-50/30 dark:bg-blue-900/10")}>
      <td className="py-4 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(user.id)}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
        />
      </td>

      {/* User Info */}
      <td className="py-4 px-6 max-w-xs">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <h4
              onClick={() => setDrawerUser(user)}
              className="font-bold text-slate-900 dark:text-white text-xs truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            >
              {user.name}
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">ID: {user.id}</span>
          </div>
        </div>
      </td>

      {/* Email & Phone */}
      <td className="py-4 px-6">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.email}</p>
        <p className="text-[11px] text-slate-400">{user.phone}</p>
      </td>

      {/* Role */}
      <td className="py-4 px-6">
        <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full border", getRoleBadge(user.role))}>
          {user.role}
        </span>
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full border", getStatusBadge(user.status))}>
          {user.status}
        </span>
      </td>

      {/* Orders & Spent */}
      <td className="py-4 px-6">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{user.totalOrders} orders</p>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold">
          ${user.totalSpent.toLocaleString()}
        </p>
      </td>

      {/* Joined Date & Last Active */}
      <td className="py-4 px-6">
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{user.createdAt}</p>
        <p className="text-[11px] text-slate-400">Active {user.lastLogin}</p>
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right relative">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setDrawerUser(user)}
            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View Profile Drawer"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-left text-xs font-semibold">
                <button
                  onClick={() => {
                    setDrawerUser(user);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>View Profile</span>
                </button>

                <button
                  onClick={() => {
                    setRoleModalUser(user);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-500" />
                  <span>Change Role</span>
                </button>

                {user.status === "Blocked" ? (
                  <button
                    onClick={() => {
                      onActivate(user.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Activate User</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setBlockUserModalUser(user);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Block User</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onDelete(user.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete User</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
