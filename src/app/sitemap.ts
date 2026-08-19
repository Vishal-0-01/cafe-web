import type { MetadataRoute } from "next";
import type { Business, Category } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const supabase = createClient();

  const [
    { data: businessesData, error: businessesError },
    { data: categoriesData, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from("businesses")
      .select("slug, updated_at")
      .eq("is_published", true),

    supabase
      .from("categories")
      .select("slug")
      .eq("is_active", true),
  ]);

  const businesses = businessesData as Pick<
    Business,
    "slug" | "updated_at"
  >[] | null;

  const categories = categoriesData as Pick<Category, "slug">[] | null;

  if (businessesError) {
    throw new Error(
      `Failed to load businesses for sitemap: ${businessesError.message}`
    );
  }

  if (categoriesError) {
    throw new Error(
      `Failed to load categories for sitemap: ${categoriesError.message}`
    );
  }

  return [
    {
      url: base,
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${base}/search`,
      changeFrequency: "daily",
      priority: 0.8,
    },

    ...(categories ?? []).map((c) => ({
      url: `${base}/category/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),

    ...(businesses ?? []).map((b) => ({
      url: `${base}/business/${b.slug}`,
      lastModified: b.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
