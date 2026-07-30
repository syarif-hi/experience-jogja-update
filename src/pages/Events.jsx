import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { format, parseISO } from "date-fns";
import PageShell from "@/components/layout/PageShell";
import EventCard from "@/components/shared/EventCard";
import { DUMMY_EVENTS } from "@/lib/dummyData";

const EVENT_TYPES = [
  { value: "festival", label_en: "Festival", label_id: "Festival" },
  { value: "cultural-performance", label_en: "Cultural Performance", label_id: "Pertunjukan Budaya" },
  { value: "exhibition", label_en: "Exhibition", label_id: "Pameran" },
  { value: "sports", label_en: "Sports", label_id: "Olahraga" },
  { value: "other", label_en: "Other", label_id: "Lainnya" },
];

export default function Events({ hideShell }) {
  const { t, language } = useTranslation();
  const [items, setItems] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const view = params.get("view"); // "calendar" = group by month

  useEffect(() => {
    base44.entities.Event.list("start_date").then(setItems).catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    let list = items.length === 0 ? DUMMY_EVENTS : items;
    return type ? list.filter((e) => e.event_type === type) : list;
  }, [items, type]);

  // Group by month for the simple calendar view.
  const byMonth = useMemo(() => {
    if (!filtered) return null;
    const groups = {};
    filtered.forEach((e) => {
      const key = e.start_date ? format(parseISO(e.start_date), "MMMM yyyy") : "—";
      (groups[key] = groups[key] || []).push(e);
    });
    return groups;
  }, [filtered]);

  const typeLabel = type ? (EVENT_TYPES.find((x) => x.value === type)?.[language === "id" ? "label_id" : "label_en"] || type) : null;
  const title = typeLabel || t("events.title");
  const subtitle = view === "calendar"
    ? (language === "id" ? "Acara dikelompokkan berdasarkan bulan" : "Events grouped by month")
    : t("events.pageSubtitle");

  return (
    <PageShell title={title} subtitle={subtitle} hideShell={hideShell}>
      <div className={hideShell ? "pt-2" : "content-wrap"}>
        {filtered === null ? (
          <div className="mt-8 grid grid-cols-2 gap-4 pb-16 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-8 text-[14px]" style={{ color: "var(--text-secondary)" }}>{t("empty.none")}</p>
        ) : view === "calendar" ? (
          <div className="mt-8 space-y-10 pb-16">
            {Object.entries(byMonth).map(([month, evs]) => (
              <div key={month}>
                <h2 className="mb-4 font-heading text-[20px] font-bold" style={{ color: "var(--color-primary)" }}>{month}</h2>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                  {evs.map((e) => <EventCard key={e.id} event={e} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 pb-16 sm:gap-6 lg:grid-cols-3">
            {filtered.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </div>
    </PageShell>
  );
}