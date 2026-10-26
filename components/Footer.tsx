import Link from "next/link";
import BrandMark from "./BrandMark";

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
      { label: "Bozorchada soting", href: "/seller" },
      { label: "Sotuvchi kabinetiga kirish", href: "/seller#ariza" },
      { label: "Topshirish punktini ochish", href: "/open-pickup-point" },
    ],
  },
];

const socials = [
  { label: "IG", name: "Instagram", href: "https://www.instagram.com/" },
  { label: "TG", name: "Telegram", href: "https://t.me/" },
  { label: "YT", name: "YouTube", href: "https://www.youtube.com/" },
  { label: "FB", name: "Facebook", href: "https://www.facebook.com/" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white rounded-t-[32px] pb-28 md:pb-0">
      <div className="container-x grid gap-8 pt-10 pb-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <BrandMark className="w-10 h-10" />
            <span className="font-display font-bold text-[22px] tracking-tight">bozorcha</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-white/65">
            Uydan chiqmasdan bozor qiling: buyurtma ertaga eng yaqin topshirish punktida.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="w-9 h-9 grid place-items-center rounded-full border border-white/20 text-xs font-semibold text-white/80 hover:bg-white hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-display font-medium text-[15px] mb-4">{c.title}</h4>
            <ul className="space-y-2.5 text-sm text-white/65">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-x flex flex-col sm:flex-row gap-3 justify-between border-t border-white/10 py-6 text-sm text-white/55">
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white">Maxfiylik kelishuvi</Link>
          <Link href="/terms" className="hover:text-white">Foydalanuvchi kelishuvi</Link>
        </div>
        <span>© 2026 Bozorcha — o&apos;quv loyihasi</span>
      </div>
    </footer>
  );
}
