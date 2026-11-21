export type DeviceType =
  | "Mobile"
  | "Desktop"
  | "Tablet"
  | "Bot"
  | "Smart TV"
  | "Console"
  | "Unknown";

export type ActivityCategory =
  | "cart"
  | "checkout"
  | "browse"
  | "search"
  | "auth"
  | "wishlist"
  | "flash_sale"
  | "review"
  | "order";

export type ActivityType =
  | "ADD_TO_CART"
  | "REMOVE_FROM_CART"
  | "CHECKOUT_INITIATED"
  | "PAYMENT_COMPLETED"
  | "ORDER_PLACED"
  | "SEARCH_QUERY"
  | "PRODUCT_VIEW"
  | "CATEGORY_BROWSE"
  | "WISHLIST_ADD"
  | "WISHLIST_REMOVE"
  | "FLASH_SALE_INTERACTION"
  | "USER_LOGIN"
  | "USER_REGISTER"
  | "REVIEW_SUBMITTED"
  | "COUPON_APPLIED"
  | "PAGE_NAVIGATION";

export interface ActivityLogEntry {
  id: string;
  activityType: ActivityType;
  title: string;
  category: ActivityCategory;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  statusCode: number;
  timestamp: string;
  latencyMs: number;
  details?: string;
  metadata?: Record<string, any>;
}

export interface DeviceLocation {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  latitude?: number;
  longitude?: number;
  isp: string;
}

export interface DeviceSession {
  id: string;
  sessionId: string;
  ip: string;
  deviceModel: string;
  deviceBrand: string;
  deviceType: DeviceType;
  os: string;
  browser: string;
  screenResolution: string;
  viewport: string;
  userAgent: string;
  location: DeviceLocation;
  status: "online" | "idle" | "exited";
  connectionType: "5G Ultra" | "WiFi 6E" | "Fiber" | "4G LTE" | "Unknown";
  durationSeconds: number;
  lastActive: string;
  firstSeen: string;
  currentPath: string;
  activities: ActivityLogEntry[];
}

export interface FlattenedActivityItem extends ActivityLogEntry {
  deviceModel: string;
  deviceBrand: string;
  deviceType: DeviceType;
  ip: string;
  flag: string;
  city: string;
  country: string;
  sessionId: string;
}

export interface DeviceTrafficStats {
  activeDevicesCount: number;
  totalEventsToday: number;
  mobileShare: number;
  desktopShare: number;
  tabletShare: number;
  topDeviceModel: string;
  uniqueIpsCount: number;
  avgResponseLatency: number;
}

export interface DeviceTrafficResponse {
  success: boolean;
  stats: DeviceTrafficStats;
  devices: DeviceSession[];
  allActivities: FlattenedActivityItem[];
  totalCount: number;
  page: number;
  totalPages: number;
}
