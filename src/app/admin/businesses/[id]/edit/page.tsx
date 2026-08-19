import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BusinessForm from "@/components/admin/BusinessForm";

export default async function EditBusinessPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const businessQuery = supabase
  .from("businesses")
  .select("*")
  .eq("id", params.id)
  .single();

const categoriesQuery = supabase
  .from("categories")
  .select("*")
  .order("sort_order");

const imagesQuery = supabase
  .from("business_images")
  .select("*")
  .eq("business_id", params.id)
  .order("sort_order");

const [
  { data: business, error: businessError },
  { data: categories },
  { data: images },
] = await Promise.all([
  businessQuery,
  categoriesQuery,
  imagesQuery,
]);

if (businessError || !business) {
  notFound();
}

  if (!business) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Edit {business.name}</h1>
      <div className="mt-6 max-w-2xl">
        <BusinessForm business={business} categories={categories ?? []} images={images ?? []} />
      </div>
    </div>
  );
}
