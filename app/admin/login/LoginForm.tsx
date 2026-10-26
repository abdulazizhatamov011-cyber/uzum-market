"use client";

import { useActionState } from "react";
import BrandMark from "@/components/BrandMark";
import { login } from "@/lib/actions/admin";

export default function LoginForm({ devHint, disabled }: { devHint: string | null; disabled: boolean }) {
  const [error, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="w-full max-w-[380px] rounded-[24px] bg-white p-7 shadow-[0_20px_60px_rgba(19,35,74,0.12)]">
      <div className="flex items-center gap-3">
        <BrandMark className="w-11 h-11" />
        <div>
          <div className="font-display font-bold text-xl leading-none">bozorcha</div>
          <div className="text-sm text-muted mt-1">Boshqaruv paneli</div>
        </div>
      </div>

      <label className="block mt-7 text-sm font-medium" htmlFor="password">
        Parol
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoFocus
        autoComplete="current-password"
        required
        disabled={disabled}
        className="mt-1.5 w-full h-12 rounded-full bg-surface px-5 outline-none border-2 border-transparent focus:border-cobalt"
      />
      {error && <p className="mt-2 text-sm text-sale">{error}</p>}
      {disabled && (
        <p className="mt-2 text-sm text-sale">
          Admin paroli sozlanmagan. Serverda ADMIN_PASSWORD muhit o&apos;zgaruvchisini o&apos;rnating.
        </p>
      )}

      <button
        type="submit"
        disabled={pending || disabled}
        className="mt-5 w-full h-12 rounded-full bg-ink text-white font-medium hover:bg-[#1d3266] disabled:opacity-60"
      >
        {pending ? "Tekshirilmoqda…" : "Kirish"}
      </button>

      {devHint && (
        <p className="mt-4 rounded-2xl bg-[#fff4d6] px-4 py-3 text-[13px] text-[#8a5a00]">
          Dev rejim: parol sozlanmagan, vaqtinchalik parol — <b>{devHint}</b>. Haqiqiy parolni .env.local faylidagi
          ADMIN_PASSWORD ga yozing.
        </p>
      )}
    </form>
  );
}
