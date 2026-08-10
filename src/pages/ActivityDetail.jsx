import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, MapPin, Wallet } from "lucide-react";
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
  const priceLine = item && typeof item.price_idr === "number" ? formatPrice(item.price_idr, currency) : null;

  const status = item === undefined ? "loading" : item === null ? "notFound" : "ok";

  return (
    <BookingDetailShell
      status={status}
      breadcrumb={[
        { label: language === "id" ? "Pesan Pengalaman" : "Book Experience", to: "/book-experience" },
        { label: language === "id" ? "Aktivitas" : "Activities", to: "/book-experience/activities" },
        ...(name ? [{ label: name }] : []),
      ]}
      backTo="/book-experience/activities"
      title={name}
      subtitleNode={item && item.regency && (
        <p className="mt-2 flex items-center gap-1.5 text-[14px]" style={{ color: "var(--text-secondary)" }}>
          <MapPin className="h-4 w-4" /> {regencyLabel(item.regency, language)}
        </p>
      )}
      facts={[
        item && item.duration_hours && { icon: Clock, label: `${item.duration_hours} ${language === "id" ? "jam" : "hours"}` },
        priceLine && { icon: Wallet, label: priceLine },
      ]}
      description={description}
      highlights={item && item.highlights}
      hero={item && item.hero_image_url}
      fallbackCopy={language === "id" ? "Rincian aktivitas akan segera hadir." : "Full activity details coming soon."}
    />
  );
}
