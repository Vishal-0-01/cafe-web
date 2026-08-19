import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FilterBar from "@/components/FilterBar";
import BusinessGrid from "@/components/BusinessGrid";
import { getCategoryBySlug, getCategories, searchBusinesses } from "@/lib/data";

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { open?: string; deal?: string; sort?: string; maxPrice?: string; amenity?: string | string[] };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? `${category.name} near campus.`,
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const amenities = searchParams.amenity
    ? Array.isArray(searchParams.amenity)
      ? searchParams.amenity
      : [searchParams.amenity]
    : [];

  const businesses = await searchBusinesses({
    categorySlug: params.slug,
    openNow: searchParams.open === "true",
    studentDiscount: searchParams.deal === "true",
    sort: (searchParams.sort as any) ?? "relevance",
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    amenities,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">{category.name}</h1>
        {category.description && <p className="mt-1 text-sm text-ink/60">{category.description}</p>}
      </div>

      <div className="mb-5">
        <FilterBar />
      </div>

      <p className="mb-4 text-sm text-ink/50">
        {businesses.length} {businesses.length === 1 ? "place" : "places"}
      </p>

      <BusinessGrid businesses={businesses} />
    </div>
  );
}
