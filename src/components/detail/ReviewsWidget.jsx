import React, { useState } from "react";
import { Star, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

// Static review data — in future, this would be fetched from an API.
const STATIC_REVIEWS = [
  {
    id: "r1",
    author: "Sarah M.",
    avatar: null,
    country: "Australia",
    rating: 5,
    date: "2026-06-15",
    title: "Absolutely breathtaking at sunrise",
    body: "We arrived at 4:30 AM for the sunrise tour and it was worth every moment. Watching the mist clear over the stupas with Mount Merapi in the background was one of the most magical experiences of my life. Highly recommend hiring a local guide who can explain the relief panels — they tell an incredible story.",
    helpful: 24,
  },
  {
    id: "r2",
    author: "Budi Santoso",
    avatar: null,
    country: "Indonesia",
    rating: 5,
    date: "2026-05-22",
    title: "Warisan budaya yang luar biasa",
    body: "Sebagai orang Indonesia, saya sangat bangga dengan Candi Borobudur. Datang saat weekday pagi hari untuk menghindari keramaian. Relief-relief cerita Buddha yang menghiasi dinding candi sangat detail dan menakjubkan. Jangan lupa bawa topi dan air minum karena cukup panas.",
    helpful: 18,
  },
  {
    id: "r3",
    author: "James & Lisa T.",
    avatar: null,
    country: "United Kingdom",
    rating: 4,
    date: "2026-04-10",
    title: "A must-visit, but come prepared",
    body: "The temple itself is extraordinary — the scale and intricacy of the carvings are hard to comprehend until you see them in person. We spent about 3 hours exploring all the levels. It can get very hot and crowded by mid-morning, so arrive early. The surrounding gardens are also lovely for a peaceful walk afterward.",
    helpful: 12,
  },
  {
    id: "r4",
    author: "Yuki Tanaka",
    avatar: null,
    country: "Japan",
    rating: 5,
    date: "2026-03-28",
    title: "Spiritual and serene",
    body: "As a Buddhist, visiting Borobudur was deeply meaningful. The ascending path through the temple levels symbolizes the journey to enlightenment, and you can feel this as you walk. The bell-shaped stupas on the upper terraces, each containing a Buddha statue, are hauntingly beautiful. I would return again in a heartbeat.",
    helpful: 31,
  },
  {
    id: "r5",
    author: "Maria G.",
    avatar: null,
    country: "Spain",
    rating: 4,
    date: "2026-02-14",
    title: "Incredible architecture, worth the trip from Yogyakarta",
    body: "We took a day trip from Jogja — about 1.5 hours each way. The temple is stunning and much larger than I expected. The 2,672 relief panels alone would take days to fully appreciate. One tip: buy your tickets online in advance to skip the queue. Also consider visiting Mendut Temple nearby, it's smaller but equally beautiful.",
    helpful: 9,
  },
];

function StarRating({ rating, size = 16 }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < rating ? "fill-current" : ""}
          style={{ color: i < rating ? "var(--color-accent)" : "var(--border-color)", width: size, height: size }}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }) {
  const initials = review.author
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
    >
      {/* Author row */}
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
          style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
        >
          {initials}
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {review.author}
          </p>
          <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
            {review.country} · {new Date(review.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Rating + title */}
      <div className="mt-3 flex items-center gap-2">
        <StarRating rating={review.rating} size={14} />
      </div>
      {review.title && (
        <p className="mt-2 text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
          {review.title}
        </p>
      )}

      {/* Body */}
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {review.body}
      </p>

      {/* Helpful */}
      <button
        type="button"
        className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors"
        style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        Helpful ({review.helpful})
      </button>
    </div>
  );
}

export default function ReviewsWidget({ destinationSlug }) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const reviews = STATIC_REVIEWS;
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="mt-10">
      <h2 className="mb-4 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
        {t("reviews.title") || "Reviews"}
      </h2>

      {/* Summary bar */}
      <div
        className="mb-5 flex flex-wrap items-center gap-4 rounded-xl px-5 py-4"
        style={{ backgroundColor: "var(--bg-surface-alt)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[28px] font-bold" style={{ color: "var(--text-primary)" }}>
            {avgRating}
          </span>
          <div>
            <StarRating rating={Math.round(Number(avgRating))} size={16} />
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {/* Rating distribution */}
        <div className="ml-auto flex flex-col gap-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-3 text-right text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
                  {star}
                </span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full" style={{ backgroundColor: "var(--border-color)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: "var(--color-accent)" }}
                  />
                </div>
                <span className="w-3 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {displayedReviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      {/* Show more/less toggle */}
      {reviews.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="focus-ring mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          {showAll ? "Show less" : `Show all ${reviews.length} reviews`}
          {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}
    </section>
  );
}
