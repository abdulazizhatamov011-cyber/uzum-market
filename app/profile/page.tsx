"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/StoreProvider";
import PageShell, { EmptyState } from "@/components/PageShell";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, orders, favorites, cartCount } = useStore();

  if (!user) {
    return (
      <PageShell title="Shaxsiy kabinet">
        <EmptyState icon="👤" title="Siz tizimga kirmagansiz" text="Buyurtmalar va ma'lumotlaringizni ko'rish uchun kiring" href="/login" action="Kirish" />
      </PageShell>
    );
  }

  const cards = [
    { href: "/orders", icon: "📦", title: "Buyurtmalarim", value: `${orders.length} ta` },
    { href: "/favorites", icon: "💜", title: "Saralangan", value: `${favorites.length} ta` },
    { href: "/cart", icon: "🛍️", title: "Savat", value: `${cartCount} ta` },
    { href: "/pickup-points", icon: "📍", title: "Topshirish punktlari", value: "Xaritada" },
  ];

  return (
    <PageShell title="Shaxsiy kabinet">
      <div className="rounded-2xl bg-[#f2f4f7] p-6 flex flex-wrap items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand text-white grid place-items-center text-2xl font-bold">
          {user.name[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="text-xl font-semibold">{user.name}</div>
          <div className="text-muted">{user.phone}</div>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="h-10 px-5 rounded-xl border border-line bg-white hover:border-[#ff4d6a] hover:text-[#ff4d6a]"
        >
          Chiqish
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-2xl border border-line p-5 hover:shadow-md transition">
            <div className="text-3xl">{c.icon}</div>
            <div className="mt-3 font-semibold">{c.title}</div>
            <div className="text-sm text-muted">{c.value}</div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
