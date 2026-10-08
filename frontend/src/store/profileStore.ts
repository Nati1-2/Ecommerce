"use client";

import { create } from "zustand";

export interface ProfileUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  verified: boolean;
  dateOfBirth?: string;
  gender?: string;
}

export interface ProfilePreferences {
  marketingEmails: boolean;
  recommendations: boolean;
  publicProfile: boolean;
}

export interface DeviceActivity {
  id: string;
  sessionId?: string;
  ipAddress?: string;
  deviceType?: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  deviceBrand?: string;
  deviceModel?: string;
  browser: string;
  os: string;
  location: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  time: string;
  loginAt?: string;
  isCurrentSession?: boolean;
}

export interface ProfileSecurity {
  twoFactorEnabled: boolean;
  devices: DeviceActivity[];
}

interface ProfileState {
  user: ProfileUser;
  preferences: ProfilePreferences;
  security: ProfileSecurity;
  setUser: (user: Partial<ProfileUser>) => void;
  setPreferences: (prefs: Partial<ProfilePreferences>) => void;
  setTwoFactor: (enabled: boolean) => void;
  setDevices: (devices: DeviceActivity[]) => void;
  removeDevice: (id: string) => void;
  deleteAccount: () => void;
}

const initialUser: ProfileUser = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  avatar: "",
  role: "Standard Member ⭐",
  verified: true,
  dateOfBirth: "1995-01-01",
  gender: "Male",
};

export const useProfileStore = create<ProfileState>((set) => ({
  user: { ...initialUser },
  preferences: {
    marketingEmails: true,
    recommendations: true,
    publicProfile: false,
  },
  security: {
    twoFactorEnabled: false,
    devices: [],
  },

  setUser: (userData) =>
    set((state) => ({ user: { ...state.user, ...userData } })),

  setPreferences: (prefData) =>
    set((state) => ({ preferences: { ...state.preferences, ...prefData } })),

  setTwoFactor: (twoFactorEnabled) =>
    set((state) => ({ security: { ...state.security, twoFactorEnabled } })),

  setDevices: (devices) =>
    set((state) => ({
      security: {
        ...state.security,
        devices,
      },
    })),

  removeDevice: (id) =>
    set((state) => ({
      security: {
        ...state.security,
        devices: state.security.devices.filter((d) => d.id !== id && d.sessionId !== id),
      },
    })),

  deleteAccount: () =>
    set({
      user: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        avatar: "",
        role: "",
        verified: false,
      },
    }),
}));
