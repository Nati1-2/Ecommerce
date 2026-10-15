import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | undefined | null): string {
  const num = typeof price === "number" ? price : Number(price) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(isNaN(num) ? 0 : num);
}

export function formatDiscount(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100);
}
