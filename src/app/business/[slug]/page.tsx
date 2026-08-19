import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Wifi, Zap, Snowflake, Volume2, CreditCard, ShieldCheck } from "lucide-react";
import { getBusinessBySlug, getRelatedBusinesses, logEvent } from "@/lib/data";
import { priceLevelLabel, AMENITY_LABELS } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import ActionButtons from "@/components/ActionButtons";
import ReviewList from "@/components/ReviewList";
import BusinessGrid from "@/components/BusinessGrid";
import OfferBadge from "@/components/OfferBadge";
import MapLoader from "@/components/MapLoader";

const AMENITY_ICONS: Record<string, any> = {
  wifi: Wifi,
  charging: Zap,
  ac: Snowflake,
  quiet: Volume2,
  card_payment: CreditCard,
};

interface BusinessPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const business = await getBusinessBySlug(params.slug);
  if (!business) return {};
  return {
    title: business.name,
    description: business.tagline ?? business.description?.slice(0, 150),
    openGraph: {
      title: business.name,
      description: business.tagline ?? undefined,
      images: business.images[0] ? [business.images[0].url] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BusinessPage({ params }: BusinessPageProps) {
  const business = await getBusinessBySlug(params.slug);
  if (!business) notFound();

  const related = await getRelatedBusinesses(business);
  await logEvent("business_view", { businessId: business.id, categoryId: business.category_id ?? undefined });

  const gallery = business.images.length > 0 ? business.images : [];

  return (
    <div className="pb-16">
      {/* Gallery */}
      <div className="border-b border-line/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          {gallery.length > 0 ? (
            <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:px-0">
              {gallery.slice(0, 4).map((img, i) => (
                <div
                  key={img.id}
                  className={`relative aspect-[4/3] w-64 shrink-0 snap-start overflow-hidden rounded-2xl bg-line sm:w-auto ${
                    i === 0 ? "sm:col-span-2 sm:row-span-2 sm:aspect-square" : ""
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text || business.name}
                    fill
                    sizes="(max-width: 640px) 256px, 25vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-48 place-items-center rounded-2xl bg-line/40 text-ink/30">
              No photos yet
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              {business.category && (
                <Link
                  href={`/category/${business.category.slug}`}
                  className="text-xs font-semibold uppercase tracking-wide text-brand-600"
                >
                  {business.category.name}
                </Link>
              )}
              <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">{business.name}</h1>
              {business.tagline && <p className="mt-1 text-ink/60">{business.tagline}</p>}
            </div>
            <span className="text-lg font-semibold text-ink/70">
              {priceLevelLabel(business.price_level)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {business.rating > 0 && (
              <span className="inline-flex items-center gap-1 font-medium">
                <Star size={16} className="fill-clay text-clay" aria-hidden />
                {business.rating.toFixed(1)}
                <span className="text-ink/40">({business.review_count} reviews)</span>
              </span>
            )}
            <StatusBadge hours={business.opening_hours} />
          </div>

          {business.offers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {business.offers.map((offer) => (
                <OfferBadge key={offer.id} offer={offer} />
              ))}
            </div>
          )}

          <div className="mt-6 sm:hidden">
            <ActionButtons business={business} />
          </div>

          {business.description && (
            <div className="mt-8">
              <h2 className="font-serif text-lg font-semibold">About</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/75">
                {business.description}
              </p>
            </div>
          )}

          {business.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-lg font-semibold">Amenities</h2>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {business.amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity] ?? ShieldCheck;
                  return (
                    <li key={amenity} className="flex items-center gap-2 text-sm text-ink/70">
                      <Icon size={16} className="text-brand-600" aria-hidden />
                      {AMENITY_LABELS[amenity] ?? amenity}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {business.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {business.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-line/60 px-2.5 py-1 text-xs font-medium text-ink/60"
                >
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          )}

          {business.opening_hours && Object.keys(business.opening_hours).length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-lg font-semibold">Hours</h2>
              <dl className="mt-3 space-y-1 text-sm">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
                  const entry = business.opening_hours[String(i)];
                  return (
                    <div key={day} className="flex justify-between border-b border-line/50 py-1.5">
                      <dt className="text-ink/60">{day}</dt>
                      <dd className="font-medium">
                        {entry ? `${entry.open} – ${entry.close}` : "Closed"}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}

          {business.latitude != null && business.longitude != null && (
            <div className="mt-8">
              <h2 className="font-serif text-lg font-semibold">Location</h2>
              {business.address && <p className="mt-1 text-sm text-ink/60">{business.address}</p>}
              <div className="mt-3">
                <MapLoader
                  center={[business.latitude, business.longitude]}
                  markers={[{ id: business.id, name: business.name, lat: business.latitude, lng: business.longitude }]}
                />
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="font-serif text-lg font-semibold">
              Reviews {business.reviews && business.reviews.length > 0 && `(${business.reviews.length})`}
            </h2>
            <div className="mt-4">
              <ReviewList reviews={business.reviews ?? []} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-ink/70">Get there</p>
            <div className="mt-3">
              <ActionButtons business={business} />
            </div>
            {business.address && (
              <p className="mt-4 text-sm text-ink/60">{business.address}</p>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 font-serif text-xl font-semibold">You might also like</h2>
          <BusinessGrid businesses={related} />
        </div>
      )}
    </div>
  );
}
