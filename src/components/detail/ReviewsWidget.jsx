import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, ChevronDown, ChevronUp, Camera, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
    images: [
      "/images/slider/borobudur_sunset_edit-upscale-2x_cropped-w2000.png",
      "/images/slider/borobudur-w2000.jpg"
    ]
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
    images: [
      "/images/slider/IMG-00017-retoched-w2000.jpeg"
    ]
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

function ReviewImageModal({ review, initialSlide, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row" style={{ backgroundColor: "rgba(0,0,0,0.95)" }} onClick={onClose}>
      <button 
        className="absolute top-4 right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Main Image Carousel */}
      <div className="relative flex-1 flex items-center justify-center min-h-[50vh] w-full" onClick={(e) => e.stopPropagation()}>
        <Swiper
          modules={[Navigation]}
          navigation
          initialSlide={initialSlide}
          className="w-full h-full flex items-center justify-center"
        >
          {review.images.map((img, i) => (
            <SwiperSlide key={i} className="flex items-center justify-center h-full w-full">
              <img src={img} alt={`Review photo ${i+1}`} className="max-h-full max-w-full object-contain p-4 md:p-12" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Reviewer Details */}
      <div 
        className="w-full md:w-[350px] shrink-0 md:h-full p-6 overflow-y-auto flex flex-col gap-4 rounded-t-2xl md:rounded-none" 
        style={{ backgroundColor: "var(--bg-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "var(--border-color)" }}>
          <span 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[14px] font-bold"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
          >
            {review.author.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>{review.author}</p>
            <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
              {review.country} · {new Date(review.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
        <div>
          <StarRating rating={review.rating} size={16} />
          {review.title && <p className="mt-3 font-bold text-[16px]" style={{ color: "var(--text-primary)" }}>{review.title}</p>}
          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{review.body}</p>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  const [activeImageIdx, setActiveImageIdx] = useState(null);
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

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
          {review.images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt="User upload" 
              className="h-20 w-20 shrink-0 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity" 
              style={{ border: "1px solid var(--border-color)" }} 
              onClick={() => setActiveImageIdx(idx)}
            />
          ))}
        </div>
      )}

      {/* Helpful */}
      <button
        type="button"
        className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors"
        style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        Helpful ({review.helpful})
      </button>

      {/* Modal */}
      {activeImageIdx !== null && (
        <ReviewImageModal 
          review={review} 
          initialSlide={activeImageIdx} 
          onClose={() => setActiveImageIdx(null)} 
        />
      )}
    </div>
  );
}

function ReviewForm({ onSubmit, onCancel }) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }
    const newImages = files.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...newImages].slice(0, 4));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSubmit({
      id: "r_new_" + Date.now(),
      author: "You",
      avatar: null,
      country: "Local",
      rating,
      date: new Date().toISOString(),
      title: "",
      body,
      images,
      helpful: 0,
    });
  };

  return (
    <form onSubmit={submit} className="rounded-xl p-5 mb-6" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
      <h3 className="font-bold text-[16px] mb-3" style={{ color: "var(--text-primary)" }}>Write a Review</h3>
      
      {/* Rating Selector */}
      <div className="flex gap-1 mb-3">
        {[1,2,3,4,5].map(star => (
          <Star 
            key={star} 
            onClick={() => setRating(star)} 
            className={`h-6 w-6 cursor-pointer ${rating >= star ? "fill-current" : ""}`} 
            style={{ color: rating >= star ? "var(--color-accent)" : "var(--border-color)" }}
          />
        ))}
      </div>
      
      <textarea 
        value={body} 
        onChange={e => setBody(e.target.value)} 
        placeholder="Share your experience..." 
        className="w-full rounded-lg p-3 text-[14px] mb-3 outline-none"
        style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
        rows="3"
        required
      />
      
      {/* Image Uploader */}
      <div className="mb-4">
        <p className="text-[12px] mb-2" style={{ color: "var(--text-secondary)" }}>Attach photos (max 4)</p>
        <div className="flex gap-2 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="relative shrink-0">
              <img src={img} alt="Upload preview" className="h-16 w-16 rounded-lg object-cover" style={{ border: "1px solid var(--border-color)" }} />
              <button 
                type="button" 
                onClick={() => setImages(images.filter((_, i) => i !== idx))} 
                className="absolute -top-2 -right-2 rounded-full p-1 shadow-sm"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < 4 && (
            <label 
              className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-surface-alt)" }}
            >
              <Camera className="h-5 w-5 mb-1" style={{ color: "var(--text-secondary)" }} />
              <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Add Photo</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-4 py-2 rounded-full text-[13px] font-semibold transition-colors hover:bg-gray-100"
          style={{ color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 rounded-full text-[13px] font-semibold transition-opacity hover:opacity-90" 
          style={{ backgroundColor: "var(--color-accent)", color: "var(--on-accent)" }}
        >
          Post Review
        </button>
      </div>
    </form>
  );
}

export default function ReviewsWidget({ destinationSlug }) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [reviews, setReviews] = useState(STATIC_REVIEWS);

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
    setIsWriting(false);
  };

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
          {t("reviews.title") || "Reviews"}
        </h2>
        {!isWriting && (
          <button 
            type="button"
            onClick={() => setIsWriting(true)}
            className="text-[14px] font-semibold hover:underline"
            style={{ color: "var(--color-accent)" }}
          >
            Write a Review
          </button>
        )}
      </div>

      {isWriting && (
        <ReviewForm onCancel={() => setIsWriting(false)} onSubmit={handleAddReview} />
      )}

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
