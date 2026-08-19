"use client";

import { useState } from "react";
import { upsertBusiness } from "@/lib/actions/admin";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Business, BusinessImage, Category } from "@/types/database";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const AMENITY_OPTIONS = ["wifi", "charging", "ac", "quiet", "card_payment", "outdoor_seating", "showers"];
const CURATED_OPTIONS = ["best_study", "best_coffee", "budget_eats", "open_late", "near_campus", "new_and_trending"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink/80">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-400";

export default function BusinessForm({
  business,
  categories,
  images,
}: {
  business?: Business;
  categories: Category[];
  images: BusinessImage[];
}) {
  const [checkedAmenities, setCheckedAmenities] = useState<Set<string>>(new Set(business?.amenities ?? []));
  const [checkedSections, setCheckedSections] = useState<Set<string>>(new Set(business?.curated_sections ?? []));

  return (
    <form action={upsertBusiness} className="flex flex-col gap-8">
      {business && <input type="hidden" name="id" value={business.id} />}

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" defaultValue={business?.name} required className={inputClass} />
        </Field>
        <Field label="Slug (auto-generated if left blank)">
          <input name="slug" defaultValue={business?.slug} placeholder="auto-generated-from-name" className={inputClass} />
        </Field>
        <Field label="Category">
          <select name="category_id" defaultValue={business?.category_id ?? ""} className={inputClass}>
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Price level">
          <select name="price_level" defaultValue={business?.price_level ?? 1} className={inputClass}>
            <option value={1}>₹ — Budget</option>
            <option value={2}>₹₹ — Moderate</option>
            <option value={3}>₹₹₹ — Pricier</option>
            <option value={4}>₹₹₹₹ — Splurge</option>
          </select>
        </Field>
        <Field label="Tagline (short, shows on cards)">
          <input name="tagline" defaultValue={business?.tagline ?? ""} maxLength={120} className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea name="description" defaultValue={business?.description ?? ""} rows={4} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Address">
            <input name="address" defaultValue={business?.address ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label="Latitude">
          <input name="latitude" type="number" step="any" defaultValue={business?.latitude ?? ""} className={inputClass} />
        </Field>
        <Field label="Longitude">
          <input name="longitude" type="number" step="any" defaultValue={business?.longitude ?? ""} className={inputClass} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone">
          <input name="phone" defaultValue={business?.phone ?? ""} placeholder="+91XXXXXXXXXX" className={inputClass} />
        </Field>
        <Field label="WhatsApp (digits only, with country code)">
          <input name="whatsapp" defaultValue={business?.whatsapp ?? ""} placeholder="91XXXXXXXXXX" className={inputClass} />
        </Field>
        <Field label="Website">
          <input name="website" type="url" defaultValue={business?.website ?? ""} className={inputClass} />
        </Field>
        <Field label="Instagram">
          <input name="instagram" defaultValue={business?.instagram ?? ""} className={inputClass} />
        </Field>
      </section>

      <section>
        <p className="mb-2 text-sm font-medium text-ink/80">Opening hours</p>
        <div className="flex flex-col gap-2">
          {DAYS.map((day, i) => {
            const existing = business?.opening_hours?.[String(i)];
            return (
              <div key={day} className="grid grid-cols-[3rem,1fr,1fr,auto] items-center gap-2 text-sm">
                <span className="text-ink/60">{day}</span>
                <input type="time" name={`open_${i}`} defaultValue={existing?.open ?? "09:00"} className={inputClass} />
                <input type="time" name={`close_${i}`} defaultValue={existing?.close ?? "21:00"} className={inputClass} />
                <label className="flex items-center gap-1.5 text-xs text-ink/60">
                  <input type="checkbox" name={`closed_${i}`} defaultChecked={!existing} /> Closed
                </label>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <p className="mb-2 text-sm font-medium text-ink/80">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => (
            <label
              key={a}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs capitalize has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white"
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checkedAmenities.has(a)}
                onChange={() =>
                  setCheckedAmenities((prev) => {
                    const next = new Set(prev);
                    next.has(a) ? next.delete(a) : next.add(a);
                    return next;
                  })
                }
              />
              {a.replace(/_/g, " ")}
            </label>
          ))}
        </div>
        <input type="hidden" name="amenities" value={Array.from(checkedAmenities).join(",")} />
      </section>

      <section>
        <Field label="Tags (comma-separated)">
          <input name="tags" defaultValue={business?.tags?.join(", ") ?? ""} placeholder="cheap, open-late, study-friendly" className={inputClass} />
        </Field>
      </section>

      <section>
        <p className="mb-2 text-sm font-medium text-ink/80">Curated sections</p>
        <div className="flex flex-wrap gap-2">
          {CURATED_OPTIONS.map((s) => (
            <label
              key={s}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs capitalize has-[:checked]:border-clay has-[:checked]:bg-clay has-[:checked]:text-white"
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checkedSections.has(s)}
                onChange={() =>
                  setCheckedSections((prev) => {
                    const next = new Set(prev);
                    next.has(s) ? next.delete(s) : next.add(s);
                    return next;
                  })
                }
              />
              {s.replace(/_/g, " ")}
            </label>
          ))}
        </div>
        <input type="hidden" name="curated_sections" value={Array.from(checkedSections).join(",")} />
      </section>

      <section className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_published" defaultChecked={business?.is_published ?? true} /> Published
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_featured" defaultChecked={business?.is_featured} /> Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_curated_favorite" defaultChecked={business?.is_curated_favorite} /> Student favorite badge
        </label>
      </section>

      {business && (
        <section>
          <p className="mb-2 text-sm font-medium text-ink/80">Photos</p>
          <ImageUploader businessId={business.id} images={images} />
        </section>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-paper transition hover:bg-ink/90 sm:w-auto sm:px-8"
      >
        {business ? "Save changes" : "Create business"}
      </button>
      {!business && (
        <p className="text-xs text-ink/50">Save first, then come back to add photos.</p>
      )}
    </form>
  );
}
