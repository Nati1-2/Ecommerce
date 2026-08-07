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
        totalUsers: 125000,
        usersGrowth: 12.4,
        activeUsers: 118000,
        activeGrowth: 9.8,
        blockedUsers: 2500,
        blockedChange: -3.1,
        newUsersToday: 850,
        todayGrowth: 18.2,
      };
    }
  },

  getUsers: async (): Promise<AdminUser[]> => {
    try {
      const data = await apiFetch<{ users: AdminUser[] }>("/api/admin/users");
      return data.users;
    } catch {
      return [
        {
          id: "usr-demo-admin",
          name: "Nati SuperAdmin",
          email: "admin@natistore.com",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          phone: "+1 (415) 890-1234",
          role: "Admin",
          status: "Active",
          location: "San Francisco, CA",
          totalOrders: 14,
          totalSpent: 12490.00,
          createdAt: "2026-01-15",
          lastLogin: "Just now",
          lastLoginIp: "192.168.1.45",
          lastLoginLocation: "San Francisco, US",
        },
        {
          id: "usr-demo-vendor",
          name: "Apex Tech Wearables Store",
          email: "vendor@natistore.com",
          avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
          phone: "+1 (800) 555-0199",
          role: "Vendor",
          status: "Active",
          location: "San Jose, CA",
          totalOrders: 8900,
          totalSpent: 3450000.00,
          createdAt: "2026-01-15",
          lastLogin: "14 mins ago",
          lastLoginIp: "172.16.0.12",
          lastLoginLocation: "San Jose, US",
        },
        {
          id: "usr-demo-customer",
          name: "John Smith",
          email: "john.smith@gmail.com",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
          phone: "+1 (206) 555-9012",
          role: "Customer",
          status: "Active",
          location: "Seattle, WA",
          totalOrders: 6,
          totalSpent: 3420.50,
          createdAt: "2026-01-15",
          lastLogin: "1 hour ago",
          lastLoginIp: "198.51.100.24",
          lastLoginLocation: "Seattle, US",
        },
      ];
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
