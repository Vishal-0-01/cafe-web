import Link from "next/link";
import {
  Coffee, Utensils, Printer, Pencil, Shirt, Dumbbell, Pill,
  ShoppingCart, BookOpen, Scissors, Sparkles, type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types/database";

const ICONS: Record<string, LucideIcon> = {
  coffee: Coffee,
  utensils: Utensils,
  printer: Printer,
  pencil: Pencil,
  shirt: Shirt,
  dumbbell: Dumbbell,
  pill: Pill,
  "shopping-cart": ShoppingCart,
  "book-open": BookOpen,
  scissors: Scissors,
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-5">
      {categories.map((category) => {
        const Icon = ICONS[category.icon] ?? Sparkles;
        return (
          <li key={category.id}>
            <Link
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-line bg-white px-3 py-4 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100">
                <Icon size={20} aria-hidden />
              </span>
              <span className="text-xs font-medium text-ink/80 sm:text-sm">{category.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
