import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, MapPin, Wallet } from "lucide-react";
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
  const priceLine = tour && typeof tour.price_idr === "number" ? formatPrice(tour.price_idr, currency) : null;

  const status = tour === undefined ? "loading" : tour === null ? "notFound" : "ok";

  return (
    <BookingDetailShell
      status={status}
      breadcrumb={[
        { label: language === "id" ? "Pesan Pengalaman" : "Book Experience", to: "/book-experience" },
        { label: language === "id" ? "Tur" : "Tours", to: "/book-experience/tours" },
        ...(name ? [{ label: name }] : []),
      ]}
      backTo="/book-experience/tours"
      title={name}
      subtitleNode={tour && tour.regency && (
        <p className="mt-2 flex items-center gap-1.5 text-[14px]" style={{ color: "var(--text-secondary)" }}>
          <MapPin className="h-4 w-4" /> {regencyLabel(tour.regency, language)}
        </p>
      )}
      facts={[
        tour && tour.duration_hours && { icon: Clock, label: `${tour.duration_hours} ${language === "id" ? "jam" : "hours"}` },
        priceLine && { icon: Wallet, label: priceLine },
      ]}
      description={description}
      highlights={tour && tour.highlights}
      hero={tour && tour.hero_image_url}
      fallbackCopy={language === "id"
        ? "Rincian tur akan segera hadir. Hubungi kami untuk info pemesanan."
        : "Full tour details coming soon. Contact us for booking details."}
    />
  );
}
