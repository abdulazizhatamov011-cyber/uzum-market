"use client";

import { createContext, useContext, useMemo } from "react";
import type { Banner, Product } from "@/lib/types";

type Catalog = {
  products: Product[];
  banners: Banner[];
  getProduct: (id: number) => Product | undefined;
};

const CatalogContext = createContext<Catalog | null>(null);

// Server bazasidagi katalogni (layout'da o'qilgan) client komponentlarga yetkazadi
export function CatalogProvider({
  products,
  banners,
  children,
}: {
  products: Product[];
  banners: Banner[];
  children: React.ReactNode;
}) {
  const value = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return { products, banners, getProduct: (id: number) => byId.get(id) };
  }, [products, banners]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}
