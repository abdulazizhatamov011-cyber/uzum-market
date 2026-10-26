import type { Banner, Category, Product } from "./types";
import { getDict, type Lang } from "./i18n";
import productsRu from "./products-ru.json";
import { products as baseProducts } from "./products";
import { nestleProducts } from "./promo";

// Boshlang'ich tovarlar — server bazasi (data/db.json) birinchi marta yaratilganda shulardan to'ldiriladi.
// Sayt va admin panel tovarlarni bazadan o'qiydi (lib/catalog.ts).
export const seedProducts = [...baseProducts, ...nestleProducts];

export const categories: Category[] = [
  { slug: "elektronika", name: "Elektronika", nameRu: "Электроника", icon: "📱", cover: 124 },
  { slug: "maishiy-texnika", name: "Maishiy texnika", nameRu: "Бытовая техника", icon: "🔌", cover: 51 },
  { slug: "kiyim", name: "Kiyim", nameRu: "Одежда", icon: "👕", cover: 85 },
  { slug: "poyabzal", name: "Poyabzallar", nameRu: "Обувь", icon: "👟", cover: 88 },
  { slug: "aksessuarlar", name: "Aksessuarlar", nameRu: "Аксессуары", icon: "⌚", cover: 97 },
  { slug: "gozallik", name: "Go'zallik va parvarish", nameRu: "Красота и уход", icon: "💄", cover: 8 },
  { slug: "mebel", name: "Mebel", nameRu: "Мебель", icon: "🛋️", cover: 12 },
  { slug: "uy-rozgor", name: "Uy-ro'zg'or buyumlari", nameRu: "Товары для дома", icon: "🏠", cover: 47 },
  { slug: "oziq-ovqat", name: "Oziq-ovqat mahsulotlari", nameRu: "Продукты питания", icon: "🛒", cover: 27 },
  { slug: "sport", name: "Sport va hordiq", nameRu: "Спорт и отдых", icon: "⚽", cover: 151 },
  { slug: "hayvonlar", name: "Uy hayvonlari uchun", nameRu: "Для животных", icon: "🐾", cover: 18 },
  { slug: "bolalar", name: "Bolalar tovarlari", nameRu: "Детские товары", icon: "🧸", cover: 918735 },
];

export const navLinks = [
  { label: "Muddatli to'lov", labelRu: "Рассрочка", href: "/category/elektronika", accent: true },
  { label: "Hafta tovarlari", labelRu: "Товары недели", href: "/category/gozallik" },
  { label: "Sizning go'zalligingiz", labelRu: "Ваша красота", href: "/category/gozallik" },
  { label: "Elektronika", labelRu: "Электроника", href: "/category/elektronika" },
  { label: "Maishiy texnika", labelRu: "Бытовая техника", href: "/category/maishiy-texnika" },
  { label: "Kiyim", labelRu: "Одежда", href: "/category/kiyim" },
  { label: "Poyabzallar", labelRu: "Обувь", href: "/category/poyabzal" },
  { label: "Mebel", labelRu: "Мебель", href: "/category/mebel" },
  { label: "Oziq-ovqat", labelRu: "Продукты", href: "/category/oziq-ovqat" },
];

// Boshlang'ich bannerlar (bazaga bir marta yoziladi, keyin admin paneldan boshqariladi)
export const seedBanners: Omit<Banner, "id">[] = [
  { title: "Nestlé Baby&Me", subtitle: "Bolalar ozuqasiga 30% gacha chegirma", titleRu: "Nestlé Baby&Me", subtitleRu: "Скидки до 30% на детское питание", color: "#ea580c", productId: 918735, href: "/promo/nestle-baby-me" },
  { title: "Muddatli to'lov", subtitle: "0% ustama bilan 12 oygacha", titleRu: "Рассрочка", subtitleRu: "До 12 месяцев без переплаты", color: "#13234a", productId: 100, href: "/category/elektronika" },
  { title: "Elektronika haftaligi", subtitle: "Noutbuklarga −25% gacha", titleRu: "Неделя электроники", subtitleRu: "Ноутбуки со скидкой до −25%", color: "#1f5fbf", productId: 79, href: "/category/elektronika" },
  { title: "Go'zallik kunlari", subtitle: "Atir va kosmetika arzon narxda", titleRu: "Дни красоты", subtitleRu: "Парфюм и косметика по низким ценам", color: "#c2255c", productId: 6, href: "/category/gozallik" },
  { title: "Oshxona uchun", subtitle: "Maishiy texnika — ertaga yetkazamiz", titleRu: "Для кухни", subtitleRu: "Бытовая техника — доставим завтра", color: "#2f7d4f", productId: 51, href: "/category/maishiy-texnika" },
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

// ——— Tarjima yordamchilari ———

const cityRu: Record<string, string> = {
  Toshkent: "Ташкент", Samarqand: "Самарканд", Buxoro: "Бухара", Andijon: "Андижан", "Farg'ona": "Фергана",
  Namangan: "Наманган", Qarshi: "Карши", Nukus: "Нукус", Jizzax: "Джизак", Termiz: "Термез",
  Urganch: "Ургенч", Navoiy: "Навои", Guliston: "Гулистан",
};
// Shahar qiymati (bazada) o'zbekcha qoladi — faqat ko'rsatishda tarjima qilinadi
export const cityName = (city: string, lang: Lang) => (lang === "ru" ? (cityRu[city] ?? city) : city);

export const catName = (c: Category, lang: Lang) => (lang === "ru" ? c.nameRu : c.name);

const seedRu = productsRu as Record<string, string>;
export const productTitle = (p: Product, lang: Lang) =>
  lang === "ru" ? (p.titleRu || seedRu[p.id] || p.title) : p.title;

export const bannerTitle = (b: Banner, lang: Lang) => (lang === "ru" && b.titleRu) || b.title;
export const bannerSubtitle = (b: Banner, lang: Lang) => (lang === "ru" && b.subtitleRu) || b.subtitle;

// Topshirish punktlari tanlangan tilda (id va shahar bir xil — buyurtmada id saqlanadi)
export function pickupPointsFor(lang: Lang) {
  const t = getDict(lang).pickup;
  return pickupPoints.map((p) => {
    const k = p.id % 10;
    const i = Math.floor(p.id / 10);
    const city = cityName(p.city, lang);
    return { ...p, name: `${city}, ${t.places[k]}`, address: t.address(city, t.streets[k], 12 + i * 3 + k) };
  });
}

// Buyurtmadagi (bazada o'zbekcha saqlangan) yetkazish va to'lov matnini tanlangan tilda ko'rsatish
export function localizeDelivery(delivery: string, lang: Lang) {
  if (lang === "uz") return delivery;
  const t = getDict(lang).orders;
  if (delivery.startsWith("Topshirish punkti: ")) {
    const addr = delivery.slice("Topshirish punkti: ".length);
    const point = pickupPoints.find((p) => p.address === addr);
    const local = point ? pickupPointsFor(lang).find((p) => p.id === point.id)?.address : undefined;
    return `${t.pickupPrefix} ${local ?? addr}`;
  }
  if (delivery.startsWith("Kuryer: ")) {
    const rest = delivery.slice("Kuryer: ".length);
    const [city, ...addr] = rest.split(", ");
    return `${t.courierPrefix} ${[cityName(city, lang), ...addr].join(", ")}`;
  }
  return delivery;
}

export function localizePayment(payment: string, lang: Lang) {
  const uz = getDict("uz").payments;
  const key = (Object.keys(uz) as (keyof typeof uz)[]).find((k) => uz[k] === payment);
  return key ? getDict(lang).payments[key] : payment;
}
