import PageShell from "@/components/PageShell";
import ApplicationForm from "@/components/ApplicationForm";
import { getDict, toLang } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/vacancies">) {
  const t = getDict(toLang((await params).lang));
  return { title: `${t.vacancies.title} — ${t.meta.suffix}` };
}

export default async function VacanciesPage({ params }: PageProps<"/[lang]/vacancies">) {
  const v = getDict(toLang((await params).lang)).vacancies;
  return (
    <PageShell title={v.title} subtitle={v.subtitle}>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-3">
          {v.jobs.map((j) => (
            <a key={j.title} href="#ariza" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line p-5 hover:border-brand transition">
              <div>
                <div className="font-semibold">{j.title}</div>
                <div className="text-sm text-muted">{j.place}</div>
              </div>
              <span className="rounded-lg bg-brand-soft text-brand text-sm px-3 py-1">{j.type}</span>
            </a>
          ))}
        </div>
        <ApplicationForm kind="job" extraLabel={v.extra} />
      </div>
    </PageShell>
  );
}
