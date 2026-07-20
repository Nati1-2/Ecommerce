import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Profile Settings | Aura Store",
  description:
    "Manage your personal profile information, upload avatars, verify emails and phone numbers, configure two-factor authentication, and monitor login activity.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
