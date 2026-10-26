"use client";

import Link from "@/components/LocalLink";
import { useEffect, useState } from "react";
import { useStore, type Order } from "@/components/StoreProvider";
import PageShell, { EmptyState } from "@/components/PageShell";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { useCatalog } from "@/components/CatalogProvider";
import { formatPrice, localizeDelivery, localizePayment, productTitle } from "@/lib/data";
import { formatDateTime } from "@/lib/i18n";
import { useI18n } from "@/components/I18nProvider";
import { getOrdersByIds } from "@/lib/actions/shop";

export default function OrdersPage() {
  const { orders } = useStore();
  const { getProduct } = useCatalog();
  const { t, lang } = useI18n();
  const o_ = t.orders;
  // Brauzer buyurtma raqamlarini eslab qoladi; joriy holat (admin o'zgartirgan) serverdan olinadi
  const [fresh, setFresh] = useState<Map<number, Order>>(new Map());
  const ids = orders.map((o) => o.id).join(",");

  useEffect(() => {
    if (!ids) return;
    getOrdersByIds(ids.split(",").map(Number))
      .then((list) => setFresh(new Map(list.map((o) => [o.id, o]))))
      .catch(() => {});
  }, [ids]);

  const list = orders.map((o) => fresh.get(o.id) ?? o);

  return (
    <PageShell title={o_.title}>
      {list.length === 0 ? (
        <EmptyState icon="📦" title={o_.emptyTitle} text={o_.emptyText} />
      ) : (
        <div className="space-y-4">
          {list.map((o) => (
            <div key={o.id} className="rounded-[20px] border border-line p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{o_.order(o.id)}</div>
                  <div className="text-sm text-muted">{formatDateTime(o.date, lang)}</div>
                </div>
                <OrderStatusBadge status={o.status} label={t.status[o.status]} />
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                {o.items.map((i) => {
                  // Eski buyurtmalarda nom/rasm saqlanmagan — katalogdan olamiz
                  const p = getProduct(i.id);
                  const title = (p ? productTitle(p, lang) : i.title) ?? o_.product;
                  const image = i.image ?? p?.image;
                  return (
                    <Link key={i.id} href={`/product/${i.id}`} className="relative w-16 h-20 shrink-0 rounded-xl bg-surface" title={title}>
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt={title} className="w-full h-full object-contain p-1" />
                      )}
                      {i.qty > 1 && (
                        <span className="absolute -top-1 -right-1 rounded-full bg-brand text-white text-[11px] px-1.5">×{i.qty}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
              <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
                <div><span className="text-muted">{o_.delivery} </span>{localizeDelivery(o.delivery, lang)}</div>
                <div><span className="text-muted">{o_.payment} </span>{localizePayment(o.payment, lang)}</div>
                <div className="sm:text-right font-semibold">{formatPrice(o.total)} {t.common.som}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
