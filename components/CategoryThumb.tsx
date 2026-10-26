import type { Category } from "@/lib/types";

// Turkum belgisi: shu turkumdagi tovarning haqiqiy rasmi dumaloq (yoki yumaloq burchakli) ramkada.
// Rasm topilmasa — emoji.
export default function CategoryThumb({
  c,
  src,
  className = "w-[60px] h-[60px] rounded-full",
}: {
  c: Category;
  src?: string;
  className?: string;
}) {
  return (
    <span className={`relative grid place-items-center overflow-hidden bg-surface shrink-0 ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <span className="text-[26px]" aria-hidden>
          {c.icon}
        </span>
      )}
    </span>
  );
}
