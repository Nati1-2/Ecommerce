export default function SearchSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-6 p-4 bg-white border border-gray-100 rounded-2xl animate-pulse">
            <div className="w-48 h-48 bg-gray-100 rounded-xl shrink-0" />
            <div className="flex-1 flex flex-col justify-center py-2">
              <div className="w-20 h-3 bg-gray-100 rounded mb-3" />
              <div className="w-3/4 h-5 bg-gray-200 rounded mb-4" />
              <div className="w-32 h-4 bg-gray-100 rounded mb-8" />
              <div className="flex justify-between items-center mt-auto">
                <div className="w-24 h-8 bg-gray-200 rounded" />
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                  <div className="w-32 h-10 bg-gray-100 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden animate-pulse flex flex-col">
          <div className="aspect-square bg-gray-100" />
          <div className="p-5 flex-1 flex flex-col">
            <div className="w-16 h-3 bg-gray-100 rounded mb-2" />
            <div className="w-full h-4 bg-gray-200 rounded mb-2" />
            <div className="w-2/3 h-4 bg-gray-200 rounded mb-4" />
            <div className="w-24 h-3 bg-gray-100 rounded mb-4" />
            <div className="w-20 h-6 bg-gray-200 rounded mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
