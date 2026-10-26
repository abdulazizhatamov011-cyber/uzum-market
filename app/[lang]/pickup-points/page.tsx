"use client";

import { useState } from "react";
import PageShell, { inputCls } from "@/components/PageShell";
import { useStore } from "@/components/StoreProvider";
import { cities, cityName, pickupPointsFor } from "@/lib/data";
import { useI18n } from "@/components/I18nProvider";

export default function PickupPointsPage() {
  const { city, setCity } = useStore();
  const [q, setQ] = useState("");
  const { t, lang } = useI18n();
  const pk = t.pickup;
  const list = pickupPointsFor(lang).filter(
    (p) => p.city === city && `${p.name} ${p.address}`.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <PageShell title={pk.title} subtitle={pk.subtitle}>
      <div className="grid sm:grid-cols-[220px_1fr] gap-3 mb-6">
        <select value={city} onChange={(e) => setCity(e.target.value)} className={inputCls}>
          {cities.map((c) => <option key={c} value={c}>{cityName(c, lang)}</option>)}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={pk.search} className={inputCls} />
      </div>
      {list.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line p-5">
              <div className="text-2xl">📍</div>
              <div className="font-semibold mt-2">{p.name}</div>
              <div className="text-sm text-muted mt-1">{p.address}</div>
              <div className="text-sm mt-3">🕘 {pk.daily(p.hours)}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted">{pk.nothing}</p>
      )}
      <p className="text-xs text-muted mt-6">{pk.note}</p>
    </PageShell>
  );
}
