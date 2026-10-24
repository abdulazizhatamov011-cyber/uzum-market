import type { Category } from "./types";
import { products } from "./products";

export { products };

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

// Banner bosilganda ochiladigan sahifa
const BANNER_LINK = "https://uzum.uz/uz/category/nestle-babymedan-aksiya--1561";

// Uzum Market bosh sahifasidagi bannerlar (1350×450)
export const banners = [
  { image: "https://images.uzum.uz/db6ubkjct6rc739jhae0/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/db7np4u3g3rc73agndd0/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dallaedkiblcbcb7g3c0/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbblg3m7vp7s73c15tng/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbbhc7m7vabc738erqpg/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbb2itijv54c73aro9g0/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbbip2m7vabc738eslhg/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbbfss9ndubc73cl5ci0/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbbgodijv54c73arrml0/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbbgpopndubc73cl5ji0/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbbgqnm7vabc738erh90/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbbgrlqjv54c73arro90/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbbgste7vabc738erikg/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/db6v97ijv54c73euvcr0/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbbgtj2jv54c73arrpr0/main_page_banner.jpg", href: BANNER_LINK },
  { image: "https://images.uzum.uz/dbe6uiaud09c73a7t9l0/main_page_banner.jpg", href: BANNER_LINK },
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
