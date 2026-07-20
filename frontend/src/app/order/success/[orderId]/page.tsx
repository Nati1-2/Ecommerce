"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { fetchOrderById } from "@/lib/api";
import { Order } from "@/types";

import SuccessAnimation from "@/components/OrderSuccess/SuccessAnimation";
import OrderInfoCard from "@/components/OrderSuccess/OrderInfoCard";
import OrderSummary from "@/components/OrderSuccess/OrderSummary";
import PriceSummary from "@/components/OrderSuccess/PriceSummary";
import DeliveryInfo from "@/components/OrderSuccess/DeliveryInfo";
import OrderTimeline from "@/components/OrderSuccess/OrderTimeline";
import InvoiceButton from "@/components/OrderSuccess/InvoiceButton";
import RecommendationCarousel from "@/components/OrderSuccess/RecommendationCarousel";
import SupportCard from "@/components/OrderSuccess/SupportCard";
import OrderSkeleton from "@/components/OrderSuccess/OrderSkeleton";

interface SuccessPageProps {
  params: Promise<{ orderId: string }>;
}

function OrderSuccessContent({ params }: SuccessPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;

  // React Query fetch
  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
  });

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (isError || !order) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center select-none space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
          <ShieldCheck className="w-8 h-8 stroke-[2px]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900">Order Verification Failed</h2>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            We couldn&apos;t verify the details for order reference #{orderId}. If you just placed this order, it might take a few moments to sync.
          </p>
        </div>
        <div className="flex gap-3 max-w-xs mx-auto">
          <button
            onClick={() => refetch()}
            className="flex-1 py-3 px-4 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Check
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* 1. Header Ring Animation */}
      <SuccessAnimation />

      {/* 2. Primary layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-6">
          <OrderInfoCard
            orderId={order.id}
            date={order.createdAt}
            paymentStatus={order.paymentStatus}
            status={order.status}
            total={order.total}
          />
          <DeliveryInfo shippingAddress={order.shippingAddress} />
          <OrderTimeline status={order.status} />
          <InvoiceButton orderId={order.id} />
        </div>

        {/* Right Column (Sidebar details) */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <OrderSummary items={order.items} />
          <PriceSummary
            subtotal={order.subtotal}
            discount={order.discount}
            shipping={order.shipping}
            tax={order.tax}
            total={order.total}
          />
          <SupportCard />
        </div>
      </div>

      {/* 3. Personalized Recommendation Carousel */}
      <div className="border-t border-gray-100 pt-10">
        <RecommendationCarousel />
      </div>

      {/* 4. Support Callout details */}
      <div className="text-center py-4 border-t border-gray-100">
        <Link
          href="/"
          className="text-xs font-black text-[#007BFF] hover:underline flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage({ params }: SuccessPageProps) {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderSuccessContent params={params} />
    </Suspense>
  );
}
