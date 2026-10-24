import { isValidPhone, sendCode } from "@/lib/otp";

export async function POST(request: Request) {
  const { phone } = await request.json().catch(() => ({}));
  if (!isValidPhone(phone)) {
    return Response.json({ error: "Telefon raqamini to'liq kiriting" }, { status: 400 });
  }
  const result = await sendCode(phone);
  if (!result.ok) {
    return Response.json({ error: result.error, resendIn: result.resendIn }, { status: result.status });
  }
  return Response.json({ resendIn: result.resendIn, devCode: result.devCode });
}
