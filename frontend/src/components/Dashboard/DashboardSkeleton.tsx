"use client";

export default function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8 select-none">
      {/* header skeleton */}
      <div className="p-6 border border-gray-100 bg-white rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-3 w-52 bg-gray-100 rounded" />
          </div>
        </div>
      </div>

      {/* stats skeletons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 border border-gray-100 bg-white rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gray-100" />
            <div className="space-y-2">
              <div className="h-2.5 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* grid content skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-44 bg-gray-100 rounded-3xl" />
          <div className="p-6 border border-gray-100 bg-white rounded-3xl space-y-4 shadow-sm">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-3 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-100" />
                  <div className="space-y-2">
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                    <div className="h-2 w-36 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-40 bg-gray-100 rounded-3xl" />
          <div className="h-48 bg-gray-100 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
