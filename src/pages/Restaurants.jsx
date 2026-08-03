import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { regencyLabel } from "@/lib/regencies";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import { DUMMY_RESTAURANTS } from "@/lib/dummyData";

export default function Restaurants({ hideShell }) {
  const { t, language } = useTranslation();
  const { currency } = useCurrency();
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (base44.entities.Restaurant) {
      base44.entities.Restaurant.list().then(setItems).catch(() => setItems([]));
    } else {
      setItems([]);
    }
  }, []);

  const displayItems = items?.length === 0 ? DUMMY_RESTAURANTS : items;

  return (
    <PageShell
      title={language === 'id' ? 'Restoran & Kuliner' : 'Restaurants & Dining'}
      subtitle={language === 'id' ? 'Cicipi kelezatan kuliner lokal dan internasional.' : 'Taste delicious local and international cuisines.'}
      hideShell={hideShell}
    >
      <div className={hideShell ? "pt-2" : "content-wrap"}>
        <div className="mt-8 grid grid-cols-2 gap-4 pb-16 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {displayItems === null ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
            ))
          ) : displayItems.length === 0 ? (
            <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>{t("empty.none") || "No items found."}</p>
          ) : (
            displayItems.map((s) => {
              const name = language === "id" ? s.name_id : s.name_en;
              return (
                <Link key={s.id} to={`/restaurants/${s.slug}`} className="group focus-ring block rounded-2xl">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    <SmartImage src={s.hero_image_url} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="pt-3">
                    <h3 className="mt-1 truncate text-[15px] font-bold" style={{ color: "var(--color-primary)" }}>{name}</h3>
                    <p className="flex items-center gap-1 text-[13px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      <UtensilsCrossed className="h-3 w-3" />
                      <span className="capitalize">{s.cuisine}</span>
                    </p>
                    <p className="flex items-center gap-1 text-[13px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      {regencyLabel(s.regency, language)}
                      {s.price_range && <span className="ml-1 text-green-600 font-medium">{s.price_range}</span>}
                    </p>
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
