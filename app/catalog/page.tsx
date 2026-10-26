import Link from "next/link";
import PageShell from "@/components/PageShell";
import { categories, categoryCover } from "@/lib/data";
import CategoryThumb from "@/components/CategoryThumb";
import { getCatalog } from "@/lib/catalog";

export const metadata = { title: "Katalog — Bozorcha" };

export default async function CatalogPage() {
  const { products } = await getCatalog();
  return (
    <PageShell title="Katalog">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="flex items-center gap-4 rounded-[20px] bg-white border border-line p-4 hover:border-[#c9d4e8] transition">
            <CategoryThumb c={c} src={categoryCover(c, products)} className="w-16 h-16 rounded-2xl" />
            <div className="min-w-0">
            <div className="font-semibold leading-snug">{c.name}</div>
            <div className="text-sm text-muted">{products.filter((p) => p.category === c.slug).length} ta mahsulot</div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
