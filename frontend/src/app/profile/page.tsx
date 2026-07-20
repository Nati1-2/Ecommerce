"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Home, ShieldAlert, Sparkles, User } from "lucide-react";
import Link from "next/link";

import ProfileSidebar, { ProfileTab } from "@/components/Profile/ProfileSidebar";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import PersonalInfoForm from "@/components/Profile/PersonalInfoForm";
import EmailVerification from "@/components/Profile/EmailVerification";
import PhoneVerification from "@/components/Profile/PhoneVerification";
import PasswordForm from "@/components/Profile/PasswordForm";
import TwoFactorAuth from "@/components/Profile/TwoFactorAuth";
import LoginActivity from "@/components/Profile/LoginActivity";
import PrivacySettings from "@/components/Profile/PrivacySettings";
import DeleteAccount from "@/components/Profile/DeleteAccount";
import ProfileSkeleton from "@/components/Profile/ProfileSkeleton";
import { motion, AnimatePresence } from "framer-motion";

function ProfileContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    router.push("/");
  };

  if (!mounted) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest select-none">
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
          setActiveTab={setActiveTab}
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
                <EmailVerification />
                <PhoneVerification />
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

            {/* Privacy / Preferences Settings Tab */}
            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <PrivacySettings />
                <DeleteAccount />
              </motion.div>
            )}

            {/* Other tabs redirect placeholder */}
            {activeTab !== "overview" &&
              activeTab !== "personal" &&
              activeTab !== "security" &&
              activeTab !== "settings" && (
                <motion.div
                  key="placeholders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 border border-gray-100 bg-white rounded-3xl text-center select-none space-y-4 shadow-sm"
                >
                  <div className="w-12 h-12 bg-blue-50 text-[#007BFF] rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-gray-900 capitalize">
                      {activeTab} Management
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
                      Access these features directly within your core Customer Account Dashboard.
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="inline-block py-2.5 px-5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Open Customer Dashboard
                  </Link>
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
