"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Home, User, ShoppingBag, Heart, LogOut } from "lucide-react";
import Link from "next/link";

import ProfileSidebar, { ProfileTab } from "@/components/Profile/ProfileSidebar";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import PersonalInfoForm from "@/components/Profile/PersonalInfoForm";
import PasswordForm from "@/components/Profile/PasswordForm";
import TwoFactorAuth from "@/components/Profile/TwoFactorAuth";
import LoginActivity from "@/components/Profile/LoginActivity";
import PrivacySettings from "@/components/Profile/PrivacySettings";
import DeleteAccount from "@/components/Profile/DeleteAccount";
import ProfileSkeleton from "@/components/Profile/ProfileSkeleton";

import DashboardPayments from "@/components/Dashboard/DashboardPayments";
import DashboardAddresses from "@/components/Dashboard/DashboardAddresses";
import DashboardWishlist from "@/components/Dashboard/DashboardWishlist";
import DashboardNotifications from "@/components/Dashboard/DashboardNotifications";
import DashboardSettings from "@/components/Dashboard/DashboardSettings";
import DashboardReviews from "@/components/Dashboard/DashboardReviews";
import RecentOrders from "@/components/Dashboard/RecentOrders";

import { useAuthStore } from "@/store/auth";
import { motion, AnimatePresence } from "framer-motion";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get("tab") as ProfileTab | null;

  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>(tabQuery || "overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (tabQuery) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!mounted || !isAuthenticated) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <Link href="/" className="hover:text-gray-900 flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-500">Account Profile</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left column navigation sidebar */}
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            router.push(`/profile?tab=${tab}`);
          }}
          onLogout={handleLogout}
        />

        {/* Right column settings panels */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            
            {/* Overview / Personal Info Tab */}
            {activeTab === "overview" && (
              <motion.div
                key="overview-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <ProfileHeader />
                <PersonalInfoForm />
              </motion.div>
            )}

            {activeTab === "personal" && (
              <motion.div
                key="personal-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <PersonalInfoForm />
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <motion.div
                key="security-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <PasswordForm />
                <TwoFactorAuth />
                <LoginActivity />
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div
                key="addresses-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DashboardAddresses />
              </motion.div>
            )}

            {activeTab === "payments" && (
              <motion.div
                key="payments-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DashboardPayments />
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <RecentOrders onViewAll={undefined} />
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div
                key="wishlist-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DashboardWishlist />
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DashboardNotifications />
              </motion.div>
            )}

            {/* Privacy / Preferences Settings Tab */}
            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <DashboardSettings />
                <PrivacySettings />
                <DeleteAccount />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
