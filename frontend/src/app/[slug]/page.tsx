import FooterPageClient from "@/components/FooterPageClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicFooterPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <FooterPageClient slug={resolvedParams.slug} />;
}
