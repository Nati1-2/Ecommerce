import {
  AdminUser,
  UserStatsData,
  UserActivityEvent,
  RolePermission,
  CreateUserInput,
  UserRole,
} from "@/types/adminUser";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") || "";
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

let mockRoles: RolePermission[] = [
  {
    id: "r1",
    name: "Admin",
    description: "Full platform control across all microservices and users",
    permissions: { products: true, orders: true, payments: true, users: true, analytics: true },
  },
  {
    id: "r2",
    name: "Vendor",
    description: "Seller dashboard access for managing products, inventory, and fulfillment",
    permissions: { products: true, orders: true, payments: false, users: false, analytics: true },
  },
  {
    id: "r3",
    name: "Support Staff",
    description: "Customer service tools for viewing orders, reviews, and customer tickets",
    permissions: { products: true, orders: true, payments: false, users: true, analytics: false },
  },
  {
    id: "r4",
    name: "Customer",
    description: "Standard marketplace buyer account",
    permissions: { products: false, orders: false, payments: false, users: false, analytics: false },
  },
];

export const adminUserApi = {
  getUserStats: async (): Promise<UserStatsData> => {
    try {
      const data = await apiFetch<{ stats: UserStatsData }>("/api/admin/users/stats");
      return data.stats;
    } catch {
      return {
        totalUsers: 0,
        usersGrowth: 0,
        activeUsers: 0,
        activeGrowth: 0,
        blockedUsers: 0,
        blockedChange: 0,
        newUsersToday: 0,
        todayGrowth: 0,
      };
    }
  },

  getUsers: async (): Promise<AdminUser[]> => {
    try {
      const data = await apiFetch<{ users: AdminUser[] }>("/api/admin/users");
      return data.users;
    } catch {
      return [];
    }
  },

  getUserById: async (id: string): Promise<AdminUser | undefined> => {
    try {
      const data = await apiFetch<{ user: AdminUser }>(`/api/admin/users/${id}`);
      return data.user;
    } catch {
      return undefined;
    }
  },

  createUser: async (input: CreateUserInput): Promise<AdminUser> => {
    const data = await apiFetch<{ user: AdminUser }>("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return data.user;
  },

  updateUser: async (id: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
    const data = await apiFetch<{ user: AdminUser }>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return data.user;
  },

  blockUser: async (id: string, reason: string): Promise<AdminUser> => {
    const data = await apiFetch<{ user: AdminUser }>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Blocked", reason }),
    });
    return data.user;
  },

  activateUser: async (id: string): Promise<AdminUser> => {
    const data = await apiFetch<{ user: AdminUser }>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Active" }),
    });
    return data.user;
  },

  changeRole: async (id: string, newRole: UserRole): Promise<AdminUser> => {
    const data = await apiFetch<{ user: AdminUser }>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    });
    return data.user;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    const data = await apiFetch<{ success: boolean }>(`/api/admin/users/${id}`, {
      method: "DELETE",
    });
    return data.success;
  },

  bulkBlockUsers: async (ids: string[], reason: string): Promise<boolean> => {
    await Promise.all(
      ids.map((id) =>
        apiFetch(`/api/admin/users/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "Blocked", reason }),
        })
      )
    );
    return true;
  },

  bulkDeleteUsers: async (ids: string[]): Promise<boolean> => {
    await Promise.all(
      ids.map((id) =>
        apiFetch(`/api/admin/users/${id}`, {
          method: "DELETE",
        })
      )
    );
    return true;
  },

  getUserActivity: async (userId: string): Promise<UserActivityEvent[]> => {
    return [
      {
        id: `act_${Date.now()}`,
        userId,
        action: "Account Session Authenticated",
        category: "login",
        timestamp: "10 mins ago",
        details: "Logged in via Desktop Client",
        ipAddress: "192.168.1.80",
        location: "United States",
        browser: "Chrome (MacOS)",
      },
    ];
  },

  getRoles: async (): Promise<RolePermission[]> => {
    return [...mockRoles];
  },
};
