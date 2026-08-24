import React, { useEffect, useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import EventCard from "@/components/shared/EventCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

export default function RelatedEvents({ currentSlug }) {
  const { t } = useTranslation();
  const [items, setItems] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    let active = true;
    base44.entities.Event.list("-start_date", 12)
      .then((all) => {
        if (!active) return;
        // Filter out sample/dummy events - only show real events
        const realEvents = all.filter(event => !event.is_sample);
        const others = realEvents.filter((a) => a.slug !== currentSlug);
        setItems(others.slice(0, 8));
      })
      .catch(() => setItems([]));
    return () => { active = false; };
  }, [currentSlug]);

  if (items !== null && items.length === 0) return null;

  const navBtn = (ref, Icon, label, side) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={`focus-ring absolute top-[40%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-colors disabled:opacity-0 sm:flex ${side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}`}
      style={{ backgroundColor: "var(--bg-surface)", color: "var(--color-primary)", boxShadow: "var(--elevation-3)" }}
    >
      <Icon className="h-5 w-5" />
    </button>
  );

  return (
    <section className="mt-14" style={{ borderColor: "var(--border)" }}>
      <h2 className="mb-6 font-heading text-[22px] font-bold md:text-[26px]" style={{ color: "var(--text-primary)" }}>
        {t("related.title")}
      </h2>
      <div className="relative">
        {navBtn(prevRef, ChevronLeft, "Previous", "left")}
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="!overflow-visible xl:!overflow-hidden"
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        >
          {items === null
            ? Array.from({ length: 4 }).map((_, i) => (
              <SwiperSlide key={i} className="!h-auto">
                <div className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
              </SwiperSlide>
            ))
            : items.map((a) => (
              <SwiperSlide key={a.id} className="!h-auto h-full">
                <EventCard event={a} />
              </SwiperSlide>
            ))}
        </Swiper>
        {navBtn(nextRef, ChevronRight, "Next", "right")}
      </div>
    </section>
  );
}
