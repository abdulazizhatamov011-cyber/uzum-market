"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, monthly } from "@/lib/data";
import { useStore } from "./StoreProvider";
import { CartPlusIcon, HeartIcon, StarIcon } from "./Icons";

export default function ProductCard({ product: p }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const fav = isFavorite(p.id);
  const discount = Math.round((1 - p.price / p.oldPrice) * 100);

  return (
    <div className="group relative flex flex-col rounded-xl transition hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
      <Link href={`/product/${p.id}`} className="relative block aspect-[3/4] rounded-xl overflow-hidden bg-[#f2f4f7]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
        {discount >= 30 && (
          <span className="absolute left-2 bottom-2 rounded-md bg-brand text-white text-[11px] font-semibold px-1.5 py-0.5">
            ARZON NARX KAFOLATI
          </span>
        )}
        {discount < 30 && discount >= 15 && (
          <span className="absolute left-2 bottom-2 rounded-md bg-[#ff4d6a] text-white text-[11px] font-semibold px-1.5 py-0.5">
            −{discount}%
          </span>
        )}
      </Link>
      <button
        aria-label="Saralanganlarga qo'shish"
        onClick={() => toggleFavorite(p.id)}
        className={`absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-full ${
          fav ? "text-brand" : "text-ink/70 hover:text-brand"
        }`}
      >
        <HeartIcon filled={fav} />
      </button>

      <div className="flex flex-col flex-1 px-1.5 pt-2 pb-2">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-[15px]">{formatPrice(p.price)} so&apos;m</span>
        </div>
        <span className="text-xs text-muted line-through">{formatPrice(p.oldPrice)} so&apos;m</span>
        <span className="mt-1 self-start rounded bg-[#ffff00] px-1 text-[12px] font-medium">
          {formatPrice(monthly(p.price))} so&apos;m/oyiga
        </span>
        <Link href={`/product/${p.id}`} className="mt-1.5 text-[13px] leading-snug line-clamp-2 hover:text-brand">
          {p.title}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-[12px] text-muted">
          <StarIcon /> {p.rating.toFixed(1)} ({formatPrice(p.reviews)} sharhlar)
        </div>
        <div className="flex-1 min-h-3" />
        <button
          onClick={() => addToCart(p.id)}
          className="h-9 rounded-lg bg-brand text-white text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-brand-dark active:scale-[0.98] transition"
        >
          <CartPlusIcon /> Ertaga
        </button>
      </div>
    </div>
  );
}
