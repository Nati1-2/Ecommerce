import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | Aura Store",
  description:
    "Complete your purchase securely. Fast checkout with multiple payment options, free shipping, and buyer protection.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Checkout uses its own minimal navbar — no site-wide Navbar/Footer
  return <>{children}</>;
}
