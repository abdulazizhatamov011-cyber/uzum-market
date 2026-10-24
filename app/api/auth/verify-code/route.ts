import { isValidPhone, verifyCode } from "@/lib/otp";

export async function POST(request: Request) {
  const { phone, code } = await request.json().catch(() => ({}));
  if (!isValidPhone(phone) || typeof code !== "string" || !/^\d{4}$/.test(code)) {
    return Response.json({ error: "4 xonali kodni kiriting" }, { status: 400 });
  }
  const result = verifyCode(phone, code);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true });
}
