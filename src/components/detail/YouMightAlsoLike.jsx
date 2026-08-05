import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SmartImage from "@/components/shared/SmartImage";

export default function YouMightAlsoLike({ category, regency, excludeSlug }) {
  const { language, t } = useTranslation();
  const [items, setItems] = useState(null);

  useEffect(() => {
    let active = true;
    const query = category ? { category } : regency ? { regency } : null;
    if (!query) { setItems([]); return; }
    base44.entities.Destination.filter(query, "display_order", 10).then((res) => {
      if (active) setItems(res.filter((d) => d.slug !== excludeSlug).slice(0, 8));
    }).catch(() => active && setItems([]));
    return () => { active = false; };
  }, [category, regency, excludeSlug]);

  if (items !== null && items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 font-heading text-[24px] font-bold" style={{ color: "var(--color-primary)" }}>
        {t("detail.alsoLike") || "You might also like"}
      </h2>
      <div className="-mx-5 px-5 md:mx-0 md:px-0">
        <Swiper slidesPerView="auto" spaceBetween={16} className="!pb-4">
          {items === null
            ? Array.from({ length: 4 }).map((_, i) => (
                <SwiperSlide key={i} className="!w-[160px] md:!w-[200px]">
                  <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-slate-100" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
                </SwiperSlide>
              ))
            : items.map((item) => {
                const name = language === "id" ? item.name_id : item.name_en;
                return (
                  <SwiperSlide key={item.id} className="!w-[160px] md:!w-[200px]">
                    <Link to={`/destinations/${item.slug}`} className="flex flex-col gap-2 rounded-xl group focus-ring">
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                        <SmartImage src={item.hero_image_url} alt={name} className="h-full w-full object-cover transition-opacity group-hover:opacity-90" />
                      </div>
                      <div>
                        <h4 className="truncate text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>{name}</h4>
                        <p className="text-[12px] truncate" style={{ color: "var(--text-secondary)" }}>{item.category}</p>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
        </Swiper>
      </div>
    </section>
  );
}
