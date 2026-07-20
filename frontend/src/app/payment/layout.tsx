import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Payment Gateway | Aura Store",
  description:
    "Complete your checkout securely with Stripe. Your credit card information is encrypted using 256-bit SSL technology.",
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
