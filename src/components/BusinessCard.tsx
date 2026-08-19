import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import type { BusinessWithRelations } from "@/types/database";
import { priceLevelLabel, formatDistance, distanceKm } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import OfferBadge from "@/components/OfferBadge";

export default function BusinessCard({
  business,
  userLocation,
}: {
  business: BusinessWithRelations;
  userLocation?: { lat: number; lng: number } | null;
}) {
  const primaryImage = business.images.find((i) => i.is_primary) ?? business.images[0];
  const distance =
    userLocation && business.latitude != null && business.longitude != null
      ? distanceKm(userLocation.lat, userLocation.lng, business.latitude, business.longitude)
      : null;

  return (
    <Link
      href={`/business/${business.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt_text || business.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-ink/30">No image</div>
        )}
        {business.is_curated_favorite && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-ink shadow-sm">
            Student favorite
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-serif text-base font-semibold leading-tight">
            {business.name}
          </h3>
          <span className="shrink-0 text-sm font-medium text-ink/60">
            {priceLevelLabel(business.price_level)}
          </span>
        </div>

        {business.tagline && (
          <p className="line-clamp-2 text-sm text-ink/60">{business.tagline}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-ink/60">
          {business.rating > 0 && (
            <span className="inline-flex items-center gap-1 font-medium text-ink/80">
              <Star size={13} className="fill-clay text-clay" aria-hidden />
              {business.rating.toFixed(1)}
              <span className="text-ink/40">({business.review_count})</span>
            </span>
          )}
          {distance != null && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} aria-hidden />
              {formatDistance(distance)}
            </span>
          )}
          <StatusBadge hours={business.opening_hours} />
        </div>

        {business.offers.length > 0 && (
          <div className="pt-1">
            <OfferBadge offer={business.offers[0]} />
          </div>
        )}
      </div>
    </Link>
  );
}
