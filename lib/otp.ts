// Telefon raqamini SMS kod bilan tasdiqlash (faqat serverda ishlatiladi).
// SMS Eskiz.uz orqali yuboriladi: .env.local faylida ESKIZ_EMAIL va ESKIZ_PASSWORD bo'lishi kerak.
// Ular bo'lmasa va loyiha dev rejimida bo'lsa, kod SMS o'rniga server konsoliga chiqariladi.
import { randomInt } from "node:crypto";
import { getDict, type Lang } from "./i18n";

const CODE_TTL = 5 * 60 * 1000; // kod 5 daqiqa amal qiladi
const RESEND_AFTER = 60 * 1000; // qayta yuborish — 60 soniyadan keyin
const MAX_ATTEMPTS = 5;

type Entry = { code: string; expires: number; sentAt: number; attempts: number };

// Dev serverda modul qayta yuklanganda ham kodlar yo'qolmasligi uchun globalThis'da saqlaymiz
const g = globalThis as typeof globalThis & { __otp?: Map<string, Entry>; __eskiz?: { token: string; exp: number } };
const store = (g.__otp ??= new Map());

export const smsConfigured = () => Boolean(process.env.ESKIZ_EMAIL && process.env.ESKIZ_PASSWORD);

export function isValidPhone(phone: unknown): phone is string {
  return typeof phone === "string" && /^\d{9}$/.test(phone);
}

export type SendResult =
  | { ok: true; devCode?: string; resendIn: number }
  | { ok: false; error: string; status: number; resendIn?: number };

export async function sendCode(phone: string, lang: Lang = "uz"): Promise<SendResult> {
  const m = getDict(lang).otp;
  const now = Date.now();
  const prev = store.get(phone);
  if (prev && now - prev.sentAt < RESEND_AFTER) {
    const resendIn = Math.ceil((RESEND_AFTER - (now - prev.sentAt)) / 1000);
    return { ok: false, status: 429, error: m.wait(resendIn), resendIn };
  }

  const code = String(randomInt(0, 10000)).padStart(4, "0");
  const text = m.sms(code);

  if (smsConfigured()) {
    try {
      await sendEskiz(`998${phone}`, text);
    } catch (e) {
      console.error("[otp] SMS yuborilmadi:", e);
      return { ok: false, status: 502, error: m.smsFailed };
    }
  } else if (process.env.NODE_ENV === "production") {
    return { ok: false, status: 503, error: m.notConfigured };
  } else {
    console.log(`[otp] +998${phone} uchun kod: ${code} (SMS xizmati sozlanmagan — dev rejim)`);
  }

  store.set(phone, { code, expires: now + CODE_TTL, sentAt: now, attempts: 0 });
  return { ok: true, resendIn: RESEND_AFTER / 1000, ...(smsConfigured() ? {} : { devCode: code }) };
}

export function verifyCode(phone: string, code: string, lang: Lang = "uz"): { ok: true } | { ok: false; error: string } {
  const m = getDict(lang).otp;
  const entry = store.get(phone);
  if (!entry || Date.now() > entry.expires) {
    store.delete(phone);
    return { ok: false, error: m.expired };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(phone);
    return { ok: false, error: m.tooMany };
  }
  if (entry.code !== code) {
    entry.attempts++;
    return { ok: false, error: m.wrong(MAX_ATTEMPTS - entry.attempts) };
  }
  store.delete(phone);
  return { ok: true };
}

async function eskizToken() {
  if (g.__eskiz && g.__eskiz.exp > Date.now()) return g.__eskiz.token;
  const body = new FormData();
  body.set("email", process.env.ESKIZ_EMAIL!);
  body.set("password", process.env.ESKIZ_PASSWORD!);
  const res = await fetch("https://notify.eskiz.uz/api/auth/login", { method: "POST", body });
  if (!res.ok) throw new Error(`Eskiz login: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { data: { token: string } };
  // Eskiz tokeni 30 kun amal qiladi; xavfsizlik uchun har kuni yangilaymiz
  g.__eskiz = { token: json.data.token, exp: Date.now() + 24 * 60 * 60 * 1000 };
  return json.data.token;
}

async function sendEskiz(phone: string, message: string) {
  const body = new FormData();
  body.set("mobile_phone", phone);
  body.set("message", message);
  body.set("from", process.env.ESKIZ_FROM || "4546");
  const res = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${await eskizToken()}` },
    body,
  });
  if (!res.ok) throw new Error(`Eskiz send: ${res.status} ${await res.text()}`);
}
