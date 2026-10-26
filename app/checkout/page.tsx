"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useStore, type Order } from "@/components/StoreProvider";
import PageShell, { EmptyState, inputCls } from "@/components/PageShell";
import PhoneInput, { formatPhone, phoneDigits } from "@/components/PhoneInput";
import { formatPrice, getProduct, pickupPoints } from "@/lib/data";

const payments = ["Karta orqali (Uzcard / Humo)", "Naqd pul — olayotganda", "Bozorcha Nasiya — muddatli to'lov"];

export default function CheckoutPage() {
  const { cart, user, city, placeOrder, clearCart } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"pickup" | "courier">("pickup");
  const [point, setPoint] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState(payments[0]);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Order | null>(null);

  // Next.js sahifani yashirib saqlaydi (Activity) — qaytib kelganda eski natija ko'rinmasin
  useLayoutEffect(() => () => {
    setDone(null);
    setError("");
  }, []);

  // Kirgan foydalanuvchi ma'lumotlarini oldindan to'ldiramiz
  useEffect(() => {
    if (user) {
      setName((n) => n || user.name);
      setPhone((p) => p || phoneDigits(user.phone));
    }
  }, [user]);

  const points = pickupPoints.filter((p) => p.city === city);
  const rows = cart.flatMap((i) => {
    const p = getProduct(i.id);
    return p ? [{ ...i, p }] : [];
  });
  const total = rows.reduce((s, r) => s + r.p.price * r.qty, 0);

  if (done) {
    return (
      <PageShell title="Buyurtma qabul qilindi">
        <EmptyState
          icon="🎉"
          title={`Buyurtma №${done.id} rasmiylashtirildi!`}
          text={`Jami ${formatPrice(done.total)} so'm. ${done.delivery}`}
          href="/orders"
          action="Buyurtmalarimga o'tish"
        />
      </PageShell>
    );
  }

  if (!rows.length) {
    return (
      <PageShell title="Rasmiylashtirish">
        <EmptyState icon="🛍️" title="Savat bo'sh" text="Rasmiylashtirish uchun avval savatga mahsulot qo'shing" />
      </PageShell>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Qabul qiluvchining ismini kiriting");
    if (phone.length !== 9) return setError("Telefon raqamini to'liq kiriting");
    const pickup = points.find((p) => String(p.id) === point);
    if (method === "pickup" && !pickup) return setError("Topshirish punktini tanlang");
    if (method === "courier" && address.trim().length < 5) return setError("Yetkazish manzilini kiriting");
    setError("");
    const order = placeOrder({
      items: rows.map((r) => ({ id: r.id, qty: r.qty, price: r.p.price })),
      total,
      name: name.trim(),
      phone: formatPhone(phone),
      delivery: method === "pickup" ? `Topshirish punkti: ${pickup!.address}` : `Kuryer: ${city}, ${address.trim()}`,
      payment,
    });
    clearCart();
    setDone(order);
    window.scrollTo(0, 0);
  };

  return (
    <PageShell title="Rasmiylashtirish">
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-lg mb-4">Qabul qiluvchi</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism va familiya" className={inputCls} />
              <PhoneInput value={phone} onChange={setPhone} />
            </div>
          </section>

          <section className="rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-lg mb-4">Yetkazib berish — {city}</h2>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface p-1">
              {(["pickup", "courier"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`h-10 rounded-lg text-sm font-medium ${method === m ? "bg-white shadow-sm" : "text-muted"}`}
                >
                  {m === "pickup" ? "Topshirish punkti (bepul)" : "Kuryer orqali"}
                </button>
              ))}
            </div>
            {method === "pickup" ? (
              <div className="mt-4 space-y-2">
                {points.map((p) => (
                  <label key={p.id} className={`flex gap-3 rounded-xl border p-3 cursor-pointer ${point === String(p.id) ? "border-brand bg-brand-soft" : "border-line"}`}>
                    <input type="radio" name="point" className="accent-brand" checked={point === String(p.id)} onChange={() => setPoint(String(p.id))} />
                    <span>
                      <span className="block font-medium">{p.name}</span>
                      <span className="block text-sm text-muted">{p.address} · {p.hours}</span>
                    </span>
                  </label>
                ))}
                <p className="text-xs text-muted">Shaharni yuqori paneldagi 📍 tugmasi orqali o&apos;zgartirishingiz mumkin</p>
              </div>
            ) : (
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ko'cha, uy, xonadon" className={`${inputCls} mt-4`} />
            )}
          </section>

          <section className="rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-lg mb-4">To&apos;lov usuli</h2>
            <div className="space-y-2">
              {payments.map((p) => (
                <label key={p} className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer ${payment === p ? "border-brand bg-brand-soft" : "border-line"}`}>
                  <input type="radio" name="payment" className="accent-brand" checked={payment === p} onChange={() => setPayment(p)} />
                  {p}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="self-start lg:sticky lg:top-32 rounded-2xl border border-line p-5">
          <h2 className="font-semibold text-lg mb-4">Buyurtmangiz</h2>
          <ul className="space-y-2 text-sm max-h-60 overflow-auto">
            {rows.map(({ p, qty }) => (
              <li key={p.id} className="flex justify-between gap-3">
                <Link href={`/product/${p.id}`} className="line-clamp-1 hover:text-brand">{qty} × {p.title}</Link>
                <span className="shrink-0">{formatPrice(p.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm mt-4"><span>Yetkazib berish:</span><span className="text-[#00a94f]">Bepul</span></div>
          <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-line">
            <span className="font-medium">Jami:</span>
            <span className="text-2xl font-bold">{formatPrice(total)} so&apos;m</span>
          </div>
          {error && <p className="text-sm text-sale mt-3">{error}</p>}
          <button type="submit" className="mt-5 w-full h-12 rounded-full bg-brand text-white font-semibold hover:bg-brand-dark transition">
            Buyurtmani tasdiqlash
          </button>
          <p className="text-xs text-muted mt-3 text-center">Demo: haqiqiy to&apos;lov amalga oshirilmaydi</p>
        </aside>
      </form>
    </PageShell>
  );
}
