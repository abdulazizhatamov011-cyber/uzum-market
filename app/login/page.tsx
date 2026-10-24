"use client";

import { useLayoutEffect, useState } from "react";
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

  // Sahifadan chiqilganda kirish jarayonini boshidan boshlaymiz
  useLayoutEffect(() => () => {
    setStep("phone");
    setCode("");
    setError("");
  }, []);

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === "phone") {
      if (phone.length !== 9) return setError("Telefon raqamini to'liq kiriting");
      setStep("code");
    } else if (step === "code") {
      if (!/^\d{4}$/.test(code)) return setError("4 xonali kodni kiriting");
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
          {step === "code" && (
            <>
              {formatPhone(phone)} raqamiga kod yuborildi.
              <br />
              <span className="text-brand">Demo rejim: istalgan 4 xonali kod ishlaydi</span>
            </>
          )}
          {step === "name" && "Buyurtmalarni shu ism bilan rasmiylashtiramiz"}
        </p>

        <div className="mt-6">
          {step === "phone" && <PhoneInput value={phone} onChange={setPhone} autoFocus />}
          {step === "code" && (
            <input
              autoFocus
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="0000"
              className={`${inputCls} text-center tracking-[0.5em] text-xl`}
            />
          )}
          {step === "name" && (
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism" className={inputCls} />
          )}
          {error && <p className="text-sm text-[#ff4d6a] mt-2">{error}</p>}
        </div>

        <button type="submit" className="mt-5 w-full h-12 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition">
          {step === "name" ? "Kirish" : "Davom etish"}
        </button>
        {step === "code" && (
          <button type="button" onClick={() => setStep("phone")} className="mt-3 w-full text-sm text-muted hover:text-ink">
            Raqamni o&apos;zgartirish
          </button>
        )}
        <p className="text-xs text-muted text-center mt-5">
          Avtorizatsiyadan o&apos;tish orqali siz shaxsiy ma&apos;lumotlarni qayta ishlash{" "}
          <a href="/privacy" className="text-brand">siyosatiga</a> rozilik bildirasiz
        </p>
      </form>
    </div>
  );
}
