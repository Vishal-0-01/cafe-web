import { createClient } from "@/lib/supabase/server";
import { upsertReview, deleteReview } from "@/lib/actions/admin";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const supabase = createClient();
  const [{ data: reviews }, { data: businesses }] = await Promise.all([
    supabase.from("reviews").select("*, business:businesses(name)").order("created_at", { ascending: false }).limit(50),
    supabase.from("businesses").select("id, name").order("name"),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Reviews</h1>
      <p className="mt-1 text-sm text-ink/60">
        Reviews are curated/admin-managed — no public accounts are required to submit them.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Add review</h2>
          <form action={upsertReview} className="mt-4 flex flex-col gap-3">
            <select name="business_id" required className="rounded-lg border border-line px-3 py-2 text-sm">
              <option value="">Select a business</option>
              {(businesses ?? []).map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <input name="reviewer_name" placeholder="Reviewer display name" required className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
              <select name="rating" defaultValue={5} className="rounded-lg border border-line px-3 py-2 text-sm">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <textarea name="review_text" placeholder="Review text" required rows={3} className="rounded-lg border border-line px-3 py-2 text-sm" />
            <input name="tags" placeholder="Tags, comma-separated (good-wifi, quiet)" className="rounded-lg border border-line px-3 py-2 text-sm" />
            <input name="review_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="rounded-lg border border-line px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_published" defaultChecked /> Published
            </label>
            <button type="submit" className="rounded-lg bg-ink py-2.5 text-sm font-semibold text-paper hover:bg-ink/90">
              Add review
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Recent reviews</h2>
          <ul className="mt-4 flex flex-col divide-y divide-line/70">
            {(reviews ?? []).map((r: any) => (
              <li key={r.id} className="py-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {r.reviewer_name} <span className="font-normal text-ink/50">on {r.business?.name}</span>
                    </p>
                    <div className="mt-0.5 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? "fill-clay text-clay" : "text-line"} />
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {r.is_seed_content && (
                      <span className="rounded-full bg-line px-2 py-0.5 text-[10px] text-ink/50">Seed</span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-xs ${r.is_published ? "bg-brand-100 text-brand-700" : "bg-line text-ink/50"}`}>
                      {r.is_published ? "Published" : "Hidden"}
                    </span>
                  </div>
                </div>
                <p className="mt-1.5 text-ink/70">{r.review_text}</p>
                <form action={deleteReview} className="mt-1">
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
