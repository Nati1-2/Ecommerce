import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "";
  
  // Format slug (e.g. "home-living" -> "Home & Living", "electronics" -> "Electronics")
  let formattedCategory = rawSlug;
  if (rawSlug.toLowerCase() === "home" || rawSlug.toLowerCase() === "home-living") {
    formattedCategory = "Home & Living";
  } else if (rawSlug) {
    formattedCategory = rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1);
  }

  redirect(`/products?category=${encodeURIComponent(formattedCategory)}`);
}
