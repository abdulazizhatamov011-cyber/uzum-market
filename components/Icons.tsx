type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const SearchIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const UserIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
);
export const HeartIcon = ({ className = "w-5 h-5", filled = false }: P & { filled?: boolean }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"} className={className}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
);
export const BagIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const PinIcon = ({ className = "w-4 h-4" }: P) => (
  <svg {...base} className={className}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const ChevronDown = ({ className = "w-4 h-4" }: P) => (
  <svg {...base} className={className}><path d="m6 9 6 6 6-6" /></svg>
);
export const ChevronRight = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="m9 6 6 6-6 6" /></svg>
);
export const ChevronLeft = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="m15 6-6 6 6 6" /></svg>
);
export const MenuIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="M4 7h16M4 12h16M4 17h10" /></svg>
);
export const CloseIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const HomeIcon = ({ className = "w-6 h-6" }: P) => (
  <svg {...base} className={className}><path d="M4 11 12 4l8 7v9H4v-9Z" /></svg>
);
export const GridIcon = ({ className = "w-6 h-6" }: P) => (
  <svg {...base} className={className}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
);
export const CartPlusIcon = ({ className = "w-4 h-4" }: P) => (
  <svg {...base} className={className}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /><path d="M12 12v5M9.5 14.5h5" /></svg>
);
export const StarIcon = ({ className = "w-3.5 h-3.5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="#ffb54c">
    <path d="m12 2.5 2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8L12 2.5Z" />
  </svg>
);
export const TrashIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
);
