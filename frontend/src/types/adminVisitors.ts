export type DeviceType = "Desktop" | "Mobile" | "Tablet" | "Bot" | "Unknown";

export type TrafficSourceType =
  | "Social Media"
  | "Search Engine"
  | "Direct"
  | "Referral"
  | "Campaign / Ad"
  | "Email"
  | "Other";

export interface VisitorLocation {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  latitude?: number;
  longitude?: number;
}

export interface VisitorTrafficSource {
  type: TrafficSourceType;
  name: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface VisitorLogItem {
  id: string;
  ip: string;
  deviceType: DeviceType;
  deviceModel: string;
  deviceBrand?: string;
  os: string;
  browser: string;
  location: VisitorLocation;
  source: VisitorTrafficSource;
  path: string;
  status: "online" | "idle" | "exited";
  durationSeconds: number;
  visitedAt: string;
  screenResolution?: string;
  userAgent?: string;
}

export interface SourceShareItem {
  name: string;
  type: TrafficSourceType;
  count: number;
  percentage: number;
  iconName?: string;
}

export interface DeviceShareItem {
  deviceType: DeviceType;
  count: number;
  percentage: number;
}

export interface OSShareItem {
  os: string;
  count: number;
  percentage: number;
}

export interface CountryShareItem {
  country: string;
  countryCode: string;
  flag: string;
  count: number;
  percentage: number;
}

export interface VisitorStats {
  totalVisits: number;
  liveActive: number;
  uniqueIps: number;
  topSource: {
    type: TrafficSourceType;
    name: string;
    percentage: number;
  };
  deviceBreakdown: DeviceShareItem[];
  sourceBreakdown: SourceShareItem[];
  osBreakdown: OSShareItem[];
  topCountries: CountryShareItem[];
}

export interface VisitorFilterOptions {
  sourceType?: string;
  deviceType?: string;
  searchQuery?: string;
  timeframe?: "1h" | "24h" | "7d" | "30d" | "all";
  page?: number;
  limit?: number;
}

export interface VisitorApiResponse {
  success: boolean;
  stats: VisitorStats;
  visitors: VisitorLogItem[];
  totalCount: number;
  page: number;
  totalPages: number;
}
