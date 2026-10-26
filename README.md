# Bozorcha — onlayn bozor

Next.js 16 asosidagi o'quv loyihasi: do'kon sahifalari va admin panel.

## Ishga tushirish

```bash
npm install
npm run dev
```

Sayt: http://localhost:3000, admin panel: http://localhost:3000/admin

## Admin panel

- Kirish paroli `.env.local` faylidagi `ADMIN_PASSWORD` dan olinadi (namuna: `.env.example`).
  Dev rejimida parol sozlanmagan bo'lsa, vaqtinchalik `admin123` ishlaydi; productionda parol majburiy.
- Bo'limlar: bosh panel (statistika va arizalar), buyurtmalar (holatini o'zgartirish), tovarlar (qo'shish, tahrirlash, o'chirish), bannerlar.

## Ma'lumotlar

Tovarlar, bannerlar, buyurtmalar va arizalar serverdagi `data/db.json` faylida saqlanadi.
Fayl birinchi ishga tushirishda `lib/products.ts` va `lib/promo-nestle.json` dan avtomatik yaratiladi.
Boshlang'ich holatga qaytarish uchun serverni to'xtatib, `data/db.json` ni o'chiring.

Fayl-baza doimiy diskli serverda (VPS yoki o'z kompyuteringiz) ishlaydi. Vercel kabi serverless hostingda fayl saqlanib qolmaydi —
u yerda haqiqiy ma'lumotlar bazasi (masalan, PostgreSQL) kerak bo'ladi.

## SMS orqali kirish

Telefon raqamiga tasdiqlash kodi Eskiz.uz orqali yuboriladi (`ESKIZ_EMAIL`, `ESKIZ_PASSWORD` — `.env.example` ga qarang).
Sozlanmagan bo'lsa, dev rejimida kod ekranda va server konsolida ko'rsatiladi.

## Tillar / Языки

Sayt ikki tilda: o'zbekcha (prefikssiz, masalan `/cart`) va ruscha (`/ru/cart`).
Barcha matnlar `lib/i18n.ts` lug'atida; tovarlarning ruscha nomlari `lib/products-ru.json` da va admin paneldagi «Nomi (ruscha)» maydonida.
Til almashtirgich — sarlavhada (telefonda UZ/RU tugmasi). Admin panel faqat o'zbekcha.
