import type { Banner, Category, Product } from "./types";
import { products as baseProducts } from "./products";
import { nestleProducts } from "./promo";

// Boshlang'ich tovarlar — server bazasi (data/db.json) birinchi marta yaratilganda shulardan to'ldiriladi.
// Sayt va admin panel tovarlarni bazadan o'qiydi (lib/catalog.ts).
export const seedProducts = [...baseProducts, ...nestleProducts];

export const categories: Category[] = [
  { slug: "elektronika", name: "Elektronika", icon: "📱", cover: 124 },
  { slug: "maishiy-texnika", name: "Maishiy texnika", icon: "🔌", cover: 51 },
  { slug: "kiyim", name: "Kiyim", icon: "👕", cover: 85 },
  { slug: "poyabzal", name: "Poyabzallar", icon: "👟", cover: 88 },
  { slug: "aksessuarlar", name: "Aksessuarlar", icon: "⌚", cover: 97 },
  { slug: "gozallik", name: "Go'zallik va parvarish", icon: "💄", cover: 8 },
  { slug: "mebel", name: "Mebel", icon: "🛋️", cover: 12 },
  { slug: "uy-rozgor", name: "Uy-ro'zg'or buyumlari", icon: "🏠", cover: 47 },
  { slug: "oziq-ovqat", name: "Oziq-ovqat mahsulotlari", icon: "🛒", cover: 27 },
  { slug: "sport", name: "Sport va hordiq", icon: "⚽", cover: 151 },
  { slug: "hayvonlar", name: "Uy hayvonlari uchun", icon: "🐾", cover: 18 },
  { slug: "bolalar", name: "Bolalar tovarlari", icon: "🧸", cover: 918735 },
];

export const navLinks = [
  { label: "Muddatli to'lov", href: "/category/elektronika", accent: true },
  { label: "Hafta tovarlari", href: "/category/gozallik" },
  { label: "Sizning go'zalligingiz", href: "/category/gozallik" },
  { label: "Elektronika", href: "/category/elektronika" },
  { label: "Maishiy texnika", href: "/category/maishiy-texnika" },
  { label: "Kiyim", href: "/category/kiyim" },
  { label: "Poyabzallar", href: "/category/poyabzal" },
  { label: "Mebel", href: "/category/mebel" },
  { label: "Oziq-ovqat", href: "/category/oziq-ovqat" },
];

// Boshlang'ich bannerlar (bazaga bir marta yoziladi, keyin admin paneldan boshqariladi)
export const seedBanners: Omit<Banner, "id">[] = [
  { title: "Nestlé Baby&Me", subtitle: "Bolalar ozuqasiga 30% gacha chegirma", color: "#ea580c", productId: 918735, href: "/promo/nestle-baby-me" },
  { title: "Muddatli to'lov", subtitle: "0% ustama bilan 12 oygacha", color: "#13234a", productId: 100, href: "/category/elektronika" },
  { title: "Elektronika haftaligi", subtitle: "Noutbuklarga −25% gacha", color: "#1f5fbf", productId: 79, href: "/category/elektronika" },
  { title: "Go'zallik kunlari", subtitle: "Atir va kosmetika arzon narxda", color: "#c2255c", productId: 6, href: "/category/gozallik" },
  { title: "Oshxona uchun", subtitle: "Maishiy texnika — ertaga yetkazamiz", color: "#2f7d4f", productId: 51, href: "/category/maishiy-texnika" },
];


// Turkum rasmi: tanlangan tovar, u o'chirilgan bo'lsa — turkumdagi eng ommabop tovar
export function categoryCover(c: Category, products: Product[]) {
  const chosen = products.find((p) => p.id === c.cover);
  if (chosen) return chosen.image;
  return products.filter((p) => p.category === c.slug).sort((a, b) => b.reviews - a.reviews)[0]?.image;
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function formatPrice(n: number) {
  return n.toLocaleString("ru-RU").replace(/,/g, " ");
}

export function monthly(price: number) {
  return Math.ceil(price / 12 / 10) * 10;
}

export const cities = [
  "Toshkent",
  "Samarqand",
  "Buxoro",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Qarshi",
  "Nukus",
  "Jizzax",
  "Termiz",
  "Urganch",
  "Navoiy",
  "Guliston",
];

// Namunaviy topshirish punktlari (o'quv loyihasi uchun to'qilgan manzillar)
export const pickupPoints = cities.flatMap((city, i) =>
  ["Markaziy", "Bozor yonida", "Yangi mavze"].map((place, k) => ({
    id: i * 10 + k,
    city,
    name: `${city}, ${place}`,
    address: `${city} sh., ${["Mustaqillik", "Navoiy", "Amir Temur"][k]} ko'chasi, ${12 + i * 3 + k}-uy`,
    hours: k === 2 ? "10:00 – 20:00" : "09:00 – 21:00",
  }))
);

const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];

// Toshkent vaqti (UTC+5, yozgi vaqt yo'q) bo'yicha — server va brauzerda bir xil natija beradi
export function formatDateTime(iso: string) {
  const d = new Date(Date.parse(iso) + 5 * 3600_000);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${d.getUTCDate()}-${MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}, ${hh}:${mm}`;
}
