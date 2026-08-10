import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, MapPin, Wallet, Tag } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { regencyLabel } from "@/lib/regencies";
import BookingDetailShell from "@/components/detail/BookingDetailShell";
import { DUMMY_ACTIVITIES } from "@/lib/dummyData";

export default function ActivityDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const { currency } = useCurrency();
  const [item, setItem] = useState(undefined);

  useEffect(() => {
    setItem(undefined);
    const fromDummy = DUMMY_ACTIVITIES.find((x) => x.slug === slug);
    if (base44.entities.Activity) {
      base44.entities.Activity.filter({ slug })
        .then((r) => setItem(r[0] || fromDummy || null))
        .catch(() => setItem(fromDummy || null));
    } else {
      setItem(fromDummy || null);
    }
  }, [slug]);

  const name = item && (language === "id" ? item.name_id : item.name_en);
  const description = item && (language === "id" ? (item.description_id || item.descriptor_id) : (item.description_en || item.descriptor_en));
  const meetingPoint = item && (language === "id" ? item.meeting_point_id : item.meeting_point_en);
  const priceLine = item && typeof item.price_idr === "number" ? `${t("from") || "From"} ${formatPrice(item.price_idr, currency)}` : null;
  const durationLabel = item && item.duration_hours ? `${item.duration_hours} ${language === "id" ? "jam" : "hours"}` : null;

  const status = item === undefined ? "loading" : item === null ? "notFound" : "ok";

  return (
    <BookingDetailShell
      status={status}
      trail={[
        { id: "home", path: "/", title: t("home") || "Home" },
        { id: "book", path: "/book-experience", title: language === "id" ? "Pesan Pengalaman" : "Book Experience" },
        { id: "activities", path: "/book-experience/activities", title: language === "id" ? "Aktivitas" : "Activities" },
        ...(name ? [{ id: "current", path: `/activities/${slug}`, title: name }] : []),
      ]}
      title={name}
      badges={[
        item && item.category && { key: "category", icon: Tag, label: item.category },
        item && item.regency && { key: "region", icon: MapPin, label: regencyLabel(item.regency, language) },
      ].filter(Boolean)}
      subtitleLine={item && [meetingPoint, item.regency && regencyLabel(item.regency, language)].filter(Boolean).join(" · ")}
      heroImageUrl={item && item.hero_image_url}
      gallery={item && item.gallery_image_urls}
      facts={[
        durationLabel && { icon: Clock, label: durationLabel },
        priceLine && { icon: Wallet, label: priceLine },
      ]}
      description={description}
      highlights={item && item.highlights}
      practicalTitle={language === "id" ? "Informasi Booking" : "Booking Information"}
      practicalRows={item ? [
        durationLabel && { icon: Clock, label: language === "id" ? "Durasi" : "Duration", value: durationLabel },
        priceLine && { icon: Wallet, label: t("detail.price") || "Price", value: priceLine },
        meetingPoint && { icon: MapPin, label: language === "id" ? "Titik Kumpul" : "Meeting Point", value: meetingPoint },
      ].filter(Boolean) : []}
      practicalCta={{ label: language === "id" ? "Pesan Aktivitas" : "Book This Activity", to: "#" }}
      relatedRegency={item && item.regency}
      reviewsKey={slug}
      fallbackCopy={language === "id" ? "Rincian aktivitas akan segera hadir." : "Full activity details coming soon."}
    />
  );
}
