import Link from "next/link";

const cols = [
  {
    title: "Biz haqimizda",
    links: [
      { label: "Topshirish punktlari", href: "/pickup-points" },
      { label: "Vakansiyalar", href: "/vacancies" },
    ],
  },
  {
    title: "Foydalanuvchilarga",
    links: [
      { label: "Biz bilan bog'lanish", href: "/contact" },
      { label: "Savol-Javob", href: "/faq" },
    ],
  },
  {
    title: "Tadbirkorlarga",
    links: [
      { label: "Uzumda soting", href: "/seller" },
      { label: "Sotuvchi kabinetiga kirish", href: "/seller#ariza" },
      { label: "Topshirish punktini ochish", href: "/open-pickup-point" },
    ],
  },
];

const socials = [
  { label: "IG", href: "https://www.instagram.com/" },
  { label: "TG", href: "https://t.me/" },
  { label: "YT", href: "https://www.youtube.com/" },
  { label: "FB", href: "https://www.facebook.com/" },
];

export default function Footer() {
  return (
    <footer className="mt-16 pb-20 md:pb-0">
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-semibold mb-4">{c.title}</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-ink">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="font-semibold mb-4">Ilovani yuklab olish</h4>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href="https://apps.apple.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-[#f2f4f7] px-3 py-2 hover:bg-[#e9ecf1]"> AppStore</a>
            <a href="https://play.google.com/store" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-[#f2f4f7] px-3 py-2 hover:bg-[#e9ecf1]">▶ Google Play</a>
          </div>
          <h4 className="font-semibold mt-8 mb-4">Uzum ijtimoiy tarmoqlarda</h4>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="w-9 h-9 grid place-items-center rounded-lg bg-[#f2f4f7] text-xs font-bold text-muted hover:text-brand">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container-x flex flex-col sm:flex-row gap-3 justify-between border-t border-line py-6 text-sm text-muted">
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-ink">Maxfiylik kelishuvi</Link>
          <Link href="/terms" className="hover:text-ink">Foydalanuvchi kelishuvi</Link>
        </div>
        <span>© 2026 Uzum Market klon — o&apos;quv loyihasi</span>
      </div>
    </footer>
  );
}
