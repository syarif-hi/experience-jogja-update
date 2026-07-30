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
import DetailHeroGallery from "@/components/detail/DetailHeroGallery";
import QuickFactsStrip from "@/components/detail/QuickFactsStrip";
import ChipGrid from "@/components/detail/ChipGrid";
import ExploreTheArea from "@/components/detail/ExploreTheArea";
import LocationMap from "@/components/detail/LocationMap";
import PracticalInfoPanel from "@/components/detail/PracticalInfoPanel";
import ReviewsPlaceholder from "@/components/detail/ReviewsPlaceholder";
import YouMightAlsoLike from "@/components/detail/YouMightAlsoLike";

export default function DestinationDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const { currency } = useCurrency();
  const [dest, setDest] = useState(undefined);

  useEffect(() => {
    setDest(undefined);
    base44.entities.Destination.filter({ slug }).then((r) => setDest(r[0] || null)).catch(() => setDest(null));
  }, [slug]);

  const name = dest && (language === "id" ? dest.name_id : dest.name_en);
  const descriptor = dest && (language === "id" ? dest.descriptor_id : dest.descriptor_en);
  const priceText = dest && typeof dest.price_idr === "number"
    ? (dest.price_idr > 0 ? `${t("from")} ${formatPrice(dest.price_idr, currency)}` : t("free"))
    : null;

  return (
    <PageShell>
      <div className="content-wrap py-8">
        <Link to="/destinations" className="focus-ring mb-6 inline-flex items-center gap-1.5 rounded text-[14px] font-semibold" style={{ color: "var(--color-primary)" }}>
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>

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
                    <p className="mt-2 flex items-center gap-1.5 text-[14px]" style={{ color: "var(--text-secondary)" }}>
                      <MapPin className="h-4 w-4" />
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
                  <button type="button" aria-label={t("share.label")} className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}>
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
                    <h2 className="mb-3 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>{t("detail.overview") || "Overview"}</h2>
                    <p className="text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{descriptor}</p>
                  </section>
                )}

                {/* Highlights */}
                <ChipGrid title={t("detail.highlights") || "Highlights"} items={dest.highlights} />

                {/* Explore the area */}
                <ExploreTheArea origin={dest} />

                {/* Location map */}
                <LocationMap latitude={dest.latitude} longitude={dest.longitude} label={name} />

                {/* Reviews */}
                <ReviewsPlaceholder />
              </article>

              {/* Practical info sidebar */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
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
    </PageShell>
  );
}