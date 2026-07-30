import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import ArticleCard from "@/components/shared/ArticleCard";

export default function News() {
  const { t } = useTranslation();
  const [items, setItems] = useState(null);

  useEffect(() => {
    base44.entities.Article.list("-published_date").then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <PageShell title={t("news.title")} subtitle={t("news.pageSubtitle")}>
      <div className="content-wrap">
        <div className="mt-8 grid grid-cols-2 gap-4 pb-16 sm:gap-6 lg:grid-cols-3">
          {items === null ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
            ))
          ) : items.length === 0 ? (
            <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>{t("empty.none")}</p>
          ) : (
            items.map((a) => <ArticleCard key={a.id} article={a} />)
          )}
        </div>
      </div>
    </PageShell>
  );
}