import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";
import PageShell from "@/components/layout/PageShell";
import { DUMMY_VISITOR_INFO } from "@/lib/dummyData";
import {
  Plane, Bus, Sun, Banknote, Activity, Heart, Wifi, Phone,
  ChevronRight,
} from "lucide-react";

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

export default function VisitorInformation({ hideShell }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [cats, setCats] = useState(null);

  useEffect(() => {
    base44.entities.VisitorInfoCategory.list("display_order").then(setCats).catch(() => setCats([]));
  }, []);

  const displayCats = cats?.length === 0 ? DUMMY_VISITOR_INFO : (cats || DUMMY_VISITOR_INFO);

  const intro = language === "id"
    ? "Semua yang perlu Anda ketahui sebelum dan selama perjalanan Anda ke Yogyakarta."
    : "Everything you need to know before and during your trip to Yogyakarta.";

  return (
    <PageShell hideShell={hideShell}>
      {/* Hero banner */}
      <div
        className="section-y"
        style={{ backgroundColor: "var(--bg-surface-alt)" }}
      >
        <div className={hideShell ? "pt-2" : "content-wrap"}>
          <h1
            className="font-display text-[34px] font-normal md:text-[48px]"
            style={{ color: "var(--color-primary)" }}
          >
            {t("visitorInfo.title") || "Visitor Information"}
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed md:text-[18px]" style={{ color: "var(--text-secondary)" }}>
            {intro}
          </p>

          {/* Quick navigation pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {displayCats.map((c, i) => {
              const title = language === "id" ? c.title_id : c.title_en;
              const Icon = ICON_MAP[c.icon_name] || Plane;
              const color = CARD_COLORS[i % CARD_COLORS.length];
              return (
                <a
                  key={c.id}
                  href={`#${c.slug}`}
                  className="focus-ring inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors"
                  style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--bg-surface-alt)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bg-surface-alt)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {title}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content cards */}
      <div className="content-wrap section-y">
        <div className="space-y-10">
          {displayCats.map((c, i) => {
            const Icon = ICON_MAP[c.icon_name] || Plane;
            const color = CARD_COLORS[i % CARD_COLORS.length];
            const title = language === "id" ? c.title_id : c.title_en;
            const desc = language === "id" ? c.desc_id : c.desc_en;
            const bullets = (language === "id" ? c.items_id : c.items_en) || [];
            const isEven = i % 2 === 0;

            return (
              <div
                key={c.id}
                id={c.slug}
                className="scroll-mt-28 overflow-hidden rounded-2xl"
                style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-1)" }}
              >
                <div className={`grid grid-cols-1 md:grid-cols-2 ${isEven ? "" : "md:[direction:rtl]"}`}>
                  {/* Image */}
                  <div className="aspect-[4/3] md:aspect-auto md:min-h-[320px]">
                    <img
                      src={c.image_url}
                      alt={title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10 md:[direction:ltr]">
                    {/* Icon + title */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: color + "18", color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2
                        className="font-display text-[22px] font-semibold md:text-[26px]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {title}
                      </h2>
                    </div>

                    {/* Description */}
                    <p className="text-[14px] leading-relaxed md:text-[15px]" style={{ color: "var(--text-secondary)" }}>
                      {desc}
                    </p>

                    {/* Bullet list */}
                    <ul className="mt-5 space-y-2.5">
                      {bullets.map((b, bi) => (
                        <li
                          key={bi}
                          className="flex items-start gap-2.5 text-[14px]"
                          style={{ color: "var(--text-primary)" }}
                        >
                          <ChevronRight
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="content-wrap flex flex-col items-center gap-4 py-12 text-center md:py-16">
          <h2 className="font-display text-[24px] font-normal text-white md:text-[32px]">
            {language === "id" ? "Siap menjelajahi Jogja?" : "Ready to explore Jogja?"}
          </h2>
          <p className="max-w-[48ch] text-[15px] text-white/80">
            {language === "id"
              ? "Rencanakan perjalanan Anda dan temukan pengalaman tak terlupakan."
              : "Plan your trip and discover unforgettable experiences."
            }
          </p>
          <a
            href="/trip-planner"
            className="focus-ring mt-2 inline-flex items-center rounded-lg px-6 py-3 text-[15px] font-semibold transition-colors"
            style={{ backgroundColor: "var(--color-accent)", color: "var(--on-accent)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
          >
            {language === "id" ? "Rencanakan Perjalanan" : "Plan Your Trip"}
          </a>
        </div>
      </div>
    </PageShell>
  );
}