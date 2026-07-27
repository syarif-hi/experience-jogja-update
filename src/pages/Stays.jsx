import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { regencyLabel } from "@/lib/regencies";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import { DUMMY_STAYS } from "@/lib/dummyData";

export default function Stays({ hideShell }) {
  const { t, language } = useTranslation();
  const { currency } = useCurrency();
  const [items, setItems] = useState(null);

  useEffect(() => {
    base44.entities.Stay.list("-is_featured").then(setItems).catch(() => setItems([]));
  }, []);

  const displayItems = items?.length === 0 ? DUMMY_STAYS : items;

  return (
    <PageShell
      title={t("stays.title") || "Places to Stay"}
      subtitle={t("stays.subtitle") || "Hotels and accommodations across the special region of Yogyakarta."}
      hideShell={hideShell}
    >
      <div className={hideShell ? "pt-2" : "content-wrap"}>
        <div className="mt-8 grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayItems === null ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
            ))
          ) : displayItems.length === 0 ? (
            <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>{t("empty.none")}</p>
          ) : (
            displayItems.map((s) => {
              const name = language === "id" ? s.name_id : s.name_en;
              return (
                <Link key={s.id} to={`/stays/${s.slug}`} className="group focus-ring block rounded-2xl">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    <SmartImage src={s.hero_image_url} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="pt-3">
                    {s.star_rating && (
                      <span className="inline-flex items-center gap-0.5 text-[12px]" style={{ color: "var(--color-accent)" }}>
                        {Array.from({ length: s.star_rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                      </span>
                    )}
                    <h3 className="mt-1 truncate text-[15px] font-bold" style={{ color: "var(--color-primary)" }}>{name}</h3>
                    <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{regencyLabel(s.regency, language)}</p>
                    {typeof s.price_idr_per_night === "number" && (
                      <p className="mt-1 text-[13px] font-semibold" style={{ color: "var(--color-primary)" }}>
                        {formatPrice(s.price_idr_per_night, currency)} {t("stay.perNight") || "/ night"}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </PageShell>
  );
}