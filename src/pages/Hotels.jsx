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
import CatalogFilters from "@/components/shared/CatalogFilters";
import { DUMMY_STAYS } from "@/lib/dummyData";

export default function Hotels({ hideShell }) {
  const { language } = useTranslation();
  const { currency } = useCurrency();
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (base44.entities.Hotel) {
      base44.entities.Hotel.list().then(setItems).catch(() => {
        if (base44.entities.Stay) {
          base44.entities.Stay.list().then(setItems).catch(() => setItems([]));
        } else {
          setItems([]);
        }
      });
    } else if (base44.entities.Stay) {
      base44.entities.Stay.list().then(setItems).catch(() => setItems([]));
    } else {
      setItems([]);
    }
  }, []);

  const displayItems = items === null ? null : (items.length === 0 ? DUMMY_STAYS : items);

  return (
    <PageShell
      title={language === "id" ? "Hotel & Akomodasi" : "Hotels & Accommodations"}
      subtitle={language === "id" ? "Temukan tempat menginap terbaik." : "Find the best places to stay."}
      hideShell={hideShell}
    >
      <div className={hideShell ? "pt-2" : "content-wrap"}>
        <CatalogFilters
          items={displayItems}
          priceKey="price_idr_per_night"
          ratingKey="star_rating"
          searchPlaceholder={{
            en: "Search hotels, resorts, guesthouses...",
            id: "Cari hotel, resort, penginapan...",
          }}
        >
          {(list) => (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((s) => {
                const name = language === "id" ? s.name_id : s.name_en;
                return (
                  <Link key={s.id} to={`/hotels/${s.slug}`} className="group focus-ring block rounded-2xl">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                      <SmartImage src={s.hero_image_url} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="pt-3">
                      <h3 className="mt-1 truncate text-[15px] font-bold" style={{ color: "var(--color-primary)" }}>{name}</h3>
                      <p className="flex items-center gap-1 text-[13px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        {regencyLabel(s.regency, language)}
                        {s.star_rating && (
                          <span className="inline-flex items-center ml-1">
                            <Star className="h-3 w-3 mr-0.5 fill-current text-yellow-400" />
                            {s.star_rating}
                          </span>
                        )}
                      </p>
                      {typeof s.price_idr_per_night === "number" && (
                        <p className="mt-1 text-[13px] font-semibold" style={{ color: "var(--color-primary)" }}>
                          {formatPrice(s.price_idr_per_night, currency)} <span className="font-normal" style={{ color: "var(--text-secondary)" }}>/ {language === "id" ? "malam" : "night"}</span>
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CatalogFilters>
      </div>
    </PageShell>
  );
}
