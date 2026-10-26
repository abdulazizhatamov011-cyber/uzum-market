import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdminPage } from "@/lib/admin-auth";
import { readDb } from "@/lib/db";
import ProductsManager from "./ProductsManager";

async function AdminProductsPageContent() {
  await requireAdminPage();
  await connection();
  const { products } = await readDb();
  return <ProductsManager products={products} />;
}

// Menyu darhol ko'rinadi, ma'lumot (kirish tekshiruvidan keyin) ortidan yuklanadi
export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Yuklanmoqda…</div>}>
      <AdminProductsPageContent />
    </Suspense>
  );
}
