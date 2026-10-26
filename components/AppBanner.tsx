"use client";

import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";
import { CloseIcon } from "./Icons";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

// Telefonda sahifaning eng tepasida: saytni bosh ekranga o'rnatish taklifi.
// Android/Chrome'da tizimning o'rnatish oynasi ochiladi, iPhone'da qo'lda qo'shish yo'riqnomasi ko'rsatiladi.
export default function AppBanner() {
  const [hidden, setHidden] = useState(false);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [help, setHelp] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    let closed = false;
    try {
      closed = sessionStorage.getItem("appBannerClosed") === "1";
    } catch {}
    if (standalone || closed) setHidden(true);
    setIos(/iPhone|iPad|iPod/i.test(navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPrompt);
    };
    const onInstalled = () => setHidden(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (hidden) return null;

  const install = async () => {
    if (!prompt) return setHelp(true);
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setHidden(true);
    setPrompt(null);
  };

  const close = () => {
    setHidden(true);
    try {
      sessionStorage.setItem("appBannerClosed", "1");
    } catch {}
  };

  return (
    <div className="md:hidden flex items-center gap-3 px-4 py-2">
      <button aria-label="Yopish" onClick={close} className="-ml-1 text-muted">
        <CloseIcon className="w-4 h-4" />
      </button>
      <BrandMark className="w-11 h-11" />
      <div className="flex-1 min-w-0 leading-tight">
        <div className="font-medium text-[15px]">Bozorcha</div>
        <div className="text-[13px] text-muted">Telefoningizga o&apos;rnating</div>
      </div>
      <button onClick={install} className="h-9 px-4 rounded-full bg-brand text-white text-[15px] font-medium">
        O&apos;rnatish
      </button>

      {help && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setHelp(false)}>
          <div className="w-full rounded-t-2xl bg-white p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
            <div className="flex items-center gap-3">
              <BrandMark className="w-12 h-12" />
              <div className="font-semibold text-lg">Bozorchani bosh ekranga qo&apos;shing</div>
            </div>
            <ol className="mt-4 space-y-2 text-[15px] list-decimal pl-5">
              {ios ? (
                <>
                  <li>Pastdagi <b>Ulashish</b> tugmasini bosing (⬆️ belgili kvadrat)</li>
                  <li><b>Bosh ekranga qo&apos;shish</b> (На экран «Домой») ni tanlang</li>
                  <li>Yuqorida <b>Qo&apos;shish</b> ni bosing</li>
                </>
              ) : (
                <>
                  <li>Brauzerning <b>⋮</b> menyusini oching</li>
                  <li><b>Bosh ekranga qo&apos;shish</b> yoki <b>Ilovani o&apos;rnatish</b> ni tanlang</li>
                </>
              )}
            </ol>
            <button onClick={() => setHelp(false)} className="mt-5 w-full h-12 rounded-full bg-brand text-white font-medium">
              Tushunarli
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
