"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreProvider";
import PageShell, { EmptyState } from "@/components/PageShell";
import { formatPrice, getProduct } from "@/lib/data";

const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];

function formatDate(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()}-${months[d.getMonth()]}, ${d.getFullYear()}, ${hh}:${mm}`;
}

const statusColor = {
  "Yig'ilmoqda": "bg-[#fff4d6] text-[#a36b00]",
  "Yo'lda": "bg-[#e6f0ff] text-[#0050ff]",
  Yetkazildi: "bg-[#e3f8ec] text-[#00a94f]",
};

export default function OrdersPage() {
  const { orders } = useStore();

  return (
    <PageShell title="Buyurtmalarim">
      {orders.length === 0 ? (
        <EmptyState icon="📦" title="Hozircha buyurtmalar yo'q" text="Savatga mahsulot qo'shing va buyurtmani rasmiylashtiring" />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-line p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">Buyurtma №{o.id}</div>
                  <div className="text-sm text-muted">
                    {formatDate(o.date)}
                  </div>
                </div>
                <span className={`rounded-lg px-3 py-1 text-sm font-medium ${statusColor[o.status]}`}>{o.status}</span>
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                {o.items.map((i) => {
                  const p = getProduct(i.id);
                  return p ? (
                    <Link key={i.id} href={`/product/${p.id}`} className="relative w-16 h-20 shrink-0 rounded-lg bg-surface" title={p.title}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.title} className="w-full h-full object-contain p-1" />
                      {i.qty > 1 && (
                        <span className="absolute -top-1 -right-1 rounded-md bg-brand text-white text-[11px] px-1">×{i.qty}</span>
                      )}
                    </Link>
                  ) : null;
                })}
              </div>
              <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
                <div><span className="text-muted">Yetkazish: </span>{o.delivery}</div>
                <div><span className="text-muted">To&apos;lov: </span>{o.payment}</div>
                <div className="sm:text-right font-semibold">{formatPrice(o.total)} so&apos;m</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
