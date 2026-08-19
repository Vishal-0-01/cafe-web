"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

const SUGGESTIONS = ["Cafe", "Cheap food", "Printing", "Study cafe", "Laundry", "Open late"];

export default function SearchBar({
  initialQuery = "",
  size = "lg",
}: {
  initialQuery?: string;
  size?: "lg" | "md";
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/search?${params.toString()}`);
  }

  const isLarge = size === "lg";

  return (
    <div>
      <form onSubmit={handleSubmit} role="search" aria-label="Search Nearby">
        <div
          className={`flex items-center gap-3 rounded-full border border-line bg-white shadow-card transition focus-within:border-brand-400 focus-within:shadow-cardHover ${
            isLarge ? "px-5 py-3.5 sm:py-4" : "px-4 py-2.5"
          }`}
        >
          <Search className="shrink-0 text-ink/40" size={isLarge ? 22 : 18} aria-hidden />
          <label htmlFor="site-search" className="sr-only">
            Search for cafés, food, printing, and more
          </label>
          <input
            id="site-search"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Find cafés, food, printing, gyms…"
            className={`w-full bg-transparent outline-none placeholder:text-ink/40 ${
              isLarge ? "text-base sm:text-lg" : "text-sm"
            }`}
          />
          <button
            type="submit"
            className={`shrink-0 rounded-full bg-ink font-medium text-paper transition hover:bg-ink/90 ${
              isLarge ? "px-5 py-2.5 text-sm" : "px-4 py-1.5 text-sm"
            }`}
          >
            Search
          </button>
        </div>
      </form>

      {isLarge && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
              className="rounded-full border border-line bg-white/70 px-3 py-1.5 text-xs font-medium text-ink/70 transition hover:border-brand-300 hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
