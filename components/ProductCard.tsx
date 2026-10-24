"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, monthly } from "@/lib/data";
import { useStore } from "./StoreProvider";
import { CartPlusIcon, HeartIcon, StarIcon } from "./Icons";

export default function ProductCard({ product: p, compact }: { product: Product; compact?: boolean }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const fav = isFavorite(p.id);
  const discount = Math.round((1 - p.price / p.oldPrice) * 100);
  // Uzum rasmlari 3:4 formatda — kartochkani to'liq egallaydi; boshqalari ichiga sig'diriladi
  const fullBleed = p.image.includes("images.uzum.uz");
  const guarantee = p.guarantee ?? discount >= 30;

  return (
    <div className="group relative flex flex-col">
      <Link href={`/product/${p.id}`} className="relative block aspect-[3/4] rounded-xl overflow-hidden bg-[#f2f4f7]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
            fullBleed ? "object-cover" : "object-contain p-3"
          }`}
        />
        <div className="absolute left-1.5 right-1.5 bottom-1.5 flex flex-col items-start gap-1">
          {p.original && (
            <span className="flex items-center gap-1 rounded-md bg-white text-ink text-[10px] font-semibold px-1.5 py-0.5 shadow-sm">
              <CheckBadge /> ORIGINAL
            </span>
          )}
          {guarantee ? (
            <span className="max-w-full truncate whitespace-nowrap rounded-md bg-[#ff2e7e] text-white text-[10px] font-bold px-1.5 py-0.5">ARZON NARX KAFOLATI</span>
          ) : (
            discount >= 15 && (
              <span className="rounded-md bg-[#ff2e7e] text-white text-[11px] font-bold px-1.5 py-0.5">−{discount}%</span>
            )
          )}
        </div>
      </Link>
      <button
        aria-label="Saralanganlarga qo'shish"
        onClick={() => toggleFavorite(p.id)}
        className={`absolute top-1.5 right-1.5 w-8 h-8 grid place-items-center rounded-full bg-white/60 backdrop-blur-sm ${
          fav ? "text-brand" : "text-ink/80 hover:text-brand"
        }`}
      >
        <HeartIcon filled={fav} className="w-[18px] h-[18px]" />
      </button>

      <div className="flex flex-col flex-1 px-1 pt-2">
        <span className="font-semibold text-[15px] sm:text-base leading-tight">{formatPrice(p.price)}</span>
        <span className="text-[12px] text-muted leading-tight mt-0.5">{formatPrice(p.oldPrice)}</span>
        <span className="mt-1 self-start rounded bg-[#ffff00] px-1 text-[12px] leading-[18px]">
          {formatPrice(monthly(p.price))} so&apos;mdan
        </span>
        <Link
          href={`/product/${p.id}`}
          className={`mt-1 text-[13px] leading-[1.35] hover:text-brand ${compact ? "line-clamp-2 min-h-[35px]" : "line-clamp-2"}`}
        >
          {p.title}
        </Link>
        {!compact && (
          <div className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
            <StarIcon /> {p.rating.toFixed(1)} ({formatPrice(p.reviews)} sharhlar)
          </div>
        )}
        <div className="flex-1 min-h-2" />
        <button
          onClick={() => addToCart(p.id)}
          className={`h-9 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] transition ${
            compact ? "bg-brand-soft text-brand hover:bg-[#e2d4ff]" : "bg-brand text-white hover:bg-brand-dark"
          }`}
        >
          <CartPlusIcon /> Ertaga
        </button>
      </div>
    </div>
  );
}

function CheckBadge() {
  return (
    <svg viewBox="0 0 16 16" className="w-3 h-3" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#00a94f" />
      <path d="M4.5 8.2l2.3 2.3 4.7-4.8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
