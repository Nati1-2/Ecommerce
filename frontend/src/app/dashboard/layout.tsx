import type { Metadata } from "next";
import ForceLightMode from "@/components/shared/ForceLightMode";

export const metadata: Metadata = {
  title: "Customer Dashboard | Nati Store",
  description:
    "Manage your profile, view order analytics charts, track logistics shipments, adjust security settings, and check custom reward points.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-slate-900 light"
      data-dashboard-theme="light"
    >
      <ForceLightMode />
      {children}
    </div>
  );
}
