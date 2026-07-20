"use client";

import { create } from "zustand";
import { Order } from "@/types";

interface OrderFilters {
  status: string;
  date: string;
  query: string;
  sort: string;
}

interface OrderState {
  orders: Order[];
  filters: OrderFilters;
  selectedOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  setFilters: (filters: Partial<OrderFilters>) => void;
  setSelectedOrder: (order: Order | null) => void;
  cancelOrder: (id: string) => void;
  returnOrder: (id: string, reason: string, description: string) => void;
  resetStore: () => void;
}

const initialFilters: OrderFilters = {
  status: "All",
  date: "Last 30 days",
  query: "",
  sort: "Newest",
};

// Initial Mock Orders data mapping the specifications
const initialOrders: Order[] = [
  {
    id: "ORD-123456",
    createdAt: "July 15, 2026",
    status: "Shipped",
    paymentStatus: "Paid",
    total: 949.0,
    subtotal: 999.0,
    discount: 100.0,
    shipping: 0,
    tax: 50.0,
    shippingAddress: {
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
    items: [
      {
        productId: "0",
        name: "Apple iPhone 17 Pro",
        image: "/iphone17.png",
        quantity: 1,
        price: 999.0,
        variant: "Sunset Orange, 256GB",
      },
    ],
  },
  {
    id: "ORD-987654",
    createdAt: "June 28, 2026",
    status: "Delivered",
    paymentStatus: "Paid",
    total: 399.0,
    subtotal: 399.0,
    discount: 0,
    shipping: 0,
    tax: 0,
    shippingAddress: {
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
    items: [
      {
        productId: "1",
        name: "Sony WH-1000XM6 Headphones",
        image: "/headphones.png",
        quantity: 1,
        price: 399.0,
        variant: "Midnight Blue",
      },
    ],
  },
  {
    id: "ORD-543210",
    createdAt: "July 14, 2026",
    status: "Processing",
    paymentStatus: "Paid",
    total: 1577.9,
    subtotal: 1598.0,
    discount: 100.0,
    shipping: 0,
    tax: 79.9,
    shippingAddress: {
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
    items: [
      {
        productId: "0",
        name: "Apple iPhone 17 Pro",
        image: "/iphone17.png",
        quantity: 1,
        price: 1199.0,
        variant: "Stellar Black, 256GB",
      },
      {
        productId: "1",
        name: "Sony WH-1000XM6 Headphones",
        image: "/headphones.png",
        quantity: 1,
        price: 399.0,
        variant: "Stellar Black",
      },
    ],
  },
  {
    id: "ORD-246810",
    createdAt: "May 12, 2026",
    status: "Cancelled",
    paymentStatus: "Failed",
    total: 89.9,
    subtotal: 89.9,
    discount: 0,
    shipping: 0,
    tax: 0,
    shippingAddress: {
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
    items: [
      {
        productId: "3",
        name: "Aura Premium Wireless Charger",
        image: "/charger.png",
        quantity: 1,
        price: 89.9,
        variant: "Default",
      },
    ],
  },
];

export const useOrderStore = create<OrderState>((set) => ({
  orders: [...initialOrders],
  filters: { ...initialFilters },
  selectedOrder: null,

  setOrders: (orders) => set({ orders }),

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  setSelectedOrder: (selectedOrder) => set({ selectedOrder }),

  cancelOrder: (id) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status: "Cancelled", paymentStatus: "Refunded" } : o
      ),
    })),

  returnOrder: (id, reason, description) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status: "Returned" } : o
      ),
    })),

  resetStore: () =>
    set({
      orders: [...initialOrders],
      filters: { ...initialFilters },
      selectedOrder: null,
    }),
}));
