"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import ProductForm from "@/components/vendor/products/ProductForm";
import ProductPreviewModal from "@/components/vendor/products/ProductPreviewModal";
import { VendorProduct } from "@/types/vendor";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();
  const [previewProduct, setPreviewProduct] = useState<VendorProduct | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["vendor-product", resolvedParams.id],
    queryFn: () => vendorApi.getProductById(resolvedParams.id),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<VendorProduct>) => vendorApi.updateProduct(resolvedParams.id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-product", resolvedParams.id] });
      showToast(`Product "${updated.name}" updated successfully!`, "success");
      router.push("/vendor/products");
    },
  });

  if (isLoading || !product) {
    return <div className="p-8 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse max-w-5xl mx-auto" />;
  }

  return (
    <>
      <ProductForm
        initialData={product}
        onSubmit={(data) => updateMutation.mutate(data)}
        isSubmitting={updateMutation.isPending}
        onPreview={(data) => setPreviewProduct(data)}
      />

      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
    </>
  );
}
