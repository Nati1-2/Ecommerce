"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "@/services/api/adminUserApi";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { CreateUserInput, UserRole } from "@/types/adminUser";

export function useUserStats() {
  return useQuery({
    queryKey: ["admin-user-stats"],
    queryFn: adminUserApi.getUserStats,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users-list"],
    queryFn: adminUserApi.getUsers,
  });
}

export function useAdminUserDetail(id: string) {
  return useQuery({
    queryKey: ["admin-user-detail", id],
    queryFn: () => adminUserApi.getUserById(id),
    enabled: !!id,
  });
}

export function useUserActivity(userId: string) {
  return useQuery({
    queryKey: ["admin-user-activity", userId],
    queryFn: () => adminUserApi.getUserActivity(userId),
    enabled: !!userId,
  });
}

export function useAdminRoles() {
  return useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: adminUserApi.getRoles,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (input: CreateUserInput) => adminUserApi.createUser(input),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-stats"] });
      showToast(`User account "${newUser.name}" created successfully!`, "success");
    },
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminUserApi.blockUser(id, reason),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-stats"] });
      showToast(`User "${updated.name}" has been blocked`, "error");
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminUserApi.activateUser(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-stats"] });
      showToast(`User "${updated.name}" activated successfully`, "success");
    },
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      adminUserApi.changeRole(id, role),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      showToast(`Role for "${updated.name}" changed to ${updated.role}`, "info");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminUserApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-stats"] });
      showToast("User account permanently deleted", "info");
    },
  });
}

export function useBulkBlockUsers() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ ids, reason }: { ids: string[]; reason: string }) =>
      adminUserApi.bulkBlockUsers(ids, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-stats"] });
      showToast("Selected users blocked", "error");
    },
  });
}

export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (ids: string[]) => adminUserApi.bulkDeleteUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-stats"] });
      showToast("Selected users deleted", "info");
    },
  });
}
