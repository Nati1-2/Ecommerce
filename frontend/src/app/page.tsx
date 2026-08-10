import Hero from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { BrandSection } from "@/components/home/BrandSection";
import { ProductGridSection } from "@/components/home/ProductCard";
import { FlashSale } from "@/components/home/FlashSale";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { PromoBanner } from "@/components/home/PromoBanner";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Newsletter } from "@/components/home/Newsletter";
import {
  mockCategories,
  mockProducts,
  mockFlashSaleProducts,
  mockNewArrivals,
  mockBestSellers,
  mockRecommendations,
  mockReviews,
} from "@/data/mock";

export const metadata = {
  title: "Nati — Premium E-Commerce | Shop Everything You Love",
  description: "Discover 50,000+ premium products from top brands with fast delivery and secure payments.",
};

export default function HomePage() {
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
        products={mockProducts}
        viewAllHref="/products"
      />

      {/* 4. Flash Sale */}
      <FlashSale products={mockFlashSaleProducts} />

      {/* 5. New Arrivals Carousel */}
      <ProductCarousel
        title="New Arrivals"
        subtitle="The latest products just landed"
        label="Just In"
        products={mockNewArrivals}
        viewAllHref="/products/new"
        dark={true}
      />

      {/* 6. Promo Banners */}
      <PromoBanner />

      {/* 7. Best Sellers Grid */}
      <ProductGridSection
        title="Best Sellers"
        subtitle="Our most popular products loved by thousands"
        label="Trending"
        products={mockBestSellers}
        viewAllHref="/products/bestsellers"
      />

      {/* 8. Recommendations Carousel */}
      <ProductCarousel
        title="Because You Viewed..."
        subtitle="Personalized picks for you"
        label="AI Recommendations"
        products={mockRecommendations}
        viewAllHref="/recommendations"
        dark={true}
      />

      {/* 9. Customer Reviews */}
      <ReviewsSection reviews={mockReviews} />

      {/* 10. Newsletter */}
      <Newsletter />
    </main>
  );
}
