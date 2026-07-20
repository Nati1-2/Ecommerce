"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Address, ShippingOption } from "@/types";

interface CheckoutState {
  step: number;
  selectedAddressId: string | null;
  shippingMethodId: string | null;
  couponCode: string | null;
  discountAmount: number;
  addresses: Address[];
  
  // Actions
  setStep: (step: number) => void;
  setSelectedAddressId: (id: string | null) => void;
  setShippingMethodId: (id: string | null) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  resetCheckout: () => void;
}

const defaultAddresses: Address[] = [
  {
    id: "addr-1",
    firstName: "John",
    lastName: "Smith",
    phone: "+1 (555) 019-2834",
    street: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
  },
  {
    id: "addr-2",
    firstName: "Jane",
    lastName: "Doe",
    phone: "+1 (555) 987-6543",
    street: "456 Oak Avenue",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94102",
  }
];

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      step: 1,
      selectedAddressId: "addr-1",
      shippingMethodId: "standard",
      couponCode: null,
      discountAmount: 0,
      addresses: defaultAddresses,

      setStep: (step) => set({ step }),
      setSelectedAddressId: (id) => set({ selectedAddressId: id }),
      setShippingMethodId: (id) => set({ shippingMethodId: id }),
      applyCoupon: (code, discount) => set({ couponCode: code, discountAmount: discount }),
      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),
      
      addAddress: (address) => set((state) => {
        const newAddress: Address = {
          ...address,
          id: `addr-${Date.now()}`
        };
        return {
          addresses: [...state.addresses, newAddress],
          selectedAddressId: newAddress.id // auto select newly created address
        };
      }),
      
      updateAddress: (updated) => set((state) => ({
        addresses: state.addresses.map((addr) => addr.id === updated.id ? updated : addr)
      })),
      
      deleteAddress: (id) => set((state) => {
        const filtered = state.addresses.filter((addr) => addr.id !== id);
        return {
          addresses: filtered,
          selectedAddressId: state.selectedAddressId === id
            ? (filtered[0]?.id || null)
            : state.selectedAddressId
        };
      }),

      resetCheckout: () => set({
        step: 1,
        selectedAddressId: "addr-1",
        shippingMethodId: "standard",
        couponCode: null,
        discountAmount: 0,
      })
    }),
    {
      name: "checkout-storage",
      partialize: (state) => ({
        addresses: state.addresses,
        selectedAddressId: state.selectedAddressId,
        shippingMethodId: state.shippingMethodId,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      })
    }
  )
);
