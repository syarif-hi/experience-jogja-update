import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import ArticleCard from "@/components/shared/ArticleCard";
import BreadcrumbTrail from "@/components/visitor/BreadcrumbTrail";

export default function News() {
  const { t, language } = useTranslation();
  const [items, setItems] = useState(null);

  useEffect(() => {
    base44.entities.Article.list("-published_date").then(setItems).catch(() => setItems([]));
  }, []);

  const trail = [
    { title: language === "id" ? "Beranda" : "Home", path: "/" },
    { title: t("news.title") || "Jogja News", path: "/news" }
  ];

  return (
    <PageShell>
      <div className="py-8 md:py-12" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <div className="content-wrap">
          <div className="mb-4">
            <BreadcrumbTrail trail={trail} />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-1" style={{ color: "var(--color-primary)" }}>
            {t("news.title")}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed max-w-3xl" style={{ color: "var(--text-secondary)" }}>
            {t("news.pageSubtitle")}
          </p>
        </div>
      </div>
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