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

  return (
    <PageShell>
      <div className="mx-auto max-w-[1120px] px-4 py-8 md:px-6">
        <Link to="/news" className="focus-ring mb-6 inline-flex items-center gap-1.5 rounded text-[14px] font-semibold" style={{ color: "var(--color-primary)" }}>
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>

        {article === undefined ? (
          <div className="aspect-[16/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
        ) : article === null ? (
          <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              {/* Main article */}
              <article className="min-w-0">
                {article.topic_tag && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold" style={{ backgroundColor: "var(--tag-culture)", color: "#FFFFFF" }}>
                    {t(`topic.${article.topic_tag}`)}
                  </span>
                )}
                <h1 className="mt-3 font-heading text-[28px] font-bold leading-tight md:text-[38px]" style={{ color: "var(--color-primary)" }}>{title}</h1>
                <p className="mt-2 font-mono-num text-[13px]" style={{ color: "var(--text-secondary)" }}>{dateLabel}</p>
                {excerpt && (
                  <p className="mt-4 text-[18px] font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>{excerpt}</p>
                )}

                <div className="mt-6 overflow-hidden rounded-2xl">
                  <SmartImage src={article.cover_image_url} alt={title} className="w-full object-cover" />
                </div>

                {body && (
                  <div
                    className="prose prose-lg mt-8 max-w-none prose-headings:font-heading prose-a:text-[color:var(--color-primary)]"
                    style={{ color: "var(--text-primary)" }}
                    dangerouslySetInnerHTML={{ __html: body }}
                  />
                )}

                <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--border)" }}>
                  <ShareButtons title={title} />
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
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
          </>
        )}
      </div>
    </PageShell>
  );
}