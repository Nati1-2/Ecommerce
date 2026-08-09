"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

/**
 * Conditionally renders the site-wide Navbar, BottomNav, and Footer.
 * Checkout pages use their own minimal chrome so we hide these.
 */
export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimal = pathname.startsWith("/checkout") || pathname.startsWith("/payment");

  return (
    <>
      {!isMinimal && <Navbar />}
      <main
        className={`flex-1 flex flex-col ${
          isMinimal ? "" : "pt-[92px] sm:pt-[100px] md:pt-[104px] pb-16 md:pb-0"
        }`}
      >
        {children}
      </main>
      {!isMinimal && <Footer />}
      {!isMinimal && <BottomNav />}
    </>
  );
}
