import { notFound } from "next/navigation";
import type { Business } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import BusinessForm from "@/components/admin/BusinessForm";

export default async function EditBusinessPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: businessData, error: businessError } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", params.id)
    .single();

  const business = businessData as Business | null;

  if (businessError || !business) {
    notFound();
  }

  const [{ data: categories }, { data: images }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("sort_order"),

    supabase
      .from("business_images")
      .select("*")
      .eq("business_id", params.id)
      .order("sort_order"),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">
        Edit {business.name}
      </h1>

      <div className="mt-6 max-w-2xl">
        <BusinessForm
          business={business}
          categories={categories ?? []}
          images={images ?? []}
        />
      </div>
    </div>
  );
}
