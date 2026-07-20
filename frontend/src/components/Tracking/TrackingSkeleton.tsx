"use client";

export default function TrackingSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8 select-none">
      {/* Header skeleton */}
      <div className="p-6 border border-gray-100 bg-white rounded-3xl space-y-4 shadow-sm">
        <div className="h-3 w-32 bg-gray-200 rounded" />
        <div className="h-6 w-56 bg-gray-200 rounded mt-1" />
        <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
          <div className="h-8 bg-gray-50 rounded-xl" />
          <div className="h-8 bg-gray-50 rounded-xl" />
        </div>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-20 bg-gray-100 rounded-3xl" />
          <div className="p-6 border border-gray-100 bg-white rounded-3xl space-y-6 shadow-sm">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="grid grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gray-100" />
                  <div className="h-2 w-12 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="h-56 bg-gray-100 rounded-3xl" />
        </div>

        <div className="space-y-6">
          <div className="p-6 border border-gray-100 bg-white rounded-3xl space-y-4 shadow-sm">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-14 bg-gray-50 rounded-xl" />
            <div className="h-14 bg-gray-50 rounded-xl" />
          </div>
          <div className="h-40 bg-gray-100 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
