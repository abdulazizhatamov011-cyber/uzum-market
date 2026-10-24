"use client";

import { useState } from "react";
import PageShell, { inputCls } from "@/components/PageShell";
import { useStore } from "@/components/StoreProvider";
import { cities, pickupPoints } from "@/lib/data";

export default function PickupPointsPage() {
  const { city, setCity } = useStore();
  const [q, setQ] = useState("");
  const list = pickupPoints.filter(
    (p) => p.city === city && `${p.name} ${p.address}`.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <PageShell title="Topshirish punktlari" subtitle="Buyurtmani o'zingizga qulay punktdan bepul olib keting">
      <div className="grid sm:grid-cols-[220px_1fr] gap-3 mb-6">
        <select value={city} onChange={(e) => setCity(e.target.value)} className={inputCls}>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Manzil bo'yicha qidirish" className={inputCls} />
      </div>
      {list.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line p-5">
              <div className="text-2xl">📍</div>
              <div className="font-semibold mt-2">{p.name}</div>
              <div className="text-sm text-muted mt-1">{p.address}</div>
              <div className="text-sm mt-3">🕘 Har kuni {p.hours}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted">Bu manzil bo&apos;yicha punkt topilmadi</p>
      )}
      <p className="text-xs text-muted mt-6">Manzillar namunaviy — o&apos;quv loyihasi uchun.</p>
    </PageShell>
  );
}
