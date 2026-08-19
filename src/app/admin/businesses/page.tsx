import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { togglePublish, deleteBusiness } from "@/lib/actions/admin";
import { Plus, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBusinessesPage() {
  const supabase = createClient();
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Businesses</h1>
        <Link
          href="/admin/businesses/new"
          className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90"
        >
          <Plus size={16} aria-hidden /> New business
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-line/20 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 sm:table-cell">Category</th>
              <th className="hidden px-4 py-3 sm:table-cell">Rating</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(businesses ?? []).map((b: any) => (
              <tr key={b.id} className="border-b border-line/70 last:border-0">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="hidden px-4 py-3 text-ink/60 sm:table-cell">{b.category?.name ?? "—"}</td>
                <td className="hidden px-4 py-3 text-ink/60 sm:table-cell">
                  {b.rating > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Star size={13} className="fill-clay text-clay" /> {b.rating.toFixed(1)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <form action={togglePublish}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="is_published" value={String(b.is_published)} />
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        b.is_published ? "bg-brand-100 text-brand-700" : "bg-line text-ink/50"
                      }`}
                    >
                      {b.is_published ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/businesses/${b.id}/edit`} className="font-medium text-brand-600 hover:underline">
                      Edit
                    </Link>
                    <form action={deleteBusiness}>
                      <input type="hidden" name="id" value={b.id} />
                      <button type="submit" className="font-medium text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(businesses ?? []).length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/50">No businesses yet.</p>
        )}
      </div>
    </div>
  );
}
