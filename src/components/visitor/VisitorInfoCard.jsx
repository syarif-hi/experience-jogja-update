import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import SmartImage from "@/components/shared/SmartImage";
import { Plane, Bus, Sun, Banknote, Activity, Heart, Wifi, Phone, ChevronRight } from "lucide-react";
import { getVisitorItemIcon } from "@/lib/visitorIcons";

const ICON_MAP = {
  Passport: Plane, Bus, Sun, Banknote, HeartPulse: Activity, Heart, Wifi, Phone,
};

// One Visitor Information category: square image + bold title + bulleted sub-item list.
// The card itself (image + title) is a link to an on-page anchor; bullets stay plain text.
export default function VisitorInfoCard({ category }) {
  const { language } = useTranslation();
  const title = language === "id" ? category.title_id : category.title_en;
  const items = category.items || [];
  const Icon = ICON_MAP[category.icon_name] || Plane;
  const targetPath = `/visitor-information/${category.slug}`;

  return (
    <div id={`vic-${category.id}`} className="flex flex-col">
      <Link
        to={targetPath}
        className="focus-ring group block overflow-hidden rounded-2xl relative"
        style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-1)" }}
      >
        <div className="aspect-[4/3] w-full overflow-hidden relative" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
          <SmartImage src={category.image_url} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          
          {/* Badge */}
          <div
            className="hidden md:flex absolute left-3 top-3 items-center justify-center rounded-lg p-2 backdrop-blur-md"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)", opacity: 0.9 }}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Link>
      <div className="mt-4">
        <h3 className="font-heading text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
        <div
          className="md:hidden mt-2 inline-flex items-center justify-center rounded-md p-1.5"
          style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.slice(0, 3).map((item, i) => {
          const itemTitle = language === "id" ? item.title_id : item.title_en;
          const ItemIcon = getVisitorItemIcon(item.title_en);
          return (
            <li key={i} className="flex items-start gap-2 text-[14px]" style={{ color: "var(--text-secondary)" }}>
              <ItemIcon className="mt-1 h-3.5 w-3.5 shrink-0" style={{ color: "var(--color-primary)" }} />
              <span className="truncate">{itemTitle}</span>
            </li>
          );
        })}
      </ul>
      <Link
        to={targetPath}
        className="mt-3 inline-flex items-center text-[14px] font-semibold transition-colors"
        style={{ color: "var(--color-primary)" }}
      >
        {language === "id" ? "Baca selengkapnya" : "Read more"}
        <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
}