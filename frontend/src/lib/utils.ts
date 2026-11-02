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

export function formatDiscount(
  original?: number | string | null,
  discounted?: number | string | null
): number {
  const orig = typeof original === "number" ? original : Number(original) || 0;
  const disc = typeof discounted === "number" ? discounted : Number(discounted) || 0;
  if (!orig || orig <= disc) return 0;
  return Math.round(((orig - disc) / orig) * 100);
}
