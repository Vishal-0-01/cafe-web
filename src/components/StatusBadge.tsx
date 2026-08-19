import { getOpenStatus } from "@/lib/utils";
import type { OpeningHours } from "@/types/database";

export default function StatusBadge({ hours }: { hours: OpeningHours }) {
  const status = getOpenStatus(hours);
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        status.isOpen ? "text-brand-600" : "text-ink/50"
      }`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${status.isOpen ? "bg-brand-500" : "bg-ink/30"}`}
      />
      {status.label}
    </span>
  );
}
