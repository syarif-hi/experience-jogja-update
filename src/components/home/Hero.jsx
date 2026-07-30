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
    <section className="pb-[var(--spacing-xl)]" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
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
      <div className="py-4" style={{ backgroundColor: "var(--bg-page)" }}>
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
      <div className="content-wrap mt-12 text-left">
        <h1 className="font-display max-w-[18ch] text-[34px] font-normal leading-[1.1] md:text-[56px]" style={{ color: "var(--color-primary)" }}>
          {t("hero.title")}
        </h1>
        <p className="mt-4 max-w-[52ch] text-[15px] font-normal leading-relaxed md:text-[18px]" style={{ color: "var(--text-secondary)" }}>
          {t("hero.subtitle")}
        </p>
        <div className="mt-6">
          <Link
            to="/destinations"
            className="focus-ring inline-flex items-center rounded-lg px-6 py-3 text-[15px] font-semibold transition-colors"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
          >
            {t("hero.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}