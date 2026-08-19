import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Store, Tags, BadgePercent, MessageSquareText } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ count: businessCount }, { count: categoryCount }, { count: offerCount }, { count: reviewCount }] =
    await Promise.all([
      supabase.from("businesses").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("offers").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("reviews").select("*", { count: "exact", head: true }),
    ]);

  const cards = [
    { label: "Businesses", count: businessCount ?? 0, href: "/admin/businesses", icon: Store },
    { label: "Active categories", count: categoryCount ?? 0, href: "/admin/categories", icon: Tags },
    { label: "Active offers", count: offerCount ?? 0, href: "/admin/offers", icon: BadgePercent },
    { label: "Reviews", count: reviewCount ?? 0, href: "/admin/reviews", icon: MessageSquareText },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">Everything on the public site is driven from here.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map(({ label, count, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
          >
            <Icon className="text-brand-600" size={20} aria-hidden />
            <p className="mt-3 text-2xl font-semibold">{count}</p>
            <p className="text-sm text-ink/60">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-serif text-lg font-semibold">Quick start</h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-ink/70">
          <li>Add a new business from <Link href="/admin/businesses/new" className="text-brand-600 underline">Businesses → New</Link> — it appears on the site immediately, no deploy needed.</li>
          <li>Create or rename categories from <Link href="/admin/categories" className="text-brand-600 underline">Categories</Link>.</li>
          <li>Add student deals from <Link href="/admin/offers" className="text-brand-600 underline">Offers</Link>.</li>
          <li>Moderate or add reviews from <Link href="/admin/reviews" className="text-brand-600 underline">Reviews</Link>.</li>
        </ul>
      </div>
    </div>
  );
}
