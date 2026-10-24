import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategory, getProduct, products } from "@/lib/data";
import ProductDetails from "./ProductDetails";
import ProductGrid from "@/components/ProductGrid";

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: PageProps<"/product/[id]">) {
  const { id } = await params;
  const p = getProduct(Number(id));
  return { title: p ? `${p.title} — Uzum Market` : "Mahsulot topilmadi" };
}

export default function ProductPage({ params }: PageProps<"/product/[id]">) {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-muted">Yuklanmoqda…</div>}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) notFound();
  const category = getCategory(product.category);
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 10);

  return (
    <div className="container-x pt-4">
      <nav className="hidden md:flex text-sm text-muted gap-2 mb-4">
        <Link href="/" className="hover:text-ink">Bosh sahifa</Link>/
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-ink">{category.name}</Link>/
          </>
        )}
        <span className="text-ink line-clamp-1">{product.title}</span>
      </nav>
      <ProductDetails product={product} />
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-5">O&apos;xshash mahsulotlar</h2>
          <ProductGrid items={similar} />
        </section>
      )}
    </div>
  );
}
