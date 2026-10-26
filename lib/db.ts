// Server tomonidagi oddiy fayl-baza: data/db.json.
// Tovarlar, bannerlar, buyurtmalar va arizalar shu yerda saqlanadi; fayl yo'q bo'lsa boshlang'ich ma'lumotdan yaratiladi.
import "server-only";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import type { Application, Banner, Order, Product } from "./types";
import { seedBanners, seedProducts } from "./data";

export type Db = {
  products: Product[];
  banners: Banner[];
  orders: Order[];
  applications: Application[];
};

const FILE = path.join(process.cwd(), "data", "db.json");

// Bir vaqtda ikki yozuv bir-birini o'chirib yubormasligi uchun hamma o'zgarishlar navbat bilan bajariladi
const g = globalThis as typeof globalThis & { __dbQueue?: Promise<unknown>; __dbSeeding?: Promise<Db> };

function seed(): Db {
  return {
    products: structuredClone(seedProducts),
    banners: seedBanners.map((b, i) => ({ id: i + 1, ...b })),
    orders: [],
    applications: [],
  };
}

// Windows'da fayl almashtirilayotgan lahzada o'qish EPERM/EBUSY berishi mumkin — bir necha marta qayta urinamiz
async function readFileRetry() {
  for (let i = 0; ; i++) {
    try {
      return await fs.readFile(FILE, "utf8");
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (i >= 4 || (code !== "EPERM" && code !== "EBUSY")) throw e;
      await new Promise((r) => setTimeout(r, 25 * (i + 1)));
    }
  }
}

export async function readDb(): Promise<Db> {
  try {
    return JSON.parse(await readFileRetry()) as Db;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    // Fayl yo'q: bir nechta so'rov bir vaqtda kelsa ham baza faqat bir marta yaratiladi
    g.__dbSeeding ??= (async () => {
      const db = seed();
      await save(db);
      return db;
    })().finally(() => (g.__dbSeeding = undefined));
    return structuredClone(await g.__dbSeeding);
  }
}

async function save(db: Db) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  // Avval vaqtinchalik faylga yozib, keyin almashtiramiz — yozish o'rtasida uzilsa ham baza buzilmaydi
  const tmp = `${FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 1));
  for (let i = 0; ; i++) {
    try {
      await fs.rename(tmp, FILE);
      return;
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (i >= 4 || (code !== "EPERM" && code !== "EBUSY")) {
        await fs.rm(tmp, { force: true });
        throw e;
      }
      await new Promise((r) => setTimeout(r, 25 * (i + 1)));
    }
  }
}

// Bazani o'zgartirish: fn bazani o'zgartiradi va natija qaytaradi; o'zgarish faylga saqlanadi
export function updateDb<T>(fn: (db: Db) => T): Promise<T> {
  const run = (g.__dbQueue ?? Promise.resolve()).then(async () => {
    const db = await readDb();
    const result = fn(db);
    await save(db);
    return result;
  });
  g.__dbQueue = run.catch(() => {});
  return run;
}

export const nextId = (items: { id: number }[]) => items.reduce((m, i) => Math.max(m, i.id), 0) + 1;
