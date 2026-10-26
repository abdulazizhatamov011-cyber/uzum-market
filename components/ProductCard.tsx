"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, monthly } from "@/lib/data";
import { useStore } from "./StoreProvider";
import { CartPlusIcon, HeartIcon, StarIcon } from "./Icons";

export default function ProductCard({ product: p, compact }: { product: Product; compact?: boolean }) {
  const { addToCart, toggleFavorite, isFavorite, cart } = useStore();
  const fav = isFavorite(p.id);
  const inCart = cart.some((i) => i.id === p.id);
  const discount = Math.round((1 - p.price / p.oldPrice) * 100);
  // images.uzum.uz rasmlari 3:4 formatda — maydonni to'liq egallaydi; boshqalari ichiga sig'diriladi
  const fullBleed = p.image.includes("images.uzum.uz");
  const guarantee = p.guarantee ?? discount >= 30;

  return (
    <div className="group relative flex flex-col h-full rounded-[18px] bg-white border border-line p-1.5 transition-colors hover:border-[#c9d4e8]">
      <Link href={`/product/${p.id}`} className="relative block aspect-[4/5] rounded-[13px] overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className={`w-full h-full ${fullBleed ? "object-cover" : "object-contain p-4"}`}
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {p.original && (
            <span className="flex items-center gap-1 rounded-full bg-white/95 text-ink text-[11px] font-medium pl-1 pr-2 py-0.5">
              <CheckBadge /> Original
            </span>
          )}
          {guarantee && !compact && (
            <span className="rounded-full bg-cobalt text-white text-[11px] font-medium px-2 py-0.5">Kafolatlangan narx</span>
          )}
        </div>
        <PriceTag price={p.price} />
      </Link>
      <button
        aria-label={fav ? "Saralangandan olib tashlash" : "Saralanganlarga qo'shish"}
        aria-pressed={fav}
        onClick={() => toggleFavorite(p.id)}
        className={`absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-full bg-white ${
          fav ? "text-brand" : "text-ink hover:text-brand"
        }`}
      >
        <HeartIcon filled={fav} className="w-[18px] h-[18px]" />
      </button>

      <div className="flex flex-col flex-1 px-1.5 pt-2.5 pb-1">
        <div className="flex items-baseline gap-2 text-[12px]">
          <span className="text-muted line-through">{formatPrice(p.oldPrice)}</span>
          {discount > 0 && <span className="font-semibold text-sale">−{discount}%</span>}
        </div>
        <span className="text-[12px] text-cobalt font-medium">oyiga {formatPrice(monthly(p.price))} so&apos;m</span>
        <Link href={`/product/${p.id}`} className="mt-1 text-[13px] leading-[1.35] line-clamp-2 min-h-[35px] hover:text-brand">
          {p.title}
        </Link>
        {!compact && (
          <div className="mt-1 flex items-center gap-1 text-[12px] text-muted">
            <StarIcon /> <span className="text-ink font-medium">{p.rating.toFixed(1)}</span> ({formatPrice(p.reviews)} sharh)
          </div>
        )}
        <div className="flex-1 min-h-2.5" />
        <button
          onClick={() => addToCart(p.id)}
          className={`h-9 rounded-full text-[13px] font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] transition ${
            inCart ? "bg-brand-soft text-brand-dark" : "bg-ink text-white hover:bg-[#1d3266]"
          }`}
        >
          <CartPlusIcon /> {inCart ? "Yana qo'shish" : "Savatga"}
        </button>
      </div>
    </div>
  );
}

// Bozordagi narx yorlig'i: chap tomoni uchli, ipga osiladigan teshigi bor
function PriceTag({ price }: { price: number }) {
  return (
    <span
      className="absolute left-0 bottom-2.5 max-w-[calc(100%-8px)] flex items-center gap-1.5 bg-brand text-white pl-4 pr-2.5 py-1 rounded-r-lg"
      style={{ clipPath: "polygon(9px 0, 100% 0, 100% 100%, 9px 100%, 0 50%)" }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden />
      <span className="font-display font-bold text-[14px] sm:text-[15px] leading-tight tracking-tight whitespace-nowrap">
        {formatPrice(price)} <span className="text-[11px] font-medium">so&apos;m</span>
      </span>
    </span>
  );
}

function CheckBadge() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#16a34a" />
      <path d="M4.5 8.2l2.3 2.3 4.7-4.8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
