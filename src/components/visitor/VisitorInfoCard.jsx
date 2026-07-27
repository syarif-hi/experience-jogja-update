import React from "react";
import { useTranslation } from "@/lib/i18n";
import SmartImage from "@/components/shared/SmartImage";

// One Visitor Information category: square image + bold title + bulleted sub-item list.
// The card itself (image + title) is a link to an on-page anchor; bullets stay plain text.
export default function VisitorInfoCard({ category }) {
  const { language } = useTranslation();
  const title = language === "id" ? category.title_id : category.title_en;
  const items = (language === "id" ? category.items_id : category.items_en) || [];
  const anchor = `vic-${category.id}`;

  return (
    <div id={anchor} className="flex flex-col">
      <a
        href={`#${anchor}`}
        className="focus-ring group block overflow-hidden rounded-2xl"
        style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-1)" }}
      >
        <div className="aspect-square w-full overflow-hidden" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
          <SmartImage src={category.image_url} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      </a>
      <h3 className="mt-3 font-heading text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[14px]" style={{ color: "var(--text-secondary)" }}>
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}