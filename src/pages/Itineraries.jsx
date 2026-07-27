import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import { DUMMY_ITINERARIES } from "@/lib/dummyData";

export default function Itineraries({ hideShell }) {
  const { t, language } = useTranslation();
  const [items, setItems] = useState(null);

  useEffect(() => {
    base44.entities.Itinerary.list("duration_days").then(setItems).catch(() => setItems([]));
  }, []);

  const displayItems = items?.length === 0 ? DUMMY_ITINERARIES : items;

  return (
    <PageShell
      title={t("itineraries.title") || "Sample Itineraries"}
      subtitle={t("itineraries.subtitle") || "Ready-made trip plans to inspire your journey through Jogja."}
      hideShell={hideShell}
    >
      <div className={hideShell ? "pt-2" : "content-wrap"}>
        <div className="mt-8 grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems === null ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
            ))
          ) : displayItems.length === 0 ? (
            <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>{t("empty.none")}</p>
          ) : (
            displayItems.map((it) => {
              const title = language === "id" ? it.title_id : it.title_en;
              const summary = language === "id" ? it.summary_id : it.summary_en;
              return (
                <Link key={it.id} to={`/itineraries/${it.slug}`} className="group focus-ring block rounded-2xl">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    <SmartImage src={it.cover_image_url} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="pt-3">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--color-accent)" }}>
                      <Calendar className="h-3.5 w-3.5" /> {it.duration_days} {t("itineraries.days") || "days"}
                    </span>
                    <h3 className="mt-1 text-[17px] font-bold" style={{ color: "var(--color-primary)" }}>{title}</h3>
                    <p className="mt-1 line-clamp-2 text-[14px]" style={{ color: "var(--text-secondary)" }}>{summary}</p>
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