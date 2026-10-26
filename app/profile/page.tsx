"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/StoreProvider";
import PageShell, { EmptyState } from "@/components/PageShell";
import { BagIcon, HeartIcon, PinIcon } from "@/components/Icons";

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
    { href: "/orders", icon: <BoxIcon />, tone: "bg-brand-soft text-brand-dark", title: "Buyurtmalarim", value: `${orders.length} ta` },
    { href: "/favorites", icon: <HeartIcon className="w-6 h-6" />, tone: "bg-[#fde8ee] text-sale", title: "Saralangan", value: `${favorites.length} ta` },
    { href: "/cart", icon: <BagIcon className="w-6 h-6" />, tone: "bg-surface text-cobalt", title: "Savat", value: `${cartCount} ta` },
    { href: "/pickup-points", icon: <PinIcon className="w-6 h-6" />, tone: "bg-[#e3f8ec] text-[#15803d]", title: "Topshirish punktlari", value: "Xaritada" },
  ];

  return (
    <PageShell title="Shaxsiy kabinet">
      <div className="rounded-2xl bg-surface p-6 flex flex-wrap items-center gap-4">
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
          className="h-10 px-5 rounded-xl border border-line bg-white hover:border-[#ff4d6a] hover:text-sale"
        >
          Chiqish
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-[20px] border border-line p-5 hover:border-[#c9d4e8] transition">
            <span className={`grid place-items-center w-12 h-12 rounded-2xl ${c.tone}`}>{c.icon}</span>
            <div className="mt-3 font-semibold">{c.title}</div>
            <div className="text-sm text-muted">{c.value}</div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

// Buyurtma qutisi (boshqa ikonkalar bilan bir xil chiziq qalinligida)
function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
      <path d="m7.8 5.3 8.5 4.5" />
    </svg>
  );
}
