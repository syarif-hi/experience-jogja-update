import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const SLIDES = [
  "https://ik.imagekit.io/ibrproject/tamansari-w2000.jpg",
  "https://ik.imagekit.io/ibrproject/malioboro_street-w2000.jpg",
  "https://ik.imagekit.io/ibrproject/tugu_jogja_edit_cropped-w2000.jpeg",
  "https://ik.imagekit.io/ibrproject/prambanan_3_expand-upscale-2x-w2000.jpeg",
  "https://ik.imagekit.io/ibrproject/wayang-crop-w2000.jpg",
  "https://ik.imagekit.io/ibrproject/traditinal_culinary-w2000.jpg",
  "https://ik.imagekit.io/ibrproject/borobudur_sunset_edit-upscale-2x_cropped-w2000.png",
  "https://ik.imagekit.io/ibrproject/traditional_dance_expanded-upscale-2x-w2000.jpeg",
  "https://ik.imagekit.io/ibrproject/prambanan_temple_human_interest-w2000.png",
  "https://ik.imagekit.io/ibrproject/traditional_event_expand-upscale-2x-w2000.jpeg",
  "https://ik.imagekit.io/ibrproject/borobudur-w2000.jpg",
  "https://ik.imagekit.io/ibrproject/prambanan_and_statue-w2000.jpg",
];

const PILLS = [
  { label: "DESTINATIONS", to: "/destinations" },
  { label: "CULINARY & LIFESTYLE", to: "/destinations?category=eat-drink" },
  { label: "HEALTH & WELLNESS", to: "/destinations?category=wellness" },
  { label: "ENTERTAINMENT & CREATIVE", to: "/destinations?category=entertainment" },
  { label: "SPORTS & ADVENTURE", to: "/destinations?category=sports" },
  { label: "MICE & BUSINESS EVENTS", to: "/destinations?category=mice" },
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
            modules={[Autoplay]}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
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

          {/* Bullet indicators — bottom left */}
          <div className="absolute bottom-6 left-6 z-10 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIndex(i);
                  if (swiperInstance) swiperInstance.slideToLoop(i);
                }}
                aria-label={`Slide ${i + 1}`}
                className="focus-ring h-2.5 rounded-full transition-all"
                style={{
                  width: i === index ? 24 : 10,
                  backgroundColor: i === index ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Menu row — below the slider */}
      <div className="py-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="content-wrap">
          <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center justify-start gap-x-10 gap-y-4 md:gap-y-2">
            {PILLS.map((p) => (
              <Link
                key={p.label}
                to={p.to}
                className="focus-ring block w-full md:w-auto text-[17px] font-normal uppercase tracking-wide transition-opacity hover:opacity-70"
                style={{ color: "var(--text-primary)" }}
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Heading / subheading / CTA — below the slider, left aligned */}
      <div className="content-wrap mt-12 text-center md:text-left">
        <img
          src="/discover-jogja-artwork_no_tagline_2.png"
          alt="Discover Your Yogyakarta"
          className="w-full max-w-full md:max-w-[960px] h-auto mb-0 md:mx-0"
        />

        <p className="text-[19px] md:text-[24px] leading-relaxed max-w-[1090px] mx-auto md:mx-0 text-left md:text-left mb-6" style={{ color: "#000000" }}>
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