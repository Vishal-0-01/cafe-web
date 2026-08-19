import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";
import {
  LayoutDashboard, Store, Tags, BadgePercent, MessageSquareText,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/businesses", label: "Businesses", icon: Store },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/offers", label: "Offers", icon: BadgePercent },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated users away from /admin/*,
  // but /admin/login itself renders without this shell.
  if (!user) redirect("/admin/login");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl gap-6 px-4 py-6 sm:px-6">
      <aside className="hidden w-52 shrink-0 sm:block">
        <nav className="sticky top-24 flex flex-col gap-1" aria-label="Admin">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-line/50 hover:text-ink"
            >
              <Icon size={16} aria-hidden /> {label}
            </Link>
          ))}
          <div className="mt-4 border-t border-line pt-4">
            <p className="truncate px-3 text-xs text-ink/40">{user.email}</p>
            <AdminSignOutButton />
          </div>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <nav className="mb-4 flex gap-3 overflow-x-auto text-sm font-medium sm:hidden" aria-label="Admin">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} className="shrink-0 rounded-full border border-line px-3 py-1.5">
              {label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
