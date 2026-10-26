// Admin panelga kirish: parol .env.local dagi ADMIN_PASSWORD dan olinadi.
// Sessiya httpOnly cookie'da: "<tugash vaqti>.<HMAC imzo>" — imzosiz yoki muddati o'tgan cookie qabul qilinmaydi.
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const COOKIE = "admin_session";
const TTL = 8 * 60 * 60 * 1000; // 8 soat

// Dev rejimida parol sozlanmagan bo'lsa vaqtinchalik "admin123" ishlaydi; productionda parol majburiy
export const DEV_PASSWORD = "admin123";

export function adminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? null : DEV_PASSWORD;
}

export const usingDevPassword = () => !process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== "production";

function secret() {
  return process.env.ADMIN_SECRET || `bozorcha:${adminPassword() ?? ""}`;
}

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(input: string) {
  const pass = adminPassword();
  return pass !== null && safeEqual(sign(input), sign(pass));
}

export async function startSession() {
  const exp = String(Date.now() + TTL);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL / 1000,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  // Vaqtni (Date.now) faqat so'rov paytida tekshiramiz — sahifa oldindan tayyorlanmasin
  await connection();
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw || !adminPassword()) return false;
  const [exp, sig] = raw.split(".");
  return Boolean(exp && sig && safeEqual(sig, sign(exp)) && Number(exp) > Date.now());
}

// Admin sahifalari uchun: kirmagan bo'lsa login sahifasiga yuboradi
export async function requireAdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
}

// Server Action'lar uchun: har bir amal o'zi tekshiradi (ular to'g'ridan-to'g'ri POST bilan ham chaqirilishi mumkin)
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Ruxsat yo'q: admin sifatida kiring");
}
