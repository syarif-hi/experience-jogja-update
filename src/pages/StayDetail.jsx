import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Share2, Star, Wallet, LogIn, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { regencyLabel } from "@/lib/regencies";
import PageShell from "@/components/layout/PageShell";
import DetailHeroGallery from "@/components/detail/DetailHeroGallery";
import QuickFactsStrip from "@/components/detail/QuickFactsStrip";
import ChipGrid from "@/components/detail/ChipGrid";
import ExploreTheArea from "@/components/detail/ExploreTheArea";
import LocationMap from "@/components/detail/LocationMap";
import PracticalInfoPanel from "@/components/detail/PracticalInfoPanel";
import ReviewsPlaceholder from "@/components/detail/ReviewsPlaceholder";
import YouMightAlsoLike from "@/components/detail/YouMightAlsoLike";
import { DUMMY_STAYS } from "@/lib/dummyData";

export default function StayDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const { currency } = useCurrency();
  const [stay, setStay] = useState(undefined);

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

  return (
    <PageShell>
      <div className="content-wrap py-8">
        <Link to="/stays" className="focus-ring mb-6 inline-flex items-center gap-1.5 rounded text-[14px] font-semibold" style={{ color: "var(--color-primary)" }}>
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>

        {stay === undefined ? (
          <div className="aspect-[21/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
        ) : stay === null ? (
          <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
        ) : (
          <>
            <DetailHeroGallery heroImageUrl={stay.hero_image_url} gallery={stay.gallery_image_urls} alt={name} />

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
              <article className="min-w-0">
                {/* Title bar */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-heading text-[28px] font-bold md:text-[36px]" style={{ color: "var(--color-primary)" }}>{name}</h1>
                    {stars && (
                      <p className="mt-1 text-[16px]" style={{ color: "var(--color-accent)" }} aria-label={`${stay.star_rating} stars`}>{stars}</p>
                    )}
                    <p className="mt-2 flex items-center gap-1.5 text-[14px]" style={{ color: "var(--text-secondary)" }}>
                      <MapPin className="h-4 w-4" />
                      {[stay.address, stay.regency && regencyLabel(stay.regency, language)].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <button type="button" aria-label={t("share.label")} className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}>
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Quick facts — Stay: star rating, (guest score omitted, not faked), price */}
                <QuickFactsStrip
                  facts={[
                    stay.star_rating && { icon: Star, label: `${stay.star_rating}-${t("stay.star") || "star"}` },
                    priceLine && { icon: Wallet, label: priceLine },
                  ]}
                />

                {/* Overview */}
                {description && (
                  <section className="mt-8">
                    <h2 className="mb-3 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>{t("detail.overview") || "Overview"}</h2>
                    <div className="prose-detail text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }} dangerouslySetInnerHTML={{ __html: description }} />
                  </section>
                )}

                {/* Amenities */}
                <ChipGrid title={t("stay.amenities") || "Amenities"} items={stay.amenities} />

                {/* Explore the area */}
                <ExploreTheArea origin={stay} />

                {/* Location map */}
                <LocationMap latitude={stay.latitude} longitude={stay.longitude} label={name} />

                {/* Reviews */}
                <ReviewsPlaceholder />
              </article>

              {/* Practical info sidebar */}
              <aside className="lg:sticky lg:top-6 lg:self-start">
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
          </>
        )}
      </div>
    </PageShell>
  );
}