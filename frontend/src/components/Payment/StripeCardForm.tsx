"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { usePaymentStore } from "@/store/paymentStore";
import { useAuthStore } from "@/store/auth";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

// Custom premium styling rules for Stripe fields
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "13px",
      color: "#111827",
      fontFamily: "Inter, sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#9CA3AF",
        fontWeight: "500",
      },
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
};

interface StripeCardFormProps {
  orderId: string;
  amount: number;
  onSuccess: (transactionId: string) => void;
  onFailure: (errorMessage: string) => void;
}

export default function StripeCardForm({
  orderId,
  amount,
  onSuccess,
  onFailure,
}: StripeCardFormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { paymentStatus, setPaymentStatus, billingAddress } = usePaymentStore();
  const { accessToken, isAuthenticated } = useAuthStore();

  const [cardError, setCardError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getActiveToken = (): string => {
    if (accessToken) return accessToken;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth_token");
      if (stored && stored !== "undefined" && stored !== "null") return stored;
      const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
      if (match && match[1]) return decodeURIComponent(match[1]);
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const token = getActiveToken();
    if (!token && !isAuthenticated) {
      setCardError("Authentication required. Please log in to complete checkout.");
      router.push(`/login?redirect=/checkout`);
      return;
    }

    setLoading(true);
    setCardError(null);
    setPaymentStatus("processing");

    try {
      // 1. Create a real Stripe PaymentIntent via production API route
      const response = await axios.post("/api/payments/create-intent", {
        orderId,
        amount,
        billingAddress,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const clientSecret = response.data?.clientSecret;
      if (!clientSecret) {
        throw new Error(response.data?.error || "Failed to retrieve secure Stripe client secret");
      }

      // 2. Real Stripe payment confirmation via Stripe Elements
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("Card inputs not found");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement as any,
          billing_details: {
            name: billingAddress.name || "Customer",
            address: {
              line1: billingAddress.address || "123 Main St",
              city: billingAddress.city || "San Francisco",
              postal_code: billingAddress.postalCode || "94105",
              country: billingAddress.country === "United States" ? "US" : "CA",
            },
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Stripe transaction failed");
      }

      if (result.paymentIntent?.status === "succeeded") {
        // 3. Confirm with backend to immediately update Order in DB to PAID
        try {
          await axios.post("/api/payments/confirm", {
            orderId,
            paymentIntentId: result.paymentIntent.id,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (confirmErr: any) {
          console.warn("Notice: payment confirmation sync warning:", confirmErr?.message);
        }

        setPaymentStatus("success");
        onSuccess(result.paymentIntent.id);
      } else {
        throw new Error(`Unexpected payment status from Stripe: ${result.paymentIntent?.status}`);
      }
    } catch (error: any) {
      setPaymentStatus("failed");
      const msg = error.response?.data?.error || error.message || "Payment declined or connectivity issue.";
      setCardError(msg);
      onFailure(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 select-none">
      <div className="space-y-4 p-5 rounded-2xl border border-gray-100 bg-[#F5F7FA]/50">
        {/* Test Mode Helper */}
        <div className="flex items-center justify-between text-[11px] bg-blue-50/70 border border-blue-100 text-blue-700 px-3 py-2 rounded-xl">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Stripe Test Card:
          </span>
          <span className="font-mono font-bold tracking-wider">4242 4242 4242 4242</span>
        </div>

        {/* Card Number Input */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Card Number
          </label>
          <div
            className={cn(
              "px-4 py-3 bg-white border rounded-xl transition-all",
              focusedField === "cardNumber"
                ? "border-[#007BFF] ring-2 ring-[#007BFF]/10"
                : "border-gray-200"
            )}
          >
            <CardNumberElement
              options={CARD_ELEMENT_OPTIONS}
              onFocus={() => setFocusedField("cardNumber")}
              onBlur={() => setFocusedField(null)}
              onChange={(e: any) => e.error && setCardError(e.error.message)}
            />
          </div>
        </div>

        {/* Expiry and CVC fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              Expiration Date
            </label>
            <div
              className={cn(
                "px-4 py-3 bg-white border rounded-xl transition-all",
                focusedField === "cardExpiry"
                  ? "border-[#007BFF] ring-2 ring-[#007BFF]/10"
                  : "border-gray-200"
              )}
            >
              <CardExpiryElement
                options={CARD_ELEMENT_OPTIONS}
                onFocus={() => setFocusedField("cardExpiry")}
                onBlur={() => setFocusedField(null)}
                onChange={(e: any) => e.error && setCardError(e.error.message)}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              Security Code (CVC)
            </label>
            <div
              className={cn(
                "px-4 py-3 bg-white border rounded-xl transition-all",
                focusedField === "cardCvc"
                  ? "border-[#007BFF] ring-2 ring-[#007BFF]/10"
                  : "border-gray-200"
              )}
            >
              <CardCvcElement
                options={CARD_ELEMENT_OPTIONS}
                onFocus={() => setFocusedField("cardCvc")}
                onBlur={() => setFocusedField(null)}
                onChange={(e: any) => e.error && setCardError(e.error.message)}
              />
            </div>
          </div>
        </div>
      </div>

      {cardError && (
        <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50/50 p-3.5 rounded-xl border border-red-100">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{cardError}</span>
        </div>
      )}

      {/* Pay now CTA */}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full py-4 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay Securely ${amount.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
}
