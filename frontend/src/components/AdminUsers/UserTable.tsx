"use client";

import { AdminUser } from "@/types/adminUser";
import UserRow from "./UserRow";
import { Users } from "lucide-react";
import AdminEmptyState from "@/components/AdminShared/AdminEmptyState";

interface Props {
  users: AdminUser[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onActivateUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserTable({
  users,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onActivateUser,
  onDeleteUser,
}: Props) {
  const isAllSelected = users.length > 0 && selectedIds.length === users.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(users.map((u) => u.id));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </th>
              <th className="py-3.5 px-6">User</th>
              <th className="py-3.5 px-6">Contact Email & Phone</th>
              <th className="py-3.5 px-6">Role</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Activity & LTV</th>
              <th className="py-3.5 px-6">Joined Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 px-6">
                  <AdminEmptyState
                    icon={Users}
                    title="No Matching Users"
                    description="No users found matching your active filter criteria."
                    className="border-0 my-0 bg-transparent py-4"
                  />
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isSelected={selectedIds.includes(user.id)}
                  onToggleSelect={onToggleSelect}
                  onActivate={onActivateUser}
                  onDelete={onDeleteUser}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
