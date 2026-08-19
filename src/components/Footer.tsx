import Link from "next/link";

const campusName = process.env.NEXT_PUBLIC_CAMPUS_NAME ?? "Campus";

export default function Footer() {
  return (
    <footer className="border-t border-line/70 bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-semibold">Nearby</p>
            <p className="mt-2 max-w-xs text-sm text-ink/60">
              A student-focused local discovery guide for {campusName}. No sign-up needed —
              just search and go.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink/80">Explore</p>
            <ul className="mt-2 space-y-1 text-sm text-ink/60">
              <li><Link href="/search" className="hover:text-ink">All listings</Link></li>
              <li><Link href="/category/cafes" className="hover:text-ink">Cafés</Link></li>
              <li><Link href="/category/food" className="hover:text-ink">Food</Link></li>
              <li><Link href="/category/study-spaces" className="hover:text-ink">Study spaces</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink/80">For businesses</p>
            <p className="mt-2 text-sm text-ink/60">
              Want your business listed or updated? Reach out and we&apos;ll get you added.
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-line pt-6 text-xs text-ink/40">
          © {new Date().getFullYear()} Nearby. A student project — listings shown may include example data.
        </p>
      </div>
    </footer>
  );
}
