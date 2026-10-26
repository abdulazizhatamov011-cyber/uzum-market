import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { requireAdminPage } from "@/lib/admin-auth";
import { readDb } from "@/lib/db";
import { formatPrice } from "@/lib/data";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import ApplicationsTable from "./ApplicationsTable";

async function AdminDashboardContent() {
  await requireAdminPage();
  await connection();
  const db = await readDb();

  const active = db.orders.filter((o) => o.status !== "Bekor qilindi");
  const revenue = active.reduce((s, o) => s + o.total, 0);
  const newOrders = db.orders.filter((o) => o.status === "Yangi").length;
  const outOfStock = db.products.filter((p) => p.stock === 0).length;
  const lowStock = db.products.filter((p) => p.stock > 0 && p.stock < 5).length;
  const newApps = db.applications.filter((a) => !a.done).length;

  const stats = [
    { label: "Savdo summasi", value: `${formatPrice(revenue)} so'm`, note: `${active.length} ta buyurtmadan` },
    { label: "Yangi buyurtmalar", value: newOrders, note: `jami ${db.orders.length} ta`, href: "/admin/orders" },
    { label: "Tovarlar", value: db.products.length, note: outOfStock || lowStock ? `${outOfStock} tasi tugagan, ${lowStock} tasi kam` : "hammasi omborda bor", href: "/admin/products" },
    { label: "Yangi arizalar", value: newApps, note: `jami ${db.applications.length} ta` },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-[24px] sm:text-[28px]">Bosh panel</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const body = (
            <>
              <div className="text-sm text-muted">{s.label}</div>
              <div className="mt-1.5 font-display font-bold text-[20px] sm:text-[24px] tracking-tight">{s.value}</div>
              <div className="mt-1 text-[13px] text-muted">{s.note}</div>
            </>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="rounded-[20px] bg-white p-5 border border-line hover:border-[#c9d4e8]">
              {body}
            </Link>
          ) : (
            <div key={s.label} className="rounded-[20px] bg-white p-5 border border-line">
              {body}
            </div>
          );
        })}
      </div>

      <section className="rounded-[20px] bg-white border border-line p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px]">Oxirgi buyurtmalar</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-cobalt hover:underline">
            Hammasi
          </Link>
        </div>
        {db.orders.length === 0 ? (
          <p className="py-6 text-center text-muted text-sm">
            Hali buyurtma yo&apos;q. Xaridor saytda buyurtma bersa, shu yerda paydo bo&apos;ladi.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {db.orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
                <span className="font-medium">№{o.id}</span>
                <span className="text-muted">{o.name}</span>
                <span className="ml-auto font-medium">{formatPrice(o.total)} so&apos;m</span>
                <OrderStatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[20px] bg-white border border-line p-5">
        <h2 className="text-[18px] mb-3">Arizalar</h2>
        <ApplicationsTable items={db.applications} />
      </section>
    </div>
  );
}

// Menyu darhol ko'rinadi, ma'lumot (kirish tekshiruvidan keyin) ortidan yuklanadi
export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Yuklanmoqda…</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
