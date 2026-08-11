import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
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
        <div className="flex flex-col gap-2 md:gap-1 mb-6">
          <h2 
            className="font-display font-normal text-[17px] min-[375px]:text-[20px] md:text-[36px] leading-[1] md:leading-tight whitespace-nowrap" 
            style={{ color: "var(--color-primary)" }}
          >
            {t("news.title")}
          </h2>
          <div className="flex items-start justify-between gap-4">
            <p className="text-[14px] md:text-[16px] font-normal" style={{ color: "var(--text-secondary)" }}>
              {t("news.subtitle")}
            </p>
            <Link
              to="/news"
              className="focus-ring inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-[12px] font-semibold tracking-wide transition-colors md:text-[14px]"
              style={{ backgroundColor: "var(--color-primary)", color: "var(--bg-surface)" }}
            >
              {t("seeMore")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <HScrollStrip rows={2}>
          {articles === null
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface)" }} />
              ))
            : articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </HScrollStrip>
      </div>
    </section>
  );
}