import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import DestinationCard from "@/components/shared/DestinationCard";

export default function ItineraryDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const [it, setIt] = useState(undefined);
  const [destMap, setDestMap] = useState({});

  useEffect(() => {
    setIt(undefined);
    base44.entities.Itinerary.filter({ slug }).then((r) => setIt(r[0] || null)).catch(() => setIt(null));
  }, [slug]);

  useEffect(() => {
    base44.entities.Destination.list().then((all) => {
      const map = {};
      all.forEach((d) => { map[d.id] = d; });
      setDestMap(map);
    }).catch(() => {});
  }, []);

  const title = it && (language === "id" ? it.title_id : it.title_en);
  const summary = it && (language === "id" ? it.summary_id : it.summary_en);
  const days = (it && it.day_plan) || [];

  return (
    <PageShell>
      <div className="content-wrap py-8">
        <Link to="/itineraries" className="focus-ring mb-6 inline-flex items-center gap-1.5 rounded text-[14px] font-semibold" style={{ color: "var(--color-primary)" }}>
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>

        {it === undefined ? (
          <div className="aspect-[21/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
        ) : it === null ? (
          <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
        ) : (
          <>
            <div className="aspect-[21/9] max-h-[380px] overflow-hidden rounded-2xl">
              <SmartImage src={it.cover_image_url} alt={title} className="h-full w-full object-cover" />
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "var(--color-accent)" }}>
              <Calendar className="h-4 w-4" /> {it.duration_days} {t("itineraries.days") || "days"}
            </span>
            <h1 className="mt-1 font-display text-[30px] font-bold md:text-[40px]" style={{ color: "var(--color-primary)" }}>{title}</h1>
            {summary && <p className="mt-2 max-w-2xl text-[16px]" style={{ color: "var(--text-secondary)" }}>{summary}</p>}

            <div className="mt-10 space-y-12">
              {days.sort((a, b) => (a.day_number || 0) - (b.day_number || 0)).map((day) => {
                const dayTitle = language === "id" ? day.title_id : day.title_en;
                const dests = (day.destination_ids || []).map((id) => destMap[id]).filter(Boolean);
                return (
                  <div key={day.day_number}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-bold" style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}>
                        {day.day_number}
                      </span>
                      <h2 className="font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
                        {t("itineraries.day") || "Day"} {day.day_number}{dayTitle ? ` · ${dayTitle}` : ""}
                      </h2>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {dests.map((d) => <DestinationCard key={d.id} destination={d} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}