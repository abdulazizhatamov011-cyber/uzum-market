import { Suspense } from "react";
import { notFound } from "next/navigation";
import CatalogView from "@/components/CatalogView";
import { categories, getCategory, products } from "@/lib/data";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  return { title: `${getCategory(slug)?.name ?? "Turkum"} — Uzum Market` };
}

export default function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-muted">Yuklanmoqda…</div>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  return (
    <CatalogView
      title={category.name}
      activeSlug={slug}
      items={products.filter((p) => p.category === slug)}
    />
  );
}
