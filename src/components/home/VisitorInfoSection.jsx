import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plane, Bus, Sun, Banknote, Activity, Heart, Wifi, Phone } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { DUMMY_VISITOR_INFO } from "@/lib/dummyData";
import SectionHeading from "@/components/home/SectionHeading";
import { getVisitorItemIcon } from "@/lib/visitorIcons";

const ICON_MAP = {
  Passport: Plane, Bus, Sun, Banknote, HeartPulse: Activity, Heart, Wifi, Phone,
};

const CARD_COLORS = [
  "var(--color-primary)",
  "var(--tag-nature)",
  "var(--color-accent)",
  "var(--tag-culture)",
  "var(--tag-heritage)",
  "var(--tag-lifestyle)",
  "#3B82F6",
  "#10B981",
];

export default function VisitorInfoSection() {
  const { language } = useLanguage();
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
    <div className="relative w-screen -ml-[50vw] left-1/2" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
      <section className="section-y mx-auto w-full max-w-[100vw]">
        <div className="content-wrap">
          <SectionHeading
            title={language === "id" ? "Informasi Pengunjung" : "Visitor Information"}
            subtitle={language === "id"
              ? "Yang perlu Anda ketahui sebelum berkunjung ke Yogyakarta"
              : "What you need to know before visiting Yogyakarta"
            }
            seeMoreTo="/visitor-information"
          />

          <div className="relative mt-8">
            {navBtn(prevRef, ChevronLeft, "Previous", "left")}
            <Swiper
              modules={[Grid, Navigation]}
              spaceBetween={16}
              slidesPerView={2.1}
              grid={{ rows: 2, fill: "row" }}
              breakpoints={{
                640: { slidesPerView: 3, grid: { rows: 2, fill: "row" } },
                1280: { slidesPerView: 4, grid: { rows: 2, fill: "row" } },
              }}
              className="!overflow-visible xl:!overflow-hidden"
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            >
              {DUMMY_VISITOR_INFO.map((item, i) => {
                const Icon = ICON_MAP[item.icon_name] || Plane;
                const color = CARD_COLORS[i % CARD_COLORS.length];
                const title = language === "id" ? item.title_id : item.title_en;
                const desc = language === "id" ? item.desc_id : item.desc_en;
                const bullets = item.items || [];

                return (
                  <SwiperSlide key={item.id} className="!h-auto">
                    <Link
                      to={`/visitor-information/${item.slug}`}
                      className="focus-ring group flex flex-col rounded-2xl p-5 transition-colors h-full"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--bg-surface-alt)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--bg-surface-alt)")}
                    >
                      {/* Icon Mobile */}
                      <div className="mb-2 flex md:hidden items-center justify-start" style={{ color }}>
                        <Icon className="h-6 w-6" />
                      </div>
                      
                      {/* Icon Desktop */}
                      <div
                        className="mb-4 hidden md:flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: color + "18", color }}
                      >
                        <Icon className="h-10 w-10" />
                      </div>

                      {/* Title */}
                      <h3
                        className="text-[16px] font-semibold leading-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {title}
                      </h3>

                      {/* Short desc */}
                      <p
                        className="mt-1.5 mb-3 text-[13px] leading-snug line-clamp-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {desc}
                      </p>

                      {/* First 2 bullet items */}
                      <ul className="mt-auto space-y-1">
                        {bullets.slice(0, 2).map((b, bi) => {
                          const bulletTitle = language === "id" ? b.title_id : b.title_en;
                          const BulletIcon = getVisitorItemIcon(b.title_en);
                          return (
                            <li
                              key={bi}
                              className="flex items-start gap-2 text-[12px]"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <BulletIcon
                                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                style={{ color: color }}
                              />
                              <span className="truncate">{bulletTitle}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            {navBtn(nextRef, ChevronRight, "Next", "right")}
          </div>
        </div>
      </section>
    </div>
  );
}
