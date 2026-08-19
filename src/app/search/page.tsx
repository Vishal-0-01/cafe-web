import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import BusinessGrid from "@/components/BusinessGrid";
import { searchBusinesses } from "@/lib/data";

export const metadata: Metadata = { title: "Explore" };

interface SearchPageProps {
  searchParams: {
    q?: string;
    open?: string;
    deal?: string;
    sort?: string;
    maxPrice?: string;
    amenity?: string | string[];
  };
}

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const amenities = searchParams.amenity
    ? Array.isArray(searchParams.amenity)
      ? searchParams.amenity
      : [searchParams.amenity]
    : [];

  const businesses = await searchBusinesses({
    q: searchParams.q,
    openNow: searchParams.open === "true",
    studentDiscount: searchParams.deal === "true",
    sort: (searchParams.sort as any) ?? "relevance",
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    amenities,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 max-w-xl">
        <SearchBar initialQuery={searchParams.q ?? ""} size="md" />
      </div>

      <div className="mb-5">
        <FilterBar />
      </div>

      <p className="mb-4 text-sm text-ink/50">
        {businesses.length} {businesses.length === 1 ? "result" : "results"}
        {searchParams.q ? ` for "${searchParams.q}"` : ""}
      </p>

      <BusinessGrid businesses={businesses} />
    </div>
  );
}
