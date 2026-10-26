export type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  brand: string | null;
  stock: number;
  // Aksiya sahifalaridagi mahsulotlar uchun qo'shimcha belgilar
  original?: boolean;
  guarantee?: boolean;
  subcategory?: string;
  age?: string;
  country?: string;
  // Qaysi aksiya sahifasiga tegishli (masalan, "nestle-baby-me")
  promo?: string;
  // Ruscha nomi (bo'lmasa o'zbekchasi ko'rsatiladi)
  titleRu?: string;
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
  nameRu: string;
  // Turkum belgisi o'rnida ko'rsatiladigan tovar (rasmi)
  cover: number;
};

// Bosh sahifa banneri: tekis rangli fon, sarlavha va tanlangan mahsulot rasmi
export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  titleRu?: string;
  subtitleRu?: string;
  color: string;
  productId: number;
  href: string;
};

export const orderStatuses = ["Yangi", "Yig'ilmoqda", "Yo'lda", "Yetkazildi", "Bekor qilindi"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export type Order = {
  id: number;
  date: string;
  items: { id: number; qty: number; price: number; title: string; image: string }[];
  total: number;
  name: string;
  phone: string;
  delivery: string;
  payment: string;
  status: OrderStatus;
};

export const applicationKinds = {
  seller: "Sotuvchi bo'lish",
  pickup: "Topshirish punkti ochish",
  job: "Vakansiya",
  contact: "Murojaat",
} as const;
export type ApplicationKind = keyof typeof applicationKinds;

export type Application = {
  id: number;
  date: string;
  kind: ApplicationKind;
  name: string;
  phone: string;
  city: string;
  extra: string;
  done: boolean;
};
