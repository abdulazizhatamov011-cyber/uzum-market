"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applicationKinds, type Application, type ApplicationKind } from "@/lib/types";
import { deleteApplication, setApplicationDone } from "@/lib/actions/admin";
import { formatDateTime } from "@/lib/data";

export default function ApplicationsTable({ items }: { items: Application[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<ApplicationKind | "all">("all");
  const [pending, start] = useTransition();
  const list = kind === "all" ? items : items.filter((a) => a.kind === kind);

  const run = (fn: () => Promise<unknown>) => start(async () => {
    await fn();
    router.refresh();
  });

  if (!items.length) {
    return (
      <p className="py-6 text-center text-muted text-sm">
        Arizalar yo&apos;q. Saytdagi «Sotuvchi bo&apos;lish», «Topshirish punktini ochish», «Vakansiyalar» va «Bog&apos;lanish»
        formalari shu yerga keladi.
      </p>
    );
  }

  return (
    <div className={pending ? "opacity-60 transition-opacity" : ""}>
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
        {(["all", ...Object.keys(applicationKinds)] as const).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k as ApplicationKind | "all")}
            className={`shrink-0 h-8 px-3.5 rounded-full text-sm border ${
              kind === k ? "bg-ink text-white border-ink" : "border-line hover:border-ink/30"
            }`}
          >
            {k === "all" ? "Hammasi" : applicationKinds[k as ApplicationKind]}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-line">
        {list.map((a) => (
          <li key={a.id} className={`py-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center ${a.done ? "opacity-55" : ""}`}>
            <div className="text-sm min-w-0">
              <div className="flex flex-wrap items-center gap-x-2">
                <span className="font-medium">{a.name}</span>
                <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="text-cobalt">{a.phone}</a>
                <span className="rounded-full bg-surface px-2 py-0.5 text-[12px]">{applicationKinds[a.kind]}</span>
              </div>
              <div className="text-muted mt-0.5 break-words">
                {a.city}. {a.extra}
              </div>
              <div className="text-[12px] text-muted mt-0.5">{formatDateTime(a.date)}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => run(() => setApplicationDone(a.id, !a.done))}
                className={`h-8 px-3.5 rounded-full text-sm ${a.done ? "border border-line" : "bg-ink text-white"}`}
              >
                {a.done ? "Qayta ochish" : "Ko'rib chiqildi"}
              </button>
              <button
                onClick={() => confirm("Ariza o'chirilsinmi?") && run(() => deleteApplication(a.id))}
                className="h-8 px-3.5 rounded-full text-sm text-sale border border-line hover:border-sale"
              >
                O&apos;chirish
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
