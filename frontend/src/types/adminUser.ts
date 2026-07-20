export type UserRole = "Customer" | "Vendor" | "Admin" | "Support Staff";

export type UserStatus = "Active" | "Blocked" | "Pending Verification";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  location: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastLogin: string;
  lastLoginIp: string;
  lastLoginLocation: string;
}

export interface RolePermission {
  id: string;
  name: UserRole;
  description: string;
  permissions: {
    products: boolean;
    orders: boolean;
    payments: boolean;
    users: boolean;
    analytics: boolean;
  };
}

export interface UserActivityEvent {
  id: string;
  userId: string;
  action: string;
  category: "login" | "order" | "review" | "security" | "account";
  timestamp: string;
  details: string;
  ipAddress: string;
  location: string;
  browser: string;
}

export interface UserStatsData {
  totalUsers: number;
  usersGrowth: number;
  activeUsers: number;
  activeGrowth: number;
  blockedUsers: number;
  blockedChange: number;
  newUsersToday: number;
  todayGrowth: number;
}

export interface UserFilterCriteria {
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
  dateFilter: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  status: UserStatus;
}
