import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";
import { DUMMY_VISITOR_INFO } from "@/lib/dummyData";
import SectionHeading from "@/components/home/SectionHeading";
import HScrollStrip from "@/components/home/HScrollStrip";
import { getVisitorItemIcon } from "@/lib/visitorIcons";
import { Plane, Bus, Sun, Banknote, Activity, Heart, Wifi, Phone } from "lucide-react";

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

          <HScrollStrip perView={4}>
            {DUMMY_VISITOR_INFO.map((item, i) => {
              const Icon = ICON_MAP[item.icon_name] || Plane;
              const color = CARD_COLORS[i % CARD_COLORS.length];
              const title = language === "id" ? item.title_id : item.title_en;
              const desc = language === "id" ? item.desc_id : item.desc_en;
              const bullets = item.items || [];

              return (
                <Link
                  key={item.id}
                  to={`/visitor-information/${item.slug}`}
                  className="focus-ring group flex flex-col rounded-2xl p-5 transition-colors h-full"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--bg-surface-alt)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--bg-surface-alt)")}
                >
                  {/* Icon */}
                  <div
                    className="mb-4 flex h-[88px] w-[88px] items-center justify-center rounded-2xl"
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
                    className="mt-1.5 text-[13px] leading-snug line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {desc}
                  </p>

                  {/* First 2 bullet items */}
                  <ul className="mt-auto pt-3 space-y-1">
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
              );
            })}
          </HScrollStrip>
        </div>
      </section>
    </div>
  );
}
