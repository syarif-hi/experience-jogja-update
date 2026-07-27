import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/categories";
import SectionHeading from "@/components/home/SectionHeading";
import SmartImage from "@/components/shared/SmartImage";

// Representative photo per category (reuses seeded destination hero images).
const CAT_IMG = {
  "landmarks": "https://media.base44.com/images/public/6a5745b9539f530d423709d4/5fccee2ff_Landmarks.jpg",
  "nature-outdoor": "https://media.base44.com/images/public/6a5745b9539f530d423709d4/171ebd4de_NatureOutdoor.jpg",
  "cultural-heritage-temples": "https://media.base44.com/images/public/6a5745b9539f530d423709d4/fd55e3822_CulturalHeritage.jpg",
  "art-museums": "https://media.base44.com/images/public/6a5745b9539f530d423709d4/21e2628cf_ArtMuseums.jpg",
  "eat-drink": "https://media.base44.com/images/public/6a5745b9539f530d423709d4/9f393ecee_EatDrink.jpg",
  "shopping": "https://media.base44.com/images/public/6a5745b9539f530d423709d4/35f48d9fc_Shopping.jpg",
  "events-festivals": "https://media.base44.com/images/public/6a5745b9539f530d423709d4/47185983f_EventsFestivals.jpg",
  "villages-local-life": "https://media.base44.com/images/public/6a5745b9539f530d423709d4/c9a3d60d2_VillagesLocalLife.jpg",
  "things-to-do": "https://media.base44.com/images/public/6a5745b9539f530d423709d4/0ce6f1e7f_ThingsToDo.jpg",
};

export default function CategoryGrid() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const navBtn = (ref, Icon, label, side) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={`focus-ring absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-colors disabled:opacity-0 sm:flex ${side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}`}
      style={{ backgroundColor: "var(--bg-surface)", color: "var(--color-primary)", boxShadow: "var(--elevation-3)" }}
    >
      <Icon className="h-5 w-5" />
    </button>
  );

  return (
    <section id="explore" className="section-y scroll-mt-24" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="content-wrap">
        <SectionHeading title={t("explore.title")} subtitle={t("explore.subtitle")} seeMoreTo="/destinations" />
        <div className="relative mt-8">
        {navBtn(prevRef, ChevronLeft, "Previous", "left")}
        <Swiper
          modules={[Grid, Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          grid={{ rows: 2, fill: "row" }}
          breakpoints={{
            640: { slidesPerView: 3, grid: { rows: 2, fill: "row" } },
            1280: { slidesPerView: 4, grid: { rows: 2, fill: "row" } },
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        >
          {CATEGORIES.map((c) => (
            <SwiperSlide key={c.value} className="!h-auto">
              <Link
                to={`/destinations?category=${c.value}`}
                className="group block focus-ring rounded-2xl"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <SmartImage
                    src={CAT_IMG[c.value]}
                    alt={language === "id" ? c.label_id : c.label_en}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="pt-3">
                  <h3 className="text-[15px] font-medium md:text-[16px]" style={{ color: "var(--color-primary)" }}>
                    {language === "id" ? c.label_id : c.label_en}
                  </h3>
                  <p className="mt-1 text-[12px] font-normal leading-snug md:text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    {language === "id" ? c.desc_id : c.desc_en}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        {navBtn(nextRef, ChevronRight, "Next", "right")}
      </div>
      </div>
    </section>
  );
}