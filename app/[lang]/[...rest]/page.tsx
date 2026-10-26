import { notFound } from "next/navigation";

// Mavjud bo'lmagan har qanday manzil — chiroyli 404 sahifasi (sarlavha va footer bilan)
export default function CatchAll() {
  notFound();
}
