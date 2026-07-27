import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import ArticleCard from "@/components/shared/ArticleCard";

export default function RelatedPosts({ currentSlug, topicTag }) {
  const { t } = useTranslation();
  const [items, setItems] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.Article.list("-published_date", 12)
      .then((all) => {
        if (!active) return;
        const others = all.filter((a) => a.slug !== currentSlug);
        const sameTopic = others.filter((a) => topicTag && a.topic_tag === topicTag);
        const picked = [...sameTopic, ...others.filter((a) => !sameTopic.includes(a))].slice(0, 3);
        setItems(picked);
      })
      .catch(() => setItems([]));
    return () => { active = false; };
  }, [currentSlug, topicTag]);

  if (items !== null && items.length === 0) return null;

  return (
    <section className="mt-14 border-t pt-10" style={{ borderColor: "var(--border)" }}>
      <h2 className="mb-6 font-heading text-[22px] font-bold md:text-[26px]" style={{ color: "var(--text-primary)" }}>
        {t("related.title")}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items === null
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
            ))
          : items.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
    </section>
  );
}