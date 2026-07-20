"use client";

import { Truck, RotateCcw, ShieldCheck, Award } from "lucide-react";

export default function DeliveryCard() {
  const deliveryFeatures = [
    {
      icon: Truck,
      title: "Free Delivery",
      desc: "Free express delivery on all orders over $50"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      desc: "30-day hassle-free return and refund policy"
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      desc: "SSL encrypted checkout and payment processing"
    },
    {
      icon: Award,
      title: "Warranty Included",
      desc: "Full 1-year official manufacturer warranty"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
      {deliveryFeatures.map((item, idx) => (
        <div key={idx} className="flex gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-[#007BFF]">
            <item.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-900">{item.title}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
