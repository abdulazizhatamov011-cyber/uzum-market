"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { formatPrice, monthly } from "@/lib/data";
import { useStore } from "@/components/StoreProvider";
import { HeartIcon, StarIcon } from "@/components/Icons";

export default function ProductDetails({ product: p }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite, cart, setQty } = useStore();
  const router = useRouter();
  const [img, setImg] = useState(0);
  const gallery = p.images.length ? p.images : [p.image];
  const inCart = cart.find((i) => i.id === p.id);
  const fav = isFavorite(p.id);

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1fr_1fr_340px]">
      {/* Galereya */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="hidden sm:flex flex-col gap-2">
          {gallery.map((src, k) => (
            <button
              key={src}
              onClick={() => setImg(k)}
              className={`w-16 h-20 rounded-lg overflow-hidden bg-[#f2f4f7] border-2 ${k === img ? "border-brand" : "border-transparent"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0 aspect-[3/4] rounded-2xl bg-[#f2f4f7] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gallery[img]} alt={p.title} className="w-full h-full object-contain p-6" />
        </div>
      </div>

      {/* Ma'lumot */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <StarIcon /> <span className="text-ink">{p.rating.toFixed(1)}</span> ({formatPrice(p.reviews)} sharhlar) ·{" "}
          {formatPrice(p.reviews * 7)} ta buyurtma
        </div>
        <h1 className="text-2xl font-semibold mt-2 leading-snug">{p.title}</h1>
        <dl className="mt-6 grid grid-cols-[140px_1fr] gap-y-3 text-sm">
          {p.brand && (
            <>
              <dt className="text-muted">Brend</dt>
              <dd>{p.brand}</dd>
            </>
          )}
          <dt className="text-muted">Omborda</dt>
          <dd>{p.stock} dona</dd>
          <dt className="text-muted">Yetkazib berish</dt>
          <dd>Ertaga, bepul — topshirish punktiga</dd>
          <dt className="text-muted">Sotuvchi</dt>
          <dd className="text-brand">{p.brand ?? "Uzum"} Store</dd>
        </dl>
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Mahsulot haqida qisqacha</h3>
          <ul className="list-disc pl-5 text-sm text-muted space-y-1">
            <li>Original mahsulot, sifat kafolati bilan</li>
            <li>10 kun ichida qaytarish imkoniyati</li>
            <li>Uzum Nasiya orqali muddatli to&apos;lov</li>
          </ul>
        </div>
      </div>

      {/* Xarid kartasi */}
      <aside className="md:col-span-2 lg:col-span-1 lg:sticky lg:top-32 self-start rounded-2xl border border-line p-5 shadow-sm">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">{formatPrice(p.price)} so&apos;m</span>
        </div>
        <div className="text-muted line-through text-sm">{formatPrice(p.oldPrice)} so&apos;m</div>
        <div className="mt-3 rounded-xl bg-[#ffff00]/80 px-3 py-2 text-sm">
          Oyiga <b>{formatPrice(monthly(p.price))} so&apos;m</b> dan — muddatli to&apos;lov
        </div>
        <div className="mt-5 flex gap-2">
          {inCart ? (
            <div className="flex-1 flex items-center justify-between h-12 rounded-xl bg-brand-soft text-brand font-semibold px-2">
              <button className="w-9 h-9 rounded-lg hover:bg-white" onClick={() => setQty(p.id, inCart.qty - 1)}>−</button>
              <Link href="/cart">{inCart.qty} ta savatda</Link>
              <button className="w-9 h-9 rounded-lg hover:bg-white" onClick={() => setQty(p.id, inCart.qty + 1)}>+</button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(p.id)}
              className="flex-1 h-12 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition"
            >
              Savatga qo&apos;shish
            </button>
          )}
          <button
            aria-label="Saralangan"
            onClick={() => toggleFavorite(p.id)}
            className={`w-12 h-12 grid place-items-center rounded-xl border border-line ${fav ? "text-brand" : ""}`}
          >
            <HeartIcon filled={fav} />
          </button>
        </div>
        <button
          onClick={() => {
            if (!inCart) addToCart(p.id);
            router.push("/checkout");
          }}
          className="mt-2 w-full h-12 rounded-xl border border-brand text-brand font-semibold hover:bg-brand-soft transition">
          Tugmani 1 bosishda xarid qilish
        </button>
        <p className="mt-4 text-sm text-muted">🚚 Ertaga yetkazib beramiz</p>
      </aside>
    </div>
  );
}
