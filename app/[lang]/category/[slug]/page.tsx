import { Suspense } from "react";
import { notFound } from "next/navigation";
import CatalogView from "@/components/CatalogView";
import { catName, categories, getCategory } from "@/lib/data";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import { getCatalog } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/category/[slug]">) {
  const { slug, lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "uz";
  const t = getDict(lang);
  const c = getCategory(slug);
  return { title: `${c ? catName(c, lang) : t.catalog.category} — ${t.meta.suffix}` };
}

export default function CategoryPage({ params }: PageProps<"/[lang]/category/[slug]">) {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-muted">…</div>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "uz";
  const category = getCategory(slug);
  if (!category) notFound();
  const { products } = await getCatalog();
  return (
    <CatalogView
      title={catName(category, lang)}
      activeSlug={slug}
      items={products.filter((p) => p.category === slug)}
    />
  );
}
