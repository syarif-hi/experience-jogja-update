import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Share2, Clock, Wallet, Tag } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { categoryLabel } from "@/lib/categories";
import { regencyLabel } from "@/lib/regencies";
import { experienceTypeLabel } from "@/lib/experienceTypes";
import PageShell from "@/components/layout/PageShell";
import CategoryTag from "@/components/shared/CategoryTag";
import BreadcrumbTrail from "@/components/visitor/BreadcrumbTrail";
import DetailHeroGallery from "@/components/detail/DetailHeroGallery";
import QuickFactsStrip from "@/components/detail/QuickFactsStrip";
import ChipGrid from "@/components/detail/ChipGrid";
import ExploreTheAreaSidebarWidget from "@/components/detail/ExploreTheAreaSidebarWidget";
import PracticalInfoPanel from "@/components/detail/PracticalInfoPanel";
import ReviewsWidget from "@/components/detail/ReviewsWidget";
import YouMightAlsoLike from "@/components/detail/YouMightAlsoLike";

export default function DestinationDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const { currency } = useCurrency();
  const [dest, setDest] = useState(undefined);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    setDest(undefined);
    base44.entities.Destination.filter({ slug }).then((r) => setDest(r[0] || null)).catch(() => setDest(null));
  }, [slug]);

  const name = dest && (language === "id" ? dest.name_id : dest.name_en);
  const descriptor = dest && (language === "id" ? dest.descriptor_id : dest.descriptor_en);
  const priceText = dest && typeof dest.price_idr === "number"
    ? (dest.price_idr > 0 ? `${t("from")} ${formatPrice(dest.price_idr, currency)}` : t("free"))
    : null;

  const handleShare = async () => {
    const shareData = {
      title: name || "Destination",
      text: name ? `${name} — Experience Jogja` : "Experience Jogja",
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
      // User cancelled or error — silently ignore
      if (e.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 2000);
        } catch (_) { /* noop */ }
      }
    }
  };

  return (
    <PageShell>
      <div className="content-wrap py-8" style={{ overflowX: "hidden" }}>
        <div>
          <BreadcrumbTrail trail={[
            { id: "home", path: "/", title: t("home") || "Home" },
            { id: "destinations", path: "/destinations", title: t("dest.title") || "Destinations" },
            ...(name ? [{ id: "current", path: `/destinations/${slug}`, title: name }] : [])
          ]} />
        </div>

        {dest === undefined ? (
          <div className="aspect-[21/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
        ) : dest === null ? (
          <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
        ) : (
          <>
            <DetailHeroGallery heroImageUrl={dest.hero_image_url} gallery={dest.gallery_image_urls} alt={name} />

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
              <article className="min-w-0">
                {/* Title bar */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-heading text-[28px] font-bold md:text-[36px]" style={{ color: "var(--color-primary)" }}>{name}</h1>
                    <p className="mt-2 flex items-start gap-1.5 text-[14px]" style={{ color: "var(--text-secondary)" }}>
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      {[dest.address, dest.regency && regencyLabel(dest.regency, language)].filter(Boolean).join(" · ")}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <CategoryTag category={dest.category} />
                      {(dest.experience_type || []).map((et) => (
                        <span key={et} className="rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}>
                          {experienceTypeLabel(et, language)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button type="button" aria-label={t("share.label")} onClick={handleShare} className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}>
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Quick facts */}
                <QuickFactsStrip
                  facts={[
                    { icon: Tag, label: categoryLabel(dest.category, language) },
                    dest.typical_duration && { icon: Clock, label: dest.typical_duration },
                    priceText && { icon: Wallet, label: priceText },
                    dest.opening_hours && { icon: Clock, label: dest.opening_hours },
                  ]}
                />

                {/* Overview */}
                {descriptor && (
                  <section className="mt-8">
                    <h2 className="mb-4 font-heading text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>{t("detail.overview") || "Overview"}</h2>
                    {descriptor.split("\n").filter(Boolean).map((para, i) => (
                      <p key={i} className="text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)", marginBottom: "1em" }}>{para}</p>
                    ))}
                  </section>
                )}

                {/* Highlights */}
                <ChipGrid title={t("detail.highlights") || "Highlights"} items={dest.highlights} />



                {/* Reviews */}
                <ReviewsWidget destinationSlug={slug} />
              </article>

              {/* Practical info sidebar */}
              <aside className="lg:sticky lg:top-24 lg:self-start flex flex-col gap-6">
                <ExploreTheAreaSidebarWidget origin={dest} />

                <PracticalInfoPanel
                  title={t("essentials.title")}
                  rows={[
                    { icon: Clock, label: t("detail.openingHours") || "Opening hours", value: dest.opening_hours },
                    { icon: Wallet, label: t("detail.price"), value: priceText },
                    { icon: MapPin, label: t("detail.address") || "Address", value: dest.address },
                  ]}
                  cta={{ label: t("detail.planTrip") || "Plan this into your trip", to: "/itineraries" }}
                />
              </aside>
            </div>

            <YouMightAlsoLike category={dest.category} excludeSlug={dest.slug} />
          </>
        )}
      </div>

      {/* Copied toast */}
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