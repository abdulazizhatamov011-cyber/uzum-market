"use client";

import { useState } from "react";
import Link from "@/components/LocalLink";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { formatPrice, monthly, productTitle } from "@/lib/data";
import { useI18n } from "@/components/I18nProvider";
import { useStore } from "@/components/StoreProvider";
import { HeartIcon, StarIcon } from "@/components/Icons";

export default function ProductDetails({ product: p }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite, cart, setQty } = useStore();
  const router = useRouter();
  const { t, lang, href } = useI18n();
  const d = t.product;
  const title = productTitle(p, lang);
  const som = t.common.som;
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
              className={`w-16 h-20 rounded-lg overflow-hidden bg-surface border-2 ${k === img ? "border-brand" : "border-transparent"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0 aspect-[3/4] rounded-2xl bg-surface overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gallery[img]} alt={title} className="w-full h-full object-contain p-6" />
        </div>
      </div>

      {/* Ma'lumot */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <StarIcon /> <span className="text-ink">{p.rating.toFixed(1)}</span> ({d.reviews(p.reviews)}) ·{" "}
          {d.orders(p.reviews * 7)}
        </div>
        <h1 className="!font-sans !tracking-normal text-xl sm:text-2xl font-semibold mt-2 leading-snug">{title}</h1>
        <dl className="mt-6 grid grid-cols-[140px_1fr] gap-y-3 text-sm">
          {p.brand && (
            <>
              <dt className="text-muted">{d.brand}</dt>
              <dd>{p.brand}</dd>
            </>
          )}
          <dt className="text-muted">{d.stock}</dt>
          <dd>{d.stockValue(p.stock)}</dd>
          <dt className="text-muted">{d.delivery}</dt>
          <dd>{d.deliveryValue}</dd>
          <dt className="text-muted">{d.seller}</dt>
          <dd className="text-brand">{t.common.seller(p.brand ?? "Bozorcha")}</dd>
        </dl>
        <div className="mt-8">
          <h3 className="font-semibold mb-2">{d.about}</h3>
          <ul className="list-disc pl-5 text-sm text-muted space-y-1">
            <li>{d.about1}</li>
            <li>{d.about2}</li>
            <li>{d.about3}</li>
          </ul>
        </div>
      </div>

      {/* Xarid kartasi */}
      <aside className="md:col-span-2 lg:col-span-1 lg:sticky lg:top-32 self-start rounded-2xl border border-line p-5 shadow-sm">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl font-bold tracking-tight text-brand">{formatPrice(p.price)} {som}</span>
        </div>
        <div className="text-muted line-through text-sm">{formatPrice(p.oldPrice)} {som}</div>
        <div className="mt-3 rounded-2xl bg-surface text-cobalt px-3.5 py-2.5 text-sm">
          {d.installment(monthly(p.price))}
        </div>
        <div className="mt-5 flex gap-2">
          {inCart ? (
            <div className="flex-1 flex items-center justify-between h-12 rounded-full bg-brand-soft text-brand font-semibold px-2">
              <button className="w-9 h-9 rounded-lg hover:bg-white" onClick={() => setQty(p.id, inCart.qty - 1)}>−</button>
              <Link href="/cart">{d.inCart(inCart.qty)}</Link>
              <button className="w-9 h-9 rounded-lg hover:bg-white" onClick={() => setQty(p.id, inCart.qty + 1)}>+</button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(p.id)}
              className="flex-1 h-12 rounded-full bg-ink text-white font-semibold hover:bg-[#1d3266] transition"
            >
              {d.addToCart}
            </button>
          )}
          <button
            aria-label={d.favorite}
            onClick={() => toggleFavorite(p.id)}
            className={`w-12 h-12 grid place-items-center rounded-full border border-line ${fav ? "text-brand" : ""}`}
          >
            <HeartIcon filled={fav} />
          </button>
        </div>
        <button
          onClick={() => {
            if (!inCart) addToCart(p.id);
            router.push(href("/checkout"));
          }}
          className="mt-2 w-full h-12 rounded-full bg-brand text-white font-semibold hover:bg-brand-dark transition">
          {d.buyNow}
        </button>
        <p className="mt-4 text-sm text-muted">{d.tomorrow}</p>
      </aside>
    </div>
  );
}
