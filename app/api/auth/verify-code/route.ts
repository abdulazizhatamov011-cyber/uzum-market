import { isValidPhone, verifyCode } from "@/lib/otp";
import { getDict, isLang } from "@/lib/i18n";

export async function POST(request: Request) {
  const { phone, code, lang: l } = await request.json().catch(() => ({}));
  const lang = isLang(String(l)) ? l : "uz";
  if (!isValidPhone(phone) || typeof code !== "string" || !/^\d{4}$/.test(code)) {
    return Response.json({ error: getDict(lang).otp.code }, { status: 400 });
  }
  const result = verifyCode(phone, code, lang);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true });
}
