import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { regencyLabel } from "@/lib/regencies";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import CatalogFilters from "@/components/shared/CatalogFilters";
import { DUMMY_RESTAURANTS } from "@/lib/dummyData";

const CUISINE_FILTER = {
  key: "cuisine",
  label_en: "Cuisine:",
  label_id: "Masakan:",
  values: [
    { value: "javanese", label_en: "Javanese", label_id: "Jawa" },
    { value: "indonesian", label_en: "Indonesian", label_id: "Indonesia" },
    { value: "international", label_en: "International", label_id: "Internasional" },
    { value: "cafe", label_en: "Cafe & Coffee", label_id: "Kafe & Kopi" },
  ],
};

export default function Restaurants({ hideShell }) {
  const { language } = useTranslation();
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (base44.entities.Restaurant) {
      base44.entities.Restaurant.list().then(setItems).catch(() => setItems([]));
    } else {
      setItems([]);
    }
  }, []);

  const displayItems = items === null ? null : (items.length === 0 ? DUMMY_RESTAURANTS : items);

  return (
    <PageShell
      title={language === "id" ? "Restoran & Kuliner" : "Restaurants & Dining"}
      subtitle={language === "id" ? "Cicipi kelezatan kuliner lokal dan internasional." : "Taste delicious local and international cuisines."}
      hideShell={hideShell}
    >
      <div className={hideShell ? "pt-2" : "content-wrap"}>
        <CatalogFilters
          items={displayItems}
          extraFilter={CUISINE_FILTER}
          searchPlaceholder={{
            en: "Search restaurants, warungs, cafes...",
            id: "Cari restoran, warung, kafe...",
          }}
        >
          {(list) => (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((s) => {
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
              })}
            </div>
          )}
        </CatalogFilters>
      </div>
    </PageShell>
  );
}
