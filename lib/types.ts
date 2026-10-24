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
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
};
