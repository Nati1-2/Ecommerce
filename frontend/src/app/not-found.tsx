import Link from "next/link";
import { Search, Home, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="relative inline-block">
          <span className="text-8xl sm:text-9xl font-black text-gray-100 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              Page Not Found
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          The page or product you requested cannot be found. It may have been
          moved, deleted, or never existed.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007BFF] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-bold shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Products
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-bold shadow-sm transition-all"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
        </div>
      </div>
    </div>
  );
}

