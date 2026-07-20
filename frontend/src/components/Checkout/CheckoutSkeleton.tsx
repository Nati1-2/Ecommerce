"use client";

export default function CheckoutSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Steps skeleton */}
      <div className="flex items-center justify-between max-w-xl mx-auto py-6 px-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 bg-gray-200 rounded-full" />
            <div className="w-12 h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address card skeletons */}
          <div className="space-y-3">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 rounded-3xl border border-gray-100 space-y-3">
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-3/4 bg-gray-100 rounded" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Order items skeleton */}
          <div className="space-y-3">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 bg-gray-200 rounded" />
                  <div className="h-2 w-16 bg-gray-100 rounded" />
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl border border-gray-100 space-y-4">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            ))}
            <div className="h-10 w-full bg-gray-200 rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
