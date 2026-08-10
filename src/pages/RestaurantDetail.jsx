import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Utensils, Wallet } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { regencyLabel } from "@/lib/regencies";
import BookingDetailShell from "@/components/detail/BookingDetailShell";
import { DUMMY_RESTAURANTS } from "@/lib/dummyData";

export default function RestaurantDetail() {
  const { slug } = useParams();
  const { language } = useTranslation();
  const [item, setItem] = useState(undefined);

  useEffect(() => {
    setItem(undefined);
    const fromDummy = DUMMY_RESTAURANTS.find((x) => x.slug === slug);
    if (base44.entities.Restaurant) {
      base44.entities.Restaurant.filter({ slug })
        .then((r) => setItem(r[0] || fromDummy || null))
        .catch(() => setItem(fromDummy || null));
    } else {
      setItem(fromDummy || null);
    }
  }, [slug]);

  const name = item && (language === "id" ? item.name_id : item.name_en);
  const description = item && (language === "id" ? (item.description_id || item.descriptor_id) : (item.description_en || item.descriptor_en));

  const status = item === undefined ? "loading" : item === null ? "notFound" : "ok";

  return (
    <BookingDetailShell
      status={status}
      breadcrumb={[
        { label: language === "id" ? "Pesan Pengalaman" : "Book Experience", to: "/book-experience" },
        { label: language === "id" ? "Restoran" : "Restaurants", to: "/book-experience/restaurants" },
        ...(name ? [{ label: name }] : []),
      ]}
      backTo="/book-experience/restaurants"
      title={name}
      subtitleNode={item && item.regency && (
        <p className="mt-2 flex items-center gap-1.5 text-[14px]" style={{ color: "var(--text-secondary)" }}>
          <MapPin className="h-4 w-4" /> {regencyLabel(item.regency, language)}
        </p>
      )}
      facts={[
        item && item.cuisine && { icon: Utensils, label: item.cuisine.charAt(0).toUpperCase() + item.cuisine.slice(1) },
        item && item.price_range && { icon: Wallet, label: item.price_range },
      ]}
      description={description}
      highlights={item && item.highlights}
      hero={item && item.hero_image_url}
      fallbackCopy={language === "id" ? "Rincian restoran akan segera hadir." : "Full restaurant details coming soon."}
    />
  );
}
