import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | Aura Store",
  description:
    "Your order has been successfully placed. Thank you for shopping with us. View order details, tracking milestones, and download invoices.",
};

export default function OrderSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
