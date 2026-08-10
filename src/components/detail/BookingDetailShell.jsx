import React, { useState } from "react";
import { Share2, Tag, MapPin, Clock, Wallet } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import BreadcrumbTrail from "@/components/visitor/BreadcrumbTrail";
import DetailHeroGallery from "@/components/detail/DetailHeroGallery";
import QuickFactsStrip from "@/components/detail/QuickFactsStrip";
import ChipGrid from "@/components/detail/ChipGrid";
import PracticalInfoPanel from "@/components/detail/PracticalInfoPanel";
import ReviewsWidget from "@/components/detail/ReviewsWidget";
import YouMightAlsoLike from "@/components/detail/YouMightAlsoLike";

/**
 * Universal shell for booking sub-pages (Tour, Activity, Restaurant, Transportation).
 * Matches the layout of DestinationDetail:
 *   - Alt-bg hero section (breadcrumb + title + chip badges + share button)
 *   - Carousel gallery
 *   - 2-col grid: article (facts, overview, highlights, reviews) + sticky sidebar (practical info panel)
 *   - YouMightAlsoLike carousel
 *
 * Props:
 *   status: 'loading' | 'notFound' | 'ok'
 *   trail: [{ id, path, title }]  — breadcrumb entries
 *   title: string
 *   badges: [{ label, key }]      — pill badges under title (category/type/cuisine…)
 *   subtitleLine: string          — address / regency line under gallery
 *   heroImageUrl, gallery         — images
 *   facts: [{ icon, label }]
 *   description: html/plain string
 *   highlights: string[]
 *   practicalTitle: string
 *   practicalRows: [{ icon, label, value }]
 *   practicalCta: { label, to?, href? }
 *   relatedRegency: string        — feeds YouMightAlsoLike
 *   reviewsKey: string            — passed to ReviewsWidget as destinationSlug
 *   fallbackCopy: string
 */
export default function BookingDetailShell({
  status,
  trail = [],
  title,
  badges = [],
  subtitleLine,
  heroImageUrl,
  gallery,
  facts,
  description,
  highlights,
  practicalTitle,
  practicalRows,
  practicalCta,
  relatedRegency,
  reviewsKey,
  fallbackCopy,
}) {
  const { t } = useTranslation();
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: title || "Experience Jogja",
      text: title ? `${title} — Experience Jogja` : "Experience Jogja",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 2000);
        } catch (_) { /* noop */ }
      }
    }
  };

  const isHtml = description && /<[a-z][\s\S]*>/i.test(description);

  return (
    <PageShell>
      <div className="overflow-x-hidden">
        {status === "loading" ? (
          <div className="content-wrap py-8">
            <div className="aspect-[21/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
          </div>
        ) : status === "notFound" ? (
          <div className="content-wrap py-8">
            <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
          </div>
        ) : (
          <>
            {/* Header block */}
            <div className="py-8 md:py-12" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
              <div className="content-wrap">
                <BreadcrumbTrail trail={trail} />

                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3" style={{ color: "var(--color-primary)" }}>{title}</h1>
                    {badges.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {badges.map((b) => (
                          <span
                            key={b.key || b.label}
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold bg-white"
                            style={{ color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
                          >
                            {b.icon && <b.icon className="h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} />}
                            {b.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label={t("share.label")}
                    onClick={handleShare}
                    className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="content-wrap py-8">
              <DetailHeroGallery heroImageUrl={heroImageUrl} gallery={gallery} alt={title} />

              <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
                <article className="min-w-0">
                  {subtitleLine && (
                    <p className="mb-6 flex items-start gap-2 text-[15px]" style={{ color: "var(--text-primary)" }}>
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-accent)" }} />
                      {subtitleLine}
                    </p>
                  )}

                  {facts && facts.length > 0 && <QuickFactsStrip facts={facts} />}

                  <section className="mt-8">
                    <h2 className="mb-4 font-heading text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>
                      {t("detail.overview") || "Overview"}
                    </h2>
                    {description ? (
                      isHtml ? (
                        <div
                          className="prose-detail text-[16px] leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      ) : (
                        description.split("\n").filter(Boolean).map((para, i) => (
                          <p key={i} className="text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)", marginBottom: "1em" }}>{para}</p>
                        ))
                      )
                    ) : (
                      <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{fallbackCopy}</p>
                    )}
                  </section>

                  <ChipGrid title={t("detail.highlights") || "Highlights"} items={highlights} />

                  {reviewsKey && <ReviewsWidget destinationSlug={reviewsKey} />}
                </article>

                <aside className="lg:sticky lg:top-6 lg:self-start flex flex-col gap-6">
                  <PracticalInfoPanel
                    title={practicalTitle || t("essentials.title")}
                    rows={practicalRows}
                    cta={practicalCta}
                  />
                </aside>
              </div>

              {relatedRegency && <YouMightAlsoLike regency={relatedRegency} />}
            </div>
          </>
        )}
      </div>

      {showCopied && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-[13px] font-semibold shadow-lg"
          style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
        >
          {t("share.copy") || "Link copied!"}
        </div>
      )}
    </PageShell>
  );
}

// Re-export icons commonly used to construct facts/badges/rows from caller pages
export { Tag, MapPin, Clock, Wallet };
