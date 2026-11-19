export type ClickEventType =
  | "CLICK"
  | "BUTTON_CLICK"
  | "LINK_CLICK"
  | "ADD_TO_CART_CLICK"
  | "CHECKOUT_CLICK"
  | "NAV_CLICK"
  | "SEARCH_SUBMIT"
  | "FILTER_CLICK"
  | "DONATE_CLICK"
  | "FORM_SUBMIT"
  | "CARD_CLICK";

export type UserRoleType = "CUSTOMER" | "VENDOR" | "ADMIN" | "GUEST";

export interface UserClickEvent {
  id: string;
  eventType: ClickEventType;
  targetTag: string; // e.g. "BUTTON", "A", "INPUT", "DIV"
  elementText: string; // e.g. "Add to Cart", "Proceed to Checkout"
  elementId?: string;
  elementClass?: string;
  componentName?: string;
  coordinates: {
    x: number;
    y: number;
  };
  path: string; // e.g. "/products/iphone-17-pro"
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRoleType;
  };
  sessionId: string;
  ip: string;
  location: {
    city: string;
    region?: string;
    country: string;
    countryCode: string;
    flag: string;
    isp: string;
  };
  device: {
    model: string;
    brand: string;
    type: "Mobile" | "Desktop" | "Tablet" | "Unknown";
    os: string;
    browser: string;
    screenResolution: string;
  };
  timestamp: string;
  durationOnPageSeconds?: number;
  metadata?: Record<string, any>;
}

export interface HotspotElement {
  elementText: string;
  targetTag: string;
  eventType: ClickEventType;
  clickCount: number;
  percentage: number;
}

export interface UserActivityStats {
  totalClicksToday: number;
  activeClickersCount: number;
  clicksPerMinute: number;
  topClickedElement: string;
  topClickedCategory: string;
  customerClicksShare: number;
  guestClicksShare: number;
  vendorClicksShare: number;
  adminClicksShare: number;
  hotspots: HotspotElement[];
}

export interface UserActivityApiResponse {
  success: boolean;
  stats: UserActivityStats;
  clicks: UserClickEvent[];
  totalCount: number;
  page: number;
  totalPages: number;
}
