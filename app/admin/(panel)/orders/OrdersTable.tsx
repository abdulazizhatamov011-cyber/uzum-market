"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { orderStatuses, type Order, type OrderStatus } from "@/lib/types";
import { formatDateTime, formatPrice } from "@/lib/data";
import { setOrderStatus } from "@/lib/actions/admin";
import { statusStyle } from "@/components/OrderStatusBadge";

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const query = q.trim().toLowerCase();
  const list = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (!query || String(o.id).includes(query) || o.name.toLowerCase().includes(query) || o.phone.replace(/\s/g, "").includes(query.replace(/\s/g, "")))
  );
  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  const change = (id: number, status: OrderStatus) =>
    start(async () => {
      const res = await setOrderStatus(id, status);
      setError(res.ok ? "" : res.error);
      router.refresh();
    });

  if (!orders.length) {
    return (
      <div className="rounded-[20px] bg-white border border-line py-16 text-center text-muted">
        Hali buyurtma yo&apos;q. Xaridor saytda buyurtma bersa, shu yerda paydo bo&apos;ladi.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["all", ...orderStatuses] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`h-9 px-4 rounded-full text-sm border ${filter === s ? "bg-ink text-white border-ink" : "bg-white border-line hover:border-ink/30"}`}
          >
            {s === "all" ? `Hammasi (${orders.length})` : `${s} (${count(s)})`}
          </button>
        ))}
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Raqam, ism yoki telefon bo'yicha qidirish"
        className="w-full sm:max-w-sm h-10 rounded-full bg-white border border-line px-4 text-sm outline-none focus:border-cobalt"
      />
      {error && <p className="text-sm text-sale">{error}</p>}

      <div className={`rounded-[20px] bg-white border border-line overflow-hidden ${pending ? "opacity-70" : ""}`}>
        {list.length === 0 && <p className="py-10 text-center text-muted text-sm">Bu filtr bo&apos;yicha buyurtma yo&apos;q</p>}
        <ul className="divide-y divide-line">
          {list.map((o) => (
            <li key={o.id}>
              <div className="grid gap-2 p-4 sm:grid-cols-[1.1fr_1.2fr_auto_170px] sm:items-center">
                <button onClick={() => setOpen(open === o.id ? null : o.id)} className="text-left" aria-expanded={open === o.id}>
                  <div className="font-medium">№{o.id}</div>
                  <div className="text-[13px] text-muted">{formatDateTime(o.date)}</div>
                </button>
                <div className="text-sm min-w-0">
                  <div className="truncate">{o.name}</div>
                  <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="text-cobalt text-[13px]">{o.phone}</a>
                </div>
                <div className="text-sm sm:text-right">
                  <div className="font-display font-bold">{formatPrice(o.total)} so&apos;m</div>
                  <div className="text-[13px] text-muted">{o.items.reduce((s, i) => s + i.qty, 0)} dona</div>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => change(o.id, e.target.value as OrderStatus)}
                  aria-label={`№${o.id} holati`}
                  className={`h-9 rounded-full px-3 text-sm font-medium outline-none cursor-pointer ${statusStyle[o.status] ?? ""}`}
                >
                  {orderStatuses.map((s) => (
                    <option key={s} value={s} className="bg-white text-ink">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {open === o.id && (
                <div className="px-4 pb-4 text-sm space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2 text-muted">
                    <div><span className="text-ink">Yetkazish:</span> {o.delivery}</div>
                    <div><span className="text-ink">To&apos;lov:</span> {o.payment}</div>
                  </div>
                  <ul className="rounded-2xl bg-surface divide-y divide-line">
                    {o.items.map((i) => (
                      <li key={i.id} className="flex items-center gap-3 p-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {i.image && <img src={i.image} alt="" className="w-10 h-12 rounded-lg object-cover bg-white" />}
                        <span className="flex-1 min-w-0 truncate">{i.title ?? `Tovar #${i.id}`}</span>
                        <span className="text-muted whitespace-nowrap">
                          {i.qty} × {formatPrice(i.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
