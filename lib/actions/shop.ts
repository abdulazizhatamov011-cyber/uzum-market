"use server";

// Xaridor tomonidagi server amallari: buyurtma, buyurtmalar holati, arizalar.
// Narx va jami summa serverda bazadagi narxdan hisoblanadi — brauzerdan faqat tovar ID va soni olinadi.
import { updateTag } from "next/cache";
import { nextId, readDb, updateDb } from "../db";
import { cities, pickupPoints } from "../data";
import { applicationKinds, type Application, type ApplicationKind, type Order } from "../types";

const PAYMENTS = ["Karta orqali (Uzcard / Humo)", "Naqd pul — olayotganda", "Bozorcha Nasiya — muddatli to'lov"];

type OrderInput = {
  items: { id: number; qty: number }[];
  name: string;
  phone: string; // 9 ta raqam, +998 siz
  city: string;
  method: "pickup" | "courier";
  pointId?: number;
  address?: string;
  payment: string;
};

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const formatPhone = (d: string) => `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;

export async function createOrder(input: OrderInput): Promise<Result<Order>> {
  const name = String(input?.name ?? "").trim().slice(0, 80);
  const phone = String(input?.phone ?? "");
  if (name.length < 2) return { ok: false, error: "Qabul qiluvchining ismini kiriting" };
  if (!/^\d{9}$/.test(phone)) return { ok: false, error: "Telefon raqamini to'liq kiriting" };
  if (!PAYMENTS.includes(input.payment)) return { ok: false, error: "To'lov usulini tanlang" };
  if (!cities.includes(input.city)) return { ok: false, error: "Shaharni tanlang" };

  let delivery: string;
  if (input.method === "pickup") {
    const point = pickupPoints.find((p) => p.id === input.pointId && p.city === input.city);
    if (!point) return { ok: false, error: "Topshirish punktini tanlang" };
    delivery = `Topshirish punkti: ${point.address}`;
  } else {
    const address = String(input.address ?? "").trim().slice(0, 200);
    if (address.length < 5) return { ok: false, error: "Yetkazish manzilini kiriting" };
    delivery = `Kuryer: ${input.city}, ${address}`;
  }

  const wanted = (Array.isArray(input.items) ? input.items : [])
    .map((i) => ({ id: Number(i.id), qty: Math.floor(Number(i.qty)) }))
    .filter((i) => Number.isFinite(i.id) && i.qty > 0 && i.qty <= 99);
  if (!wanted.length) return { ok: false, error: "Savat bo'sh" };

  const result = await updateDb<Result<Order>>((db) => {
    const items: Order["items"] = [];
    for (const w of wanted) {
      const p = db.products.find((x) => x.id === w.id);
      if (!p) return { ok: false, error: "Savatdagi tovarlardan biri sotuvdan olingan. Savatni yangilang" };
      if (p.stock < w.qty) return { ok: false, error: `«${p.title}» omborda ${p.stock} dona qolgan` };
      items.push({ id: p.id, qty: w.qty, price: p.price, title: p.title, image: p.image });
    }
    for (const it of items) db.products.find((x) => x.id === it.id)!.stock -= it.qty;

    // Buyurtma raqami taxmin qilib bo'lmaydigan 8 xonali son — boshqalarning buyurtmasini ko'rib bo'lmasin
    let id: number;
    do id = 10_000_000 + Math.floor(Math.random() * 89_999_999);
    while (db.orders.some((o) => o.id === id));

    const order: Order = {
      id,
      date: new Date().toISOString(),
      items,
      total: items.reduce((s, i) => s + i.price * i.qty, 0),
      name,
      phone: formatPhone(phone),
      delivery,
      payment: input.payment,
      status: "Yangi",
    };
    db.orders.unshift(order);
    return { ok: true, data: order };
  });

  // Qoldiq o'zgardi — katalog keshini yangilaymiz
  if (result.ok) updateTag("catalog");
  return result;
}

// "Buyurtmalarim" sahifasi: brauzerda saqlangan buyurtma raqamlari bo'yicha joriy holatni oladi
export async function getOrdersByIds(ids: number[]): Promise<Order[]> {
  const set = new Set((Array.isArray(ids) ? ids : []).slice(0, 100).map(Number));
  const db = await readDb();
  return db.orders.filter((o) => set.has(o.id));
}

type ApplicationInput = { kind: ApplicationKind; name: string; phone: string; city: string; extra: string };

export async function createApplication(input: ApplicationInput): Promise<Result<null>> {
  const name = String(input?.name ?? "").trim().slice(0, 80);
  const phone = String(input?.phone ?? "");
  if (!(input?.kind in applicationKinds)) return { ok: false, error: "Noma'lum ariza turi" };
  if (name.length < 2) return { ok: false, error: "Ismingizni kiriting" };
  if (!/^\d{9}$/.test(phone)) return { ok: false, error: "Telefon raqamini to'liq kiriting" };
  if (!cities.includes(input.city)) return { ok: false, error: "Shaharni tanlang" };

  await updateDb((db) => {
    const app: Application = {
      id: nextId(db.applications),
      date: new Date().toISOString(),
      kind: input.kind,
      name,
      phone: formatPhone(phone),
      city: input.city,
      extra: String(input.extra ?? "").trim().slice(0, 500),
      done: false,
    };
    db.applications.unshift(app);
  });
  return { ok: true, data: null };
}
