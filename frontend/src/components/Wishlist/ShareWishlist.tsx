"use client";

import { useState } from "react";
import { Share2, Copy, Check, Mail } from "lucide-react";

export default function ShareWishlist() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 border border-gray-150 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <div className="flex items-center gap-2.5 text-gray-900">
        <Share2 className="w-5 h-5 text-[#007BFF]" />
        <h3 className="text-sm font-black text-gray-900">Share Wishlist</h3>
      </div>

      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed text-left">
        Share your curated list of favorites with friends and family for gifts or design setups suggestions.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        {/* Copy trigger */}
        <button
          onClick={handleCopy}
          className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-450" />}
          <span>{copied ? "Copied Link" : "Copy Wishlist Link"}</span>
        </button>

        {/* Social Mock items */}
        <div className="flex items-center justify-center gap-1.5 shrink-0">
          <button className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100/50 rounded-xl transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </button>
          <button className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-100/50 rounded-xl transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
