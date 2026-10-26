import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata = { title: "Savol-javob — Bozorcha" };

const faq = [
  ["Buyurtma qancha vaqtda yetkaziladi?", "Ko'pchilik shaharlarda buyurtma ertasi kuni topshirish punktiga yetkaziladi. Kuryer orqali yetkazish 1–3 kun oladi."],
  ["Yetkazib berish pullikmi?", "Topshirish punktiga yetkazish bepul. Kuryer xizmati narxi rasmiylashtirish sahifasida ko'rsatiladi."],
  ["Qanday to'lash mumkin?", "Uzcard va Humo kartalari, naqd pul (olayotganda) yoki Bozorcha Nasiya orqali muddatli to'lov bilan."],
  ["Mahsulotni qaytarsam bo'ladimi?", "Ha, mahsulotni olgan kundan boshlab 10 kun ichida, qadog'i va tovar ko'rinishi saqlangan holda qaytarishingiz mumkin."],
  ["Buyurtmani qanday kuzataman?", "«Buyurtmalarim» bo'limida buyurtma holati ko'rsatiladi: yig'ilmoqda, yo'lda yoki yetkazildi."],
  ["Buyurtma topshirish punktida necha kun saqlanadi?", "Buyurtma punktga kelgandan keyin 5 kun davomida saqlanadi."],
];

export default function FaqPage() {
  return (
    <PageShell title="Savol-javob" subtitle="Ko'p beriladigan savollarga javoblar" narrow>
      <div className="space-y-3">
        {faq.map(([q, a]) => (
          <details key={q} className="group rounded-2xl bg-surface p-5 open:bg-white open:shadow-[0_0_0_1px_var(--color-line)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {q}
              <span className="text-xl text-muted transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-muted">{a}</p>
          </details>
        ))}
      </div>
      <p className="mt-8 text-muted">
        Javob topmadingizmi? <Link href="/contact" className="text-brand">Biz bilan bog&apos;laning</Link>
      </p>
    </PageShell>
  );
}
