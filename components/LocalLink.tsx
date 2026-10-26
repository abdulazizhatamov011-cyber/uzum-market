"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "./I18nProvider";

// next/link bilan bir xil, faqat sayt ichidagi manzilga joriy til prefiksini qo'shadi: /cart → /ru/cart
export default function LocalLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { href: localize } = useI18n();
  return <Link href={typeof href === "string" ? localize(href) : href} {...props} />;
}
