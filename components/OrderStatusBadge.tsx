import type { OrderStatus } from "@/lib/types";

export const statusStyle: Record<OrderStatus, string> = {
  Yangi: "bg-brand-soft text-brand-dark",
  "Yig'ilmoqda": "bg-[#fff4d6] text-[#8a5a00]",
  "Yo'lda": "bg-surface text-cobalt",
  Yetkazildi: "bg-[#e3f8ec] text-[#15803d]",
  "Bekor qilindi": "bg-[#fde8ee] text-sale",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium ${statusStyle[status] ?? "bg-surface"}`}>
      {status}
    </span>
  );
}
