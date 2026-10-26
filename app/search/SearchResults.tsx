"use client";

import { useSearchParams } from "next/navigation";
import CatalogView from "@/components/CatalogView";
import { categories } from "@/lib/data";
import { useCatalog } from "@/components/CatalogProvider";

export default function SearchResults() {
  const { products } = useCatalog();
  const q = (useSearchParams().get("q") ?? "").trim().toLowerCase();
  const items = q
    ? products.filter((p) => {
        const cat = categories.find((c) => c.slug === p.category)?.name ?? "";
        return `${p.title} ${p.brand ?? ""} ${cat}`.toLowerCase().includes(q);
      })
    : products;

  return <CatalogView title={q ? <>«{q}» bo&apos;yicha natijalar</> : "Barcha mahsulotlar"} items={items} />;
}
