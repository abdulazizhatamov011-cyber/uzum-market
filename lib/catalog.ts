// Saytga ko'rinadigan katalog (tovarlar va bannerlar) — keshlanadi.
// Admin tovar yoki bannerni o'zgartirganda updateTag("catalog") keshni darhol yangilaydi.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { readDb } from "./db";
import { seedBanners } from "./data";

export async function getCatalog() {
  "use cache";
  cacheTag("catalog");
  cacheLife("max");
  const db = await readDb();
  // Ruscha matni bo'lmagan eski bannerlar boshlang'ich ma'lumotdagi tarjimani oladi
  const banners = db.banners.map((b) => {
    if (b.titleRu) return b;
    const seed = seedBanners.find((s) => s.title === b.title && s.subtitle === b.subtitle);
    return seed ? { ...b, titleRu: seed.titleRu, subtitleRu: seed.subtitleRu } : b;
  });
  return { products: db.products, banners };
}

export async function getProductById(id: number) {
  const { products } = await getCatalog();
  return products.find((p) => p.id === id);
}
