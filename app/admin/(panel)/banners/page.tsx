import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdminPage } from "@/lib/admin-auth";
import { readDb } from "@/lib/db";
import BannersManager from "./BannersManager";

async function AdminBannersPageContent() {
  await requireAdminPage();
  await connection();
  const { banners, products } = await readDb();
  // Forma uchun faqat kerakli maydonlar: tovarni ID bo'yicha topib, nomi va rasmini ko'rsatish
  const productOptions = products.map((p) => ({ id: p.id, title: p.title, image: p.image }));
  return <BannersManager banners={banners} products={productOptions} />;
}

// Menyu darhol ko'rinadi, ma'lumot (kirish tekshiruvidan keyin) ortidan yuklanadi
export default function AdminBannersPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Yuklanmoqda…</div>}>
      <AdminBannersPageContent />
    </Suspense>
  );
}
