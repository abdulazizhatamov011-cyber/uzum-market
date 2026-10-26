import { isValidPhone, sendCode } from "@/lib/otp";
import { getDict, isLang } from "@/lib/i18n";

export async function POST(request: Request) {
  const { phone, lang: l } = await request.json().catch(() => ({}));
  const lang = isLang(String(l)) ? l : "uz";
  if (!isValidPhone(phone)) {
    return Response.json({ error: getDict(lang).otp.phone }, { status: 400 });
  }
  const result = await sendCode(phone, lang);
  if (!result.ok) {
    return Response.json({ error: result.error, resendIn: result.resendIn }, { status: result.status });
  }
  return Response.json({ resendIn: result.resendIn, devCode: result.devCode });
}
