import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Business, BusinessWithRelations, Category, Offer, Review } from "@/types/database";

export interface BusinessFilters {
  q?: string;
  categorySlug?: string;
  openNow?: boolean;
  studentDiscount?: boolean;
  maxPrice?: number;
  amenities?: string[];
  sort?: "distance" | "rating" | "price_low" | "price_high" | "relevance";
  lat?: number;
  lng?: number;
}

async function attachRelations(rows: Business[]): Promise<BusinessWithRelations[]> {
  if (rows.length === 0) return [];
  const supabase = createClient();
  const ids = rows.map((r) => r.id);

  const [{ data: categories }, { data: images }, { data: offers }] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("business_images").select("*").in("business_id", ids).order("sort_order"),
    supabase.from("offers").select("*").in("business_id", ids).eq("is_active", true),
  ]);

  const categoryMap = new Map((categories ?? []).map((c: Category) => [c.id, c]));
  const imagesByBusiness = new Map<string, any[]>();
  (images ?? []).forEach((img: any) => {
    const arr = imagesByBusiness.get(img.business_id) ?? [];
    arr.push(img);
    imagesByBusiness.set(img.business_id, arr);
  });
  const offersByBusiness = new Map<string, Offer[]>();
  (offers ?? []).forEach((o: Offer) => {
    const arr = offersByBusiness.get(o.business_id) ?? [];
    arr.push(o);
    offersByBusiness.set(o.business_id, arr);
  });

  return rows.map((b) => ({
    ...b,
    category: b.category_id ? categoryMap.get(b.category_id) ?? null : null,
    images: imagesByBusiness.get(b.id) ?? [],
    offers: offersByBusiness.get(b.id) ?? [],
  }));
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).single();
  return data ?? null;
}

export async function searchBusinesses(filters: BusinessFilters): Promise<BusinessWithRelations[]> {
  const supabase = createClient();
  let query = supabase.from("businesses").select("*").eq("is_published", true);

  if (filters.q) {
    query = query.or(
      `name.ilike.%${filters.q}%,tagline.ilike.%${filters.q}%,tags.cs.{${filters.q}}`
    );
  }

  if (filters.categorySlug) {
    const category = await getCategoryBySlug(filters.categorySlug);
    if (category) query = query.eq("category_id", category.id);
    else return [];
  }

  if (filters.maxPrice) {
    query = query.lte("price_level", filters.maxPrice);
  }

  if (filters.amenities && filters.amenities.length > 0) {
    query = query.contains("amenities", filters.amenities);
  }

  if (filters.studentDiscount) {
    // matched post-fetch against active offers, see below
  }

  if (filters.sort === "rating") query = query.order("rating", { ascending: false });
  else if (filters.sort === "price_low") query = query.order("price_level", { ascending: true });
  else if (filters.sort === "price_high") query = query.order("price_level", { ascending: false });
  else query = query.order("is_featured", { ascending: false }).order("rating", { ascending: false });

  const { data, error } = await query.limit(60);
  if (error) throw error;

  let results = await attachRelations(data ?? []);

  if (filters.studentDiscount) {
    results = results.filter((b) => b.offers.length > 0);
  }

  if (filters.openNow) {
    const { getOpenStatus } = await import("@/lib/utils");
    results = results.filter((b) => getOpenStatus(b.opening_hours).isOpen);
  }

  if (filters.sort === "distance" && filters.lat != null && filters.lng != null) {
    const { distanceKm } = await import("@/lib/utils");
    results = results
      .filter((b) => b.latitude != null && b.longitude != null)
      .sort(
        (a, b) =>
          distanceKm(filters.lat!, filters.lng!, a.latitude!, a.longitude!) -
          distanceKm(filters.lat!, filters.lng!, b.latitude!, b.longitude!)
      );
  }

  return results;
}

export async function getBusinessBySlug(slug: string): Promise<BusinessWithRelations | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;

  const [withRelations] = await attachRelations([data]);
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("business_id", data.id)
    .eq("is_published", true)
    .order("review_date", { ascending: false });

  return { ...withRelations, reviews: (reviews ?? []) as Review[] };
}

export async function getRelatedBusinesses(business: Business): Promise<BusinessWithRelations[]> {
  if (!business.category_id) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("category_id", business.category_id)
    .eq("is_published", true)
    .neq("id", business.id)
    .order("rating", { ascending: false })
    .limit(4);
  return attachRelations(data ?? []);
}

export async function getCuratedSection(key: string, limit = 8): Promise<BusinessWithRelations[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("is_published", true)
    .contains("curated_sections", [key])
    .order("rating", { ascending: false })
    .limit(limit);
  return attachRelations(data ?? []);
}

export async function getFeaturedBusinesses(limit = 8): Promise<BusinessWithRelations[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("rating", { ascending: false })
    .limit(limit);
  return attachRelations(data ?? []);
}

export async function logEvent(
  eventType: string,
  payload: { businessId?: string; categoryId?: string; metadata?: Record<string, unknown> } = {}
) {
  const supabase = createClient();
  await supabase.from("events").insert({
    event_type: eventType,
    business_id: payload.businessId ?? null,
    category_id: payload.categoryId ?? null,
    metadata: payload.metadata ?? {},
  });
}
