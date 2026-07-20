"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";

import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/cart";

import CheckoutSteps from "@/components/Checkout/CheckoutSteps";
import AddressSelector from "@/components/Checkout/AddressSelector";
import ShippingMethod from "@/components/Checkout/ShippingMethod";
import OrderReview from "@/components/Checkout/OrderReview";
import PriceSummary from "@/components/Checkout/PriceSummary";
import CouponBox from "@/components/Checkout/CouponBox";
import SecurityBadge from "@/components/Checkout/SecurityBadge";
import PaymentForm from "@/components/Checkout/PaymentForm";
import CheckoutSkeleton from "@/components/Checkout/CheckoutSkeleton";

const stepVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { step, setStep, selectedAddressId, shippingMethodId } =
    useCheckoutStore();
  const totalItems = useCartStore((s) => s.totalItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePaymentSuccess = () => {
    useCartStore.getState().clearCart();
    useCheckoutStore.getState().resetCheckout();
    router.push("/");
  };

  // Button labels per step
  const buttonLabels: Record<number, string> = {
    1: "Continue to Shipping",
    2: "Continue to Review",
    3: "Continue to Payment",
  };

  // Disable conditions per step
  const isDisabled: Record<number, boolean> = {
    1: !selectedAddressId,
    2: !shippingMethodId,
    3: false,
  };

  if (!mounted) {
    return (
      <div className="bg-white min-h-screen">
        <CheckoutSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* ── MINIMAL CHECKOUT NAVBAR ──────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Left: back + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => (step > 1 ? goBack() : router.back())}
              className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <Link
              href="/"
              className="text-base font-black tracking-tight text-gray-900"
            >
              Aura<span className="text-[#007BFF]">.</span>
            </Link>
          </div>

          {/* Center: secure checkout label */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
            <Lock className="w-3.5 h-3.5 text-[#007BFF]" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>

          {/* Right: help link */}
          <button className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Help</span>
          </button>
        </div>
      </header>

      {/* ── PROGRESS BAR ─────────────────────────────────────────── */}
      <div className="bg-[#F5F7FA] border-b border-gray-100">
        <CheckoutSteps currentStep={step} />
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Step content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* ── STEP 1: SHIPPING ADDRESS ─── */}
              {step === 1 && (
                <motion.div key="step-1" {...stepVariants}>
                  <AddressSelector />
                </motion.div>
              )}

              {/* ── STEP 2: DELIVERY METHOD ──── */}
              {step === 2 && (
                <motion.div key="step-2" {...stepVariants}>
                  <ShippingMethod />
                </motion.div>
              )}

              {/* ── STEP 3: ORDER REVIEW ─────── */}
              {step === 3 && (
                <motion.div key="step-3" {...stepVariants} className="space-y-6">
                  <OrderReview />
                  {/* Coupon */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Have a Coupon?
                    </h4>
                    <CouponBox />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: PAYMENT ──────────── */}
              {step === 4 && (
                <motion.div key="step-4" {...stepVariants}>
                  <PaymentForm onSuccess={handlePaymentSuccess} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Sticky sidebar */}
          <div className="lg:sticky lg:top-20 space-y-4">
            {step < 4 && (
              <>
                <PriceSummary
                  onContinue={goNext}
                  buttonLabel={buttonLabels[step]}
                  disabled={isDisabled[step]}
                />
                <SecurityBadge />
              </>
            )}

            {step === 4 && <SecurityBadge />}
          </div>
        </div>
      </div>

      {/* ── MOBILE STICKY BOTTOM BAR ─────────────────────────────── */}
      {step < 4 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40">
          <button
            onClick={goNext}
            disabled={isDisabled[step]}
            className="w-full py-3.5 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
          >
            {buttonLabels[step]}
          </button>
        </div>
      )}
    </div>
  );
}
