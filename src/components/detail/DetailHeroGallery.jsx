import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import SmartImage from "@/components/shared/SmartImage";

// Universal hero gallery: desktop/tablet = 1 hero + row of 5 thumbnails;
// mobile = single swipeable hero with a photo-count badge. Both open a shared lightbox.
export default function DetailHeroGallery({ heroImageUrl, gallery = [], alt = "" }) {
  // Full ordered photo list: hero first, then gallery images (deduped).
  const photos = [heroImageUrl, ...gallery].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

  const [lightbox, setLightbox] = useState(-1); // index open in lightbox, -1 = closed
  const [mobileIdx, setMobileIdx] = useState(0);

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

  const hero = photos[0];
  const thumbs = photos.slice(1, 6); // up to 5
  const extraCount = photos.length - 6; // photos beyond the 6 shown

  return (
    <div>
      {/* ── Mobile: single swipeable hero + count badge ── */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setLightbox(mobileIdx)}
          className="focus-ring relative block aspect-[4/3] w-full overflow-hidden rounded-2xl"
        >
          <SmartImage src={photos[mobileIdx]} alt={alt} className="h-full w-full object-cover" />
          <span
            className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff" }}
          >
            <Images className="h-3.5 w-3.5" /> {mobileIdx + 1} / {photos.length}
          </span>
        </button>
        {photos.length > 1 && (
          <div className="mt-2 flex justify-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Photo ${i + 1}`}
                onClick={() => setMobileIdx(i)}
                className="focus-ring h-2 rounded-full transition-all"
                style={{
                  width: i === mobileIdx ? 20 : 8,
                  backgroundColor: i === mobileIdx ? "var(--color-primary)" : "var(--border)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop / tablet: hero + row of up to 5 thumbnails ── */}
      <div className="hidden md:block">
        <button
          type="button"
          onClick={() => setLightbox(0)}
          className="focus-ring block aspect-[21/9] w-full overflow-hidden rounded-2xl"
        >
          <SmartImage src={hero} alt={alt} className="h-full w-full object-cover" />
        </button>
        {thumbs.length > 0 && (
          <div className="mt-3 grid grid-cols-5 gap-3">
            {thumbs.map((url, i) => {
              const isLastShown = i === thumbs.length - 1;
              const showOverlay = isLastShown && extraCount > 0;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightbox(i + 1)}
                  className="focus-ring relative aspect-[4/3] overflow-hidden rounded-md"
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  <SmartImage src={url} alt={`${alt} ${i + 2}`} className="h-full w-full object-cover" />
                  {showOverlay && (
                    <span
                      className="absolute inset-0 flex items-center justify-center text-[18px] font-bold"
                      style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "#fff" }}
                    >
                      +{extraCount + 1} more
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

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