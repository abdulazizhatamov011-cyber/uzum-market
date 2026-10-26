import PageShell from "@/components/PageShell";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata = { title: "Topshirish punktini ochish — Bozorcha" };

const steps = [
  "Ariza qoldiring — menejer siz bilan bog'lanadi",
  "Joy talablarga mos kelishini birga tekshiramiz",
  "Ta'mir va jihozlash bo'yicha brendbuk beramiz",
  "Xodimlarni o'qitamiz va punkt ishga tushadi",
];

export default function OpenPickupPointPage() {
  return (
    <PageShell title="Topshirish punktini ochish" subtitle="O'z biznesingizni Bozorcha bilan boshlang">
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div>
          <h2 className="text-xl font-semibold mb-4">Qanday ishlaydi?</h2>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-4 items-center rounded-2xl bg-surface p-4">
                <span className="w-9 h-9 shrink-0 rounded-full bg-brand text-white grid place-items-center font-bold">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <h2 className="text-xl font-semibold mt-8 mb-3">Talablar</h2>
          <ul className="list-disc pl-5 text-muted space-y-1">
            <li>Maydoni 30 m² dan katta xona</li>
            <li>Birinchi qavat, ko&apos;chadan alohida kirish</li>
            <li>Odamlar ko&apos;p yuradigan joy</li>
          </ul>
        </div>
        <ApplicationForm kind="pickup" extraLabel="Taxminiy manzil" />
      </div>
    </PageShell>
  );
}
