"use client";

import { useEffect, useState } from "react";

const STORE = {
  android: "https://play.google.com/store/apps/details?id=uz.uzum.app",
  ios: "https://apps.apple.com/uz/app/uzum-market/id1640483056",
};

// Telefonda sahifaning eng tepasida turadigan "Ilovani yuklab olish" paneli (uzum.uz'dagidek)
export default function AppBanner() {
  const [href, setHref] = useState(STORE.android);

  useEffect(() => {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) setHref(STORE.ios);
  }, []);

  return (
    <div className="md:hidden flex items-center gap-3 px-4 py-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon-192.png" alt="" className="w-11 h-11 rounded-xl" />
      <div className="flex-1 min-w-0 leading-tight">
        <div className="font-medium text-[15px]">Uzum Market</div>
        <div className="text-[13px] text-muted">Ilovani yuklab olish</div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="h-9 px-4 rounded-xl bg-brand text-white text-[15px] font-medium grid place-items-center"
      >
        Yuklab olish
      </a>
    </div>
  );
}
