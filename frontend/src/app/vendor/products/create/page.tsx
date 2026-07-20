"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import ProductForm from "@/components/vendor/products/ProductForm";
import ProductPreviewModal from "@/components/vendor/products/ProductPreviewModal";
import { VendorProduct } from "@/types/vendor";

export default function CreateProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();
  const [previewProduct, setPreviewProduct] = useState<VendorProduct | null>(null);

  const createMutation = useMutation({
    mutationFn: vendorApi.createProduct,
    onSuccess: (newProd) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      showToast(`Product "${newProd.name}" submitted for approval!`, "success");
      router.push("/vendor/products");
    },
  });

  return (
    <>
      <ProductForm
        onSubmit={(data) => createMutation.mutate(data)}
        isSubmitting={createMutation.isPending}
        onPreview={(data) => setPreviewProduct(data)}
      />

      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
    </>
  );
}
