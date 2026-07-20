"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/orderStore";
import { fetchOrders } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import OrderHeader from "@/components/Orders/OrderHeader";
import OrderStats from "@/components/Orders/OrderStats";
import OrderSearch from "@/components/Orders/OrderSearch";
import OrderFilters from "@/components/Orders/OrderFilters";
import OrderCard from "@/components/Orders/OrderCard";
import OrderSkeleton from "@/components/Orders/OrderSkeleton";
import { ShoppingBag, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

function OrdersContent() {
  const router = useRouter();
  const { filters, orders, setOrders } = useOrderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch initial orders list using React Query
  const { isLoading, error, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const data = await fetchOrders();
      setOrders(data);
      return data;
    },
  });

  const handleLogout = () => {
    router.push("/");
  };

  // Helper date parsing math
  const parseDate = (dateStr: string) => {
    return new Date(dateStr).getTime();
  };

  // 1. Filter and sort logic mapping UI interactions
  const getFilteredOrders = () => {
    let list = [...orders];

    // Status filter
    if (filters.status !== "All") {
      list = list.filter((o) => o.status === filters.status);
    }

    // Query filter (Order ID, product name)
    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((item) => item.name.toLowerCase().includes(q)) ||
          o.createdAt.toLowerCase().includes(q)
      );
    }

    // Date filter
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    const oneYear = 365 * 24 * 60 * 60 * 1000;

    if (filters.date === "Last 30 days") {
      list = list.filter((o) => now - parseDate(o.createdAt) <= thirtyDays);
    } else if (filters.date === "Last 3 months") {
      list = list.filter((o) => now - parseDate(o.createdAt) <= ninetyDays);
    } else if (filters.date === "Last year") {
      list = list.filter((o) => now - parseDate(o.createdAt) <= oneYear);
    }

    // Sort options
    if (filters.sort === "Newest") {
      list.sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt));
    } else if (filters.sort === "Oldest") {
      list.sort((a, b) => parseDate(a.createdAt) - parseDate(b.createdAt));
    } else if (filters.sort === "Highest price") {
      list.sort((a, b) => b.total - a.total);
    } else if (filters.sort === "Lowest price") {
      list.sort((a, b) => a.total - b.total);
    }

    return list;
  };

  if (!mounted) {
    return <OrderSkeleton />;
  }

  const filtered = getFilteredOrders();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left navigation sidebar */}
        <ProfileSidebar
          activeTab="orders"
          setActiveTab={(tab) => {
            if (tab === "overview") router.push("/profile");
            else if (tab === "personal") router.push("/profile");
            else if (tab === "security") router.push("/profile");
            else if (tab === "settings") router.push("/profile");
            else if (tab === "orders") router.push("/profile/orders");
          }}
          onLogout={handleLogout}
        />

        {/* Right order content list */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          
          {/* Header */}
          <OrderHeader />

          {/* Quick stats numeric boxes */}
          <OrderStats />

          {/* Search bar and Filters */}
          <div className="space-y-4">
            <OrderSearch />
            <OrderFilters />
          </div>

          {/* Order list results */}
          {isLoading ? (
            <OrderSkeleton />
          ) : error ? (
            <div className="max-w-md mx-auto py-12 text-center select-none space-y-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-900">Unable to load orders</h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  A network connection error prevented loading your purchase histories.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="py-2.5 px-4 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center select-none space-y-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                <ShoppingBag className="w-6 h-6 stroke-[1.5px]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-gray-900">No orders found</h3>
                <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
                  We couldn't find any orders matching your selected filters. Try broadening your criteria.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 mx-auto"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrdersContent />
    </Suspense>
  );
}
