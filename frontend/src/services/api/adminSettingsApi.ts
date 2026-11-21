import type {
  SystemSettingsState, IntegrationItem, FeatureFlagItem,
  MicroserviceHealthItem, SystemBackupItem,
} from "@/types/adminSettings";

function unavailable(): never {
  throw new Error("System settings are unavailable until a persistent configuration service is connected.");
}

export const adminSettingsApi = {
  getSettings: async (): Promise<SystemSettingsState> => unavailable(),
  updateSettings: async (_section: keyof SystemSettingsState, _payload: unknown): Promise<boolean> => unavailable(),
  getIntegrations: async (): Promise<IntegrationItem[]> => unavailable(),
  toggleIntegration: async (_id: string, _status: "Connected" | "Disconnected"): Promise<boolean> => unavailable(),
  getFeatureFlags: async (): Promise<FeatureFlagItem[]> => unavailable(),
  toggleFeatureFlag: async (_id: string, _enabled: boolean): Promise<boolean> => unavailable(),
  getSystemHealth: async (): Promise<MicroserviceHealthItem[]> => unavailable(),
  getBackups: async (): Promise<SystemBackupItem[]> => unavailable(),
  clearCache: async (): Promise<boolean> => unavailable(),
  createBackup: async (): Promise<SystemBackupItem> => unavailable(),
};
