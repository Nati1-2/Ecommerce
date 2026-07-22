"use client";

import dynamic from "next/dynamic";
import { use, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, HelpCircle, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

import { usePaymentStore } from "@/store/paymentStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/cart";
import { SHIPPING_OPTIONS } from "@/components/Checkout/ShippingMethod";

import CheckoutSteps from "@/components/Payment/CheckoutSteps";
import OrderSummary from "@/components/Payment/OrderSummary";
import PaymentSecurity from "@/components/Payment/PaymentSecurity";
import PaymentSkeleton from "@/components/Payment/PaymentSkeleton";

const PaymentForm = dynamic(() => import("@/components/Payment/PaymentForm"), {
  ssr: false,
  loading: () => <PaymentSkeleton />,
});
const PaymentSuccess = dynamic(() => import("@/components/Payment/PaymentSuccess"), {
  ssr: false,
});
const PaymentError = dynamic(() => import("@/components/Payment/PaymentError"), {
  ssr: false,
});

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const {
    paymentStatus,
    setPaymentStatus,
    transactionId,
    setTransactionId,
    error,
    setError,
    resetPaymentState,
  } = usePaymentStore();

  const { shippingMethodId, discountAmount } = useCheckoutStore();
  const cartItems = useCartStore((s) => s.items);

  const [mounted, setMounted] = useState(false);
  const [socketStatus, setSocketStatus] = useState<string>("");

  // Compute amount
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingCost = SHIPPING_OPTIONS.find((o) => o.id === shippingMethodId)?.price ?? 0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost + tax);

  useEffect(() => {
    setMounted(true);
    resetPaymentState();

    // Socket.IO integration setup dynamically loaded
    let socket: any;
    import("socket.io-client").then(({ io }) => {
      socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8009", {
        autoConnect: false,
        reconnectionAttempts: 2,
      });

      socket.connect();

      socket.on("connect", () => {
        setSocketStatus("Connected to payment channel");
      });

      socket.on("payment_status", (data: { status: string; message: string }) => {
        setSocketStatus(data.message);
        if (data.status === "succeeded") {
          setPaymentStatus("success");
        }
      });
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [resetPaymentState, setPaymentStatus]);

  // Handle successful transaction
  const handlePaymentSuccess = (txId: string) => {
    setTransactionId(txId);
    setPaymentStatus("success");

    // Clear cart upon successful transaction
    useCartStore.getState().clearCart();
  };

  // Handle transaction failure
  const handlePaymentFailure = (errorMessage: string) => {
    setError(errorMessage);
    setPaymentStatus("failed");
  };

  if (!mounted) {
    return <PaymentSkeleton />;
  }

  // Handle success render state
  if (paymentStatus === "success" && transactionId) {
    return (
      <div className="bg-white min-h-screen py-12">
        <PaymentSuccess
          orderId={orderId}
          transactionId={transactionId}
          amount={totalAmount}
        />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* ── SECURE MINIMAL PAYMENT NAVBAR ─────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 select-none">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-base font-black tracking-tight text-gray-900"
            >
              Aura<span className="text-[#007BFF]">.</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>🔒 Secure Checkout</span>
          </div>

          <button className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Support</span>
          </button>
        </div>
      </header>

      {/* ── STEP PROGRESS INDICATOR ───────────────────────────────── */}
      <div className="bg-[#F5F7FA] border-b border-gray-100">
        <CheckoutSteps currentStep={paymentStatus === "success" ? "complete" : "payment"} />
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {paymentStatus === "failed" ? (
          <PaymentError
            error={error}
            onRetry={() => setPaymentStatus("idle")}
            onChangeMethod={() => setPaymentStatus("idle")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Form and inputs */}
            <div className="lg:col-span-2 space-y-6">
              {paymentStatus === "processing" && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center gap-3 text-xs font-semibold text-blue-700 animate-pulse">
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>
                    {socketStatus || "Verifying secure payment credentials with Stripe network..."}
                  </span>
                </div>
              )}

              <PaymentForm
                orderId={orderId}
                amount={totalAmount}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
              />
            </div>

            {/* Right Column: Sidebar summaries */}
            <div className="lg:sticky lg:top-20 space-y-6">
              <OrderSummary />
              <PaymentSecurity />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentSkeleton />}>
      <PaymentContent />
    </Suspense>
  );
}
