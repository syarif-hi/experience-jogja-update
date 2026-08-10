import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Share2, Star, Wallet, LogIn, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { regencyLabel } from "@/lib/regencies";
import PageShell from "@/components/layout/PageShell";
import BreadcrumbTrail from "@/components/visitor/BreadcrumbTrail";
import DetailHeroGallery from "@/components/detail/DetailHeroGallery";
import QuickFactsStrip from "@/components/detail/QuickFactsStrip";
import ChipGrid from "@/components/detail/ChipGrid";
import ExploreTheAreaSidebarWidget from "@/components/detail/ExploreTheAreaSidebarWidget";
import PracticalInfoPanel from "@/components/detail/PracticalInfoPanel";
import ReviewsWidget from "@/components/detail/ReviewsWidget";
import YouMightAlsoLike from "@/components/detail/YouMightAlsoLike";
import { DUMMY_STAYS } from "@/lib/dummyData";

export default function StayDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const { currency } = useCurrency();
  const [stay, setStay] = useState(undefined);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    setStay(undefined);
    const fromDummy = DUMMY_STAYS.find((x) => x.slug === slug);
    base44.entities.Stay.filter({ slug })
      .then((r) => setStay(r[0] || fromDummy || null))
      .catch(() => setStay(fromDummy || null));
  }, [slug]);

  const name = stay && (language === "id" ? stay.name_id : stay.name_en);
  const description = stay && (language === "id" ? stay.description_id : stay.description_en);
  const priceLine = stay && typeof stay.price_idr_per_night === "number"
    ? `${formatPrice(stay.price_idr_per_night, currency)} ${t("stay.perNight") || "/ night"}`
    : null;
  const stars = stay && stay.star_rating ? "★".repeat(stay.star_rating) : null;

  const handleShare = async () => {
    const shareData = {
      title: name || "Stay",
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
      <div className="overflow-x-hidden">
        {stay === undefined ? (
          <div className="content-wrap py-8">
            <div className="aspect-[21/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
          </div>
        ) : stay === null ? (
          <div className="content-wrap py-8">
            <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
          </div>
        ) : (
          <>
            <div className="py-8 md:py-12" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
              <div className="content-wrap">
                <div>
                  <BreadcrumbTrail trail={[
                    { id: "home", path: "/", title: t("home") || "Home" },
                    { id: "stays", path: "/stays", title: t("stays.title") || "Stays" },
                    ...(name ? [{ id: "current", path: `/stays/${slug}`, title: name }] : [])
                  ]} />
                </div>
                
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3" style={{ color: "var(--color-primary)" }}>{name}</h1>
                    <div className="flex flex-wrap items-center gap-2">
                      {stars && (
                        <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold bg-white" style={{ color: "var(--color-accent)", border: "1px solid var(--border-color)" }}>
                          {stay.star_rating} {t("stay.star") || "star"} {stars}
                        </span>
                      )}
                    </div>
                  </div>
                  <button type="button" aria-label={t("share.label")} onClick={handleShare} className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm" style={{ color: "var(--text-primary)" }}>
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="content-wrap py-8">
              <DetailHeroGallery heroImageUrl={stay.hero_image_url} gallery={stay.gallery_image_urls} alt={name} />

              <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
                <article className="min-w-0">
                  <p className="mb-6 flex items-start gap-2 text-[15px]" style={{ color: "var(--text-primary)" }}>
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-accent)" }} />
                    {[stay.address, stay.regency && regencyLabel(stay.regency, language)].filter(Boolean).join(" · ")}
                  </p>

                {/* Quick facts */}
                <QuickFactsStrip
                  facts={[
                    stay.star_rating && { icon: Star, label: `${stay.star_rating}-${t("stay.star") || "star"}` },
                    priceLine && { icon: Wallet, label: priceLine },
                  ]}
                />

                {/* Overview */}
                {description && (
                  <section className="mt-8">
                    <h2 className="mb-4 font-heading text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>{t("detail.overview") || "Overview"}</h2>
                    <div className="prose-detail text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }} dangerouslySetInnerHTML={{ __html: description }} />
                  </section>
                )}

                {/* Amenities */}
                <ChipGrid title={t("stay.amenities") || "Amenities"} items={stay.amenities} />

                {/* Reviews */}
                <ReviewsWidget destinationSlug={slug} isStay={true} />
              </article>

              {/* Practical info sidebar */}
              <aside className="lg:sticky lg:top-6 lg:self-start flex flex-col gap-6">
                <ExploreTheAreaSidebarWidget origin={stay} />

                <PracticalInfoPanel
                  title={t("stay.booking") || "Booking"}
                  priceLine={priceLine}
                  rows={[
                    { icon: LogIn, label: t("stay.checkIn") || "Check-in", value: stay.check_in_time },
                    { icon: LogOut, label: t("stay.checkOut") || "Check-out", value: stay.check_out_time },
                    { icon: MapPin, label: t("detail.address") || "Address", value: stay.address },
                  ]}
                  cta={stay.contact_or_inquiry_url
                    ? { label: t("stay.checkAvailability") || "Check availability", href: stay.contact_or_inquiry_url }
                    : { label: t("stay.checkAvailability") || "Check availability", to: "#" }}
                />
              </aside>
            </div>

            <YouMightAlsoLike regency={stay.regency} />
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