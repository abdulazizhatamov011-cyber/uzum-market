"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { categories } from "@/lib/data";
import ProductGrid from "./ProductGrid";

const sorts = {
  popular: { label: "Ommabopligi bo'yicha", fn: (a: Product, b: Product) => b.reviews - a.reviews },
  cheap: { label: "Arzonroq", fn: (a: Product, b: Product) => a.price - b.price },
  expensive: { label: "Qimmatroq", fn: (a: Product, b: Product) => b.price - a.price },
  rating: { label: "Yuqori reyting", fn: (a: Product, b: Product) => b.rating - a.rating },
};

export default function CatalogView({
  title,
  items,
  activeSlug,
}: {
  title: React.ReactNode;
  items: Product[];
  activeSlug?: string;
}) {
  const [sort, setSort] = useState<keyof typeof sorts>("popular");
  const [max, setMax] = useState("");
  const list = useMemo(
    () => items.filter((p) => !max || p.price <= Number(max)).sort(sorts[sort].fn),
    [items, sort, max]
  );

  return (
    <div className="container-x pt-4 grid gap-8 md:grid-cols-[220px_1fr]">
      <aside className="hidden md:block sticky top-[172px] self-start max-h-[calc(100vh-188px)] overflow-y-auto overscroll-contain pr-2 [scrollbar-width:thin]">
        <h3 className="font-semibold mb-3">Turkumlar</h3>
        <ul className="space-y-1 text-sm">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className={`block rounded-lg px-2 py-1.5 hover:bg-surface ${c.slug === activeSlug ? "text-brand font-medium" : ""}`}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="font-semibold mt-6 mb-3">Narx, so&apos;mgacha</h3>
        <input
          inputMode="numeric"
          value={max}
          onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
          placeholder="Masalan, 500000"
          className="w-full h-10 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand"
        />
      </aside>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {title} <span className="text-base font-normal text-muted">{list.length} ta mahsulot</span>
          </h1>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as keyof typeof sorts)}
            className="h-10 rounded-lg border border-line px-3 text-sm bg-white outline-none"
          >
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        {list.length ? (
          <ProductGrid key={sort + max} items={list} step={20} />
        ) : (
          <div className="py-20 text-center text-muted">Hech narsa topilmadi 😔</div>
        )}
      </div>
    </div>
  );
}
