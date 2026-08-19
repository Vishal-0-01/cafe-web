import { createClient } from "@/lib/supabase/server";
import BusinessForm from "@/components/admin/BusinessForm";

export default async function NewBusinessPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">New business</h1>
      <p className="mt-1 text-sm text-ink/60">
        This appears on the public site immediately after saving — no code changes needed.
      </p>
      <div className="mt-6 max-w-2xl">
        <BusinessForm categories={categories ?? []} images={[]} />
      </div>
    </div>
  );
}
