import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Smartphone, Bus, Bike, Car, Navigation } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import SmartImage from "@/components/shared/SmartImage";
import Breadcrumb from "@/components/shared/Breadcrumb";

export default function GettingAroundArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sidebar navigation items with correct icons
  const sidebarItems = [
    { slug: "ride-hailing", icon: Smartphone, title_en: "Online Ride-Hailing", title_id: "Ojek Online" },
    { slug: "bus", icon: Bus, title_en: "Trans Jogja Bus", title_id: "Bus Trans Jogja" },
    { slug: "traditional", icon: Bike, title_en: "Becak & Andong", title_id: "Becak & Andong" },
    { slug: "rental", icon: Car, title_en: "Car & Motorbike Rental", title_id: "Sewa Mobil & Motor" },
    { slug: "taxi", icon: Navigation, title_en: "Taxi", title_id: "Taksi" }
  ];

  useEffect(() => {
    setLoading(true);
    base44.entities.guide_article.filter({ slug }, "", 1)
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
        <h2 className="text-2xl font-bold mb-4">{language === "id" ? "Artikel Tidak Ditemukan" : "Article Not Found"}</h2>
        <button onClick={() => navigate(-1)} className="text-primary underline">{language === "id" ? "Kembali" : "Go Back"}</button>
      </div>
    );
  }

  const title = language === "id" ? article.title_id : article.title_en;
  const content = language === "id" ? article.content_id : article.content_en;

  const breadcrumbItems = [
    { label: language === "id" ? "Rencanakan Perjalanan" : "Plan Your Trip", to: "/plan-your-trip" },
    { label: language === "id" ? "Transportasi Lokal" : "Getting Around", to: "/plan-your-trip/getting-around" },
    { label: title }
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-6 rounded-2xl p-4" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
            <h3 className="font-heading text-[14px] font-bold mb-4 px-3" style={{ color: "var(--text-secondary)" }}>
              {language === "id" ? "Semua Topik" : "All Topics"}
            </h3>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.slug === slug;
                return (
                  <Link
                    key={item.slug}
                    to={`/plan-your-trip/getting-around/${item.slug}`}
                    className="flex items-center gap-3 py-2 px-3 rounded-xl transition-colors duration-200 group"
                    style={{ 
                      backgroundColor: isActive ? "var(--bg-surface)" : "transparent",
                      color: isActive ? "var(--color-primary)" : "var(--text-secondary)"
                    }}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium text-[14px]">{language === "id" ? item.title_id : item.title_en}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <article className="flex flex-col pb-12 w-full animate-in fade-in duration-500">
            {/* Hero Image */}
            {article.cover_image_url && (
              <figure
                className="rounded-2xl overflow-hidden mb-4 md:mb-8"
                style={{ backgroundColor: "var(--bg-surface-alt)" }}
              >
                <div className="w-full aspect-[16/9] md:aspect-[32/9] overflow-hidden">
                  <SmartImage
                    src={article.cover_image_url}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </figure>
            )}

            <h1 className="mb-6 font-heading text-[32px] font-bold md:text-[42px]" style={{ color: "var(--color-primary)" }}>
              {title}
            </h1>

            {/* Markdown Body */}
            <div className="prose prose-lg max-w-none" style={{ color: "var(--text-primary)" }}>
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => <h2 className="font-heading text-2xl font-bold mt-10 mb-4" style={{ color: "var(--color-primary)" }} {...props} />,
                  h3: ({node, ...props}) => <h3 className="font-heading text-xl font-bold mt-8 mb-3" style={{ color: "var(--color-primary)" }} {...props} />,
                  h4: ({node, ...props}) => <h4 className="font-heading text-lg font-bold mt-6 mb-2" style={{ color: "var(--color-primary)" }} {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }} {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-5 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-5 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li style={{ color: "var(--text-secondary)" }} {...props} />,
                  a: ({node, ...props}) => <a className="underline hover:no-underline font-medium" style={{ color: "var(--color-primary)" }} {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold" style={{ color: "var(--text-primary)" }} {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote
                      className="my-6 pl-5 py-3 pr-4 rounded-xl"
                      style={{
                        backgroundColor: "var(--bg-surface-alt)",
                        color: "var(--text-secondary)",
                      }}
                      {...props}
                    />
                  ),
                  hr: ({node, ...props}) => <hr className="my-8 border-0" style={{ height: "1px", backgroundColor: "var(--border-color)" }} {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
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
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline font-medium" style={{ color: "var(--color-primary)" }}>
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
          </article>
        </main>
      </div>
    </>
  );
}
