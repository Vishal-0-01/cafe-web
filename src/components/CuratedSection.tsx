import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BusinessWithRelations } from "@/types/database";
import BusinessCard from "@/components/BusinessCard";

export default function CuratedSection({
  title,
  description,
  businesses,
  viewAllHref,
}: {
  title: string;
  description?: string;
  businesses: BusinessWithRelations[];
  viewAllHref?: string;
}) {
  if (businesses.length === 0) return null;

  return (
    <section className="py-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-semibold sm:text-2xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink/60">{description}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 sm:flex"
          >
            View all <ArrowRight size={16} aria-hidden />
          </Link>
        )}
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {businesses.map((b) => (
          <div key={b.id} className="w-40 shrink-0 snap-start sm:w-auto">
            <BusinessCard business={b} />
          </div>
        ))}
      </div>
    </section>
  );
}
