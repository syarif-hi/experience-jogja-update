import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Car } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import CatalogFilters from "@/components/shared/CatalogFilters";
import { DUMMY_TRANSPORTATION } from "@/lib/dummyData";

const TYPE_FILTER = {
  key: "type",
  label_en: "Type:",
  label_id: "Jenis:",
  values: [
    { value: "shuttle", label_en: "Shuttle", label_id: "Shuttle" },
    { value: "rental", label_en: "Rental", label_id: "Sewa" },
    { value: "taxi", label_en: "Taxi", label_id: "Taksi" },
  ],
};

export default function Transportation({ hideShell }) {
  const { language } = useTranslation();
  const { currency } = useCurrency();
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (base44.entities.Transportation) {
      base44.entities.Transportation.list().then(setItems).catch(() => setItems([]));
    } else {
      setItems([]);
    }
  }, []);

  const displayItems = items === null ? null : (items.length === 0 ? DUMMY_TRANSPORTATION : items);

  return (
    <PageShell
      title={language === "id" ? "Layanan Transportasi" : "Transportation Services"}
      subtitle={language === "id" ? "Sewa kendaraan atau pesan shuttle." : "Rent vehicles or book a shuttle."}
      hideShell={hideShell}
    >
      <div className={hideShell ? "pt-2" : "content-wrap"}>
        <CatalogFilters
          items={displayItems}
          priceKey="price_idr"
          hideRegion
          extraFilter={TYPE_FILTER}
          searchPlaceholder={{
            en: "Search shuttle, rental, driver...",
            id: "Cari shuttle, sewa, sopir...",
          }}
        >
          {(list) => (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((s) => {
                const name = language === "id" ? s.name_id : s.name_en;
                return (
                  <Link key={s.id} to={`/transportation/${s.slug}`} className="group focus-ring block rounded-2xl">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl relative">
                      <SmartImage src={s.hero_image_url} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {s.type && (
                        <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-md uppercase tracking-wider flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          {s.type}
                        </span>
                      )}
                    </div>
                    <div className="pt-3">
                      <h3 className="mt-1 truncate text-[15px] font-bold" style={{ color: "var(--color-primary)" }}>{name}</h3>
                      {typeof s.price_idr === "number" && (
                        <p className="mt-1 text-[13px] font-semibold" style={{ color: "var(--color-primary)" }}>
                          {formatPrice(s.price_idr, currency)}
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
