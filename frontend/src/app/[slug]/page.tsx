import FooterPageClient from "@/components/FooterPageClient";

export function generateStaticParams() {
  return [
    { slug: "about" },
    { slug: "careers" },
    { slug: "press" },
    { slug: "blog" },
    { slug: "investors" },
    { slug: "help" },
    { slug: "shipping" },
    { slug: "returns" },
    { slug: "track" },
    { slug: "size-guide" },
    { slug: "flash-sale" },
    { slug: "new" },
    { slug: "bestsellers" },
    { slug: "gift-cards" },
    { slug: "affiliate" },
    { slug: "privacy" },
    { slug: "terms" },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicFooterPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <FooterPageClient slug={resolvedParams.slug} />;
}
