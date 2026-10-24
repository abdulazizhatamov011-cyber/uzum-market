"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "./StoreProvider";
import { BagIcon, GridIcon, HeartIcon, HomeIcon, UserIcon } from "./Icons";

export default function MobileNav() {
  const path = usePathname();
  const { cartCount, user } = useStore();
  const items = [
    { href: "/", label: "Bosh sahifa", icon: <HomeIcon /> },
    { href: "/catalog", label: "Katalog", icon: <GridIcon /> },
    { href: "/cart", label: "Savat", icon: <BagIcon className="w-6 h-6" />, count: cartCount },
    { href: "/favorites", label: "Saralangan", icon: <HeartIcon className="w-6 h-6" /> },
    { href: user ? "/profile" : "/login", label: "Kabinet", icon: <UserIcon className="w-6 h-6" /> },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-line grid grid-cols-5 h-16">
      {items.map((i) => (
        <Link
          key={i.label}
          href={i.href}
          className={`relative flex flex-col items-center justify-center gap-0.5 text-[11px] ${
            path === i.href ? "text-brand" : "text-muted"
          }`}
        >
          {i.icon}
          {i.label}
          {!!i.count && (
            <span className="absolute top-1.5 left-1/2 ml-1 min-w-[18px] h-[18px] px-1 rounded-md bg-brand text-white text-[11px] grid place-items-center">
              {i.count}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
