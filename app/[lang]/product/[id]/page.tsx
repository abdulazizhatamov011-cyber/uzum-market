import Link from "@/components/LocalLink";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { catName, getCategory, productTitle } from "@/lib/data";
import { getCatalog, getProductById } from "@/lib/catalog";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import ProductDetails from "./ProductDetails";
import ProductGrid from "@/components/ProductGrid";

// Mavjud tovarlar oldindan tayyorlanadi; admin keyin qo'shgan tovarlar birinchi ochilganda tayyorlanadi
export async function generateStaticParams() {
  const { products } = await getCatalog();
  return products.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/product/[id]">) {
  const { id, lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "uz";
  const t = getDict(lang);
  const p = await getProductById(Number(id));
  return { title: p ? `${productTitle(p, lang)} — ${t.meta.suffix}` : t.product.notFound };
}

export default function ProductPage({ params }: PageProps<"/[lang]/product/[id]">) {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-muted">…</div>}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const { id, lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "uz";
  const t = getDict(lang);
  const { products } = await getCatalog();
  const product = products.find((p) => p.id === Number(id));
  if (!product) notFound();
  const category = getCategory(product.category);
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 10);

  return (
    <div className="container-x pt-4">
      <nav className="hidden md:flex text-sm text-muted gap-2 mb-4">
        <Link href="/" className="hover:text-ink">{t.common.home}</Link>/
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-ink">{catName(category, lang)}</Link>/
          </>
        )}
        <span className="text-ink line-clamp-1">{productTitle(product, lang)}</span>
      </nav>
      <ProductDetails product={product} />
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-5">{t.product.similar}</h2>
          <ProductGrid items={similar} />
        </section>
      )}
    </div>
  );
}
