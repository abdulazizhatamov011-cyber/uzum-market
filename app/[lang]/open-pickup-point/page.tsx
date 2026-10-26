import PageShell from "@/components/PageShell";
import ApplicationForm from "@/components/ApplicationForm";
import { getDict, toLang } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/open-pickup-point">) {
  const t = getDict(toLang((await params).lang));
  return { title: `${t.openPoint.title} — ${t.meta.suffix}` };
}

export default async function OpenPickupPointPage({ params }: PageProps<"/[lang]/open-pickup-point">) {
  const o = getDict(toLang((await params).lang)).openPoint;
  return (
    <PageShell title={o.title} subtitle={o.subtitle}>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div>
          <h2 className="text-xl font-semibold mb-4">{o.how}</h2>
          <ol className="space-y-3">
            {o.steps.map((s, i) => (
              <li key={s} className="flex gap-4 items-center rounded-2xl bg-surface p-4">
                <span className="w-9 h-9 shrink-0 rounded-full bg-brand text-white grid place-items-center font-bold">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <h2 className="text-xl font-semibold mt-8 mb-3">{o.reqTitle}</h2>
          <ul className="list-disc pl-5 text-muted space-y-1">
            {o.reqs.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <ApplicationForm kind="pickup" extraLabel={o.extra} />
      </div>
    </PageShell>
  );
}
