"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/StoreProvider";
import PhoneInput, { formatPhone } from "@/components/PhoneInput";
import { inputCls } from "@/components/PageShell";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [step, setStep] = useState<"phone" | "code" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [sentTo, setSentTo] = useState("");
  const [devCode, setDevCode] = useState("");

  // Sahifadan chiqilganda kirish jarayonini boshidan boshlaymiz
  useLayoutEffect(() => () => {
    setStep("phone");
    setCode("");
    setError("");
  }, []);

  // Qayta yuborish taymeri
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const post = async (url: string, body: object) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return { ok: res.ok, data: await res.json() };
    } catch {
      return { ok: false, data: { error: "Internet aloqasini tekshiring" } };
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async () => {
    setError("");
    const { ok, data } = await post("/api/auth/send-code", { phone });
    if (data.resendIn) setResendIn(data.resendIn);
    if (!ok) return setError(data.error);
    setSentTo(phone);
    setDevCode(data.devCode ?? "");
    setCode("");
    setStep("code");
  };

  const next = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (step === "phone") {
      if (phone.length !== 9) return setError("Telefon raqamini to'liq kiriting");
      // Shu raqamga kod hozirgina yuborilgan bo'lsa, qaytadan yubormaymiz
      if (phone === sentTo && resendIn > 0) return setStep("code");
      await sendCode();
    } else if (step === "code") {
      if (!/^\d{4}$/.test(code)) return setError("4 xonali kodni kiriting");
      const { ok, data } = await post("/api/auth/verify-code", { phone, code });
      if (!ok) return setError(data.error);
      setSentTo("");
      setResendIn(0);
      setDevCode("");
      setStep("name");
    } else {
      if (name.trim().length < 2) return setError("Ismingizni kiriting");
      login({ name: name.trim(), phone: formatPhone(phone) });
      router.push("/profile");
    }
  };

  return (
    <div className="container-x py-12 flex justify-center">
      <form onSubmit={next} className="w-full max-w-[400px] rounded-2xl border border-line p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-center">
          {step === "phone" && "Telefon raqamini kiriting"}
          {step === "code" && "Kodni kiriting"}
          {step === "name" && "Ismingiz qanday?"}
        </h1>
        <p className="text-sm text-muted text-center mt-2">
          {step === "phone" && "Tasdiqlash kodini SMS orqali yuboramiz"}
          {step === "code" && <>{formatPhone(phone)} raqamiga SMS orqali 4 xonali kod yuborildi</>}
          {step === "name" && "Buyurtmalarni shu ism bilan rasmiylashtiramiz"}
        </p>
        {step === "code" && devCode && (
          <p className="mt-3 rounded-lg bg-[#fff4d6] text-[#a36b00] text-sm text-center px-3 py-2">
            SMS xizmati hali ulanmagan (sinov rejimi). Kod: <b className="tracking-widest">{devCode}</b>
          </p>
        )}

        <div className="mt-6">
          {step === "phone" && <PhoneInput value={phone} onChange={setPhone} autoFocus />}
          {step === "code" && (
            <input
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="0000"
              className={`${inputCls} text-center tracking-[0.5em] text-xl`}
            />
          )}
          {step === "name" && (
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism" className={inputCls} />
          )}
          {error && <p className="text-sm text-sale mt-2">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full h-12 rounded-full bg-brand text-white font-semibold hover:bg-brand-dark transition disabled:opacity-60"
        >
          {loading ? "Kuting…" : step === "phone" ? "Kod olish" : step === "code" ? "Tasdiqlash" : "Kirish"}
        </button>
        {step === "code" && (
          <div className="mt-3 flex justify-between text-sm">
            <button type="button" onClick={() => setStep("phone")} className="text-muted hover:text-ink">
              Raqamni o&apos;zgartirish
            </button>
            {resendIn > 0 ? (
              <span className="text-muted">Qayta yuborish: 0:{String(resendIn).padStart(2, "0")}</span>
            ) : (
              <button type="button" onClick={sendCode} disabled={loading} className="text-brand font-medium">
                Kodni qayta yuborish
              </button>
            )}
          </div>
        )}
        <p className="text-xs text-muted text-center mt-5">
          Avtorizatsiyadan o&apos;tish orqali siz shaxsiy ma&apos;lumotlarni qayta ishlash{" "}
          <a href="/privacy" className="text-brand">siyosatiga</a> rozilik bildirasiz
        </p>
      </form>
    </div>
  );
}
