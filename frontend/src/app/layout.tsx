import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura — Premium E-Commerce | Shop Everything You Love",
  description:
    "Discover 50,000+ premium products from top brands. Fast delivery, secure payments, and easy returns. Shop electronics, fashion, gaming, beauty, and more.",
  keywords: ["ecommerce", "online shopping", "premium products", "electronics", "fashion"],
  openGraph: {
    title: "Aura — Premium E-Commerce",
    description: "Discover premium products with fast delivery and secure payment.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col bg-white text-gray-900`}
      >
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}

