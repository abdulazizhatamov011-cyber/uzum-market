"use client";

import Link from "@/components/LocalLink";
import { useStore } from "@/components/StoreProvider";
import ProductGrid from "@/components/ProductGrid";
import { useCatalog } from "@/components/CatalogProvider";
import { useI18n } from "@/components/I18nProvider";

export default function FavoritesPage() {
  const { favorites } = useStore();
  const { products } = useCatalog();
  const { t } = useI18n();
  const items = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="container-x pt-6">
      <h1 className="text-3xl font-bold mb-6">{t.favorites.title}</h1>
      {items.length ? (
        <ProductGrid items={items} />
      ) : (
        <div className="py-20 text-center">
          <div className="text-7xl mb-4">💜</div>
          <h2 className="text-xl font-bold">{t.favorites.emptyTitle}</h2>
          <p className="text-muted mt-2">{t.favorites.emptyText}</p>
          <Link href="/" className="inline-block mt-6 rounded-full bg-brand text-white font-semibold px-8 h-12 leading-[48px]">
            {t.common.home}
          </Link>
        </div>
      )}
    </div>
  );
}
