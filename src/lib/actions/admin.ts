"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function parseHours(formData: FormData) {
  const hours: Record<string, { open: string; close: string } | null> = {};
  for (let day = 0; day < 7; day++) {
    const closed = formData.get(`closed_${day}`) === "on";
    const open = formData.get(`open_${day}`) as string;
    const close = formData.get(`close_${day}`) as string;
    hours[String(day)] = closed || !open || !close ? null : { open, close };
  }
  return hours;
}

function parseList(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// BUSINESSES
// ---------------------------------------------------------------------------
export async function upsertBusiness(formData: FormData) {
  const supabase = await requireAdmin();

  const id = formData.get("id") as string | null;
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  const payload = {
    name,
    slug: slugInput ? slugify(slugInput) : slugify(name),
    category_id: (formData.get("category_id") as string) || null,
    tagline: (formData.get("tagline") as string) || null,
    description: (formData.get("description") as string) || null,
    address: (formData.get("address") as string) || null,
    latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
    longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
    phone: (formData.get("phone") as string) || null,
    whatsapp: (formData.get("whatsapp") as string) || null,
    website: (formData.get("website") as string) || null,
    instagram: (formData.get("instagram") as string) || null,
    price_level: Number(formData.get("price_level") ?? 1),
    opening_hours: parseHours(formData),
    amenities: parseList(formData.get("amenities")),
    tags: parseList(formData.get("tags")),
    curated_sections: parseList(formData.get("curated_sections")),
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    is_curated_favorite: formData.get("is_curated_favorite") === "on",
  };

  if (id) {
    const { error } = await supabase
      .from("businesses")
      .update(payload as Database["public"]["Tables"]["businesses"]["Update"])
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("businesses").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/businesses");
  revalidatePath("/");
  redirect("/admin/businesses");
}

export async function deleteBusiness(formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("businesses").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/businesses");
}

export async function togglePublish(formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string;
  const isPublished = formData.get("is_published") === "true";
  const { error } = await supabase
    .from("businesses")
    .update({ is_published: !isPublished })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/businesses");
}

// ---------------------------------------------------------------------------
// BUSINESS IMAGES
// ---------------------------------------------------------------------------
export async function addBusinessImage(formData: FormData) {
  const supabase = await requireAdmin();
  const businessId = formData.get("business_id") as string;
  const url = formData.get("url") as string;
  const altText = (formData.get("alt_text") as string) || "";
  const isPrimary = formData.get("is_primary") === "on";

  if (isPrimary) {
    await supabase.from("business_images").update({ is_primary: false }).eq("business_id", businessId);
  }

  const { error } = await supabase.from("business_images").insert({
    business_id: businessId,
    url,
    alt_text: altText,
    is_primary: isPrimary,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/businesses/${businessId}/edit`);
}

export async function deleteBusinessImage(formData: FormData) {
  const supabase = await requireAdmin();
  const imageId = formData.get("image_id") as string;
  const businessId = formData.get("business_id") as string;
  const { error } = await supabase.from("business_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/businesses/${businessId}/edit`);
}

// ---------------------------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------------------------
export async function upsertCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string | null;
  const name = String(formData.get("name") ?? "").trim();

  const payload = {
    name,
    slug: slugify(name),
    description: (formData.get("description") as string) || null,
    icon: (formData.get("icon") as string) || "sparkles",
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on",
  };

  if (id) {
    const { error } = await supabase.from("categories").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("categories").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("categories").update({ is_active: false }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}

// ---------------------------------------------------------------------------
// OFFERS
// ---------------------------------------------------------------------------
export async function upsertOffer(formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string | null;

  const payload = {
    business_id: formData.get("business_id") as string,
    title: String(formData.get("title") ?? "").trim(),
    description: (formData.get("description") as string) || null,
    code: (formData.get("code") as string) || null,
    valid_from: (formData.get("valid_from") as string) || null,
    valid_until: (formData.get("valid_until") as string) || null,
    is_active: formData.get("is_active") === "on",
  };

  if (id) {
    const { error } = await supabase.from("offers").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("offers").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/offers");
}

export async function deleteOffer(formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/offers");
}

// ---------------------------------------------------------------------------
// REVIEWS
// ---------------------------------------------------------------------------
export async function upsertReview(formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string | null;

  const payload = {
    business_id: formData.get("business_id") as string,
    rating: Number(formData.get("rating") ?? 5),
    review_text: String(formData.get("review_text") ?? "").trim(),
    reviewer_name: String(formData.get("reviewer_name") ?? "").trim(),
    review_date: (formData.get("review_date") as string) || new Date().toISOString().slice(0, 10),
    tags: parseList(formData.get("tags")),
    is_published: formData.get("is_published") === "on",
  };

  if (id) {
    const { error } = await supabase.from("reviews").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("reviews").insert({ ...payload, is_seed_content: false });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/reviews");
}

export async function deleteReview(formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}
