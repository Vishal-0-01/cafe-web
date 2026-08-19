import { createClient } from "@/lib/supabase/server";
import { upsertCategory, deleteCategory } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Categories</h1>
      <p className="mt-1 text-sm text-ink/60">
        Categories can be added, renamed, or deactivated here without touching any code.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Add category</h2>
          <form action={upsertCategory} className="mt-4 flex flex-col gap-3">
            <input
              name="name"
              placeholder="Category name"
              required
              className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              name="description"
              placeholder="Short description (optional)"
              className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <div className="flex gap-3">
              <input
                name="icon"
                placeholder="lucide icon name e.g. coffee"
                className="w-1/2 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <input
                name="sort_order"
                type="number"
                placeholder="Sort order"
                defaultValue={0}
                className="w-1/2 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_active" defaultChecked /> Active
            </label>
            <button type="submit" className="rounded-lg bg-ink py-2.5 text-sm font-semibold text-paper hover:bg-ink/90">
              Add category
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Existing categories</h2>
          <ul className="mt-4 flex flex-col divide-y divide-line/70">
            {(categories ?? []).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-ink/50">/category/{c.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${c.is_active ? "bg-brand-100 text-brand-700" : "bg-line text-ink/50"}`}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                  {c.is_active && (
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="font-medium text-red-600 hover:underline">
                        Deactivate
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
