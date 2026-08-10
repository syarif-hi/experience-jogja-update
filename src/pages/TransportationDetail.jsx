import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Car, MapPin, Wallet, Tag } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import BookingDetailShell from "@/components/detail/BookingDetailShell";
import { DUMMY_TRANSPORTATION } from "@/lib/dummyData";

export default function TransportationDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
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
  const pickup = item && (language === "id" ? item.pickup_id : item.pickup_en);
  const priceLine = item && typeof item.price_idr === "number" ? `${t("from") || "From"} ${formatPrice(item.price_idr, currency)}` : null;
  const typeLabel = item && item.type && (item.type.charAt(0).toUpperCase() + item.type.slice(1));

  const status = item === undefined ? "loading" : item === null ? "notFound" : "ok";

  return (
    <BookingDetailShell
      status={status}
      trail={[
        { id: "home", path: "/", title: t("home") || "Home" },
        { id: "book", path: "/book-experience", title: language === "id" ? "Pesan Pengalaman" : "Book Experience" },
        { id: "transport", path: "/book-experience/transportation", title: language === "id" ? "Transportasi" : "Transportation" },
        ...(name ? [{ id: "current", path: `/transportation/${slug}`, title: name }] : []),
      ]}
      title={name}
      badges={[
        typeLabel && { key: "type", icon: Car, label: typeLabel },
        priceLine && { key: "price", icon: Tag, label: priceLine },
      ].filter(Boolean)}
      subtitleLine={pickup}
      heroImageUrl={item && item.hero_image_url}
      gallery={item && item.gallery_image_urls}
      facts={[
        typeLabel && { icon: Car, label: typeLabel },
        priceLine && { icon: Wallet, label: priceLine },
      ]}
      description={description}
      highlights={item && item.highlights}
      practicalTitle={language === "id" ? "Informasi Booking" : "Booking Information"}
      practicalRows={item ? [
        typeLabel && { icon: Car, label: language === "id" ? "Jenis" : "Type", value: typeLabel },
        priceLine && { icon: Wallet, label: t("detail.price") || "Price", value: priceLine },
        pickup && { icon: MapPin, label: language === "id" ? "Titik Jemput" : "Pick-up", value: pickup },
      ].filter(Boolean) : []}
      practicalCta={{ label: language === "id" ? "Pesan Sekarang" : "Book Now", to: "#" }}
      relatedRegency={null}
      reviewsKey={slug}
      fallbackCopy={language === "id" ? "Rincian transportasi akan segera hadir." : "Full transportation details coming soon."}
    />
  );
}
