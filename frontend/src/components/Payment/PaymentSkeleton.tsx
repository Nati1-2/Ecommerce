"use client";

export default function PaymentSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8">
      {/* progress skeleton */}
      <div className="h-10 max-w-xl mx-auto bg-gray-100 rounded-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* left main payment skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border border-gray-100 rounded-3xl space-y-6 bg-white shadow-sm">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            
            {/* payment methods selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl" />
              ))}
            </div>

            {/* card elements inputs placeholder */}
            <div className="space-y-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-11 bg-gray-100 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-11 bg-gray-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-11 bg-gray-100 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* billing address skeleton */}
          <div className="p-6 border border-gray-100 rounded-3xl space-y-4 bg-white shadow-sm">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-5 w-32 bg-gray-100 rounded" />
          </div>
        </div>

        {/* right sidebar order summary skeleton */}
        <div className="space-y-6">
          <div className="p-6 border border-gray-100 rounded-3xl space-y-4 bg-white shadow-sm">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-3 w-12 bg-gray-100 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-3 w-12 bg-gray-100 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-3 w-12 bg-gray-100 rounded" />
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-5 w-20 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-12 bg-gray-100 rounded-2xl mt-4" />
          </div>

          <div className="h-28 bg-gray-100 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
