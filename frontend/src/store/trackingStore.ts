"use client";

import { create } from "zustand";
import { TrackingEvent, Tracking } from "@/types";

interface TrackingState {
  orderId: string | null;
  orderStatus: string;
  currentLocation: string;
  deliveryTime: string;
  trackingHistory: TrackingEvent[];
  setTrackingData: (data: Tracking) => void;
  updateStatus: (status: string, location: string, timestamp: string, description: string) => void;
  resetStore: () => void;
}

export const useTrackingStore = create<TrackingState>((set) => ({
  orderId: null,
  orderStatus: "Preparing shipment",
  currentLocation: "Processing Facility",
  deliveryTime: "July 20, 2026",
  trackingHistory: [],

  setTrackingData: (data) =>
    set({
      orderId: data.orderId,
      orderStatus: data.status,
      currentLocation: data.currentLocation,
      deliveryTime: data.estimatedDelivery,
      trackingHistory: data.history,
    }),

  updateStatus: (status, location, timestamp, description) =>
    set((state) => {
      const newEvent: TrackingEvent = {
        status,
        location,
        timestamp,
        description,
      };

      // Add to the top of the history list if not duplicates
      const exists = state.trackingHistory.some(
        (e) => e.status === status && e.timestamp === timestamp
      );

      return {
        orderStatus: status,
        currentLocation: location,
        trackingHistory: exists
          ? state.trackingHistory
          : [newEvent, ...state.trackingHistory],
      };
    }),

  resetStore: () =>
    set({
      orderId: null,
      orderStatus: "Preparing shipment",
      currentLocation: "Processing Facility",
      deliveryTime: "July 20, 2026",
      trackingHistory: [],
    }),
}));
