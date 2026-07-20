"use client";

import { use, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Home, RefreshCw, Star, AlertTriangle, Share2 } from "lucide-react";
import Link from "next/link";

import { fetchProductById } from "@/lib/api";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { useRealtimeStock } from "@/hooks/useRealtimeStock";
import { RatingStars } from "@/components/shared/RatingStars";

// Product Detail Subcomponents
import ProductGallery from "@/components/ProductDetails/ProductGallery";
import ProductInfo from "@/components/ProductDetails/ProductInfo";
import ProductPrice from "@/components/ProductDetails/ProductPrice";
import ProductVariants from "@/components/ProductDetails/ProductVariants";
import QuantitySelector from "@/components/ProductDetails/QuantitySelector";
import AddToCartButton from "@/components/ProductDetails/AddToCartButton";
import WishlistButton from "@/components/ProductDetails/WishlistButton";
import DeliveryCard from "@/components/ProductDetails/DeliveryCard";
import ProductTabs from "@/components/ProductDetails/ProductTabs";
import ReviewSection from "@/components/ProductDetails/ReviewSection";
import RelatedProducts from "@/components/ProductDetails/RelatedProducts";
import RecentlyViewed from "@/components/ProductDetails/RecentlyViewed";

// Mock customer reviews for initial render
import { mockReviews } from "@/data/mock";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function ProductDetailsContent({ id }: { id: string }) {
  // 1. Fetch Product Data via React Query
  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });

  // State for quantity and variants
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [priceOffset, setPriceOffset] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const addItem = useCartStore((s) => s.addItem);

  // Sync default variant selection on load
  useEffect(() => {
    if (product?.variants) {
      const defaults: Record<string, string> = {};
      product.variants.forEach((v) => {
        const firstOpt = v.options[0];
        defaults[v.name] = typeof firstOpt === "string" ? firstOpt : firstOpt.value;
      });
      setSelectedVariants(defaults);
      setPriceOffset(0);
    }
  }, [product]);

  // Handle variant color/storage options changes
  const handleSelectOption = (variantName: string, optionValue: string) => {
    const nextVariants = { ...selectedVariants, [variantName]: optionValue };
    setSelectedVariants(nextVariants);

    // Calculate price deltas (e.g. storage capacities add price offsets)
    let totalOffset = 0;
    if (product?.variants) {
      product.variants.forEach((v) => {
        const activeVal = nextVariants[v.name];
        const match = v.options.find((opt) =>
          typeof opt === "string" ? opt === activeVal : opt.value === activeVal
        );
        if (match && typeof match !== "string" && match.price) {
          totalOffset += match.price;
        }
      });
    }
    setPriceOffset(totalOffset);
  };

  // Real-time stock monitor hook (Socket.IO with auto-fallback ticker)
  const realTimeStock = useRealtimeStock(
    product?.id || "",
    product?.stock !== undefined ? product.stock : 10
  );

  const handleAddToCart = () => {
    if (!product) return;
    const variantLabel = Object.entries(selectedVariants)
      .map(([name, val]) => `${name}: ${val}`)
      .join(", ");

    addItem({
      productId: `${product.id}-${variantLabel}`,
      name: `${product.name} ${variantLabel ? `(${variantLabel})` : ""}`,
      price: product.price + priceOffset,
      quantity,
      image: product.image,
    });

    setToastMessage("Added to Cart!");
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage("Link copied to clipboard!");
    setTimeout(() => setToastMessage(""), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 text-[#007BFF] animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-500">Loading product experience...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-black text-gray-900">Product Not Found</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          The product you are looking for may have been removed or is temporarily unavailable.
        </p>
        <Link
          href="/products"
          className="mt-6 bg-[#007BFF] hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  // Active prices factoring variant offsets
  const activePrice = product.price + priceOffset;
  const activeOriginalPrice = product.originalPrice + priceOffset;

  return (
    <div className="bg-white min-h-screen pb-16 relative">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-xl z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* ── BREADCRUMBS ────────────────────────────────────────────────── */}
      <div className="bg-[#F5F7FA] border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Link href="/" className="hover:text-[#007BFF] flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-[#007BFF] transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-bold">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── MAIN PRODUCT SPLIT ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Right Column: Specifications & Actions */}
          <div className="space-y-6">
            <ProductInfo product={product} />

            {/* Price display with variant shifts */}
            <ProductPrice
              price={activePrice}
              originalPrice={activeOriginalPrice}
              discount={product.discount}
            />

            {/* Color/Storage Options */}
            <ProductVariants
              variants={product.variants}
              selectedVariants={selectedVariants}
              onSelectOption={handleSelectOption}
            />

            {/* Stock tracker warnings and Quantity inputs */}
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              max={realTimeStock}
            />

            {/* Checkout & Wishlist Actions */}
            <div className="flex gap-3">
              <AddToCartButton onAdd={handleAddToCart} inStock={realTimeStock > 0} />
              <WishlistButton productId={product.id} />
              <button
                onClick={handleShare}
                className="p-4 rounded-2xl border border-gray-200 text-gray-500 hover:border-[#007BFF] hover:text-[#007BFF] bg-white transition-all"
                title="Share Link"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust badge cards */}
            <DeliveryCard />
          </div>
        </div>
      </div>

      {/* ── TECHNICAL SPECIFICATIONS & TABS ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-gray-100">
        <ProductTabs
          description={product.description}
          reviewsCount={mockReviews.length}
          reviewsContent={
            <ReviewSection productId={product.id} initialReviews={mockReviews} />
          }
        />
      </div>

      {/* ── RELATED PRODUCTS CAROUSEL ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-gray-100 mt-10">
        <RelatedProducts productId={product.id} onQuickView={() => {}} />
      </div>

      {/* ── RECENTLY VIEWED HISTORY ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-gray-100">
        <RecentlyViewed currentProductId={product.id} onQuickView={() => {}} />
      </div>
    </div>
  );
}

export default function ProductDetailsPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  return (
    <ProductDetailsContent id={resolvedParams.id} />
  );
}
