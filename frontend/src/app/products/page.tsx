"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight, Home, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";

import { fetchProducts, GetProductsParams } from "@/lib/api";
import { Product } from "@/types";
import { FilterSidebar, FilterState } from "@/components/ProductListing/FilterSidebar";
import { FilterDrawer } from "@/components/ProductListing/FilterDrawer";
import { ProductGrid } from "@/components/ProductListing/ProductGrid";
import { ProductToolbar } from "@/components/ProductListing/ProductToolbar";
import { Pagination } from "@/components/ProductListing/Pagination";
import { QuickViewModal } from "@/components/ProductListing/QuickViewModal";
import { EmptyState } from "@/components/ProductListing/EmptyState";
import { ProductGridSkeleton } from "@/components/ProductListing/ProductSkeleton";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { mockRecommendations } from "@/data/mock";

const BRANDS = ["Apple", "Sony", "Nike", "Samsung", "Dyson"];
const CATEGORIES = ["Electronics", "Fashion", "Home & Living", "Gaming", "Beauty", "Sports"];

function ProductListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL State Syncing
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");
  const urlSort = searchParams.get("sort");
  const urlPage = parseInt(searchParams.get("page") || "1");

  // React State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    categories: urlCategory ? [urlCategory] : [],
    brands: [],
    priceRange: [0, 3000],
    rating: null,
    inStock: null,
    discount: null,
  });

  // Sort State
  const [sort, setSort] = useState<string>(urlSort || "popular");

  // Page State
  const [page, setPage] = useState<number>(urlPage);

  // Sync Search query from URL
  const searchQuery = urlSearch || "";

  // Reset page when filters change
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    updateURL(newFilters, sort, 1, searchQuery);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
    updateURL(filters, newSort, 1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL(filters, sort, newPage, searchQuery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterState = {
      categories: [],
      brands: [],
      priceRange: [0, 3000],
      rating: null,
      inStock: null,
      discount: null,
    };
    setFilters(defaultFilters);
    setSort("popular");
    setPage(1);
    updateURL(defaultFilters, "popular", 1, "");
  };

  // Update browser URL query params
  const updateURL = (f: FilterState, s: string, p: number, q: string) => {
    const params = new URLSearchParams();
    if (f.categories.length === 1) params.set("category", f.categories[0]);
    if (q) params.set("search", q);
    if (s !== "popular") params.set("sort", s);
    if (p > 1) params.set("page", p.toString());

    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Sync URL changes back to local React state
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: urlCategory ? [urlCategory] : [],
    }));
    setSort(urlSort || "popular");
    setPage(urlPage);
  }, [urlCategory, urlSort, urlPage]);

  // React Query fetch
  const queryParams: GetProductsParams = {
    category: filters.categories,
    brands: filters.brands,
    priceMin: filters.priceRange[0],
    priceMax: filters.priceRange[1],
    rating: filters.rating || undefined,
    inStock: filters.inStock === true ? true : undefined,
    discount: filters.discount || undefined,
    sort,
    search: searchQuery || undefined,
    page,
    limit: 8,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => fetchProducts(queryParams),
  });

  // Breadcrumbs text
  const activeCategoryName = filters.categories.length === 1 ? filters.categories[0] : null;

  return (
    <div className="bg-white min-h-screen">
      {/* ── BREADCRUMBS & BANNER ────────────────────────────────────────── */}
      <div className="bg-[#F5F7FA] border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Link href="/" className="hover:text-[#007BFF] flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-[#007BFF] transition-colors">
              Products
            </Link>
            {activeCategoryName && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600 font-bold">{activeCategoryName}</span>
              </>
            )}
          </nav>

          {/* Heading */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#111827]">
                {activeCategoryName || "All Products"}
              </h1>
              <p className="text-gray-500 text-sm mt-1 max-w-xl">
                Explore our handpicked catalog of top-tier products. Clean, verified, and ready to ship.
              </p>
            </div>
            {/* Minimal promo badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#007BFF] text-xs font-bold px-4 py-2 rounded-xl self-start md:self-center">
              <Sparkles className="w-4 h-4 text-[#007BFF]" />
              Free shipping on orders over $50
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8 items-start">
          {/* Left Sidebar Filter (Desktop) */}
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            availableBrands={BRANDS}
            availableCategories={CATEGORIES}
          />

          {/* Right side Grid layout */}
          <div className="flex-1 space-y-5">
            {/* Toolbar */}
            <ProductToolbar
              total={data?.total || 0}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sort={sort}
              onSortChange={handleSortChange}
              filters={filters}
              onFilterChange={handleFilterChange}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
              onClearFilters={handleClearFilters}
            />

            {/* Product Rendering */}
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100">
                <RefreshCw className="w-10 h-10 text-red-400 animate-spin mb-4" />
                <h3 className="text-lg font-black text-gray-900">Unable to load products</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-xs">
                  There was a problem contacting the server. Check your connection and try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-6 bg-[#007BFF] hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm"
                >
                  Retry Connection
                </button>
              </div>
            ) : data?.products.length === 0 ? (
              <EmptyState onClearFilters={handleClearFilters} />
            ) : (
              <>
                <ProductGrid
                  products={data?.products || []}
                  viewMode={viewMode}
                  onQuickView={setQuickViewProduct}
                />
                <Pagination
                  currentPage={page}
                  totalPages={data?.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTOM RECOMMENDATIONS ────────────────────────────────────────── */}
      <div className="border-t border-gray-100 bg-[#F5F7FA] mt-12">
        <ProductCarousel
          title="Customers Also Viewed"
          subtitle="A selection of trending products chosen by other shoppers"
          label="Trending Recommendations"
          products={mockRecommendations}
          viewAllHref="/products"
          dark={true}
        />
      </div>

      {/* Mobile Drawer */}
      <FilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        availableBrands={BRANDS}
        availableCategories={CATEGORIES}
      />

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

export default function ProductListingPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <ProductGridSkeleton count={8} />
      </div>
    }>
      <ProductListingContent />
    </Suspense>
  );
}
