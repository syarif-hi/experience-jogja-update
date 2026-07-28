import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";

// Matching arrow button for inline/external nav placement.
export function StripNavButton({ onClick, direction = "next", disabled, label }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label || (direction === "prev" ? "Previous" : "Next")}
      disabled={disabled}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-opacity disabled:opacity-30"
      style={{ backgroundColor: "var(--bg-surface)", color: "var(--color-primary)", boxShadow: "var(--elevation-1)" }}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

// Swiper-based horizontal strip: swipe gesture on touch, nav arrows on desktop.
// Slides align to the content-wrap edges.
// `navPlacement`: "sides" (default) floats arrows outside the content grid;
//                 "top" renders arrows in a top-right control row above the strip.
// `perView` controls how many cards are visible at the largest breakpoint.
// `rows` renders a multi-row horizontal grid (each swipe page is rows x cols).
export default function HScrollStrip({ children, perView = 4, rows = 1, spaceBetween = 20, navPlacement = "sides", onNavState, mobileCols }) {
  const swiperRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const items = React.Children.toArray(children);

  const defaultMobileCols = rows > 1 ? 2.1 : 1.1;
  const actualMobileCols = mobileCols !== undefined ? mobileCols : defaultMobileCols;

  const gridProps = rows > 1 ? { modules: [Grid], grid: { rows, fill: "row" } } : { modules: [] };
  const bp = rows > 1
    ? {
        640: { slidesPerView: 2, grid: { rows: 2, fill: "row" } },
        768: { slidesPerView: 3, grid: { rows: 1, fill: "row" } },
        1024: { slidesPerView: 3, grid: { rows: 1, fill: "row" } },
        1280: { slidesPerView: perView, grid: { rows: 1, fill: "row" } },
      }
    : {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: perView },
      };

  const goPrev = () => swiperRef.current?.slidePrev();
  const goNext = () => swiperRef.current?.slideNext();

  const syncEdges = (swiper) => {
    setAtStart(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
    if (navPlacement === "external" && onNavState) {
      onNavState({ atStart: swiper.isBeginning, atEnd: swiper.isEnd, goPrev, goNext });
    }
  };

  const sideBtn = (onClick, Icon, label, side, disabled) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={`focus-ring absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-opacity disabled:opacity-0 sm:flex ${side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}`}
      style={{ backgroundColor: "var(--bg-surface)", color: "var(--color-primary)", boxShadow: "var(--elevation-3)" }}
    >
      <Icon className="h-5 w-5" />
    </button>
  );

  const topBtn = (onClick, Icon, label, disabled) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-opacity disabled:opacity-30"
      style={{ backgroundColor: "var(--bg-surface)", color: "var(--color-primary)", boxShadow: "var(--elevation-1)" }}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  const swiperEl = (
    <Swiper
      {...gridProps}
      spaceBetween={spaceBetween}
      slidesPerView={actualMobileCols}
      breakpoints={bp}
      className="!overflow-visible xl:!overflow-hidden"
      onSwiper={(swiper) => { swiperRef.current = swiper; syncEdges(swiper); }}
      onSlideChange={syncEdges}
      onResize={syncEdges}
    >
      {items.map((child, i) => (
        <SwiperSlide key={i} className="!h-auto">
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );

  if (navPlacement === "external") {
    return swiperEl;
  }

  if (navPlacement === "top") {
    return (
      <div>
        <div className="mb-3 flex items-center justify-end gap-2">
          {topBtn(goPrev, ChevronLeft, "Previous", atStart)}
          {topBtn(goNext, ChevronRight, "Next", atEnd)}
        </div>
        {swiperEl}
      </div>
    );
  }

  return (
    <div className="relative mt-8">
      {sideBtn(goPrev, ChevronLeft, "Previous", "left", atStart)}
      {swiperEl}
      {sideBtn(goNext, ChevronRight, "Next", "right", atEnd)}
    </div>
  );
}