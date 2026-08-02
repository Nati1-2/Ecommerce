"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Home, Copy, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error("Account page error:", error);
  }, [error]);

  const errorMessage = error?.message || "Unknown error";
  const errorStack = error?.stack?.split("\n").slice(0, 5).join("\n") || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(`${errorMessage}\n\n${errorStack}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
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

        {/* Show error details for debugging */}
        <div className="text-left bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Error Details</span>
            <button
              onClick={handleCopy}
              className="text-[10px] font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1"
            >
              {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs font-mono text-red-600 break-all">{errorMessage}</p>
          {errorStack && (
            <pre className="text-[10px] font-mono text-gray-500 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
              {errorStack}
            </pre>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              // Clear any stale auth state before retrying
              if (typeof window !== "undefined") {
                try {
                  const authData = localStorage.getItem("auth-storage");
                  if (authData) {
                    const parsed = JSON.parse(authData);
                    if (!parsed?.state?.user?.email) {
                      localStorage.removeItem("auth-storage");
                      localStorage.removeItem("auth_token");
                    }
                  }
                } catch {}
              }
              reset();
            }}
            className="py-2.5 px-5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>

          <Link
            href="/login"
            className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
