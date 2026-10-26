"use client";

import { useSearchParams } from "next/navigation";
import CatalogView from "@/components/CatalogView";
import { catName, categories, productTitle } from "@/lib/data";
import { useI18n } from "@/components/I18nProvider";
import { useCatalog } from "@/components/CatalogProvider";

export default function SearchResults() {
  const { products } = useCatalog();
  const { t } = useI18n();
  const q = (useSearchParams().get("q") ?? "").trim().toLowerCase();
  const items = q
    ? products.filter((p) => {
        // Ikkala tilda ham qidiriladi: "krossovka" ham, "кроссовки" ham topiladi
        const c = categories.find((x) => x.slug === p.category);
        const cats = c ? `${c.name} ${catName(c, "ru")}` : "";
        return `${p.title} ${productTitle(p, "ru")} ${p.brand ?? ""} ${cats}`.toLowerCase().includes(q);
      })
    : products;

  return <CatalogView title={q ? t.catalog.searchResults(q) : t.catalog.allProducts} items={items} />;
}
