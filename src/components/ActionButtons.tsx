"use client";

import { Navigation, Phone, MessageCircle, Globe } from "lucide-react";
import type { Business } from "@/types/database";
import { logEventAction } from "@/lib/actions/events";

export default function ActionButtons({ business }: { business: Business }) {
  const directionsUrl =
    business.latitude != null && business.longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`
      : business.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`
      : null;

  function track(eventType: string) {
    void logEventAction(eventType, { businessId: business.id });
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {directionsUrl && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("directions_clicked")}
          className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-ink/90"
        >
          <Navigation size={16} aria-hidden /> Directions
        </a>
      )}
      {business.phone && (
        <a
          href={`tel:${business.phone}`}
          onClick={() => track("call_clicked")}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-line/40"
        >
          <Phone size={16} aria-hidden /> Call
        </a>
      )}
      {business.whatsapp && (
        <a
          href={`https://wa.me/${business.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_clicked")}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-line/40"
        >
          <MessageCircle size={16} aria-hidden /> WhatsApp
        </a>
      )}
      {business.website && (
        <a
          href={business.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("website_clicked")}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-line/40"
        >
          <Globe size={16} aria-hidden /> Website
        </a>
      )}
    </div>
  );
}
