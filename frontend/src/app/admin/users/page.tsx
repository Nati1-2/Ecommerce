"use client";

import { useAdminUserStore } from "@/store/adminUserStore";
import {
  useUserStats,
  useAdminUsers,
  useActivateUser,
  useDeleteUser,
  useBulkBlockUsers,
  useBulkDeleteUsers,
} from "@/hooks/useAdminUserQuery";

import UserHeader from "@/components/AdminUsers/UserHeader";
import UserStats from "@/components/AdminUsers/UserStats";
import UserToolbar from "@/components/AdminUsers/UserToolbar";
import UserTable from "@/components/AdminUsers/UserTable";
import UserProfileDrawer from "@/components/AdminUsers/UserProfileDrawer";
import RoleManagerModal from "@/components/AdminUsers/RoleManagerModal";
import CreateUserModal from "@/components/AdminUsers/CreateUserModal";
import BlockUserModal from "@/components/AdminUsers/BlockUserModal";
import UserExportModal from "@/components/AdminUsers/UserExportModal";
import UserSkeleton from "@/components/AdminUsers/UserSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminUsersPage() {
  const {
    filters,
    selectedUserIds,
    toggleSelectUser,
    selectAllUsers,
    clearSelection,
  } = useAdminUserStore();

  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: users = [], isLoading: usersLoading, isError, refetch } = useAdminUsers();

  const activateUserMutation = useActivateUser();
  const deleteUserMutation = useDeleteUser();
  const bulkBlockMutation = useBulkBlockUsers();
  const bulkDeleteMutation = useBulkDeleteUsers();

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      u.phone.includes(filters.searchQuery);

    const matchesRole = filters.roleFilter === "All" || u.role === filters.roleFilter;
    const matchesStatus = filters.statusFilter === "All" || u.status === filters.statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (statsLoading || usersLoading || !stats) {
    return <UserSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
          Unable to Load User Registry
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          The User Microservice is currently undergoing a database migration sync.
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <UserHeader />

      {/* Statistics Cards */}
      <UserStats stats={stats} />

      {/* Toolbar & Filters */}
      <UserToolbar
        selectedCount={selectedUserIds.length}
        onBulkBlock={() => {
          bulkBlockMutation.mutate({ ids: selectedUserIds, reason: "Bulk Administrative Suspension" });
          clearSelection();
        }}
        onBulkActivate={() => {
          selectedUserIds.forEach((id) => activateUserMutation.mutate(id));
          clearSelection();
        }}
        onBulkDelete={() => {
          bulkDeleteMutation.mutate(selectedUserIds);
          clearSelection();
        }}
      />

      {/* User Table */}
      <UserTable
        users={filteredUsers}
        selectedIds={selectedUserIds}
        onToggleSelect={toggleSelectUser}
        onSelectAll={selectAllUsers}
        onActivateUser={(id) => activateUserMutation.mutate(id)}
        onDeleteUser={(id) => deleteUserMutation.mutate(id)}
      />

      {/* Modals & Side Drawers */}
      <UserProfileDrawer />
      <RoleManagerModal />
      <CreateUserModal />
      <BlockUserModal />
      <UserExportModal />
    </div>
  );
}
