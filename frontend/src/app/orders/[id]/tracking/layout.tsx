import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real-time Package Tracking | Aura Store",
  description:
    "Track your package delivery milestones in real-time. Follow live distribution transfers, arrival windows, and dispatch alerts.",
};

export default function OrderTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
