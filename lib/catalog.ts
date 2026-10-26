// Saytga ko'rinadigan katalog (tovarlar va bannerlar) — keshlanadi.
// Admin tovar yoki bannerni o'zgartirganda updateTag("catalog") keshni darhol yangilaydi.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { readDb } from "./db";

export async function getCatalog() {
  "use cache";
  cacheTag("catalog");
  cacheLife("max");
  const db = await readDb();
  return { products: db.products, banners: db.banners };
}

export async function getProductById(id: number) {
  const { products } = await getCatalog();
  return products.find((p) => p.id === id);
}
