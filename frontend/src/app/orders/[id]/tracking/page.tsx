"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Home, RefreshCw, Star, AlertTriangle, Compass } from "lucide-react";
import Link from "next/link";
import { io } from "socket.io-client";

import { fetchTrackingById } from "@/lib/api";
import { useTrackingStore } from "@/store/trackingStore";
import { Tracking } from "@/types";

import OrderHeader from "@/components/Tracking/OrderHeader";
import TrackingTimeline from "@/components/Tracking/TrackingTimeline";
import LiveStatusCard from "@/components/Tracking/LiveStatusCard";
import DeliveryMap from "@/components/Tracking/DeliveryMap";
import ShippingDetails from "@/components/Tracking/ShippingDetails";
import OrderProductCard from "@/components/Tracking/OrderProductCard";
import NotificationHistory from "@/components/Tracking/NotificationHistory";
import TrackingActions from "@/components/Tracking/TrackingActions";
import TrackingSkeleton from "@/components/Tracking/TrackingSkeleton";

interface TrackingPageProps {
  params: Promise<{ id: string }>;
}

function TrackingContent({ params }: TrackingPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const { setTrackingData, updateStatus, resetStore } = useTrackingStore();
  const [mounted, setMounted] = useState(false);
  const [socketStatus, setSocketStatus] = useState<string>("");

  // Query database logistics info
  const {
    data: tracking,
    isLoading,
    isError,
    refetch,
  } = useQuery<Tracking>({
    queryKey: ["tracking", orderId],
    queryFn: () => fetchTrackingById(orderId),
  });

  // Sync state data on success query load
  useEffect(() => {
    if (tracking) {
      setTrackingData(tracking);
    }
  }, [tracking, setTrackingData]);

  useEffect(() => {
    setMounted(true);

    // Initialize Socket.IO Client
    const socket = io("http://localhost:3000", {
      autoConnect: false,
      reconnectionAttempts: 2,
    });

    socket.connect();

    socket.on("connect", () => {
      setSocketStatus("Connected to logistics stream");
    });

    socket.on("connect_error", () => {
      setSocketStatus("Logistics gateway unavailable. Sandbox simulation running.");
    });

    // Listen to real-time order update event payload
    socket.on("ORDER_STATUS_UPDATED", (data: { orderId: string; status: string; timestamp: string; location: string; description: string }) => {
      if (data.orderId === orderId) {
        updateStatus(data.status, data.location, data.timestamp, data.description);
      }
    });

    // Sandbox Simulation Loop: status shifts every 15s to demonstrate UI transitions in standard showcase environment
    let simIndex = 0;
    const simSteps = [
      { status: "Out for Delivery", location: "Paris Distribution Center", time: "10:30 AM", desc: "Package is with the courier for local delivery." },
      { status: "Delivered", location: "Resident Front Door", time: "11:15 AM", desc: "Package dropped off. Signed by recipient." },
    ];

    const simTimer = setInterval(() => {
      if (simIndex < simSteps.length) {
        const step = simSteps[simIndex];
        updateStatus(step.status, step.location, step.time, step.desc);
        simIndex++;
      }
    }, 15000);

    return () => {
      socket.disconnect();
      clearInterval(simTimer);
      resetStore();
    };
  }, [orderId, updateStatus, resetStore]);

  if (isLoading || !mounted) {
    return <TrackingSkeleton />;
  }

  if (isError || !tracking) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center select-none space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100 animate-bounce">
          <AlertTriangle className="w-8 h-8 stroke-[2px]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900">Tracking Unavailable</h2>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            We couldn&apos;t load shipment history for order reference #{orderId}. If you just completed payment, shipment logistics might take a few moments to initialize.
          </p>
        </div>
        <div className="flex gap-3 max-w-xs mx-auto">
          <button
            onClick={() => refetch()}
            className="flex-1 py-3 px-4 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Query
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* ── BREADCRUMBS ─────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest select-none">
        <Link href="/" className="hover:text-gray-900 flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-500">Logistics Tracking</span>
      </nav>

      {/* Socket integration warning/info banner */}
      <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-4 text-[10px] font-bold text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          Logistics Status: {socketStatus || "Initializing courier updates stream..."}
        </span>
        <span className="text-gray-300 hidden sm:inline">Stripe + Socket.IO + Redis + RabbitMQ Channel</span>
      </div>

      {/* ── TWO COLUMN PRIMARY LAYOUT ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left main: LiveStatus, timeline, map */}
        <div className="lg:col-span-2 space-y-6">
          <LiveStatusCard />
          <TrackingTimeline />
          <DeliveryMap />
        </div>

        {/* Right sidebar details */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <OrderHeader orderId={orderId} placedDate="July 15, 2026" />
          <ShippingDetails trackingNumber="TRK123456789" carrier="DHL" />
          <NotificationHistory />
          <OrderProductCard />
          <TrackingActions />
        </div>
      </div>
    </div>
  );
}

export default function TrackingPage({ params }: TrackingPageProps) {
  return (
    <Suspense fallback={<TrackingSkeleton />}>
      <TrackingContent params={params} />
    </Suspense>
  );
}
