"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, ShoppingBag, Home } from "lucide-react";
import Link from "next/link";
import { reportError } from "@/lib/errorHandler";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { location: "ProductsRouteError" });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto text-amber-500 shadow-sm">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-gray-900">
            Unable to load products
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            We encountered an issue fetching product information. This could be due to
            a temporary network issue.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007BFF] hover:bg-blue-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload Catalog
          </button>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 text-xs font-bold shadow-sm transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            All Products
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 text-xs font-bold shadow-sm transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

