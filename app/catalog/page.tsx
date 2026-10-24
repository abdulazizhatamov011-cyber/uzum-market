import Link from "next/link";
import PageShell from "@/components/PageShell";
import { categories, products } from "@/lib/data";

export const metadata = { title: "Katalog — Uzum Market" };

export default function CatalogPage() {
  return (
    <PageShell title="Katalog">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="rounded-2xl bg-[#f2f4f7] p-5 hover:bg-[#e9ecf1] transition">
            <div className="text-4xl">{c.icon}</div>
            <div className="font-semibold mt-3">{c.name}</div>
            <div className="text-sm text-muted">{products.filter((p) => p.category === c.slug).length} ta mahsulot</div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
