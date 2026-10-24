"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartItem = { id: number; qty: number };

export type User = { name: string; phone: string };

export type Order = {
  id: number;
  date: string;
  items: { id: number; qty: number; price: number }[];
  total: number;
  name: string;
  phone: string;
  delivery: string;
  payment: string;
  status: "Yig'ilmoqda" | "Yo'lda" | "Yetkazildi";
};

type Store = {
  cart: CartItem[];
  favorites: number[];
  cartCount: number;
  user: User | null;
  orders: Order[];
  city: string;
  addToCart: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  login: (user: User) => void;
  logout: () => void;
  placeOrder: (order: Omit<Order, "id" | "date" | "status">) => Order;
  setCity: (city: string) => void;
};

const StoreContext = createContext<Store | null>(null);

// localStorage'dagi qiymat buzilgan yoki eski formatda bo'lsa, standart qiymat qaytariladi
function load<T>(key: string, fallback: T, valid: (v: unknown) => boolean): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value: unknown = JSON.parse(raw);
    return valid(value) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const isCart = (v: unknown) =>
  Array.isArray(v) && v.every((i) => isObj(i) && typeof i.id === "number" && typeof i.qty === "number");
const isIds = (v: unknown) => Array.isArray(v) && v.every((i) => typeof i === "number");
const isUser = (v: unknown) => v === null || (isObj(v) && typeof v.name === "string" && typeof v.phone === "string");
const isOrders = (v: unknown) =>
  Array.isArray(v) && v.every((o) => isObj(o) && typeof o.id === "number" && Array.isArray(o.items));

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [city, setCity] = useState("Toshkent");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(load("cart", [], isCart));
    setFavorites(load("favorites", [], isIds));
    setUser(load("user", null, isUser));
    setOrders(load("orders", [], isOrders));
    setCity(load("city", "Toshkent", (v) => typeof v === "string"));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("favorites", JSON.stringify(favorites));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("orders", JSON.stringify(orders));
      localStorage.setItem("city", JSON.stringify(city));
    } catch {}
  }, [cart, favorites, user, orders, city, ready]);

  const store: Store = {
    cart,
    favorites,
    cartCount: cart.reduce((s, i) => s + i.qty, 0),
    user,
    orders,
    city,
    addToCart: (id) =>
      setCart((c) =>
        c.some((i) => i.id === id)
          ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
          : [...c, { id, qty: 1 }]
      ),
    setQty: (id, qty) =>
      setCart((c) =>
        qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty } : i))
      ),
    removeFromCart: (id) => setCart((c) => c.filter((i) => i.id !== id)),
    clearCart: () => setCart([]),
    toggleFavorite: (id) =>
      setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    isFavorite: (id) => favorites.includes(id),
    login: setUser,
    logout: () => setUser(null),
    placeOrder: (data) => {
      const order: Order = {
        ...data,
        id: 10000000 + Math.floor(Math.random() * 89999999),
        date: new Date().toISOString(),
        status: "Yig'ilmoqda",
      };
      setOrders((o) => [order, ...o]);
      return order;
    },
    setCity,
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
