import type { Banner } from "@/lib/data";
import { getProduct } from "@/lib/data";

// Bitta banner: chapda sarlavha, o'ngda mahsulot Rishton laganiga o'xshash dumaloq "tovoq"da.
// O'lchamlar "cqw" (konteyner kengligiga nisbatan) — telefonda ham, kompyuterda ham bir xil ko'rinadi.
export default function BannerSlide({ b, eager, phone }: { b: Banner; eager?: boolean; phone?: boolean }) {
  const image = getProduct(b.productId)?.image;
  // Telefonda banner balandroq (2.2:1), shuning uchun matn va tovoq nisbatan kattaroq
  const t = phone
    ? { title: "text-[8cqw]", sub: "text-[3.9cqw]", btn: "text-[3.4cqw] px-[3.6cqw] py-[1.4cqw]", plate: "w-[38cqw]", box: "max-w-[58%]" }
    : { title: "text-[5.6cqw]", sub: "text-[2.3cqw]", btn: "text-[1.9cqw] px-[2.2cqw] py-[0.9cqw]", plate: "w-[27cqw]", box: "max-w-[60%]" };
  return (
    <div className="relative w-full h-full overflow-hidden text-white [container-type:inline-size]" style={{ background: b.color }}>
      <div className={`relative h-full flex flex-col justify-center pl-[6cqw] ${t.box}`}>
        <h2 className={`font-display font-bold leading-[1.02] tracking-[-0.03em] ${t.title}`}>{b.title}</h2>
        <p className={`mt-[1.4cqw] leading-snug text-white/90 ${t.sub}`}>{b.subtitle}</p>
        <span className={`mt-[2.4cqw] self-start rounded-full bg-white text-ink font-medium ${t.btn}`}>
          Ko&apos;rish
        </span>
      </div>

      {image && (
        <div className={`absolute right-[5cqw] top-1/2 -translate-y-1/2 ${t.plate} aspect-square rounded-full bg-white grid place-items-center`}>
          {/* Lagan chetidagi naqsh halqasi */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden>
            <circle cx="50" cy="50" r="46.5" fill="none" stroke={b.color} strokeWidth="2.2" strokeDasharray="1 4.2" strokeLinecap="round" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1f5fbf" strokeOpacity=".18" strokeWidth="1" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            loading={eager ? "eager" : "lazy"}
            draggable={false}
            className="relative w-[62%] h-[62%] object-contain"
          />
        </div>
      )}
    </div>
  );
}
