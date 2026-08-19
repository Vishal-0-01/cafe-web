import Link from "next/link";
import MobileNav from "@/components/MobileNav";

const campusName = process.env.NEXT_PUBLIC_CAMPUS_NAME ?? "Campus";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-sm font-bold text-paper"
          >
            N
          </span>
          Nearby
          <span className="hidden text-sm font-normal text-ink/50 sm:inline">/ {campusName}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex" aria-label="Primary">
          <Link href="/search" className="text-ink/70 transition hover:text-ink">
            Explore
          </Link>
          <Link href="/category/cafes" className="text-ink/70 transition hover:text-ink">
            Cafés
          </Link>
          <Link href="/category/food" className="text-ink/70 transition hover:text-ink">
            Food
          </Link>
          <Link
            href="/search"
            className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-ink/90"
          >
            Find something
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
