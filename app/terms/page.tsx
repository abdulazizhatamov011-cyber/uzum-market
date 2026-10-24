import PageShell from "@/components/PageShell";

export const metadata = { title: "Foydalanuvchi kelishuvi — Uzum Market" };

export default function TermsPage() {
  return (
    <PageShell title="Foydalanuvchi kelishuvi" narrow>
      <div className="space-y-4 text-muted leading-relaxed">
        <p>Ushbu sahifa o&apos;quv loyihasi uchun namunaviy matn hisoblanadi.</p>
        <h2 className="text-lg font-semibold text-ink">1. Umumiy qoidalar</h2>
        <p>Sayt Uzum Market dizaynini o&apos;rganish maqsadida yaratilgan va haqiqiy savdo amalga oshirmaydi.</p>
        <h2 className="text-lg font-semibold text-ink">2. Buyurtmalar</h2>
        <p>Rasmiylashtirilgan buyurtmalar demo hisoblanadi: to&apos;lov olinmaydi va mahsulot yetkazilmaydi.</p>
        <h2 className="text-lg font-semibold text-ink">3. Mahsulot rasmlari</h2>
        <p>Mahsulot rasmlari ochiq dummyjson.com xizmatidan olingan.</p>
      </div>
    </PageShell>
  );
}
