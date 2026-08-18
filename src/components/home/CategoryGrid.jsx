import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/categories";
import SectionHeading from "@/components/home/SectionHeading";
import SmartImage from "@/components/shared/SmartImage";
import HScrollStrip from "@/components/home/HScrollStrip";

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

  return (
    <section id="explore" className="section-y scroll-mt-24" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="content-wrap">
        <SectionHeading title={t("explore.title")} subtitle={t("explore.subtitle")} seeMoreTo="/destinations" />
        <HScrollStrip rows={2}>
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
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
                <h3 className="line-clamp-2 text-[15px] font-medium md:text-[16px]" style={{ color: "var(--color-primary)" }}>
                  {language === "id" ? c.label_id : c.label_en}
                </h3>
                <p className="mt-1 text-[12px] font-normal leading-snug md:text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  {language === "id" ? c.desc_id : c.desc_en}
                </p>
              </div>
            </Link>
          ))}
        </HScrollStrip>
      </div>
    </section>
  );
}