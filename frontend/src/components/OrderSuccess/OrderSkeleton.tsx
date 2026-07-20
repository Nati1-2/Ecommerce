"use client";

export default function OrderSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-8">
      {/* Animation placeholder */}
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="w-20 h-20 rounded-full bg-gray-100" />
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-72 bg-gray-100 rounded" />
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border border-gray-100 bg-white rounded-3xl space-y-4 shadow-sm">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-50 rounded-2xl border border-gray-100" />
              ))}
            </div>
          </div>

          <div className="p-6 border border-gray-100 bg-white rounded-3xl space-y-4 shadow-sm">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-50 rounded-2xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border border-gray-100 bg-white rounded-3xl space-y-4 shadow-sm">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                  <div className="h-3 w-12 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="h-32 bg-gray-100 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
