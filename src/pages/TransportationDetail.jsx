import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Car, Wallet } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import BookingDetailShell from "@/components/detail/BookingDetailShell";
import { DUMMY_TRANSPORTATION } from "@/lib/dummyData";

export default function TransportationDetail() {
  const { slug } = useParams();
  const { language } = useTranslation();
  const { currency } = useCurrency();
  const [item, setItem] = useState(undefined);

  useEffect(() => {
    setItem(undefined);
    const fromDummy = DUMMY_TRANSPORTATION.find((x) => x.slug === slug);
    if (base44.entities.Transportation) {
      base44.entities.Transportation.filter({ slug })
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
        { label: language === "id" ? "Transportasi" : "Transportation", to: "/book-experience/transportation" },
        ...(name ? [{ label: name }] : []),
      ]}
      backTo="/book-experience/transportation"
      title={name}
      subtitleNode={null}
      facts={[
        item && item.type && { icon: Car, label: item.type.charAt(0).toUpperCase() + item.type.slice(1) },
        priceLine && { icon: Wallet, label: priceLine },
      ]}
      description={description}
      highlights={item && item.highlights}
      hero={item && item.hero_image_url}
      fallbackCopy={language === "id" ? "Rincian transportasi akan segera hadir." : "Full transportation details coming soon."}
    />
  );
}
