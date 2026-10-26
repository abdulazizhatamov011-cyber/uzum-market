import PageShell from "@/components/PageShell";
import { getDict, toLang } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">) {
  const t = getDict(toLang((await params).lang));
  return { title: `${t.privacy.title} — ${t.meta.suffix}` };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const p = getDict(toLang((await params).lang)).privacy;
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
