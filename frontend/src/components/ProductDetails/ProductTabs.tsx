"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TabSpec {
  label: string;
  value: string;
}

interface ProductTabsProps {
  description: string;
  specs?: TabSpec[];
  shippingInfo?: string;
  reviewsCount?: number;
  reviewsContent: React.ReactNode;
}

export default function ProductTabs({
  description,
  specs = [],
  shippingInfo = "Standard delivery ships within 2-3 business days. International shipping takes 7-14 business days.",
  reviewsCount = 0,
  reviewsContent,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const defaultSpecs: TabSpec[] = specs.length > 0 ? specs : [
    { label: "Connectivity", value: "Wi-Fi 6E, Bluetooth 5.3, NFC" },
    { label: "In the Box", value: "Product, USB Charging Cable, Quick Start Guide" },
    { label: "Dimensions", value: "147.5 x 71.5 x 7.85 mm" },
    { label: "Weight", value: "206 grams" }
  ];

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "shipping", label: "Shipping" },
    { id: "reviews", label: `Reviews (${reviewsCount})` }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs list navigation header */}
      <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-3 text-sm font-bold border-b-2 transition-all relative",
                activeTab === tab.id
                  ? "border-[#007BFF] text-[#007BFF]"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panel body content */}
      <div className="min-h-[160px] text-gray-600 text-sm leading-relaxed">
        {activeTab === "description" && (
          <div className="space-y-4 animate-fadeIn">
            <p>{description}</p>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="space-y-3 animate-fadeIn max-w-xl">
            {defaultSpecs.map((item) => (
              <div key={item.label} className="grid grid-cols-3 py-2.5 border-b border-gray-50">
                <span className="font-bold text-gray-900 col-span-1">{item.label}</span>
                <span className="text-gray-500 col-span-2 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-4 animate-fadeIn">
            <p>{shippingInfo}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="animate-fadeIn">
            {reviewsContent}
          </div>
        )}
      </div>
    </div>
  );
}
