import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import "swiper/css/effect-fade";

const SLIDES = [
  "/images/slider/tugu_jogja_edit_cropped-w2000.jpeg",
  "/images/slider/prambanan_temple_human_interest-w2000.png",
  "/images/slider/wayang-crop-w2000.jpg",
  "/images/slider/malioboro_street-w2000.jpg",
  "/images/slider/borobudur-w2000.jpg",
  "/images/slider/traditinal_culinary-w2000.jpg",
  "/images/slider/IMG-00028_beach_crop_expanded-w2000.jpg",
  "/images/slider/traditional_event_expand-upscale-2x-w2000.jpeg",
  "/images/slider/borobudur_sunset_edit-upscale-2x_cropped-w2000.png",
  "/images/slider/IMG-00017-retoched-w2000.jpeg",
  "/images/slider/IMG-00018-expanded-w2000.jpeg",
  "/images/slider/IMG-00020-expand-w2000.jpeg",
  "/images/slider/IMG-00024-expanded-w2000.jpeg",
  "/images/slider/IMG-00026-expanded-w2000.jpeg",
  "/images/slider/IMG-00027_beach_crop-w2000.jpg",
  "/images/slider/prambanan_3_expand-upscale-2x-w2000.jpeg",
  "/images/slider/tamansari-w2000.jpg",
  "/images/slider/IMG-00019-w2000.jpg",
  "/images/slider/IMG-00020-expand-w2000.jpeg",
  "/images/slider/prambanan_and_statue-w2000.jpg",
];

const PILLS = [
  { label_en: "DESTINATIONS", label_id: "DESTINASI", to: "/destinations", icon: "/images/icons/icon_destination.png" },
  { label_en: "CULINARY & LIFESTYLE", label_id: "KULINER & GAYA HIDUP", to: "/things-to-do/culinary-lifestyle", icon: "/images/icons/icon_culinary.png" },
  { label_en: "HEALTH & WELLNESS", label_id: "KESEHATAN & KEBUGARAN", to: "/things-to-do/health-wellness", icon: "/images/icons/icon_health_lifestyle.png" },
  { label_en: "ENTERTAINMENT & CREATIVE", label_id: "HIBURAN & KREATIF", to: "/things-to-do/entertainment-creative", icon: "/images/icons/icon_entertainment.png" },
  { label_en: "SPORTS & ADVENTURE", label_id: "OLAHRAGA & PETUALANGAN", to: "/things-to-do/sports-adventure", icon: "/images/icons/icon_sports_adventure.png" },
  { label_en: "MICE & BUSINESS EVENTS", label_id: "MICE & ACARA BISNIS", to: "/things-to-do/mice-business", icon: "/images/icons/icon_mice_business_events.png" },
];

export default function Hero() {
  const { t, language } = useTranslation();
  const [index, setIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <section style={{ backgroundColor: "#FFFFFF" }}>
      {/* Fluid image slider — full-bleed, no radius */}
      <div className="relative">
        <div className="relative aspect-[4/3] md:aspect-[21/9] max-h-[calc(100vh-220px)] min-h-[320px] w-full overflow-hidden">
          <Swiper
            modules={[Autoplay, Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: false }}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: '.hero-prev', nextEl: '.hero-next' }}
            onSlideChange={(swiper) => setIndex(swiper.realIndex)}
            onSwiper={setSwiperInstance}
            loop={true}
            speed={1}
            className="h-full w-full bg-black"
          >
            {SLIDES.map((src, i) => (
              <SwiperSlide key={src} className="h-full w-full transform-gpu">
                <img
                  src={src}
                  alt="Yogyakarta"
                  className="h-full w-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            className="hero-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center drop-shadow-md opacity-70 transition-opacity hover:opacity-100 md:left-8"
            aria-label="Previous slide"
          >
            <img src="/images/nav-slider-arrow.svg" alt="Previous" className="h-6 w-6 md:h-10 md:w-10 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            className="hero-next absolute right-4 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center drop-shadow-md opacity-70 transition-opacity hover:opacity-100 md:right-8"
            aria-label="Next slide"
          >
            <img src="/images/nav-slider-arrow.svg" alt="Next" className="h-6 w-6 md:h-10 md:w-10" />
          </button>
        </div>
      </div>

      {/* Menu grid — below the slider */}
      <div className="py-6 md:py-8" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="content-wrap">
          <div className="grid grid-cols-3 md:grid-cols-6 lg:flex lg:flex-wrap lg:justify-start lg:gap-10 gap-y-6 gap-x-2">
            {PILLS.map((p) => {
              const label = language === "id" ? p.label_id : p.label_en;
              return (
                <Link
                  key={p.to}
                  to={p.to}
                  className="focus-ring flex flex-col items-center justify-start text-center group transition-opacity hover:opacity-70"
                >
                  <div className="w-20 h-12 mb-2 flex items-center justify-center transition-transform group-hover:scale-105">
                    <img src={p.icon} alt={label} className="w-full h-full object-contain" />
                  </div>
                  <span
                    className="text-[11px] md:text-[14px] font-medium leading-tight px-1 uppercase lg:whitespace-nowrap md:max-w-[120px] lg:max-w-none"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Heading / subheading / CTA — below the slider, left aligned */}
      <div className="content-wrap mt-6 text-center md:text-left">

        <p className="text-[16px] min-[400px]:text-[17px] md:text-[22px] leading-[1.2] pt-2 max-w-[1090px] mx-auto md:mx-0 text-left md:text-left mb-2 whitespace-nowrap md:whitespace-normal truncate md:overflow-visible" style={{ color: "#000000" }}>
          One Destination. Endless Experiences.
        </p>

        <img
          src="/discover-jogja-artwork_no_tagline_3.png"
          alt="Discover Your Yogyakarta"
          className="block w-[70%] max-w-[70%] mr-auto md:w-full md:max-w-[485px] h-auto mb-0 md:mx-0"
        />

        <p className="text-[16px] md:text-[22px] leading-[1.2] pt-2 max-w-[1090px] mx-auto md:mx-0 text-left md:text-left mb-6" style={{ color: "#000000" }}>
          Your trusted guide to Yogyakarta's destinations, culture, culinary experiences,
          events, accommodations, transportation, and local lifestyle.
        </p>

        <div className="space-y-4 text-[15px] md:text-[20px] leading-relaxed max-w-[1090px] mx-auto md:mx-0 text-left md:text-left mb-16" style={{ color: "var(--text-secondary)" }}>
          <p>{t("hero.welcome1")}</p>
          <p>{t("hero.welcome2")}</p>
          <p>{t("hero.welcome3")}</p>
        </div>

      </div>
    </section>
  );
}