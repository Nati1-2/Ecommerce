"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Hero from "@/components/home/Hero";
import { BrandSection } from "@/components/home/BrandSection";
import { ProductGridSection } from "@/components/home/ProductCard";
import { PromoBanner } from "@/components/home/PromoBanner";
import { Newsletter } from "@/components/home/Newsletter";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { fetchProducts } from "@/lib/api";
import { reportError } from "@/lib/errorHandler";
import { Product } from "@/types";

export default function HomePage() {
  const { setTheme, theme } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    // Strictly enforce light mode on home page once mounted
    if (theme && theme !== "light") {
      setTheme("light");
    }
  }, []); // Run once on mount to avoid theme toggling loops

  useEffect(() => {
    let isMounted = true;

    async function loadBackendProducts() {
      try {
        const data = await fetchProducts({ limit: 20 });
        if (!isMounted) return;

        setFeaturedProducts(data.products);
      } catch (err) {
        reportError(err, { location: "HomePage.loadBackendProducts" });
        if (isMounted) setProductsError(true);
      } finally {
        if (isMounted) setProductsLoading(false);
      }
    }

    loadBackendProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* 1. Hero */}
      <ErrorBoundary name="Hero Section">
        <Hero />
      </ErrorBoundary>

      {/* 3. Top Brands */}
      <ErrorBoundary name="Top Brands">
        <BrandSection />
      </ErrorBoundary>

      {/* 4. Featured Products */}
      <ErrorBoundary name="Featured Products">
        {productsLoading ? <p className="p-8" role="status">Loading products...</p> : productsError ?
          <p className="p-8 text-red-600" role="alert">Products are unavailable. Please try again later.</p> :
          featuredProducts.length === 0 ? <p className="p-8">No products are available yet.</p> : <ProductGridSection
          title="Featured Products"
          subtitle="Explore the current catalog"
          label="Products"
          products={featuredProducts}
          viewAllHref="/products"
        />}
      </ErrorBoundary>

      {/* 7. Promo Banners */}
      <ErrorBoundary name="Promo Banners">
        <PromoBanner />
      </ErrorBoundary>


      {/* 11. Newsletter */}
      <ErrorBoundary name="Newsletter">
        <Newsletter />
      </ErrorBoundary>
    </main>
  );
}
