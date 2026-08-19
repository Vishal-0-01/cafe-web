import { Star } from "lucide-react";
import type { Review } from "@/types/database";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-ink/50">No reviews yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-5">
      {reviews.map((review) => (
        <li key={review.id} className="border-b border-line pb-5 last:border-0 last:pb-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-ink">{review.reviewer_name}</p>
            <time className="text-xs text-ink/40" dateTime={review.review_date}>
              {new Date(review.review_date).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>
          <div className="mt-1 flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                aria-hidden
                className={i < review.rating ? "fill-clay text-clay" : "text-line"}
              />
            ))}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">{review.review_text}</p>
          {review.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700"
                >
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
