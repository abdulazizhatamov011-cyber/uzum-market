import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdminPage } from "@/lib/admin-auth";
import { readDb } from "@/lib/db";
import OrdersTable from "./OrdersTable";

async function AdminOrdersPageContent() {
  await requireAdminPage();
  await connection();
  const { orders } = await readDb();
  return (
    <div>
      <h1 className="text-[24px] sm:text-[28px] mb-6">Buyurtmalar</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}

// Menyu darhol ko'rinadi, ma'lumot (kirish tekshiruvidan keyin) ortidan yuklanadi
export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Yuklanmoqda…</div>}>
      <AdminOrdersPageContent />
    </Suspense>
  );
}
