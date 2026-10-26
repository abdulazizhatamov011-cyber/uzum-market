"use client";

import { useLayoutEffect, useState } from "react";
import PhoneInput from "./PhoneInput";
import { inputCls } from "./PageShell";
import { cities } from "@/lib/data";
import { createApplication } from "@/lib/actions/shop";
import type { ApplicationKind } from "@/lib/types";

export default function ApplicationForm({
  kind,
  extraLabel,
  button = "Ariza yuborish",
}: {
  kind: ApplicationKind;
  extraLabel: string;
  button?: string;
}) {
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(cities[0]);
  const [extra, setExtra] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useLayoutEffect(() => () => {
    setSent(false);
    setError("");
  }, []);

  if (sent) {
    return (
      <div id="ariza" className="rounded-2xl bg-[#e3f8ec] p-6 text-center">
        <div className="text-5xl">✅</div>
        <div className="font-semibold text-lg mt-2">Arizangiz qabul qilindi!</div>
        <p className="text-muted text-sm mt-1">Menejerimiz 1 ish kuni ichida siz bilan bog&apos;lanadi.</p>
        <button onClick={() => { setSent(false); setName(""); setPhone(""); setExtra(""); }} className="mt-4 text-brand text-sm">
          Yana ariza yuborish
        </button>
      </div>
    );
  }

  return (
    <form
      id="ariza"
      onSubmit={async (e) => {
        e.preventDefault();
        if (sending) return;
        if (name.trim().length < 2) return setError("Ismingizni kiriting");
        if (phone.length !== 9) return setError("Telefon raqamini to'liq kiriting");
        if (!extra.trim()) return setError(`«${extraLabel}» maydonini to'ldiring`);
        setError("");
        setSending(true);
        // Ariza serverga yoziladi va admin panelda ko'rinadi
        const res = await createApplication({ kind, name, phone, city, extra }).catch(() => ({
          ok: false as const,
          error: "Server bilan aloqa yo'q. Qayta urinib ko'ring",
        }));
        setSending(false);
        if (!res.ok) return setError(res.error);
        setSent(true);
      }}
      className="rounded-2xl border border-line p-6 space-y-3 scroll-mt-40"
    >
      <h2 className="font-semibold text-lg">Ariza qoldiring</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism va familiya" className={inputCls} />
      <PhoneInput value={phone} onChange={setPhone} />
      <select value={city} onChange={(e) => setCity(e.target.value)} className={inputCls}>
        {cities.map((c) => <option key={c}>{c}</option>)}
      </select>
      <input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder={extraLabel} className={inputCls} />
      {error && <p className="text-sm text-sale">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full h-12 rounded-full bg-brand text-white font-semibold hover:bg-brand-dark transition disabled:opacity-60"
      >
        {sending ? "Yuborilmoqda…" : button}
      </button>
    </form>
  );
}
