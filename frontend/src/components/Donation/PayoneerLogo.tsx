"use client";

import React from "react";

export default function PayoneerLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
      {/* Payoneer Iconic Multi-Color Ring Circle */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 shrink-0"
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="url(#payoneerGradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="payoneerGradient"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF4800" />
            <stop offset="0.33" stopColor="#FF1844" />
            <stop offset="0.66" stopColor="#9E0059" />
            <stop offset="1" stopColor="#550066" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-black text-slate-900 tracking-tight text-sm">
        Payoneer
      </span>
    </div>
  );
}
