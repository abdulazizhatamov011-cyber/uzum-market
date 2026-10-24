"use client";

import { inputCls } from "./PageShell";

// +998 XX XXX XX XX ko'rinishida formatlaydi
export function formatPhone(digits: string) {
  const d = digits.slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return "+998 " + parts.join(" ");
}

export function phoneDigits(value: string) {
  return value.replace(/^\+?998/, "").replace(/\D/g, "").slice(0, 9);
}

export default function PhoneInput({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (digits: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <input
      type="tel"
      autoFocus={autoFocus}
      value={formatPhone(value)}
      onChange={(e) => onChange(phoneDigits(e.target.value))}
      placeholder="+998 00 000 00 00"
      className={inputCls}
    />
  );
}
