"use client";

import { create } from "zustand";

interface DonationState {
  isOpen: boolean;
  hasAutoShown: boolean;
  openDonationModal: () => void;
  closeDonationModal: () => void;
  dismissUntilTomorrow: () => void;
  isDismissed: () => boolean;
}

export const useDonationStore = create<DonationState>((set) => ({
  isOpen: false,
  hasAutoShown: false,
  openDonationModal: () => set({ isOpen: true }),
  closeDonationModal: () => set({ isOpen: false, hasAutoShown: true }),
  dismissUntilTomorrow: () => {
    if (typeof window !== "undefined") {
      const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("nati_donation_dismissed_until", tomorrow.toString());
    }
    set({ isOpen: false, hasAutoShown: true });
  },
  isDismissed: () => {
    if (typeof window === "undefined") return false;
    const dismissedUntil = localStorage.getItem("nati_donation_dismissed_until");
    if (!dismissedUntil) return false;
    const timestamp = parseInt(dismissedUntil, 10);
    return Date.now() < timestamp;
  },
}));
