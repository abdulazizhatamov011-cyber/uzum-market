"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "@/components/LocalLink";
import { useStore, type Order } from "@/components/StoreProvider";
import PageShell, { EmptyState, inputCls } from "@/components/PageShell";
import PhoneInput, { phoneDigits } from "@/components/PhoneInput";
import { cityName, formatPrice, localizeDelivery, pickupPointsFor, productTitle } from "@/lib/data";
import { useI18n } from "@/components/I18nProvider";
import { useCatalog } from "@/components/CatalogProvider";
import { createOrder, type PaymentKey } from "@/lib/actions/shop";

const payments: PaymentKey[] = ["card", "cash", "nasiya"];

export default function CheckoutPage() {
  const { cart, user, city, addOrder, clearCart } = useStore();
  const { getProduct } = useCatalog();
  const { t, lang } = useI18n();
  const c = t.checkout;
  const som = t.common.som;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"pickup" | "courier">("pickup");
  const [point, setPoint] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentKey>(payments[0]);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Order | null>(null);
  const [sending, setSending] = useState(false);

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

  const points = pickupPointsFor(lang).filter((p) => p.city === city);
  const rows = cart.flatMap((i) => {
    const p = getProduct(i.id);
    return p ? [{ ...i, p }] : [];
  });
  const total = rows.reduce((s, r) => s + r.p.price * r.qty, 0);

  if (done) {
    return (
      <PageShell title={c.doneTitle}>
        <EmptyState
          icon="🎉"
          title={c.doneHeading(done.id)}
          text={c.doneText(done.total, localizeDelivery(done.delivery, lang))}
          href="/orders"
          action={c.toOrders}
        />
      </PageShell>
    );
  }

  if (!rows.length) {
    return (
      <PageShell title={c.title}>
        <EmptyState icon="🛍️" title={c.emptyTitle} text={c.emptyText} />
      </PageShell>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (name.trim().length < 2) return setError(c.errName);
    if (phone.length !== 9) return setError(c.errPhone);
    const pickup = points.find((p) => String(p.id) === point);
    if (method === "pickup" && !pickup) return setError(c.errPoint);
    if (method === "courier" && address.trim().length < 5) return setError(c.errAddress);
    setError("");
    setSending(true);
    // Buyurtma serverda yaratiladi: narx va jami summani server bazadagi narxdan hisoblaydi
    const res = await createOrder({
      items: rows.map((r) => ({ id: r.id, qty: r.qty })),
      name: name.trim(),
      phone,
      city,
      method,
      pointId: pickup?.id,
      address: address.trim(),
      payment,
    }, lang).catch(() => ({ ok: false as const, error: t.common.noConnection }));
    setSending(false);
    if (!res.ok) return setError(res.error);
    addOrder(res.data);
    clearCart();
    setDone(res.data);
    window.scrollTo(0, 0);
  };

  return (
    <PageShell title={c.title}>
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-lg mb-4">{c.recipient}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.common.namePlaceholder} className={inputCls} />
              <PhoneInput value={phone} onChange={setPhone} />
            </div>
          </section>

          <section className="rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-lg mb-4">{c.deliveryIn(cityName(city, lang))}</h2>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface p-1">
              {(["pickup", "courier"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`h-10 rounded-lg text-sm font-medium ${method === m ? "bg-white shadow-sm" : "text-muted"}`}
                >
                  {m === "pickup" ? c.pickup : c.courier}
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
                <p className="text-xs text-muted">{c.cityHint}</p>
              </div>
            ) : (
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={c.address} className={`${inputCls} mt-4`} />
            )}
          </section>

          <section className="rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-lg mb-4">{c.payment}</h2>
            <div className="space-y-2">
              {payments.map((p) => (
                <label key={p} className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer ${payment === p ? "border-brand bg-brand-soft" : "border-line"}`}>
                  <input type="radio" name="payment" className="accent-brand" checked={payment === p} onChange={() => setPayment(p)} />
                  {t.payments[p]}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="self-start lg:sticky lg:top-32 rounded-2xl border border-line p-5">
          <h2 className="font-semibold text-lg mb-4">{t.common.yourOrder}</h2>
          <ul className="space-y-2 text-sm max-h-60 overflow-auto">
            {rows.map(({ p, qty }) => (
              <li key={p.id} className="flex justify-between gap-3">
                <Link href={`/product/${p.id}`} className="line-clamp-1 hover:text-brand">{qty} × {productTitle(p, lang)}</Link>
                <span className="shrink-0">{formatPrice(p.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm mt-4"><span>{t.common.delivery}</span><span className="text-[#00a94f]">{t.common.free}</span></div>
          <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-line">
            <span className="font-medium">{t.common.total}</span>
            <span className="text-2xl font-bold">{formatPrice(total)} {som}</span>
          </div>
          {error && <p className="text-sm text-sale mt-3">{error}</p>}
          <button type="submit" disabled={sending} className="mt-5 w-full h-12 rounded-full bg-brand text-white font-semibold hover:bg-brand-dark transition disabled:opacity-60">
            {sending ? t.common.sending : c.confirm}
          </button>
          <p className="text-xs text-muted mt-3 text-center">{c.demo}</p>
        </aside>
      </form>
    </PageShell>
  );
}
