"use client";

import { useSearchParams } from "next/navigation";
import CatalogView from "@/components/CatalogView";
import { categories, products } from "@/lib/data";

export default function SearchResults() {
  const q = (useSearchParams().get("q") ?? "").trim().toLowerCase();
  const items = q
    ? products.filter((p) => {
        const cat = categories.find((c) => c.slug === p.category)?.name ?? "";
        return `${p.title} ${p.brand ?? ""} ${cat}`.toLowerCase().includes(q);
      })
    : products;

  return <CatalogView title={q ? <>«{q}» bo&apos;yicha natijalar</> : "Barcha mahsulotlar"} items={items} />;
}
