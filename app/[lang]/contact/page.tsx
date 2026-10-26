import PageShell from "@/components/PageShell";
import ApplicationForm from "@/components/ApplicationForm";
import { getDict, toLang } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  const t = getDict(toLang((await params).lang));
  return { title: `${t.contact.title} — ${t.meta.suffix}` };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const c = getDict(toLang((await params).lang)).contact;
  return (
    <PageShell title={c.title} subtitle={c.subtitle}>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="grid sm:grid-cols-3 gap-4 content-start">
          {c.channels.map((ch) => (
            <div key={ch.title} className="rounded-2xl bg-surface p-5">
              <div className="text-3xl">{ch.icon}</div>
              <div className="font-semibold mt-3">{ch.title}</div>
              <div className="text-sm text-muted mt-1">{ch.text}</div>
            </div>
          ))}
        </div>
        <ApplicationForm kind="contact" extraLabel={c.extra} button={c.button} />
      </div>
    </PageShell>
  );
}
