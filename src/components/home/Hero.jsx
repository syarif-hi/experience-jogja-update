import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import "swiper/css/effect-fade";

const SLIDES = [
  "/images/slider/tamansari-w2000.jpg",
  "/images/slider/malioboro_street-w2000.jpg",
  "/images/slider/IMG-00033-cropped-w2000.jpg",
  "/images/slider/prambanan_3_expand-upscale-2x-w2000.jpeg",
  "/images/slider/wayang-crop-w2000.jpg",
  "/images/slider/traditinal_culinary-w2000.jpg",
  "/images/slider/borobudur_sunset_edit-upscale-2x_cropped-w2000.png",
  "/images/slider/prambanan_temple_human_interest-w2000.png",
  "/images/slider/traditional_event_expand-upscale-2x-w2000.jpeg",
  "/images/slider/borobudur-w2000.jpg",
  "/images/slider/prambanan_and_statue-w2000.jpg",
  "/images/slider/IMG-00017-retoched-w2000.jpeg",
  "/images/slider/IMG-00018-expanded-w2000.jpeg",
  "/images/slider/IMG-00019-w2000.jpg",
  "/images/slider/IMG-00020-expand-w2000.jpeg",
  "/images/slider/IMG-00024-expanded-w2000.jpeg",
  "/images/slider/traditional_dance_jogja.jpeg",
  "/images/slider/IMG-00027_beach_crop-w2000.jpg",
  "/images/slider/IMG-00028_beach_crop_expanded-w2000.jpg",
];

const PILLS = [
  { label: "DESTINATIONS", to: "/destinations", icon: "/images/icons/icon_destionation.png" },
  { label: "CULINARY & LIFESTYLE", to: "/things-to-do/culinary-lifestyle", icon: "/images/icons/icon_culinary_and_lifestyle.png" },
  { label: "HEALTH & WELLNESS", to: "/things-to-do/health-wellness", icon: "/images/icons/icon_health_and_wellness.png" },
  { label: "ENTERTAINMENT & CREATIVE", to: "/things-to-do/entertainment-creative", icon: "/images/icons/icon_entertainment_and_creative.png" },
  { label: "SPORTS & ADVENTURE", to: "/things-to-do/sports-adventure", icon: "/images/icons/icon-sports_and_adventure.png" },
  { label: "MICE & BUSINESS EVENTS", to: "/things-to-do/mice-business", icon: "/images/icons/icon_mice_and_business_events.png" },
];

export default function Hero() {
  const { t } = useTranslation();
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
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: '.hero-prev', nextEl: '.hero-next' }}
            onSlideChange={(swiper) => setIndex(swiper.realIndex)}
            onSwiper={setSwiperInstance}
            loop={true}
            speed={1}
            className="h-full w-full"
          >
            {SLIDES.map((src, i) => (
              <SwiperSlide key={src} className="h-full w-full">
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
          <div className="grid grid-cols-3 md:grid-cols-6 gap-y-6 gap-x-2 md:gap-x-4">
            {PILLS.map((p) => (
              <Link
                key={p.label}
                to={p.to}
                className="focus-ring flex flex-col items-center justify-start text-center group transition-opacity hover:opacity-70"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 mb-2 flex items-center justify-center transition-transform group-hover:scale-105">
                  <img src={p.icon} alt={p.label} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                </div>
                <span
                  className="text-[11px] md:text-[13px] font-medium leading-tight px-1 uppercase"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Heading / subheading / CTA — below the slider, left aligned */}
      <div className="content-wrap mt-6 text-center md:text-left">

        <p className="text-[17px] md:text-[22px] leading-[1.2] pt-2 max-w-[1090px] mx-auto md:mx-0 text-left md:text-left mb-2" style={{ color: "#000000" }}>
          One Destination. Endless Experiences.
        </p>

        <img
          src="/discover-jogja-artwork_no_tagline_3.png"
          alt="Discover Your Yogyakarta"
          className="w-full max-w-full md:max-w-[485px] h-auto mb-0 md:mx-0"
        />

        <p className="text-[18px] md:text-[22px] leading-[1.2] pt-2 max-w-[1090px] mx-auto md:mx-0 text-left md:text-left mb-6" style={{ color: "#000000" }}>
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