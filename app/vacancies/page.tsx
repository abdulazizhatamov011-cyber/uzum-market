import PageShell from "@/components/PageShell";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata = { title: "Vakansiyalar — Uzum Market" };

const jobs = [
  { title: "Frontend dasturchi (Next.js)", place: "Toshkent, ofis", type: "To'liq stavka" },
  { title: "Topshirish punkti operatori", place: "Barcha viloyatlar", type: "Smenali grafik" },
  { title: "Ombor xodimi", place: "Toshkent viloyati", type: "To'liq stavka" },
  { title: "Kuryer", place: "Toshkent, Samarqand", type: "Erkin grafik" },
  { title: "Mijozlarni qo'llab-quvvatlash mutaxassisi", place: "Masofaviy", type: "Smenali grafik" },
];

export default function VacanciesPage() {
  return (
    <PageShell title="Vakansiyalar" subtitle="Jamoamizga qo'shiling">
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-3">
          {jobs.map((j) => (
            <a key={j.title} href="#ariza" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line p-5 hover:border-brand transition">
              <div>
                <div className="font-semibold">{j.title}</div>
                <div className="text-sm text-muted">{j.place}</div>
              </div>
              <span className="rounded-lg bg-brand-soft text-brand text-sm px-3 py-1">{j.type}</span>
            </a>
          ))}
        </div>
        <ApplicationForm extraLabel="Qaysi vakansiya qiziqtiradi?" />
      </div>
    </PageShell>
  );
}
