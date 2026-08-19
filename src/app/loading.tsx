export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-line bg-white">
            <div className="aspect-[4/3] bg-line/60" />
            <div className="space-y-2 p-3.5">
              <div className="h-4 w-3/4 rounded bg-line/60" />
              <div className="h-3 w-1/2 rounded bg-line/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
