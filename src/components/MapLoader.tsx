"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/components/Map";

// Leaflet touches `window` on import, so the map must be a client-only,
// dynamically-imported component (no SSR) to avoid build/render errors.
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-64 place-items-center rounded-2xl border border-line bg-line/20 text-sm text-ink/40">
      Loading map…
    </div>
  ),
});

export default function MapLoader(props: {
  markers: MapMarker[];
  center: [number, number];
  zoom?: number;
  heightClassName?: string;
}) {
  return <Map {...props} />;
}
