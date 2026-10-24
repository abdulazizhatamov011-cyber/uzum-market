import type { MetadataRoute } from "next";

// Telefonda "Bosh ekranga qo'shish" uchun: belgilar butun kvadratni sariq to'ldiradi,
// shuning uchun telefon qaysi shaklda kesmasin, chetlarida oq joy qolmaydi
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Uzum Market",
    short_name: "Uzum Market",
    description: "O'zbekistondagi milliy marketpleys",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7000ff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
