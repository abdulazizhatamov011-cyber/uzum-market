import { EmptyState } from "@/components/PageShell";

export default function NotFound() {
  return (
    <div className="container-x">
      <EmptyState icon="🔍" title="Sahifa topilmadi" text="Bu sahifa mavjud emas yoki o'chirilgan. Bosh sahifadan davom eting." />
    </div>
  );
}
