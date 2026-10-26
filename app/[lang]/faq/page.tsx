import Link from "@/components/LocalLink";
import PageShell from "@/components/PageShell";
import { getDict, toLang } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">) {
  const t = getDict(toLang((await params).lang));
  return { title: `${t.faq.title} — ${t.meta.suffix}` };
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const f = getDict(toLang((await params).lang)).faq;
  return (
    <PageShell title={f.title} subtitle={f.subtitle} narrow>
      <div className="space-y-3">
        {f.items.map(([q, a]) => (
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
        {f.noAnswer} <Link href="/contact" className="text-brand">{f.contactUs}</Link>
      </p>
    </PageShell>
  );
}
