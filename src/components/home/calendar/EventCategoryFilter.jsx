import React from "react";
import { useTranslation } from "@/lib/i18n";
import { EVENT_CATEGORIES } from "@/lib/eventCategories";

// Doubles as the color legend and the category filter: each chip shows the
// category color (legend) and toggles that category on/off (filter).
export default function EventCategoryFilter({ active, onToggle, onAll }) {
  const { t, language } = useTranslation();
  const allActive = active.length === EVENT_CATEGORIES.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
        {t("calendar.categories")}
      </span>

      <button
        type="button"
        onClick={onAll}
        aria-pressed={allActive}
        className="focus-ring rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors"
        style={{
          backgroundColor: allActive ? "var(--color-primary)" : "var(--bg-surface-alt)",
          color: allActive ? "var(--on-primary)" : "var(--text-secondary)",
        }}
      >
        {t("calendar.all")}
      </button>

      {EVENT_CATEGORIES.map((c) => {
        const on = active.includes(c.value);
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => onToggle(c.value)}
            aria-pressed={on}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition-opacity"
            style={{
              backgroundColor: "var(--bg-surface-alt)",
              color: "var(--text-primary)",
              opacity: on ? 1 : 0.4,
            }}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            {language === "id" ? c.label_id : c.label_en}
          </button>
        );
      })}
    </div>
  );
}