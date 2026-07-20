export interface UserSettings {
  // Account
  displayName: string;
  username: string;
  emailVisibility: boolean;
  phoneVisibility: boolean;
  profileVisibility: "public" | "private" | "friends";
  
  // Appearance & Localization
  theme: "light" | "dark" | "system";
  language: string;

  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  notificationPreferences: {
    orderUpdates: boolean;
    promotions: boolean;
    discounts: boolean;
    newProducts: boolean;
    newsletter: boolean;
  };

  // Privacy
  showReviewsPublicly: boolean;
  personalizedRecommendations: boolean;
  dataSharingPreferences: boolean;
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  ipAddress: string;
}

export interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  connectedAt: string | null;
  permissions: string[];
}

// Mock Database
let MOCK_SETTINGS: UserSettings = {
  displayName: "Alex Developer",
  username: "alexdev26",
  emailVisibility: false,
  phoneVisibility: false,
  profileVisibility: "public",
  theme: "system",
  language: "en",
  emailNotifications: true,
  pushNotifications: true,
  smsAlerts: true,
  notificationPreferences: {
    orderUpdates: true,
    promotions: false,
    discounts: true,
    newProducts: false,
    newsletter: true,
  },
  showReviewsPublicly: true,
  personalizedRecommendations: true,
  dataSharingPreferences: false,
};

let MOCK_SESSIONS: Session[] = [
  {
    id: "sess_1",
    device: "MacBook Pro M3",
    browser: "Chrome",
    location: "San Francisco, CA",
    lastActive: "Just now",
    isCurrent: true,
    ipAddress: "192.168.1.104",
  },
  {
    id: "sess_2",
    device: "iPhone 15 Pro",
    browser: "Safari",
    location: "San Francisco, CA",
    lastActive: "2 hours ago",
    isCurrent: false,
    ipAddress: "172.20.10.4",
  },
  {
    id: "sess_3",
    device: "Windows Desktop",
    browser: "Edge",
    location: "New York, NY",
    lastActive: "3 days ago",
    isCurrent: false,
    ipAddress: "10.0.0.45",
  }
];

let MOCK_APPS: ConnectedApp[] = [
  {
    id: "app_1",
    name: "Google",
    icon: "https://www.svgrepo.com/show/475656/google-color.svg",
    connectedAt: "2024-01-15T08:30:00Z",
    permissions: ["Email", "Profile"],
  },
  {
    id: "app_2",
    name: "Apple",
    icon: "https://www.svgrepo.com/show/511330/apple-173.svg",
    connectedAt: null,
    permissions: ["Email", "Name"],
  },
  {
    id: "app_3",
    name: "Stripe",
    icon: "https://www.svgrepo.com/show/354406/stripe.svg",
    connectedAt: "2025-06-20T14:45:00Z",
    permissions: ["Payments", "Purchase History"],
  }
];

// Helper to simulate latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const settingsApi = {
  getSettings: async (): Promise<UserSettings> => {
    await delay(600);
    return { ...MOCK_SETTINGS };
  },

  updateSettings: async (updates: Partial<UserSettings>): Promise<UserSettings> => {
    await delay(800);
    // Simulate error randomly
    if (Math.random() < 0.05) throw new Error("Failed to update settings");
    
    MOCK_SETTINGS = { ...MOCK_SETTINGS, ...updates };
    return { ...MOCK_SETTINGS };
  },

  getSessions: async (): Promise<Session[]> => {
    await delay(500);
    return [...MOCK_SESSIONS];
  },

  deleteSession: async (id: string): Promise<void> => {
    await delay(600);
    MOCK_SESSIONS = MOCK_SESSIONS.filter(s => s.id !== id);
  },

  deleteAllSessions: async (): Promise<void> => {
    await delay(800);
    MOCK_SESSIONS = MOCK_SESSIONS.filter(s => s.isCurrent);
  },

  getConnectedApps: async (): Promise<ConnectedApp[]> => {
    await delay(500);
    return [...MOCK_APPS];
  },

  toggleAppConnection: async (id: string, connect: boolean): Promise<ConnectedApp[]> => {
    await delay(700);
    MOCK_APPS = MOCK_APPS.map(app => 
      app.id === id ? { ...app, connectedAt: connect ? new Date().toISOString() : null } : app
    );
    return [...MOCK_APPS];
  },

  exportData: async (): Promise<{ url: string; message: string }> => {
    await delay(1500);
    return {
      url: "#",
      message: "Data export initiated. You will receive an email with the download link shortly."
    };
  },

  deleteAccount: async (password: string): Promise<void> => {
    await delay(2000);
    if (password !== "password123") {
      throw new Error("Invalid password");
    }
    // Simulate deletion success
  }
};
