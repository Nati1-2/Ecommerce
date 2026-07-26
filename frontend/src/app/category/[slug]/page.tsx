import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const rawSlug = decodeURIComponent(resolvedParams.slug || "");
  
  const categoryMap: Record<string, string> = {
    "electronics": "Electronics",
    "fashion": "Fashion",
    "home": "Home & Living",
    "home-living": "Home & Living",
    "home-and-living": "Home & Living",
    "gaming": "Gaming",
    "beauty": "Beauty",
    "sports": "Sports",
  };

  const key = rawSlug.toLowerCase().trim();
  const formattedCategory = categoryMap[key] || (rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1));

  redirect(`/products?category=${encodeURIComponent(formattedCategory)}`);
}
