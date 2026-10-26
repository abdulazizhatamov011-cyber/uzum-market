import type { Category } from "./types";
import { products as baseProducts } from "./products";
import { nestleProducts } from "./promo";

export const products = [...baseProducts, ...nestleProducts];

export const categories: Category[] = [
  { slug: "elektronika", name: "Elektronika", icon: "📱" },
  { slug: "maishiy-texnika", name: "Maishiy texnika", icon: "🔌" },
  { slug: "kiyim", name: "Kiyim", icon: "👕" },
  { slug: "poyabzal", name: "Poyabzallar", icon: "👟" },
  { slug: "aksessuarlar", name: "Aksessuarlar", icon: "⌚" },
  { slug: "gozallik", name: "Go'zallik va parvarish", icon: "💄" },
  { slug: "mebel", name: "Mebel", icon: "🛋️" },
  { slug: "uy-rozgor", name: "Uy-ro'zg'or buyumlari", icon: "🏠" },
  { slug: "oziq-ovqat", name: "Oziq-ovqat mahsulotlari", icon: "🛒" },
  { slug: "sport", name: "Sport va hordiq", icon: "⚽" },
  { slug: "hayvonlar", name: "Uy hayvonlari uchun", icon: "🐾" },
  { slug: "bolalar", name: "Bolalar tovarlari", icon: "🧸" },
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

// Bosh sahifa bannerlari: tekis rangli fon, sarlavha va mahsulot rasmi (BannerSlide chizadi)
export type Banner = { title: string; subtitle: string; color: string; productId: number; href: string };

export const banners: Banner[] = [
  { title: "Nestlé Baby&Me", subtitle: "Bolalar ozuqasiga 30% gacha chegirma", color: "#ea580c", productId: 918735, href: "/promo/nestle-baby-me" },
  { title: "Muddatli to'lov", subtitle: "0% ustama bilan 12 oygacha", color: "#13234a", productId: 100, href: "/category/elektronika" },
  { title: "Elektronika haftaligi", subtitle: "Noutbuklarga −25% gacha", color: "#1f5fbf", productId: 79, href: "/category/elektronika" },
  { title: "Go'zallik kunlari", subtitle: "Atir va kosmetika arzon narxda", color: "#c2255c", productId: 6, href: "/category/gozallik" },
  { title: "Oshxona uchun", subtitle: "Maishiy texnika — ertaga yetkazamiz", color: "#2f7d4f", productId: 51, href: "/category/maishiy-texnika" },
];

export const quickCategories = [
  { label: "Elektronika", href: "/category/elektronika", icon: "🎧" },
  { label: "Har kuni uchun", href: "/category/oziq-ovqat", icon: "🧴" },
  { label: "Moda", href: "/category/kiyim", icon: "🧥" },
  { label: "Uy uchun", href: "/category/uy-rozgor", icon: "🧸" },
];

export function getProduct(id: number) {
  return products.find((p) => p.id === id);
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
