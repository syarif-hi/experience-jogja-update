import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import ShareButtons from "@/components/news/ShareButtons";
import ArticleEssentials from "@/components/news/ArticleEssentials";
import RelatedPosts from "@/components/news/RelatedPosts";
import BreadcrumbTrail from "@/components/visitor/BreadcrumbTrail";

export default function ArticleDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const [article, setArticle] = useState(undefined);

  useEffect(() => {
    base44.entities.Article.filter({ slug }).then((r) => setArticle(r[0] || null)).catch(() => setArticle(null));
  }, [slug]);

  const locale = language === "id" ? idLocale : enUS;
  const title = article && (language === "id" ? article.title_id : article.title_en);
  const excerpt = article && (language === "id" ? article.excerpt_id : article.excerpt_en);
  const body = article && (language === "id" ? article.body_id : article.body_en);
  const dateLabel = article && article.published_date ? format(parseISO(article.published_date), "d MMMM yyyy", { locale }) : "";

  const trail = [
    { title: language === "id" ? "Beranda" : "Home", path: "/" },
    { title: t("news.title") || "Jogja News", path: "/news" },
    { title: title || "...", path: `/news/${slug}` }
  ];

  return (
    <PageShell>
      {article === undefined ? (
        <div className="content-wrap py-8">
          <div className="aspect-[16/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
        </div>
      ) : article === null ? (
        <div className="content-wrap py-8">
          <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
        </div>
      ) : (
        <div className="overflow-x-hidden">
          <div className="py-8 md:py-12" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
            <div className="content-wrap">
              <div className="mb-4">
                <BreadcrumbTrail trail={trail} />
              </div>
              
              {article.topic_tag && (
                <span className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold" style={{ backgroundColor: "var(--tag-culture)", color: "#FFFFFF" }}>
                  {t(`topic.${article.topic_tag}`)}
                </span>
              )}
              
              <h1 className="font-heading text-3xl md:text-5xl font-bold mb-1" style={{ color: "var(--color-primary)" }}>
                {title}
              </h1>
              {excerpt && (
                <p className="text-lg md:text-xl leading-relaxed max-w-3xl mt-4" style={{ color: "var(--text-secondary)" }}>
                  {excerpt}
                </p>
              )}
            </div>
          </div>

          <div className="content-wrap py-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              {/* Main article */}
              <article className="min-w-0">
                <p className="mb-6 font-mono-num text-[13px]" style={{ color: "var(--text-secondary)" }}>{dateLabel}</p>

                <div className="overflow-hidden rounded-2xl">
                  <SmartImage src={article.cover_image_url} alt={title} className="w-full object-cover" />
                </div>

                {body && (
                  <div
                    className="prose prose-lg mt-8 max-w-none prose-headings:font-heading prose-a:text-[color:var(--color-primary)]"
                    style={{ color: "var(--text-primary)" }}
                    dangerouslySetInnerHTML={{ __html: body }}
                  />
                )}
              </article>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-6 lg:self-start">
                <ArticleEssentials article={article} body={body} />
                <div className="mt-4 rounded-2xl p-5" style={{ backgroundColor: "var(--color-primary)" }}>
                  <p className="text-[15px] font-bold" style={{ color: "var(--on-primary)" }}>{t("share.label")}</p>
                  <div className="mt-3">
                    <ShareButtons title={title} hideLabel />
                  </div>
                </div>
              </aside>
            </div>

            <RelatedPosts currentSlug={article.slug} topicTag={article.topic_tag} />
          </div>
        </div>
      )}
    </PageShell>
  );
}