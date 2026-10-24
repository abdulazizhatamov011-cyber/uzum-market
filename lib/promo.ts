// "Nestle Baby&Me"dan aksiya — uzum.uz/uz/category/nestle-babymedan-aksiya--1561 sahifasidagi tovarlar
import type { Product } from "./types";
import raw from "./promo-nestle.json";

type Raw = (typeof raw)[number];

// Asl sahifadagi turkum tugmalari tartibi
export const nestleSubcategories = [
  "Bolalar ovqati",
  "Bolalar boʻtqasi",
  "Bir yoshdan katta bolalar uchun ozuqa",
  "Bolalar uchun pyure",
  "Bolalar uchun desertlar",
  "Bolalar uchun batonchalar",
  "Bolalar uchun pechenye",
];

export const nestleAges = ["1 oy", "4 oy", "5 oy", "6 oy", "1 yil", "0-2 yil", "2-4 yil"];

function brandOf(title: string) {
  if (/\bnan\b/i.test(title)) return "NAN";
  if (/nestogen/i.test(title)) return "Nestogen";
  if (/gerber/i.test(title)) return "Gerber";
  return "Nestle";
}

function subcategoryOf(title: string, brand: string) {
  if (/pyure/i.test(title)) return "Bolalar uchun pyure";
  if (/batonch/i.test(title)) return "Bolalar uchun batonchalar";
  if (/yulduzcha/i.test(title)) return "Bolalar uchun pechenye";
  if (/bo.?tqa/i.test(title)) return "Bolalar boʻtqasi";
  if ((brand === "NAN" || brand === "Nestogen") && /\b4\b|18|12 oydan/.test(title)) {
    return "Bir yoshdan katta bolalar uchun ozuqa";
  }
  return "Bolalar ovqati";
}

// Nomdagi "6 oydan", "12 oylikdan" kabi yozuvlardan yosh filtri qiymatini olamiz
function ageOf(title: string, brand: string) {
  const m = title.match(/(\d+)\+?\s*oy/i);
  if (m) {
    const months = Number(m[1]);
    if (months >= 18) return "2-4 yil";
    if (months >= 12) return "1 yil";
    if (months <= 1) return "1 oy";
    if (months >= 6) return "6 oy";
    return `${months} oy`;
  }
  if (brand === "NAN" || brand === "Nestogen") return /\b4\b/.test(title) ? "2-4 yil" : "1 yil";
  return "0-2 yil";
}

function toProduct(r: Raw): Product {
  const brand = brandOf(r.title);
  return {
    ...r,
    category: "bolalar",
    images: [r.image.replace("t_product_540_high", "t_product_high")],
    brand,
    stock: 50 + (r.id % 450),
    subcategory: subcategoryOf(r.title, brand),
    age: ageOf(r.title, brand),
    country: brand === "NAN" ? "Germaniya" : "Rossiya",
  };
}

export const nestleProducts: Product[] = raw.map(toProduct);

export const nestlePromo = {
  slug: "nestle-baby-me",
  title: "\"Nestle Baby&Me\"dan aksiya",
  products: nestleProducts,
};
