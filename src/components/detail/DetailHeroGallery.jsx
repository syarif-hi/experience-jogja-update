import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SmartImage from "@/components/shared/SmartImage";

// Universal hero gallery: desktop/tablet = 1 hero + row of 5 thumbnails;
// mobile = single swipeable hero with a photo-count badge. Both open a shared lightbox.
export default function DetailHeroGallery({ heroImageUrl, gallery = [], alt = "" }) {
  // Full ordered photo list: hero first, then gallery images (deduped).
  const photos = [heroImageUrl, ...gallery].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

  const [lightbox, setLightbox] = useState(-1); // index open in lightbox, -1 = closed
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (lightbox < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(-1);
      if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, photos.length]);

  if (photos.length === 0) {
    return <div className="aspect-[16/9] rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />;
  }

  const hero = photos[selectedIdx] || photos[0];

  return (
    <div className="w-full overflow-hidden">
      {/* ── Unified Layout: Hero + row of up to 5 thumbnails ── */}
      <button
        type="button"
        onClick={() => setLightbox(selectedIdx)}
        className="focus-ring block w-full aspect-[16/9] sm:aspect-auto sm:h-[340px] overflow-hidden transition-opacity"
        style={{ borderRadius: "var(--radius-md)" }}
      >
        <SmartImage src={hero} alt={alt} className="h-full w-full object-cover" />
      </button>
      {photos.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {photos.map((url, i) => {
            const isActive = selectedIdx === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedIdx(i)}
                className={`focus-ring relative w-24 sm:w-32 shrink-0 snap-start aspect-[4/3] overflow-hidden transition-all ${isActive ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                <SmartImage src={url} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox >= 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightbox(-1)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightbox(-1)}
            className="focus-ring absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
          >
            <X className="h-5 w-5" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + photos.length) % photos.length); }}
                className="focus-ring absolute left-4 flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % photos.length); }}
                className="focus-ring absolute right-4 flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", right: "1rem" }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <div className="max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <SmartImage src={photos[lightbox]} alt={`${alt} ${lightbox + 1}`} className="max-h-[85vh] max-w-[90vw] object-contain" />
            <p className="mt-3 text-center text-[13px]" style={{ color: "rgba(255,255,255,0.8)" }}>
              {lightbox + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}