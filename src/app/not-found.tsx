import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <h1 className="font-serif text-3xl font-semibold">Couldn&apos;t find that</h1>
      <p className="mt-2 text-sm text-ink/60">
        The page you&apos;re looking for doesn&apos;t exist, or the listing may have been removed.
      </p>
      <div className="mt-6 w-full">
        <SearchBar size="md" />
      </div>
      <Link href="/" className="mt-6 text-sm font-medium text-brand-600 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
