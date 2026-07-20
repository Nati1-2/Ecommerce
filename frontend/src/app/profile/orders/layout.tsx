import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase History | Aura Store",
  description:
    "Review your recent orders, track shipping logistics progress, download tax invoices, and reorder previous items.",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
