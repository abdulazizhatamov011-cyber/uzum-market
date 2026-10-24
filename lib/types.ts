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
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
};
