import { Suspense } from "react";
import AdminNav from "./AdminNav";

export const metadata = { title: "Admin — Bozorcha", robots: { index: false } };

// Panel qobig'i. Kirish tekshiruvi har bir sahifaning o'zida (requireAdminPage) —
// layout va sahifa parallel ishlaydi, shuning uchun faqat layout'dagi tekshiruvga tayanmaymiz.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-surface md:grid md:grid-cols-[232px_1fr]">
      <AdminNav />
      <div className="min-w-0 px-4 py-6 md:px-8 md:py-8">
        <Suspense fallback={<div className="py-20 text-center text-muted">Yuklanmoqda…</div>}>{children}</Suspense>
      </div>
    </div>
  );
}
