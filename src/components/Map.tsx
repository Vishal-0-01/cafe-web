"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet's default marker icons reference image files that don't bundle
// correctly with Next.js — point them at CDN URLs instead.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  href?: string;
}

export default function Map({
  markers,
  center,
  zoom = 15,
  heightClassName = "h-64",
}: {
  markers: MapMarker[];
  center: [number, number];
  zoom?: number;
  heightClassName?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line ${heightClassName}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        aria-label="Map showing business locations"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={markerIcon}>
            <Popup>
              <div className="text-sm font-medium">{m.name}</div>
              {m.href && (
                <a href={m.href} className="text-xs text-brand-600 underline">
                  View details
                </a>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
