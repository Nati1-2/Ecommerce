"use client";

import { create } from "zustand";

export interface BillingAddress {
  name: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
}

export type PaymentStatus = "idle" | "processing" | "success" | "failed";
export type PaymentMethodType = "card" | "paypal" | "applepay" | "googlepay";

interface PaymentState {
  paymentMethod: PaymentMethodType;
  billingAddress: BillingAddress;
  sameAsShipping: boolean;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
  error: string | null;
  setPaymentMethod: (method: PaymentMethodType) => void;
  setBillingAddress: (address: Partial<BillingAddress>) => void;
  setSameAsShipping: (same: boolean) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setTransactionId: (id: string | null) => void;
  setError: (error: string | null) => void;
  resetPaymentState: () => void;
}

const initialBillingAddress: BillingAddress = {
  name: "",
  country: "United States",
  city: "",
  address: "",
  postalCode: "",
};

export const usePaymentStore = create<PaymentState>((set) => ({
  paymentMethod: "card",
  billingAddress: { ...initialBillingAddress },
  sameAsShipping: true,
  paymentStatus: "idle",
  transactionId: null,
  error: null,

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setBillingAddress: (address) =>
    set((state) => ({
      billingAddress: { ...state.billingAddress, ...address },
    })),
  setSameAsShipping: (sameAsShipping) => set({ sameAsShipping }),
  setPaymentStatus: (paymentStatus) => set({ paymentStatus }),
  setTransactionId: (transactionId) => set({ transactionId }),
  setError: (error) => set({ error }),
  resetPaymentState: () =>
    set({
      paymentMethod: "card",
      billingAddress: { ...initialBillingAddress },
      sameAsShipping: true,
      paymentStatus: "idle",
      transactionId: null,
      error: null,
    }),
}));
