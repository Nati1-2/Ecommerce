import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Dashboard | Aura Store",
  description:
    "Manage your profile, view order analytics charts, track logistics shipments, adjust security settings, and check custom reward points.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
