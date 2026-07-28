import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { useTranslation } from "@/lib/i18n";
import { formatPrice } from "@/lib/currency";
import CategoryTag from "@/components/shared/CategoryTag";
import SmartImage from "@/components/shared/SmartImage";

export default function DestinationCard({ destination }) {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const name = language === "id" ? destination.name_id : destination.name_en;
  const descriptor = language === "id" ? destination.descriptor_id : destination.descriptor_en;
  const price = destination.price_idr;

  return (
    <Link to={`/destinations/${destination.slug}`} className="group block focus-ring rounded-2xl">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <SmartImage
          src={destination.hero_image_url}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="hidden md:block absolute left-3 top-3">
          <CategoryTag category={destination.category} />
        </div>
      </div>
      <div className="pt-3">
        <h3 className="line-clamp-2 text-[14px] md:text-[15px] font-medium leading-tight" style={{ color: "var(--color-primary)" }}>
          {name}
        </h3>
        <div className="md:hidden mt-2 flex">
          <CategoryTag category={destination.category} className="max-w-full truncate" />
        </div>
        <p className="mt-1 text-[13px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-secondary)" }}>
          {descriptor}
        </p>
        {typeof price === "number" && price > 0 && (
          <p className="mt-2 font-body text-[13px]" style={{ color: "var(--color-primary)" }}>
            {t("from")} {formatPrice(price, currency)}
          </p>
        )}
        {price === 0 && (
          <p className="mt-2 font-body text-[13px]" style={{ color: "var(--color-primary)" }}>
            {t("free")}
          </p>
        )}
      </div>
    </Link>
  );
}