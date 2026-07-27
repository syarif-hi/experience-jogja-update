import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";
import { DUMMY_VISITOR_INFO } from "@/lib/dummyData";
import SectionHeading from "@/components/home/SectionHeading";
import {
  Plane, Bus, Sun, Banknote, Activity, Heart, Wifi, Phone,
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

export default function VisitorInfoSection() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Show first 4 items on homepage
  const items = DUMMY_VISITOR_INFO.slice(0, 4);

  return (
    <section className="section-y" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
      <div className="content-wrap">
        <SectionHeading
          title={language === "id" ? "Informasi Pengunjung" : "Visitor Information"}
          subtitle={language === "id"
            ? "Yang perlu Anda ketahui sebelum berkunjung ke Yogyakarta"
            : "What you need to know before visiting Yogyakarta"
          }
          seeMoreTo="/visitor-information"
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon_name] || Plane;
            const color = CARD_COLORS[i % CARD_COLORS.length];
            const title = language === "id" ? item.title_id : item.title_en;
            const desc = language === "id" ? item.desc_id : item.desc_en;
            const bullets = (language === "id" ? item.items_id : item.items_en) || [];

            return (
              <Link
                key={item.id}
                to={`/visitor-information#${item.slug}`}
                className="focus-ring group flex flex-col rounded-2xl p-5 transition-colors"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--bg-surface-alt)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--bg-surface-alt)")}
              >
                {/* Icon */}
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: color + "18", color }}
                >
                  <Icon className="h-5 w-5" />
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
                  className="mt-1.5 text-[13px] leading-snug"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {desc}
                </p>

                {/* First 2 bullet items */}
                <ul className="mt-3 space-y-1">
                  {bullets.slice(0, 2).map((b, bi) => (
                    <li
                      key={bi}
                      className="flex items-start gap-2 text-[12px]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
