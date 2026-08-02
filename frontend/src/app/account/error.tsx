"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Account page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900">
            Something went wrong
          </h2>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            We encountered an error loading your account. This may be a
            temporary issue — please try again.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="py-2.5 px-5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>

          <Link
            href="/"
            className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
