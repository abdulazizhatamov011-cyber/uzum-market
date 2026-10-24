import PageShell from "@/components/PageShell";

export const metadata = { title: "Maxfiylik kelishuvi — Uzum Market" };

export default function PrivacyPage() {
  return (
    <PageShell title="Maxfiylik kelishuvi" narrow>
      <div className="space-y-4 text-muted leading-relaxed">
        <p>Ushbu sahifa o&apos;quv loyihasi uchun namunaviy matn hisoblanadi.</p>
        <h2 className="text-lg font-semibold text-ink">1. Qanday ma&apos;lumotlar saqlanadi</h2>
        <p>Ism, telefon raqami, savat, saralangan mahsulotlar va buyurtmalar faqat sizning brauzeringizda (localStorage) saqlanadi va hech qayerga yuborilmaydi.</p>
        <h2 className="text-lg font-semibold text-ink">2. Ma&apos;lumotlardan foydalanish</h2>
        <p>Ma&apos;lumotlar faqat buyurtmani rasmiylashtirish formasini oldindan to&apos;ldirish uchun ishlatiladi.</p>
        <h2 className="text-lg font-semibold text-ink">3. Ma&apos;lumotlarni o&apos;chirish</h2>
        <p>Kabinetdan chiqish yoki brauzer ma&apos;lumotlarini tozalash orqali barcha ma&apos;lumotlar o&apos;chiriladi.</p>
      </div>
    </PageShell>
  );
}
