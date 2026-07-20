import SearchPage from "@/components/Search/SearchPage";

export const metadata = {
  title: "Search Results | E-Commerce",
  description: "Find the best products across categories.",
};

import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
      <SearchPage />
    </Suspense>
  );
}
