import type { Metadata } from "next";
import ForceLightMode from "@/components/shared/ForceLightMode";

export const metadata: Metadata = {
  title: "Account Profile Settings | Nati Store",
  description:
    "Manage your personal profile information, upload avatars, verify emails and phone numbers, configure two-factor authentication, and monitor login activity.",
};

export default function ProfileLayout({
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
