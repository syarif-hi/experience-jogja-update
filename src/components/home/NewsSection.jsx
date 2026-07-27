import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import SectionHeading from "@/components/home/SectionHeading";
import HScrollStrip from "@/components/home/HScrollStrip";
import ArticleCard from "@/components/shared/ArticleCard";

export default function NewsSection() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.Article.list("-published_date", 12).then((res) => {
      if (active) setArticles(res);
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="section-y" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="content-wrap">
        <SectionHeading title={t("news.title")} subtitle={t("news.subtitle")} seeMoreTo="/news" />
        <HScrollStrip>
          {articles === null
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[16/10] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface)" }} />
              ))
            : articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </HScrollStrip>
      </div>
    </section>
  );
}