import React from "react";
import { Calendar, Tag, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useTranslation } from "@/lib/i18n";

// Rough reading time from stripped HTML body.
function readingMinutes(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]+>/g, " ").trim();
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
}

export default function ArticleEssentials({ article, body }) {
  const { t, language } = useTranslation();
  const locale = language === "id" ? idLocale : enUS;
  const dateLabel = article.published_date ? format(parseISO(article.published_date), "d MMMM yyyy", { locale }) : "—";

  const rows = [
    { icon: Calendar, label: t("detail.when"), value: dateLabel },
    { icon: Tag, label: t("detail.category"), value: article.topic_tag ? t(`topic.${article.topic_tag}`) : "—" },
    { icon: Clock, label: t("essentials.readTime"), value: `${readingMinutes(body)} ${t("essentials.min")}` },
  ];

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-1)" }}>
      <h3 className="mb-4 text-[15px] font-bold  tracking-wide" style={{ color: "var(--text-primary)" }}>
        {t("essentials.title")}
      </h3>
      <ul className="space-y-4">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--color-accent)" }}>
              <r.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[12px]  tracking-wide" style={{ color: "var(--text-secondary)" }}>{r.label}</p>
              <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{r.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}