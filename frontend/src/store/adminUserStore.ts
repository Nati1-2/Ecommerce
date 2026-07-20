"use client";

import { create } from "zustand";
import { AdminUser, UserFilterCriteria } from "@/types/adminUser";

interface AdminUserState {
  selectedUserIds: string[];
  filters: UserFilterCriteria;
  drawerUser: AdminUser | null;
  blockUserModalUser: AdminUser | null;
  roleModalUser: AdminUser | null;
  isCreateModalOpen: boolean;
  isExportModalOpen: boolean;

  setSearchQuery: (query: string) => void;
  setRoleFilter: (role: string) => void;
  setStatusFilter: (status: string) => void;
  setDateFilter: (date: string) => void;
  resetFilters: () => void;

  toggleSelectUser: (id: string) => void;
  selectAllUsers: (ids: string[]) => void;
  clearSelection: () => void;

  setDrawerUser: (user: AdminUser | null) => void;
  setBlockUserModalUser: (user: AdminUser | null) => void;
  setRoleModalUser: (user: AdminUser | null) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  setIsExportModalOpen: (open: boolean) => void;
}

export const useAdminUserStore = create<AdminUserState>((set) => ({
  selectedUserIds: [],
  filters: {
    searchQuery: "",
    roleFilter: "All",
    statusFilter: "All",
    dateFilter: "All",
  },
  drawerUser: null,
  blockUserModalUser: null,
  roleModalUser: null,
  isCreateModalOpen: false,
  isExportModalOpen: false,

  setSearchQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  setRoleFilter: (role) =>
    set((state) => ({ filters: { ...state.filters, roleFilter: role } })),
  setStatusFilter: (status) =>
    set((state) => ({ filters: { ...state.filters, statusFilter: status } })),
  setDateFilter: (date) =>
    set((state) => ({ filters: { ...state.filters, dateFilter: date } })),
  resetFilters: () =>
    set({
      filters: {
        searchQuery: "",
        roleFilter: "All",
        statusFilter: "All",
        dateFilter: "All",
      },
    }),

  toggleSelectUser: (id) =>
    set((state) => ({
      selectedUserIds: state.selectedUserIds.includes(id)
        ? state.selectedUserIds.filter((uId) => uId !== id)
        : [...state.selectedUserIds, id],
    })),
  selectAllUsers: (ids) => set({ selectedUserIds: ids }),
  clearSelection: () => set({ selectedUserIds: [] }),

  setDrawerUser: (drawerUser) => set({ drawerUser }),
  setBlockUserModalUser: (blockUserModalUser) => set({ blockUserModalUser }),
  setRoleModalUser: (roleModalUser) => set({ roleModalUser }),
  setIsCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),
  setIsExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
}));
