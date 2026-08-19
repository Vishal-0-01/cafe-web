"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-10 w-10 place-items-center rounded-full active:bg-line/60"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-16 border-b border-line bg-paper px-4 pb-6 pt-2 shadow-card"
        >
          <nav className="flex flex-col gap-1 text-base" aria-label="Mobile">
            <Link href="/search" className="flex items-center gap-2 rounded-lg px-2 py-3 active:bg-line/60" onClick={() => setOpen(false)}>
              <Search size={18} /> Explore everything
            </Link>
            <Link href="/category/cafes" className="rounded-lg px-2 py-3 active:bg-line/60" onClick={() => setOpen(false)}>
              Cafés
            </Link>
            <Link href="/category/food" className="rounded-lg px-2 py-3 active:bg-line/60" onClick={() => setOpen(false)}>
              Food
            </Link>
            <Link href="/category/printing" className="rounded-lg px-2 py-3 active:bg-line/60" onClick={() => setOpen(false)}>
              Printing
            </Link>
            <Link href="/category/study-spaces" className="rounded-lg px-2 py-3 active:bg-line/60" onClick={() => setOpen(false)}>
              Study spaces
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
