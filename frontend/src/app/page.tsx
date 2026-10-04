"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { BrandSection } from "@/components/home/BrandSection";
import { ProductGridSection } from "@/components/home/ProductCard";
import { FlashSale } from "@/components/home/FlashSale";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { PromoBanner } from "@/components/home/PromoBanner";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Newsletter } from "@/components/home/Newsletter";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types";
import {
  mockCategories,
  mockProducts,
  mockFlashSaleProducts,
  mockNewArrivals,
  mockBestSellers,
  mockRecommendations,
  mockReviews,
} from "@/data/mock";

import { useAuthStore } from "@/store/auth";

export default function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>(mockFlashSaleProducts);
  const [newArrivals, setNewArrivals] = useState<Product[]>(mockNewArrivals);
  const [bestSellers, setBestSellers] = useState<Product[]>(mockBestSellers);
  const [recommendations, setRecommendations] = useState<Product[]>(mockRecommendations);

  useEffect(() => {
    async function loadBackendProducts() {
      try {
        const data = await fetchProducts({ limit: 20 });
        if (data && data.products && data.products.length > 0) {
          setFeaturedProducts(data.products);
          setFlashSaleProducts(data.products.slice(0, 4));
          setNewArrivals(data.products.slice(0, 8));
          setBestSellers(data.products.slice(0, 8));
          setRecommendations(data.products.slice(0, 8));
        }
      } catch (err) {
        console.warn("Home page backend fetch error:", err);
      }
    }
    loadBackendProducts();
  }, []);

  return (
    <main className="min-h-screen">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Categories */}
      <CategorySection categories={mockCategories} />

      {/* 3. Top Brands */}
      <BrandSection />

      {/* 3. Featured Products */}
      <ProductGridSection
        title="Featured Products"
        subtitle="Hand-picked for you based on quality and value"
        label="Editor's Choice"
        products={featuredProducts}
        viewAllHref="/products"
      />

      {/* 4. Flash Sale */}
      <FlashSale products={flashSaleProducts} />

      {/* 5. New Arrivals Carousel */}
      <ProductCarousel
        title="New Arrivals"
        subtitle="The latest products just landed"
        label="Just In"
        products={newArrivals}
        viewAllHref="/products"
        dark={true}
      />

      {/* 6. Promo Banners */}
      <PromoBanner />

      {/* 7. Best Sellers Grid */}
      <ProductGridSection
        title="Best Sellers"
        subtitle="Our most popular products loved by thousands"
        label="Trending"
        products={bestSellers}
        viewAllHref="/products"
      />

      {/* 8. Recommendations Carousel */}
      <ProductCarousel
        title={isAuthenticated ? "Because You Viewed..." : "Recommended For You"}
        subtitle={isAuthenticated ? "Personalized picks based on your recent activity" : "Top trending picks curated for new shoppers"}
        label="AI Recommendations"
        products={recommendations}
        viewAllHref="/products"
        dark={true}
      />

      {/* 9. Customer Reviews */}
      <ReviewsSection reviews={mockReviews} />

      {/* 10. Newsletter */}
      <Newsletter />
    </main>
  );
}
