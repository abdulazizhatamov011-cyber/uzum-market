import PageShell from "@/components/PageShell";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata = { title: "Biz bilan bog'lanish — Bozorcha" };

const channels = [
  { icon: "📞", title: "Qo'llab-quvvatlash", text: "Har kuni 08:00 – 22:00" },
  { icon: "💬", title: "Telegram-chat", text: "Javob 5 daqiqa ichida" },
  { icon: "✉️", title: "Elektron pochta", text: "1 ish kuni ichida javob beramiz" },
];

export default function ContactPage() {
  return (
    <PageShell title="Biz bilan bog'lanish" subtitle="Savolingiz bo'lsa — yozing, albatta yordam beramiz">
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="grid sm:grid-cols-3 gap-4 content-start">
          {channels.map((c) => (
            <div key={c.title} className="rounded-2xl bg-surface p-5">
              <div className="text-3xl">{c.icon}</div>
              <div className="font-semibold mt-3">{c.title}</div>
              <div className="text-sm text-muted mt-1">{c.text}</div>
            </div>
          ))}
        </div>
        <ApplicationForm kind="contact" extraLabel="Savolingiz yoki buyurtma raqami" button="Xabar yuborish" />
      </div>
    </PageShell>
  );
}
