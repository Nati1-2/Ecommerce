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

function unavailable(): never {
  throw new Error("Account settings require a persistent settings service.");
}

export const settingsApi = {
  getSettings: async (): Promise<UserSettings> => unavailable(),
  updateSettings: async (_updates: Partial<UserSettings>): Promise<UserSettings> => unavailable(),
  getSessions: async (): Promise<Session[]> => unavailable(),
  deleteSession: async (_id: string): Promise<void> => unavailable(),
  deleteAllSessions: async (): Promise<void> => unavailable(),
  getConnectedApps: async (): Promise<ConnectedApp[]> => unavailable(),
  toggleAppConnection: async (_id: string, _connect: boolean): Promise<ConnectedApp[]> => unavailable(),
  exportData: async (): Promise<{ url: string; message: string }> => unavailable(),
  deleteAccount: async (_password: string): Promise<void> => unavailable(),
};
