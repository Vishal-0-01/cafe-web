import { Tag } from "lucide-react";
import type { Offer } from "@/types/database";

export default function OfferBadge({ offer }: { offer: Offer }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-clay/10 px-2.5 py-1 text-xs font-semibold text-clay">
      <Tag size={12} aria-hidden />
      {offer.title}
    </span>
  );
}
