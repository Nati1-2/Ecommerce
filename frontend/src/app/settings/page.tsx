import { Metadata } from "next";
import SettingsPage from "@/components/Settings/SettingsPage";

export const metadata: Metadata = {
  title: "Account Settings | Ecommerce",
  description: "Manage your account preferences, security, and notifications.",
};

export default function Page() {
  return <SettingsPage />;
}
