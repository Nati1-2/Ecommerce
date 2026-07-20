"use client";

import { useAdminProductStore } from "@/store/adminProductStore";
import {
  useProductStats,
  useAdminProducts,
  useDeleteProduct,
  useBulkApproveProducts,
} from "@/hooks/useAdminProductQuery";

import ProductHeader from "@/components/AdminProducts/ProductHeader";
import ProductStats from "@/components/AdminProducts/ProductStats";
import ReportedProducts from "@/components/AdminProducts/ReportedProducts";
import ProductFilters from "@/components/AdminProducts/ProductFilters";
import ProductApprovalTable from "@/components/AdminProducts/ProductApprovalTable";
import ProductReviewDrawer from "@/components/AdminProducts/ProductReviewDrawer";
import ApproveProductModal from "@/components/AdminProducts/ApproveProductModal";
import RejectProductModal from "@/components/AdminProducts/RejectProductModal";
import RequestChangesModal from "@/components/AdminProducts/RequestChangesModal";
import ProductPreview from "@/components/AdminProducts/ProductPreview";
import CategoryManager from "@/components/AdminProducts/CategoryManager";
import ProductExportModal from "@/components/AdminProducts/ProductExportModal";
import ProductSkeleton from "@/components/AdminProducts/ProductSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminProductsPage() {
  const {
    filters,
    selectedProductIds,
    toggleSelectProduct,
    selectAllProducts,
    clearSelection,
  } = useAdminProductStore();

  const { data: stats, isLoading: statsLoading } = useProductStats();
  const { data: products = [], isLoading: productsLoading, isError, refetch } = useAdminProducts();

  const deleteProductMutation = useDeleteProduct();
  const bulkApproveMutation = useBulkApproveProducts();

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.vendorStore.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesStatus = filters.statusFilter === "All" || p.status === filters.statusFilter;
    const matchesCategory = filters.categoryFilter === "All" || p.category === filters.categoryFilter;
    const matchesVendor = filters.vendorFilter === "All" || p.vendorStore === filters.vendorFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesVendor;
  });

  if (statsLoading || productsLoading || !stats) {
    return <ProductSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
          Unable to Load Product Catalog
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          The Product Service search cluster is currently synchronizing ElasticSearch indexes.
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <ProductHeader />

      {/* Summary Statistics */}
      <ProductStats stats={stats} />

      {/* Reported Products Moderation Queue */}
      <ReportedProducts />

      {/* Search & Filter Toolbar */}
      <ProductFilters
        selectedCount={selectedProductIds.length}
        onBulkApprove={() => {
          bulkApproveMutation.mutate(selectedProductIds);
          clearSelection();
        }}
        onBulkDelete={() => {
          selectedProductIds.forEach((id) => deleteProductMutation.mutate(id));
          clearSelection();
        }}
      />

      {/* Product Approval Table */}
      <ProductApprovalTable
        products={filteredProducts}
        selectedIds={selectedProductIds}
        onToggleSelect={toggleSelectProduct}
        onSelectAll={selectAllProducts}
        onDeleteProduct={(id) => deleteProductMutation.mutate(id)}
      />

      {/* Modals & Drawers */}
      <ProductReviewDrawer />
      <ApproveProductModal />
      <RejectProductModal />
      <RequestChangesModal />
      <ProductPreview />
      <CategoryManager />
      <ProductExportModal />
    </div>
  );
}
