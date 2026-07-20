import {
  AdminUser,
  UserStatsData,
  UserActivityEvent,
  RolePermission,
  CreateUserInput,
  UserRole,
} from "@/types/adminUser";

let mockStats: UserStatsData = {
  totalUsers: 125000,
  usersGrowth: 12.4,
  activeUsers: 118000,
  activeGrowth: 9.8,
  blockedUsers: 2500,
  blockedChange: -3.1,
  newUsersToday: 850,
  todayGrowth: 18.2,
};

let mockUsers: AdminUser[] = [
  {
    id: "usr_9001",
    name: "Sarah Jenkins",
    email: "sarah.j@techcorp.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (415) 890-1234",
    role: "Admin",
    status: "Active",
    location: "San Francisco, CA",
    totalOrders: 14,
    totalSpent: 12490.00,
    createdAt: "2024-02-10",
    lastLogin: "2 mins ago",
    lastLoginIp: "192.168.1.45",
    lastLoginLocation: "San Francisco, US",
  },
  {
    id: "usr_9002",
    name: "Alexander Vance",
    email: "alexander@apextech.io",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (800) 555-0199",
    role: "Vendor",
    status: "Active",
    location: "San Jose, CA",
    totalOrders: 8900,
    totalSpent: 3450000.00,
    createdAt: "2023-04-12",
    lastLogin: "14 mins ago",
    lastLoginIp: "172.16.0.12",
    lastLoginLocation: "San Jose, US",
  },
  {
    id: "usr_9003",
    name: "Michael Chen",
    email: "mchen@horizon.dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (206) 555-9012",
    role: "Customer",
    status: "Active",
    location: "Seattle, WA",
    totalOrders: 6,
    totalSpent: 3420.50,
    createdAt: "2024-08-19",
    lastLogin: "1 hour ago",
    lastLoginIp: "198.51.100.24",
    lastLoginLocation: "Seattle, US",
  },
  {
    id: "usr_9004",
    name: "Marcus Sterling",
    email: "marcus@luminavision.com",
    avatar: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (312) 789-0123",
    role: "Vendor",
    status: "Pending Verification",
    location: "Chicago, IL",
    totalOrders: 5800,
    totalSpent: 1890000.00,
    createdAt: "2024-01-15",
    lastLogin: "3 hours ago",
    lastLoginIp: "203.0.113.19",
    lastLoginLocation: "Chicago, US",
  },
  {
    id: "usr_9005",
    name: "David Miller",
    email: "david.m@suspicious.org",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (555) 321-9988",
    role: "Customer",
    status: "Blocked",
    location: "Miami, FL",
    totalOrders: 1,
    totalSpent: 89.00,
    createdAt: "2025-03-01",
    lastLogin: "Yesterday",
    lastLoginIp: "198.51.100.88",
    lastLoginLocation: "Miami, US",
  },
  {
    id: "usr_9006",
    name: "Elena Rostova",
    email: "elena.r@support.apex.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (212) 345-6789",
    role: "Support Staff",
    status: "Active",
    location: "New York, NY",
    totalOrders: 9,
    totalSpent: 5120.00,
    createdAt: "2024-05-01",
    lastLogin: "5 mins ago",
    lastLoginIp: "198.51.100.12",
    lastLoginLocation: "New York, US",
  },
];

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

let mockUserActivities: Record<string, UserActivityEvent[]> = {
  usr_9001: [
    { id: "act_101", userId: "usr_9001", action: "User Logged In", category: "login", timestamp: "2 mins ago", details: "Successful authentication via 2FA", ipAddress: "192.168.1.45", location: "San Francisco, US", browser: "Chrome 126.0 (MacOS)" },
    { id: "act_102", userId: "usr_9001", action: "Approved Vendor Store", category: "account", timestamp: "1 hour ago", details: "Approved vendor onboarding for Hyperion Ergonomics", ipAddress: "192.168.1.45", location: "San Francisco, US", browser: "Chrome 126.0 (MacOS)" },
    { id: "act_103", userId: "usr_9001", action: "Exported Audit Log", category: "security", timestamp: "Yesterday", details: "Exported System Audit Log to CSV format", ipAddress: "192.168.1.45", location: "San Francisco, US", browser: "Chrome 126.0 (MacOS)" },
  ],
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminUserApi = {
  getUserStats: async (): Promise<UserStatsData> => {
    await delay(200);
    return { ...mockStats };
  },

  getUsers: async (): Promise<AdminUser[]> => {
    await delay(250);
    return [...mockUsers];
  },

  getUserById: async (id: string): Promise<AdminUser | undefined> => {
    await delay(200);
    return mockUsers.find((u) => u.id === id);
  },

  createUser: async (input: CreateUserInput): Promise<AdminUser> => {
    await delay(400);
    const newUser: AdminUser = {
      id: `usr_${Date.now()}`,
      name: input.name,
      email: input.email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      phone: input.phone || "+1 (555) 000-1122",
      role: input.role,
      status: input.status,
      location: "San Francisco, CA",
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Just now",
      lastLoginIp: "192.168.1.10",
      lastLoginLocation: "USA",
    };
    mockUsers.unshift(newUser);
    mockStats.totalUsers += 1;
    mockStats.activeUsers += 1;
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
    await delay(300);
    const idx = mockUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");

    mockUsers[idx] = { ...mockUsers[idx], ...updates };
    return mockUsers[idx];
  },

  blockUser: async (id: string, reason: string): Promise<AdminUser> => {
    await delay(300);
    const u = mockUsers.find((user) => user.id === id);
    if (!u) throw new Error("User not found");

    u.status = "Blocked";
    mockStats.blockedUsers += 1;
    mockStats.activeUsers = Math.max(0, mockStats.activeUsers - 1);
    return u;
  },

  activateUser: async (id: string): Promise<AdminUser> => {
    await delay(300);
    const u = mockUsers.find((user) => user.id === id);
    if (!u) throw new Error("User not found");

    u.status = "Active";
    mockStats.blockedUsers = Math.max(0, mockStats.blockedUsers - 1);
    mockStats.activeUsers += 1;
    return u;
  },

  changeRole: async (id: string, newRole: UserRole): Promise<AdminUser> => {
    await delay(300);
    const u = mockUsers.find((user) => user.id === id);
    if (!u) throw new Error("User not found");

    u.role = newRole;
    return u;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    await delay(300);
    mockUsers = mockUsers.filter((u) => u.id !== id);
    mockStats.totalUsers = Math.max(0, mockStats.totalUsers - 1);
    return true;
  },

  bulkBlockUsers: async (ids: string[], reason: string): Promise<boolean> => {
    await delay(400);
    mockUsers = mockUsers.map((u) => (ids.includes(u.id) ? { ...u, status: "Blocked" } : u));
    return true;
  },

  bulkDeleteUsers: async (ids: string[]): Promise<boolean> => {
    await delay(400);
    mockUsers = mockUsers.filter((u) => !ids.includes(u.id));
    mockStats.totalUsers = mockUsers.length;
    return true;
  },

  getUserActivity: async (userId: string): Promise<UserActivityEvent[]> => {
    await delay(200);
    return mockUserActivities[userId] || [
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
    await delay(150);
    return [...mockRoles];
  },
};
