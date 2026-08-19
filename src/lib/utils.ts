import type { OpeningHours } from "@/types/database";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function priceLevelLabel(level: number) {
  return "₹".repeat(Math.max(1, Math.min(4, level)));
}

/** Haversine distance in kilometers between two lat/lng points. */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Determines open/closed status "right now" from a business's opening_hours JSON. */
export function getOpenStatus(hours: OpeningHours | null | undefined, now: Date = new Date()) {
  if (!hours) return { isOpen: false, label: "Hours unavailable" };

  const day = now.getDay();
  const today = hours[String(day)];

  const minutesNow = now.getHours() * 60 + now.getMinutes();

  const parse = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  if (today) {
    const open = parse(today.open);
    let close = parse(today.close);
    // handle overnight hours e.g. 16:00 -> 02:00
    if (close <= open) {
      if (minutesNow >= open || minutesNow < close) {
        return { isOpen: true, label: `Open · closes ${formatTime(today.close)}` };
      }
    } else if (minutesNow >= open && minutesNow < close) {
      return { isOpen: true, label: `Open · closes ${formatTime(today.close)}` };
    }
  }

  // find next opening time for a friendly closed label
  for (let i = 0; i < 7; i++) {
    const checkDay = (day + i) % 7;
    const entry = hours[String(checkDay)];
    if (entry) {
      const label =
        i === 0
          ? `Closed · opens ${formatTime(entry.open)}`
          : `Closed · opens ${WEEKDAY_LABELS[checkDay]} ${formatTime(entry.open)}`;
      return { isOpen: false, label };
    }
  }

  return { isOpen: false, label: "Closed" };
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, "0")}${period}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const AMENITY_LABELS: Record<string, string> = {
  wifi: "WiFi",
  charging: "Charging points",
  ac: "AC",
  quiet: "Quiet",
  card_payment: "Card payment",
  outdoor_seating: "Outdoor seating",
  showers: "Showers",
};
