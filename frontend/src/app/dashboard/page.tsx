"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/dashboardStore";

import DashboardSidebar, { DashboardTab } from "@/components/Dashboard/DashboardSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import StatsCard from "@/components/Dashboard/StatsCard";
import RecentOrders from "@/components/Dashboard/RecentOrders";
import OrderChart from "@/components/Dashboard/OrderChart";
import RecommendationCarousel from "@/components/Dashboard/RecommendationCarousel";
import RecentlyViewed from "@/components/Dashboard/RecentlyViewed";
import NotificationPreview from "@/components/Dashboard/NotificationPreview";
import SecurityCard from "@/components/Dashboard/SecurityCard";
import AddressPreview from "@/components/Dashboard/AddressPreview";
import DashboardSkeleton from "@/components/Dashboard/DashboardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import Link from "next/link";

function DashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    // Clear user state and redirect
    router.push("/");
  };

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center select-none space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
          <AlertCircle className="w-8 h-8 stroke-[2px]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900">Unable to load dashboard</h2>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            There was a connection issue loading your account details. Please try reloading the page.
          </p>
        </div>
        <button
          onClick={() => setError(false)}
          className="w-full max-w-xs py-3 px-5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 transition-colors mx-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left column sidebar navigation */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Right column dashboard panels content */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* Header Profile card */}
                <DashboardHeader />

                {/* Quick stats numeric row */}
                <StatsCard />

                {/* Grid Analytics and recent orders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-6">
                    <OrderChart />
                    <RecentOrders />
                  </div>

                  <div className="space-y-6">
                    <SecurityCard />
                    <AddressPreview />
                    <NotificationPreview />
                    <RecentlyViewed />
                  </div>
                </div>

                {/* Personalized suggestions product carousels */}
                <div className="border-t border-gray-100 pt-8">
                  <RecommendationCarousel />
                </div>
              </motion.div>
            )}

            {/* Other tabs conditional placeholder views */}
            {activeTab !== "profile" && (
              <motion.div
                key="other-tabs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="p-8 border border-gray-100 bg-white rounded-3xl text-center select-none space-y-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-50 text-[#007BFF] rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-gray-900 capitalize">
                    {activeTab} Management
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
                    Configure your saved details, track historical alerts, and manage payment options directly.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("profile")}
                  className="py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Return to Dashboard Overview
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
