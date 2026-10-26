import PageShell from "@/components/PageShell";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata = { title: "Bozorchada soting — Bozorcha" };

const perks = [
  { icon: "👥", title: "Millionlab xaridorlar", text: "Mahsulotlaringizni butun O'zbekiston bo'ylab ko'rishadi" },
  { icon: "🚚", title: "Logistika bizdan", text: "Omborga topshirasiz — qolganini o'zimiz yetkazamiz" },
  { icon: "📊", title: "Qulay kabinet", text: "Sotuvlar, qoldiqlar va to'lovlar bitta joyda" },
  { icon: "💸", title: "Tezkor to'lovlar", text: "Daromad har hafta hisobingizga o'tkaziladi" },
];

export default function SellerPage() {
  return (
    <PageShell title="Bozorchada soting" subtitle="Biznesingizni onlayn bozorda rivojlantiring">
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="rounded-2xl bg-gradient-to-r from-brand to-[#fb923c] text-white p-8">
            <div className="text-3xl sm:text-4xl font-black">0 so&apos;m — ro&apos;yxatdan o&apos;tish</div>
            <p className="mt-2 opacity-90">Birinchi oy komissiyasiz savdo qiling</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {perks.map((p) => (
              <div key={p.title} className="rounded-2xl bg-surface p-5">
                <div className="text-3xl">{p.icon}</div>
                <div className="font-semibold mt-3">{p.title}</div>
                <div className="text-sm text-muted mt-1">{p.text}</div>
              </div>
            ))}
          </div>
        </div>
        <ApplicationForm extraLabel="Do'kon nomi yoki STIR" />
      </div>
    </PageShell>
  );
}
