export default function SettingsSkeleton() {
  return (
    <div className="p-6 sm:p-10 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 mb-10" />
      
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-3 w-1/2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32" />
      </div>
    </div>
  );
}
