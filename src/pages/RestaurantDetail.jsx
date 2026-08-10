import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Clock, Utensils, Wallet } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { regencyLabel } from "@/lib/regencies";
import BookingDetailShell from "@/components/detail/BookingDetailShell";
import { DUMMY_RESTAURANTS } from "@/lib/dummyData";

export default function RestaurantDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
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
  const cuisineLabel = item && item.cuisine && (item.cuisine.charAt(0).toUpperCase() + item.cuisine.slice(1));

  const status = item === undefined ? "loading" : item === null ? "notFound" : "ok";

  return (
    <BookingDetailShell
      status={status}
      trail={[
        { id: "home", path: "/", title: t("home") || "Home" },
        { id: "book", path: "/book-experience", title: language === "id" ? "Pesan Pengalaman" : "Book Experience" },
        { id: "restaurants", path: "/book-experience/restaurants", title: language === "id" ? "Restoran" : "Restaurants" },
        ...(name ? [{ id: "current", path: `/restaurants/${slug}`, title: name }] : []),
      ]}
      title={name}
      badges={[
        cuisineLabel && { key: "cuisine", icon: Utensils, label: cuisineLabel },
        item && item.price_range && { key: "price", icon: Wallet, label: item.price_range },
        item && item.regency && { key: "region", icon: MapPin, label: regencyLabel(item.regency, language) },
      ].filter(Boolean)}
      subtitleLine={item && [item.address, item.regency && regencyLabel(item.regency, language)].filter(Boolean).join(" · ")}
      heroImageUrl={item && item.hero_image_url}
      gallery={item && item.gallery_image_urls}
      facts={[
        cuisineLabel && { icon: Utensils, label: cuisineLabel },
        item && item.price_range && { icon: Wallet, label: item.price_range },
        item && item.opening_hours && { icon: Clock, label: item.opening_hours },
      ]}
      description={description}
      highlights={item && item.highlights}
      practicalTitle={language === "id" ? "Informasi Kunjungan" : "Visitor Information"}
      practicalRows={item ? [
        item.opening_hours && { icon: Clock, label: language === "id" ? "Jam Buka" : "Opening Hours", value: item.opening_hours },
        item.price_range && { icon: Wallet, label: language === "id" ? "Kisaran Harga" : "Price Range", value: item.price_range },
        item.address && { icon: MapPin, label: language === "id" ? "Alamat" : "Address", value: item.address },
      ].filter(Boolean) : []}
      practicalCta={{ label: language === "id" ? "Pesan Meja" : "Reserve a Table", to: "#" }}
      relatedRegency={item && item.regency}
      reviewsKey={slug}
      fallbackCopy={language === "id" ? "Rincian restoran akan segera hadir." : "Full restaurant details coming soon."}
    />
  );
}
