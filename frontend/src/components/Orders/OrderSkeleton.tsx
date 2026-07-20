"use client";

export default function OrderSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-gray-150 rounded-3xl bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <div className="flex gap-6">
              <div className="space-y-2">
                <div className="h-2.5 w-16 bg-gray-250 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-2.5 w-16 bg-gray-250 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>

          {/* Product Items */}
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-48 bg-gray-200 rounded" />
                <div className="h-2 w-32 bg-gray-100 rounded" />
              </div>
              <div className="h-4 w-12 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-50 flex justify-between items-center">
            <div className="h-3.5 w-24 bg-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-gray-100 rounded-lg" />
              <div className="h-8 w-24 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
