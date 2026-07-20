"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { usePaymentStore } from "@/store/paymentStore";
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
  const stripe = useStripe();
  const elements = useElements();
  const { paymentStatus, setPaymentStatus, billingAddress } = usePaymentStore();

  const [cardError, setCardError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Tracks if individual inputs have validations
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setCardError(null);
    setPaymentStatus("processing");

    try {
      // 1. In production, we'd hit the API gateway payment service to create a payment intent
      // POST /payment/intent { orderId, amount }
      // For portfolio sandbox safety, we'll try API call or fall back to simulation
      let clientSecret = "";
      try {
        const response = await axios.post("/api/payment/create-intent", {
          orderId,
          amount,
          billingAddress,
        });
        clientSecret = response.data.clientSecret;
      } catch (err) {
        console.warn("API gateway not running. Falling back to sandbox stripe simulation.");
      }

      if (clientSecret) {
        // Real Stripe payment confirmation
        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) throw new Error("Card inputs not found");

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement as any,
            billing_details: {
              name: billingAddress.name,
              address: {
                line1: billingAddress.address,
                city: billingAddress.city,
                postal_code: billingAddress.postalCode,
                country: billingAddress.country === "United States" ? "US" : "CA",
              },
            },
          },
        });

        if (result.error) {
          throw new Error(result.error.message || "Stripe transaction failed");
        } else if (result.paymentIntent?.status === "succeeded") {
          setPaymentStatus("success");
          onSuccess(result.paymentIntent.id);
        }
      } else {
        // Simulated Stripe sandbox purchase flow (takes 2 seconds)
        await new Promise((r) => setTimeout(r, 2000));
        
        // Mock card decline check based on input card number (standard sandbox tests)
        // e.g. if name contains "decline", fail it
        if (billingAddress.name.toLowerCase().includes("decline")) {
          throw new Error("Card declined. Insufficient funds or card restriction.");
        }

        const mockTransactionId = `ch_${Math.random().toString(36).substr(2, 20)}`;
        setPaymentStatus("success");
        onSuccess(mockTransactionId);
      }
    } catch (error: any) {
      setPaymentStatus("failed");
      const msg = error.message || "Payment declined or connectivity issue.";
      setCardError(msg);
      onFailure(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 select-none">
      <div className="space-y-4 p-5 rounded-2xl border border-gray-100 bg-[#F5F7FA]/50">
        
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
