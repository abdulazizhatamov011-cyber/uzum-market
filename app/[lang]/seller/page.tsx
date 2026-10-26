import PageShell from "@/components/PageShell";
import ApplicationForm from "@/components/ApplicationForm";
import { getDict, toLang } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/seller">) {
  const t = getDict(toLang((await params).lang));
  return { title: `${t.seller.title} — ${t.meta.suffix}` };
}

export default async function SellerPage({ params }: PageProps<"/[lang]/seller">) {
  const s = getDict(toLang((await params).lang)).seller;
  return (
    <PageShell title={s.title} subtitle={s.subtitle}>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="rounded-2xl bg-gradient-to-r from-brand to-[#fb923c] text-white p-8">
            <div className="text-3xl sm:text-4xl font-black">{s.hero}</div>
            <p className="mt-2 opacity-90">{s.heroText}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {s.perks.map((p) => (
              <div key={p.title} className="rounded-2xl bg-surface p-5">
                <div className="text-3xl">{p.icon}</div>
                <div className="font-semibold mt-3">{p.title}</div>
                <div className="text-sm text-muted mt-1">{p.text}</div>
              </div>
            ))}
          </div>
        </div>
        <ApplicationForm kind="seller" extraLabel={s.extra} />
      </div>
    </PageShell>
  );
}
