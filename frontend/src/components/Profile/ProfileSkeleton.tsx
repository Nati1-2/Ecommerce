"use client";

export default function ProfileSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8 select-none">
      {/* header card skeleton */}
      <div className="p-6 border border-gray-100 bg-white rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-36 bg-gray-200 rounded" />
              <div className="h-3 w-52 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="h-6 w-28 bg-gray-100 rounded-full" />
        </div>
      </div>

      {/* Grid forms and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border border-gray-100 bg-white rounded-3xl space-y-6 shadow-sm">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-11 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-6">
          <div className="h-48 bg-gray-100 rounded-3xl" />
          <div className="h-40 bg-gray-100 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
