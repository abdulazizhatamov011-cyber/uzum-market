import PageShell from "@/components/PageShell";
import { getDict, toLang } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">) {
  const t = getDict(toLang((await params).lang));
  return { title: `${t.terms.title} — ${t.meta.suffix}` };
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const p = getDict(toLang((await params).lang)).terms;
  return (
    <PageShell title={p.title} narrow>
      <div className="space-y-4 text-muted leading-relaxed">
        {p.sections.map(([h, text]) => (
          <div key={text} className="space-y-2">
            {h && <h2 className="text-lg font-semibold text-ink">{h}</h2>}
            <p>{text}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
