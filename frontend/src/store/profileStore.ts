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
  browser: string;
  os: string;
  location: string;
  time: string;
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
  removeDevice: (id: string) => void;
  deleteAccount: () => void;
}

const initialUser: ProfileUser = {
  id: "usr-948",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@gmail.com",
  phone: "+1 (555) 019-2834",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
  role: "Premium Member ⭐",
  verified: true,
  dateOfBirth: "1992-05-12",
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
    devices: [
      { id: "dev-1", browser: "Chrome", os: "Windows", location: "Paris, France", time: "Active Now" },
      { id: "dev-2", browser: "Safari", os: "iOS", location: "Paris, France", time: "2 hours ago" },
      { id: "dev-3", browser: "Firefox", os: "macOS", location: "London, UK", time: "3 days ago" },
    ],
  },

  setUser: (userData) =>
    set((state) => ({ user: { ...state.user, ...userData } })),

  setPreferences: (prefData) =>
    set((state) => ({ preferences: { ...state.preferences, ...prefData } })),

  setTwoFactor: (twoFactorEnabled) =>
    set((state) => ({ security: { ...state.security, twoFactorEnabled } })),

  removeDevice: (id) =>
    set((state) => ({
      security: {
        ...state.security,
        devices: state.security.devices.filter((d) => d.id !== id),
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
