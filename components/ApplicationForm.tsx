"use client";

import { useLayoutEffect, useState } from "react";
import PhoneInput from "./PhoneInput";
import { inputCls } from "./PageShell";
import { cities, cityName } from "@/lib/data";
import { useI18n } from "./I18nProvider";
import { createApplication } from "@/lib/actions/shop";
import type { ApplicationKind } from "@/lib/types";

export default function ApplicationForm({
  kind,
  extraLabel,
  button,
}: {
  kind: ApplicationKind;
  extraLabel: string;
  button?: string;
}) {
  const [sending, setSending] = useState(false);
  const { t, lang } = useI18n();
  const a = t.application;
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
        <div className="font-semibold text-lg mt-2">{a.sentTitle}</div>
        <p className="text-muted text-sm mt-1">{a.sentText}</p>
        <button onClick={() => { setSent(false); setName(""); setPhone(""); setExtra(""); }} className="mt-4 text-brand text-sm">
          {a.again}
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
        if (name.trim().length < 2) return setError(a.errName);
        if (phone.length !== 9) return setError(a.errPhone);
        if (!extra.trim()) return setError(a.errExtra(extraLabel));
        setError("");
        setSending(true);
        // Ariza serverga yoziladi va admin panelda ko'rinadi
        const res = await createApplication({ kind, name, phone, city, extra }, lang).catch(() => ({
          ok: false as const,
          error: t.common.noConnection,
        }));
        setSending(false);
        if (!res.ok) return setError(res.error);
        setSent(true);
      }}
      className="rounded-2xl border border-line p-6 space-y-3 scroll-mt-40"
    >
      <h2 className="font-semibold text-lg">{a.title}</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.common.namePlaceholder} className={inputCls} />
      <PhoneInput value={phone} onChange={setPhone} />
      <select value={city} onChange={(e) => setCity(e.target.value)} className={inputCls}>
        {cities.map((c) => <option key={c} value={c}>{cityName(c, lang)}</option>)}
      </select>
      <input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder={extraLabel} className={inputCls} />
      {error && <p className="text-sm text-sale">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full h-12 rounded-full bg-brand text-white font-semibold hover:bg-brand-dark transition disabled:opacity-60"
      >
        {sending ? t.common.sending : (button ?? a.send)}
      </button>
    </form>
  );
}
