import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, MapPin, Wallet, Tag } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { regencyLabel } from "@/lib/regencies";
import BookingDetailShell from "@/components/detail/BookingDetailShell";
import { DUMMY_TOURS } from "@/lib/dummyData";

export default function TourDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const { currency } = useCurrency();
  const [tour, setTour] = useState(undefined);

  useEffect(() => {
    setTour(undefined);
    const fromDummy = DUMMY_TOURS.find((x) => x.slug === slug);
    if (base44.entities.Tour) {
      base44.entities.Tour.filter({ slug })
        .then((r) => setTour(r[0] || fromDummy || null))
        .catch(() => setTour(fromDummy || null));
    } else {
      setTour(fromDummy || null);
    }
  }, [slug]);

  const name = tour && (language === "id" ? tour.name_id : tour.name_en);
  const description = tour && (language === "id" ? (tour.description_id || tour.descriptor_id) : (tour.description_en || tour.descriptor_en));
  const meetingPoint = tour && (language === "id" ? tour.meeting_point_id : tour.meeting_point_en);
  const priceLine = tour && typeof tour.price_idr === "number" ? `${t("from") || "From"} ${formatPrice(tour.price_idr, currency)}` : null;
  const durationLabel = tour && tour.duration_hours ? `${tour.duration_hours} ${language === "id" ? "jam" : "hours"}` : null;

  const status = tour === undefined ? "loading" : tour === null ? "notFound" : "ok";

  return (
    <BookingDetailShell
      status={status}
      trail={[
        { id: "home", path: "/", title: t("home") || "Home" },
        { id: "book", path: "/book-experience", title: language === "id" ? "Pesan Pengalaman" : "Book Experience" },
        { id: "tours", path: "/book-experience/tours", title: language === "id" ? "Tur" : "Tours" },
        ...(name ? [{ id: "current", path: `/tours/${slug}`, title: name }] : []),
      ]}
      title={name}
      badges={[
        { key: "kind", icon: Tag, label: language === "id" ? "Tur" : "Tour" },
        tour && tour.regency && { key: "region", icon: MapPin, label: regencyLabel(tour.regency, language) },
      ].filter(Boolean)}
      subtitleLine={tour && [meetingPoint, tour.regency && regencyLabel(tour.regency, language)].filter(Boolean).join(" · ")}
      heroImageUrl={tour && tour.hero_image_url}
      gallery={tour && tour.gallery_image_urls}
      facts={[
        durationLabel && { icon: Clock, label: durationLabel },
        priceLine && { icon: Wallet, label: priceLine },
      ]}
      description={description}
      highlights={tour && tour.highlights}
      practicalTitle={language === "id" ? "Informasi Booking" : "Booking Information"}
      practicalRows={tour ? [
        durationLabel && { icon: Clock, label: language === "id" ? "Durasi" : "Duration", value: durationLabel },
        priceLine && { icon: Wallet, label: t("detail.price") || "Price", value: priceLine },
        meetingPoint && { icon: MapPin, label: language === "id" ? "Titik Kumpul" : "Meeting Point", value: meetingPoint },
      ].filter(Boolean) : []}
      practicalCta={{ label: language === "id" ? "Pesan Tur Ini" : "Book This Tour", to: "#" }}
      relatedRegency={tour && tour.regency}
      reviewsKey={slug}
      fallbackCopy={language === "id"
        ? "Rincian tur akan segera hadir. Hubungi kami untuk info pemesanan."
        : "Full tour details coming soon. Contact us for booking details."}
    />
  );
}
