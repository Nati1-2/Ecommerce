"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import ProductFilterBar from "@/components/vendor/products/ProductFilterBar";
import ProductTable from "@/components/vendor/products/ProductTable";
import ProductPreviewModal from "@/components/vendor/products/ProductPreviewModal";
import { VendorProduct } from "@/types/vendor";

export default function VendorProductsPage() {
  const queryClient = useQueryClient();
  const {
    searchQuery,
    setSearchQuery,
    selectedProductIds,
    toggleSelectProduct,
    selectAllProducts,
    clearProductSelection,
    showToast,
  } = useVendorStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [previewProduct, setPreviewProduct] = useState<VendorProduct | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["vendor-products"],
    queryFn: vendorApi.getProducts,
  });

  const duplicateMutation = useMutation({
    mutationFn: vendorApi.duplicateProduct,
    onSuccess: (copy) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      showToast(`Duplicated as "${copy.name}"`, "success");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vendorApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      showToast("Product deleted successfully", "info");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: vendorApi.bulkDeleteProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      clearProductSelection();
      showToast("Selected products deleted", "info");
    },
  });

  const bulkActivateMutation = useMutation({
    mutationFn: vendorApi.bulkActivateProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      clearProductSelection();
      showToast("Selected products activated", "success");
    },
  });

  // Extract unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;

    return matchesQuery && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Catalog Management</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage product catalog, pricing, variants, and approval statuses.
        </p>
      </div>

      <ProductFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        categories={categories}
        selectedCount={selectedProductIds.length}
        onBulkDelete={() => bulkDeleteMutation.mutate(selectedProductIds)}
        onBulkActivate={() => bulkActivateMutation.mutate(selectedProductIds)}
        onExport={() => showToast("Product list exported to CSV", "success")}
      />

      {isLoading ? (
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
      ) : (
        <ProductTable
          products={filteredProducts}
          selectedIds={selectedProductIds}
          onToggleSelect={toggleSelectProduct}
          onSelectAll={selectAllProducts}
          onDuplicate={(id) => duplicateMutation.mutate(id)}
          onDelete={(id) => deleteMutation.mutate(id)}
          onPreview={(prod) => setPreviewProduct(prod)}
        />
      )}

      {/* Preview Modal */}
      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
    </div>
  );
}
