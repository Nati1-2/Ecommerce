"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { reportError } from "@/lib/errorHandler";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    reportError(error, { location: "RootError" });
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-500 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            We ran into an unexpected problem. You can try refreshing the page or
            navigating back to the home page.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007BFF] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-bold shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Optional Collapsible Technical Details */}
        <div className="pt-4 border-t border-gray-100 text-left">
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="flex items-center justify-between w-full text-[11px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider cursor-pointer"
          >
            <span>Technical Details</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-700 break-all space-y-1">
              <p className="font-semibold text-red-600">{error.message || "Unknown error"}</p>
              {error.digest && <p className="text-[10px] text-gray-400">Digest: {error.digest}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

