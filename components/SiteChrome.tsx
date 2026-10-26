"use client";

import { usePathname } from "next/navigation";

// Do'kon sahifalaridagi sarlavha, footer va pastki menyu — admin panelda ko'rsatilmaydi
export default function SiteChrome({
  top,
  bottom,
  children,
}: {
  top: React.ReactNode;
  bottom: React.ReactNode;
  children: React.ReactNode;
}) {
  const admin = usePathname().startsWith("/admin");
  if (admin) return <>{children}</>;
  return (
    <>
      {top}
      <main className="flex-1">{children}</main>
      {bottom}
    </>
  );
}
