import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Nati Store",
  description:
    "Manage your personal profile information, upload avatars, verify emails and phone numbers, configure two-factor authentication, and monitor login activity.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
