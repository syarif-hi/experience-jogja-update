import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import DestinationCard from "@/components/shared/DestinationCard";
import LocationMap from "@/components/detail/LocationMap";
import Breadcrumb from "@/components/shared/Breadcrumb";
import InteractiveMapsSection from "@/components/home/InteractiveMapsSection";

export default function ItineraryDetail({ hideShell }) {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const [it, setIt] = useState(undefined);
  const [destMap, setDestMap] = useState({});
  const [allItineraries, setAllItineraries] = useState([]);

  useEffect(() => {
    setIt(undefined);
    base44.entities.Itinerary.filter({ slug }).then((r) => setIt(r[0] || null)).catch(() => setIt(null));
  }, [slug]);

  useEffect(() => {
    base44.entities.Itinerary.list("duration_days").then((r) => setAllItineraries(r || [])).catch(() => setAllItineraries([]));
  }, []);

  useEffect(() => {
    base44.entities.Destination.list().then((all) => {
      const map = {};
      all.forEach((d) => { map[d.id] = d; });
      setDestMap(map);
    }).catch(() => {});
  }, []);

  const title = it && (language === "id" ? it.title_id : it.title_en);
  const summary = it && (language === "id" ? it.summary_id : it.summary_en);
  const intro = it && (language === "id" ? it.intro_id : it.intro_en);
  const days = ((it && it.day_plan) || []).slice().sort((a, b) => (a.day_number || 0) - (b.day_number || 0));

  const breadcrumbItems = [
    { label: language === "id" ? "Rencanakan Perjalanan" : "Plan Your Trip", to: "/plan-your-trip" },
    { label: t("itineraries.title") || "Sample Itineraries", to: "/plan-your-trip/itineraries" },
    ...(title ? [{ label: title }] : []),
  ];

  // Ordered stops across every day, resolved to destinations that carry coordinates.
  const mapMarkers = days.flatMap((day) =>
    (day.destination_ids || [])
      .map((id) => destMap[id])
      .filter((d) => d && typeof d.latitude === "number" && typeof d.longitude === "number")
      .map((d) => ({
        id: d.id,
        latitude: d.latitude,
        longitude: d.longitude,
        name: `${language === "id" ? d.name_id : d.name_en}`,
      }))
  );

  const content = (
    <div className={hideShell ? "pt-2" : "content-wrap py-8"}>
      <Breadcrumb items={breadcrumbItems} />

      {it === undefined ? (
        <div className="aspect-[21/9] animate-pulse rounded-2xl mt-6" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
      ) : it === null ? (
        <p className="text-[15px] mt-6" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-6 rounded-2xl p-4" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
              <h3 className="font-heading text-[14px] font-bold mb-4 px-3" style={{ color: "var(--text-secondary)" }}>
                {language === "id" ? "Semua Itinerary" : "All Itineraries"}
              </h3>
              <nav className="space-y-1">
                {allItineraries.map((item) => {
                  const isActive = item.slug === slug;
                  return (
                    <Link
                      key={item.slug}
                      to={`/plan-your-trip/itineraries/${item.slug}`}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl transition-colors duration-200 group"
                      style={{
                        backgroundColor: isActive ? "var(--bg-surface)" : "transparent",
                        color: isActive ? "var(--color-primary)" : "var(--text-secondary)"
                      }}
                    >
                      <Calendar className="w-5 h-5 shrink-0" />
                      <span className="font-medium text-[14px]">{language === "id" ? item.title_id : item.title_en}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <article className="flex flex-col pb-12 w-full animate-in fade-in duration-500">
              {it.cover_image_url && (
                <figure
                  className="rounded-2xl overflow-hidden mb-4 md:mb-8"
                  style={{ backgroundColor: "var(--bg-surface-alt)" }}
                >
                  <div className="w-full aspect-[16/9] md:aspect-[32/9] overflow-hidden">
                    <SmartImage
                      src={it.cover_image_url}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </figure>
              )}

          <div className="mb-6">
            <h1 className="mb-2 font-heading text-[32px] font-bold md:text-[42px]" style={{ color: "var(--color-primary)" }}>
              {title}
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "var(--color-accent)" }}>
              <Calendar className="h-4 w-4" /> {it.duration_days} {t("itineraries.days") || "days"}
            </span>
            {summary && <p className="mt-2 max-w-none text-lg" style={{ color: "var(--text-secondary)" }}>{summary}</p>}
          </div>

          {intro && (
            <p className="mb-2 text-[16px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {intro}
            </p>
          )}

          {mapMarkers.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 flex items-center gap-2 font-heading text-2xl font-bold mt-10" style={{ color: "var(--color-primary)" }}>
                <MapPin className="h-5 w-5" style={{ color: "var(--color-accent)" }} />
                {t("itineraries.tripMap") || "Trip Map"}
              </h2>
              <LocationMap
                markers={mapMarkers}
                numbered
                fitToMarkers
                hideHeader
                height={420}
              />
              <p className="mt-2 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                {t("itineraries.mapHint") || "Numbered pins follow the order of stops across all days."}
              </p>
            </div>
          )}

          <div className="mt-10 space-y-12">
            {days.map((day) => {
              const dayTitle = language === "id" ? day.title_id : day.title_en;
              const dayIntro = language === "id" ? day.intro_id : day.intro_en;
              const dests = (day.destination_ids || []).map((id) => destMap[id]).filter(Boolean);
              return (
                <div key={day.day_number}>
                  <div className="flex items-center gap-3 mt-10 mb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-bold" style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}>
                      {day.day_number}
                    </span>
                    <h2 className="font-heading text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                      {t("itineraries.day") || "Day"} {day.day_number}{dayTitle ? ` · ${dayTitle}` : ""}
                    </h2>
                  </div>
                  {dayIntro && (
                    <p className="mb-4 text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {dayIntro}
                    </p>
                  )}
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {dests.map((d) => <DestinationCard key={d.id} destination={d} />)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16">
            <InteractiveMapsSection disableWrap={true} />
          </div>
            </article>
          </main>
        </div>
      )}
    </div>
  );

  if (hideShell) return content;
  return <PageShell>{content}</PageShell>;
}