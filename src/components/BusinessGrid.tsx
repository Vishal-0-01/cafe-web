import type { BusinessWithRelations } from "@/types/database";
import BusinessCard from "@/components/BusinessCard";

export default function BusinessGrid({
  businesses,
  emptyMessage = "No results found. Try a different search or filter.",
}: {
  businesses: BusinessWithRelations[];
  emptyMessage?: string;
}) {
  if (businesses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white/60 p-10 text-center text-sm text-ink/50">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {businesses.map((b) => (
        <BusinessCard key={b.id} business={b} />
      ))}
    </div>
  );
}
