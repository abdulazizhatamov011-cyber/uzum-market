// Bozorcha belgisi: to'q sariq fonda jilmayib turgan oq xarid sumkasi (app/icon.svg bilan bir xil)
export default function BrandMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#ea580c" />
      <path d="M15 15V12a5 5 0 0 1 10 0v3" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="10" y="14" width="20" height="19.5" rx="3" fill="#fff" />
      <circle cx="15" cy="17.8" r="1.3" fill="#ea580c" />
      <circle cx="25" cy="17.8" r="1.3" fill="#ea580c" />
      <path d="M15.5 23.5q4.5 4 9 0" fill="none" stroke="#ea580c" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}
