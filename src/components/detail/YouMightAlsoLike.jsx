import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import HScrollStrip from "@/components/home/HScrollStrip";
import DestinationCard from "@/components/shared/DestinationCard";

// Reuses the existing DestinationCard, filtered to the same category or regency.
export default function YouMightAlsoLike({ category, regency, excludeSlug }) {
  const { t } = useTranslation();
  const [items, setItems] = useState(null);

  useEffect(() => {
    let active = true;
    const query = category ? { category } : regency ? { regency } : null;
    if (!query) { setItems([]); return; }
    base44.entities.Destination.filter(query, "display_order", 10).then((res) => {
      if (active) setItems(res.filter((d) => d.slug !== excludeSlug).slice(0, 8));
    }).catch(() => active && setItems([]));
    return () => { active = false; };
  }, [category, regency, excludeSlug]);

  if (items !== null && items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 font-heading text-[24px] font-bold" style={{ color: "var(--color-primary)" }}>
        {t("detail.alsoLike") || "You might also like"}
      </h2>
      <HScrollStrip rows={2}>
        {items === null
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] w-[280px] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
            ))
          : items.map((d) => <DestinationCard key={d.id} destination={d} />)}
      </HScrollStrip>
    </section>
  );
}