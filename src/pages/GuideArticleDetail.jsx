import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import SmartImage from "@/components/shared/SmartImage";

export default function GuideArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch article by slug
    base44.entities.guide_article.filter({ slug, _limit: 1 })
      .then((res) => {
        if (res && res.length > 0) setArticle(res[0]);
        else setArticle(null);
      })
      .catch((e) => {
        console.error("Failed to load article", e);
        setArticle(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-primary underline">Go Back</button>
      </div>
    );
  }

  const title = language === "id" ? article.title_id : article.title_en;
  const content = language === "id" ? article.content_id : article.content_en;

  return (
    <div className="animate-in fade-in duration-500">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-[14px] font-medium transition-opacity hover:opacity-70"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        {language === "id" ? "Kembali" : "Back"}
      </button>

      {article.cover_image_url && (
        <div className="mb-8 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gray-100">
          <SmartImage
            src={article.cover_image_url}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <h1 className="mb-6 font-heading text-[32px] font-bold md:text-[42px]" style={{ color: "var(--color-primary)" }}>
        {title}
      </h1>

      <div className="prose prose-lg max-w-none mb-12" style={{ color: "var(--text-primary)" }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      {article.references && article.references.length > 0 && (
        <div className="mt-12 rounded-2xl p-6" style={{ backgroundColor: "var(--bg-surface)" }}>
          <h3 className="mb-4 font-heading text-[20px] font-bold" style={{ color: "var(--color-primary)" }}>
            {language === "id" ? "Referensi & Tautan Berguna" : "References & Useful Links"}
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {article.references.map((ref, i) => (
              <li key={i} className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
                    {ref.label}
                  </a>
                ) : (
                  <span>{ref.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
