"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cx } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "relevance", label: "Recommended" },
  { value: "rating", label: "Top rated" },
  { value: "distance", label: "Nearest" },
  { value: "price_low", label: "Price: low to high" },
  { value: "price_high", label: "Price: high to low" },
];

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showMore, setShowMore] = useState(false);

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "" || value === "false") params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggle(key: string) {
    const current = searchParams.get(key) === "true";
    setParam(key, current ? null : "true");
  }

  const openNow = searchParams.get("open") === "true";
  const studentDiscount = searchParams.get("deal") === "true";
  const sort = searchParams.get("sort") ?? "relevance";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={sort}
        onChange={(e) => setParam("sort", e.target.value)}
        aria-label="Sort results"
        className="rounded-full border border-line bg-white px-3 py-2 text-sm font-medium text-ink/80 outline-none focus:border-brand-400"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => toggle("open")}
        aria-pressed={openNow}
        className={cx(
          "rounded-full border px-3 py-2 text-sm font-medium transition",
          openNow ? "border-brand-500 bg-brand-500 text-white" : "border-line bg-white text-ink/80"
        )}
      >
        Open now
      </button>

      <button
        type="button"
        onClick={() => toggle("deal")}
        aria-pressed={studentDiscount}
        className={cx(
          "rounded-full border px-3 py-2 text-sm font-medium transition",
          studentDiscount ? "border-clay bg-clay text-white" : "border-line bg-white text-ink/80"
        )}
      >
        Student deals
      </button>

      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        aria-expanded={showMore}
        className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-sm font-medium text-ink/80"
      >
        <SlidersHorizontal size={14} aria-hidden /> More filters
      </button>

      {showMore && (
        <div className="flex w-full flex-wrap gap-2 pt-1">
          {["1", "2", "3", "4"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setParam("maxPrice", level)}
              aria-pressed={searchParams.get("maxPrice") === level}
              className={cx(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                searchParams.get("maxPrice") === level
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink/70"
              )}
            >
              Up to {"₹".repeat(Number(level))}
            </button>
          ))}
          {["wifi", "quiet", "charging", "ac"].map((amenity) => {
            const current = searchParams.getAll("amenity");
            const active = current.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  const values = params.getAll("amenity").filter((v) => v !== amenity);
                  if (!active) values.push(amenity);
                  params.delete("amenity");
                  values.forEach((v) => params.append("amenity", v));
                  router.push(`${pathname}?${params.toString()}`);
                }}
                aria-pressed={active}
                className={cx(
                  "rounded-full border px-3 py-1.5 text-xs font-medium capitalize",
                  active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/70"
                )}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
