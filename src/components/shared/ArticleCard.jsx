import React from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import SmartImage from "@/components/shared/SmartImage";

export default function ArticleCard({ article }) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const title = language === "id" ? article.title_id : article.title_en;
  const excerpt = language === "id" ? article.excerpt_id : article.excerpt_en;
  const locale = language === "id" ? idLocale : enUS;
  const dateLabel = article.published_date ? format(parseISO(article.published_date), "d MMM yyyy", { locale }) : "";

  return (
    <Link to={`/news/${article.slug}`} className="group flex flex-col focus-ring rounded-2xl">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <SmartImage src={article.cover_image_url} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {article.topic_tag && (
          <span
            className="absolute left-3 top-3 inline-flex items-center rounded-md px-3 py-1 text-[12px] font-semibold"
            style={{ backgroundColor: "var(--tag-culture)", color: "#FFFFFF" }}
          >
            {t(`topic.${article.topic_tag}`)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <span className="font-body text-[12px]" style={{ color: "var(--text-secondary)" }}>{dateLabel}</span>
        <h3 className="mt-1 truncate text-[14px] md:text-[15px] font-medium leading-tight" style={{ color: "var(--color-primary)" }}>
          {title}
        </h3>
        <p className="mt-1.5 text-[13px] font-normal leading-snug line-clamp-3" style={{ color: "var(--text-secondary)" }}>
          {excerpt}
        </p>
        <span className="mt-2 text-[13px] font-semibold group-hover:underline" style={{ color: "var(--color-primary)" }}>
          {t("readMore")}
        </span>
      </div>
    </Link>
  );
}