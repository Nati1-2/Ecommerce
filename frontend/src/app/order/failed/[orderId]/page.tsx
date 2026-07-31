"use client";

import { use } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft, ShieldAlert } from "lucide-react";
import { paymentApi } from "@/services/api/paymentApi";
import { useState, useEffect } from "react";

interface FailedPageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderFailedPage({ params }: FailedPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const [loading, setLoading] = useState(false);
  const [orderAmount, setOrderAmount] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { orderApi } = await import("@/services/api/orderApi");
        const res = await orderApi.getOrder(orderId);
        if (res.data?.totalAmount) {
          setOrderAmount(res.data.totalAmount);
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleRetryPayment = async () => {
    setLoading(true);
    try {
      const res = await paymentApi.createCheckoutSession({
        orderId,
        amount: orderAmount > 0 ? orderAmount : 149.99, // Fallback just in case
        currency: "USD",
        successUrl: `${window.location.origin}/order/success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/order/failed/${orderId}`
      });

      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        window.location.href = `/checkout`;
      }
    } catch (err) {
      window.location.href = `/checkout`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 stroke-[2.5px]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Payment Unsuccessful</h2>
          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            Your payment for order reference <span className="font-bold text-gray-900">#{orderId}</span> was declined or cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left flex items-start gap-3 text-amber-800">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="text-[11px] font-semibold space-y-1">
            <p className="font-bold text-amber-900">Common Reasons:</p>
            <ul className="list-disc pl-3 space-y-0.5 text-amber-700">
              <li>Card limits or insufficient funds</li>
              <li>Incorrect billing info or 3D Secure timeout</li>
              <li>Payment window expired on Stripe</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleRetryPayment}
            disabled={loading}
            className="w-full py-3.5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Re-connecting to Stripe..." : "Retry Payment with Stripe"}
          </button>

          <Link
            href="/checkout"
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all block"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
