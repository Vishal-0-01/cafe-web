import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CategoryGrid from "@/components/CategoryGrid";
import CuratedSection from "@/components/CuratedSection";
import { getCategories, getCuratedSection, getFeaturedBusinesses } from "@/lib/data";

const campusName = process.env.NEXT_PUBLIC_CAMPUS_NAME ?? "campus";

export default async function HomePage() {
  const [categories, featured, budgetEats, studySpots, openLate, bestCoffee] = await Promise.all([
    getCategories(),
    getFeaturedBusinesses(8),
    getCuratedSection("budget_eats"),
    getCuratedSection("best_study"),
    getCuratedSection("open_late"),
    getCuratedSection("best_coffee"),
  ]);

  return (
    <div>
      <section className="border-b border-line/70 bg-gradient-to-b from-brand-50/60 to-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-card">
            Built for students around {campusName}
          </p>
          <h1 className="mx-auto max-w-2xl font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Find your way around {campusName}, fast.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink/60 sm:text-lg">
            Coffee, cheap eats, printing, laundry, study spots — search once and get
            straight to what&apos;s actually nearby. No account needed.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold sm:text-2xl">Browse by category</h2>
          <Link href="/search" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            See everything
          </Link>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      <section className="mx-auto max-w-6xl divide-y divide-line/70 px-4 sm:px-6">
        <CuratedSection
          title="Student favorites"
          description="Consistently well-rated spots students keep coming back to."
          businesses={featured}
          viewAllHref="/search?sort=rating"
        />
        <CuratedSection
          title="Best budget eats"
          description="Good food that won't wreck your monthly budget."
          businesses={budgetEats}
          viewAllHref="/search?q=cheap+food"
        />
        <CuratedSection
          title="Best study cafés"
          description="Quiet, WiFi, and outlets — built for getting work done."
          businesses={studySpots}
          viewAllHref="/category/study-spaces"
        />
        <CuratedSection
          title="Open late"
          description="For the nights that run past midnight."
          businesses={openLate}
          viewAllHref="/search?open=true"
        />
        <CuratedSection
          title="Best coffee"
          description="Where to get a genuinely good cup nearby."
          businesses={bestCoffee}
          viewAllHref="/category/cafes"
        />
      </section>
    </div>
  );
}
