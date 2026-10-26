"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreProvider";
import { TrashIcon } from "@/components/Icons";
import { formatPrice } from "@/lib/data";
import { useCatalog } from "@/components/CatalogProvider";

export default function CartPage() {
  const { cart, setQty, removeFromCart } = useStore();
  const { getProduct } = useCatalog();
  const rows = cart.flatMap((i) => {
    const p = getProduct(i.id);
    return p ? [{ ...i, p }] : [];
  });
  const total = rows.reduce((s, r) => s + r.p.price * r.qty, 0);
  const old = rows.reduce((s, r) => s + r.p.oldPrice * r.qty, 0);
  const count = rows.reduce((s, r) => s + r.qty, 0);

  if (!rows.length) {
    return (
      <div className="container-x py-24 text-center">
        <div className="text-7xl mb-4">🛍️</div>
        <h1 className="text-2xl font-bold">Savatda hozircha mahsulot yo&apos;q</h1>
        <p className="text-muted mt-2">Bosh sahifadagi to&apos;plamlardan boshlang yoki kerakli mahsulotni qidiruv orqali toping</p>
        <Link href="/" className="inline-block mt-6 rounded-full bg-brand text-white font-semibold px-8 h-12 leading-[48px]">
          Bosh sahifa
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x pt-6">
      <h1 className="text-3xl font-bold mb-6">
        Savatingiz, <span className="text-muted font-normal text-xl">{count} mahsulot</span>
      </h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-line divide-y divide-line">
          <div className="p-4 text-sm font-medium">🚚 Bozorcha yetkazib berishi — <span className="text-brand">ertaga</span></div>
          {rows.map(({ p, qty }) => (
            <div key={p.id} className="flex gap-4 p-4">
              <Link href={`/product/${p.id}`} className="w-24 h-28 shrink-0 rounded-xl bg-surface overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} className="w-full h-full object-contain p-2" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between gap-3">
                  <Link href={`/product/${p.id}`} className="text-sm hover:text-brand line-clamp-2">{p.title}</Link>
                  <button aria-label="O'chirish" onClick={() => removeFromCart(p.id)} className="text-muted hover:text-sale shrink-0 flex items-center gap-1 text-sm">
                    <TrashIcon /> <span className="hidden sm:inline">Yo&apos;q qilish</span>
                  </button>
                </div>
                <div className="text-xs text-muted mt-1">Sotuvchi: {p.brand ?? "Bozorcha"} Store</div>
                <div className="mt-auto flex items-end justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-line h-10">
                    <button className="w-10 h-full text-lg" onClick={() => setQty(p.id, qty - 1)}>−</button>
                    <span className="w-8 text-center">{qty}</span>
                    <button className="w-10 h-full text-lg" onClick={() => setQty(p.id, qty + 1)}>+</button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand">{formatPrice(p.price * qty)} so&apos;m</div>
                    <div className="text-xs text-muted line-through">{formatPrice(p.oldPrice * qty)} so&apos;m</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="self-start lg:sticky lg:top-32 rounded-2xl border border-line p-5">
          <h2 className="font-semibold text-lg mb-4">Buyurtmangiz</h2>
          <div className="flex justify-between text-sm"><span>Mahsulotlar ({count}):</span><span>{formatPrice(old)} so&apos;m</span></div>
          <div className="flex justify-between text-sm mt-2"><span>Chegirma:</span><span className="text-sale">−{formatPrice(old - total)} so&apos;m</span></div>
          <div className="flex justify-between text-sm mt-2"><span>Yetkazib berish:</span><span className="text-[#00a94f]">Bepul</span></div>
          <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-line">
            <span className="font-medium">Jami:</span>
            <span className="text-2xl font-bold">{formatPrice(total)} so&apos;m</span>
          </div>
          <Link href="/checkout" className="mt-5 w-full h-12 rounded-full bg-brand text-white font-semibold hover:bg-brand-dark transition grid place-items-center">
            Rasmiylashtirishga o&apos;tish
          </Link>
        </aside>
      </div>
    </div>
  );
}
