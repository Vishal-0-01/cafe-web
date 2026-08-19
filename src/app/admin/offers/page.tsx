import { createClient } from "@/lib/supabase/server";
import { upsertOffer, deleteOffer } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const supabase = createClient();
  const [{ data: offers }, { data: businesses }] = await Promise.all([
    supabase.from("offers").select("*, business:businesses(name)").order("created_at", { ascending: false }),
    supabase.from("businesses").select("id, name").order("name"),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Offers &amp; student deals</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Add offer</h2>
          <form action={upsertOffer} className="mt-4 flex flex-col gap-3">
            <select name="business_id" required className="rounded-lg border border-line px-3 py-2 text-sm">
              <option value="">Select a business</option>
              {(businesses ?? []).map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <input name="title" placeholder="20% off with student ID" required className="rounded-lg border border-line px-3 py-2 text-sm" />
            <textarea name="description" placeholder="Details (optional)" rows={2} className="rounded-lg border border-line px-3 py-2 text-sm" />
            <input name="code" placeholder="Coupon code (optional)" className="rounded-lg border border-line px-3 py-2 text-sm" />
            <div className="flex gap-3">
              <label className="flex-1 text-xs text-ink/60">
                Valid from
                <input name="valid_from" type="date" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
              </label>
              <label className="flex-1 text-xs text-ink/60">
                Valid until
                <input name="valid_until" type="date" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_active" defaultChecked /> Active
            </label>
            <button type="submit" className="rounded-lg bg-ink py-2.5 text-sm font-semibold text-paper hover:bg-ink/90">
              Add offer
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Existing offers</h2>
          <ul className="mt-4 flex flex-col divide-y divide-line/70">
            {(offers ?? []).map((o: any) => (
              <li key={o.id} className="py-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{o.title}</p>
                    <p className="text-xs text-ink/50">{o.business?.name}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${o.is_active ? "bg-brand-100 text-brand-700" : "bg-line text-ink/50"}`}>
                    {o.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <form action={deleteOffer} className="mt-1">
                  <input type="hidden" name="id" value={o.id} />
                  <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
          {(offers ?? []).length === 0 && <p className="mt-4 text-sm text-ink/50">No offers yet.</p>}
        </div>
      </div>
    </div>
  );
}
