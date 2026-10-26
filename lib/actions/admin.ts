"use server";

// Admin panel amallari. Har bir amal avval admin ekanini tekshiradi:
// Server Action'larni to'g'ridan-to'g'ri POST so'rov bilan ham chaqirish mumkin.
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, requireAdmin, startSession } from "../admin-auth";
import { nextId, updateDb } from "../db";
import { categories } from "../data";
import { orderStatuses, type Banner, type OrderStatus, type Product } from "../types";

type Result = { ok: true } | { ok: false; error: string };

// ——— Kirish / chiqish ———

export async function login(_prev: string | null, form: FormData): Promise<string | null> {
  const password = String(form.get("password") ?? "");
  // Parolni taxmin qilishni sekinlashtirish uchun kichik kechikish
  await new Promise((r) => setTimeout(r, 400));
  if (!checkPassword(password)) return "Parol noto'g'ri";
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ——— Tovarlar ———

export type ProductInput = {
  id?: number;
  title: string;
  titleRu: string;
  category: string;
  price: number;
  oldPrice: number;
  stock: number;
  brand: string;
  image: string;
  images: string;
  original: boolean;
  guarantee: boolean;
};

const isImageUrl = (s: string) => /^https?:\/\/\S+$/i.test(s) || /^\/\S+$/.test(s);

export async function saveProduct(input: ProductInput): Promise<Result & { id?: number }> {
  await requireAdmin();
  const title = String(input.title ?? "").trim();
  const price = Math.round(Number(input.price));
  const oldPrice = Math.round(Number(input.oldPrice)) || price;
  const stock = Math.max(0, Math.round(Number(input.stock)));
  const image = String(input.image ?? "").trim();
  const images = String(input.images ?? "")
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(isImageUrl);

  if (title.length < 3) return { ok: false, error: "Tovar nomini kiriting (kamida 3 harf)" };
  if (!categories.some((c) => c.slug === input.category)) return { ok: false, error: "Turkumni tanlang" };
  if (!(price > 0)) return { ok: false, error: "Narx 0 dan katta bo'lishi kerak" };
  if (oldPrice < price) return { ok: false, error: "Eski narx joriy narxdan kichik bo'lmasligi kerak" };
  if (!isImageUrl(image)) return { ok: false, error: "Asosiy rasm havolasini kiriting (https://...)" };

  const fields = {
    title: title.slice(0, 200),
    titleRu: String(input.titleRu ?? "").trim().slice(0, 200) || undefined,
    category: input.category,
    price,
    oldPrice,
    stock,
    brand: String(input.brand ?? "").trim().slice(0, 60) || null,
    image,
    images: images.length ? images : [image],
    original: Boolean(input.original),
    guarantee: Boolean(input.guarantee),
  };

  const id = await updateDb((db) => {
    if (input.id) {
      const p = db.products.find((x) => x.id === input.id);
      if (!p) return null;
      Object.assign(p, fields);
      return p.id;
    }
    const p: Product = { id: nextId(db.products), rating: 0, reviews: 0, ...fields };
    db.products.unshift(p);
    return p.id;
  });
  if (id === null) return { ok: false, error: "Tovar topilmadi — u o'chirilgan bo'lishi mumkin" };
  updateTag("catalog");
  return { ok: true, id };
}

export async function deleteProduct(id: number): Promise<Result> {
  await requireAdmin();
  const used = await updateDb((db) => {
    const banner = db.banners.find((b) => b.productId === id);
    if (banner) return banner.title;
    db.products = db.products.filter((p) => p.id !== id);
    return null;
  });
  if (used) return { ok: false, error: `Bu tovar «${used}» bannerida ishlatilgan. Avval bannerni o'zgartiring` };
  updateTag("catalog");
  return { ok: true };
}

// ——— Buyurtmalar ———

export async function setOrderStatus(id: number, status: OrderStatus): Promise<Result> {
  await requireAdmin();
  if (!orderStatuses.includes(status)) return { ok: false, error: "Noto'g'ri holat" };
  const found = await updateDb((db) => {
    const o = db.orders.find((x) => x.id === id);
    if (o) o.status = status;
    return Boolean(o);
  });
  return found ? { ok: true } : { ok: false, error: "Buyurtma topilmadi" };
}

// ——— Bannerlar ———

export type BannerInput = Omit<Banner, "id"> & { id?: number };

export async function saveBanner(input: BannerInput): Promise<Result> {
  await requireAdmin();
  const title = String(input.title ?? "").trim().slice(0, 40);
  const subtitle = String(input.subtitle ?? "").trim().slice(0, 60);
  const titleRu = String(input.titleRu ?? "").trim().slice(0, 40) || undefined;
  const subtitleRu = String(input.subtitleRu ?? "").trim().slice(0, 60) || undefined;
  const href = String(input.href ?? "").trim();
  const color = String(input.color ?? "");
  const productId = Number(input.productId);

  if (title.length < 2) return { ok: false, error: "Sarlavhani kiriting" };
  if (!/^#[0-9a-f]{6}$/i.test(color)) return { ok: false, error: "Rangni tanlang" };
  if (!href.startsWith("/")) return { ok: false, error: "Havola sayt ichidagi sahifa bo'lishi kerak, masalan /category/kiyim" };

  const res = await updateDb<Result>((db) => {
    if (!db.products.some((p) => p.id === productId)) return { ok: false, error: `ID ${productId} tovar topilmadi` };
    const fields = { title, subtitle, titleRu, subtitleRu, href, color, productId };
    if (input.id) {
      const b = db.banners.find((x) => x.id === input.id);
      if (!b) return { ok: false, error: "Banner topilmadi" };
      Object.assign(b, fields);
    } else {
      db.banners.push({ id: nextId(db.banners), ...fields });
    }
    return { ok: true };
  });
  if (res.ok) updateTag("catalog");
  return res;
}

export async function deleteBanner(id: number): Promise<Result> {
  await requireAdmin();
  await updateDb((db) => {
    db.banners = db.banners.filter((b) => b.id !== id);
  });
  updateTag("catalog");
  return { ok: true };
}

export async function moveBanner(id: number, dir: -1 | 1): Promise<Result> {
  await requireAdmin();
  await updateDb((db) => {
    const i = db.banners.findIndex((b) => b.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= db.banners.length) return;
    [db.banners[i], db.banners[j]] = [db.banners[j], db.banners[i]];
  });
  updateTag("catalog");
  return { ok: true };
}

// ——— Arizalar ———

export async function setApplicationDone(id: number, done: boolean): Promise<Result> {
  await requireAdmin();
  await updateDb((db) => {
    const a = db.applications.find((x) => x.id === id);
    if (a) a.done = Boolean(done);
  });
  return { ok: true };
}

export async function deleteApplication(id: number): Promise<Result> {
  await requireAdmin();
  await updateDb((db) => {
    db.applications = db.applications.filter((a) => a.id !== id);
  });
  return { ok: true };
}
