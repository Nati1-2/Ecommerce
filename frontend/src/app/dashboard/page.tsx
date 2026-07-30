"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/dashboardStore";
import { useWishlistStore } from "@/store/wishlist";

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
import { useAuthStore } from "@/store/auth";

function DashboardContent() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, accessToken, logout, setAuth } = useAuthStore();
  const { updateProfile } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [mounted, setMounted] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);

    const token = accessToken || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

    if (!isAuthenticated && !token) {
      router.push("/login");
      return;
    }

    // Sync wishlist count from wishlist store
    try {
      const wishlistCount = useWishlistStore.getState().items.length;
      useDashboardStore.setState({ wishlistCount });
    } catch (e) {
      console.warn("Wishlist count sync failed:", e);
    }

    // If user has a valid JWT token (not a demo-jwt token), fetch real profile from backend
    if (token && !token.startsWith("demo-jwt-token-")) {
      fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data.user) {
            // Update dashboard store with real backend user data
            updateProfile({
              id: data.user.id,
              name: data.user.name || data.user.email.split("@")[0],
              email: data.user.email,
              avatar: data.user.avatar || "",
              membership: data.user.membership || "Standard Member ⭐",
              points: data.user.points ?? 0,
            });

            useDashboardStore.setState({
              reviewsCount: data.user.reviewsCount ?? 0
            });

            // Also sync auth store
            setAuth(
              {
                id: data.user.id,
                email: data.user.email,
                role: data.user.role,
                name: data.user.name,
              } as any,
              token
            );

            // Fetch orders for dashboard
            fetch(`/api/orders?userId=${data.user.id}`)
              .then((res) => res.json())
              .then((ordersData) => {
                if (Array.isArray(ordersData)) {
                  const mappedOrders = ordersData.map((o: any) => ({
                    id: o.orderId || o._id,
                    status: o.status || "Processing",
                    amount: o.pricing?.total || o.totalAmount || o.amount || 0,
                    date: new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    itemsCount: o.items?.length || 1,
                  }));
                  useDashboardStore.setState({ orders: mappedOrders });
                }
              })
              .catch((err) => console.warn("Dashboard orders fetch failed:", err));

            setProfileLoaded(true);
          }
        })
        .catch((err) => {
          console.warn("Profile load failed:", err.message);
          // Fallback: use auth store data if backend fails
          if (authUser) {
            updateProfile({
              id: authUser.id,
              name: (authUser as any).name || authUser.email?.split("@")[0] || "User",
              email: authUser.email,
              avatar: "",
              membership: "Standard Member ⭐",
              points: 0,
            });
          }
          setProfileLoaded(true);
        });
    } else if (authUser) {
      // Demo session or already have user in store — use it
      updateProfile({
        id: authUser.id,
        name: (authUser as any).name || authUser.email?.split("@")[0] || "User",
        email: authUser.email,
        avatar: "",
        membership: "Standard Member ⭐",
        points: 0,
      });
      setProfileLoaded(true);
    } else {
      setProfileLoaded(true);
    }
  }, []); // Only run once on mount

  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    router.push("/login");
  };

  if (!mounted || !profileLoaded) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar navigation */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Main content */}
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
                <DashboardHeader onEditProfile={() => setActiveTab("settings")} />
                <StatsCard />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-6">
                    <OrderChart />
                    <RecentOrders onViewAll={() => setActiveTab("orders")} />
                  </div>

                  <div className="space-y-6">
                    <SecurityCard onManage={() => setActiveTab("settings")} />
                    <AddressPreview onManage={() => setActiveTab("addresses")} />
                    <NotificationPreview />
                    <RecentlyViewed />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <RecommendationCarousel />
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm">
                  <h2 className="text-base font-black text-gray-900 mb-4">My Orders</h2>
                  <RecentOrders onViewAll={undefined} />
                </div>
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div
                key="addresses-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm">
                  <h2 className="text-base font-black text-gray-900 mb-4">Delivery Addresses</h2>
                  <AddressPreview onManage={undefined} />
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm">
                  <h2 className="text-base font-black text-gray-900 mb-4">Security Settings</h2>
                  <SecurityCard onManage={undefined} />
                </div>
              </motion.div>
            )}

            {!["profile", "orders", "addresses", "settings"].includes(activeTab) && (
              <motion.div
                key="other-tabs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="p-10 border border-gray-100 bg-white rounded-3xl text-center select-none space-y-4 shadow-sm"
              >
                <div className="w-14 h-14 bg-blue-50 text-[#007BFF] rounded-2xl flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-gray-900 capitalize">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
                    This section is coming soon. Your data will appear here shortly.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("profile")}
                  className="py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  ← Back to Dashboard
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
