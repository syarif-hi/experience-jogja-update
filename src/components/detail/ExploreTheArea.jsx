import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Utensils, Plane, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { nearest, hasCoords, haversineKm, estimateDriveMinutes } from "@/lib/distance";
import { TRANSIT_POINTS } from "@/lib/transit-reference-points";
import SmartImage from "@/components/shared/SmartImage";

function Row({ to, image, name, distanceKm, driveMin }) {
  const inner = (
    <>
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <SmartImage src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{name}</p>
        <p className="text-[12px] font-mono-num" style={{ color: "var(--text-secondary)" }}>
          {distanceKm.toFixed(1)} km · ~{driveMin} min approx.
        </p>
      </div>
    </>
  );
  const cls = "flex items-center gap-3 rounded-xl p-2 transition-colors";
  if (to) {
    return <Link to={to} className={`focus-ring ${cls} hover:bg-[var(--bg-surface-alt)]`}>{inner}</Link>;
  }
  return <div className={cls}>{inner}</div>;
}

export default function ExploreTheArea({ origin }) {
  const { t, language } = useTranslation();
  const [dests, setDests] = useState([]);
  const [tab, setTab] = useState("attractions");
  const [openMobile, setOpenMobile] = useState("attractions");

  useEffect(() => {
    base44.entities.Destination.list().then(setDests).catch(() => setDests([]));
  }, []);

  if (!hasCoords(origin)) return null;

  const nm = (r) => (language === "id" ? r.name_id : r.name_en);

  const attractions = nearest(origin, dests.filter((d) => d.category !== "eat-drink"), { limit: 6, excludeId: origin.id });
  const eats = nearest(origin, dests.filter((d) => d.category === "eat-drink"), { limit: 6, excludeId: origin.id });
  const transit = TRANSIT_POINTS
    .map((p) => {
      const distanceKm = haversineKm(origin.latitude, origin.longitude, p.latitude, p.longitude);
      return { ...p, distanceKm, driveMin: estimateDriveMinutes(distanceKm) };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const groups = [
    { key: "attractions", label: t("explore.attractions") || "Nearby Attractions", Icon: MapPin,
      rows: attractions.map((d) => ({ key: d.id, to: `/destinations/${d.slug}`, image: d.hero_image_url, name: nm(d), distanceKm: d.distanceKm, driveMin: d.driveMin })) },
    { key: "eat", label: t("explore.eat") || "Where to Eat", Icon: Utensils,
      rows: eats.map((d) => ({ key: d.id, to: `/destinations/${d.slug}`, image: d.hero_image_url, name: nm(d), distanceKm: d.distanceKm, driveMin: d.driveMin })) },
    { key: "transit", label: t("explore.gettingThere") || "Getting There", Icon: Plane,
      rows: transit.map((p) => ({ key: p.id, to: null, image: p.image_url, name: language === "id" ? p.name_id : p.name_en, distanceKm: p.distanceKm, driveMin: p.driveMin })) },
  ].filter((g) => g.rows.length > 0);

  if (groups.length === 0) return null;

  const active = groups.find((g) => g.key === tab) || groups[0];

  return (
    <section className="mt-10">
      <h2 className="mb-4 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
        {t("explore.title") || "Explore the area"}
      </h2>

      {/* Desktop: tabs */}
      <div className="hidden md:block">
        <div className="mb-4 inline-flex gap-1 rounded-xl p-1" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
          {groups.map((g) => {
            const on = active.key === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setTab(g.key)}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors"
                style={{ backgroundColor: on ? "var(--color-primary)" : "transparent", color: on ? "var(--on-primary)" : "var(--text-secondary)" }}
              >
                <g.Icon className="h-4 w-4" /> {g.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          {active.rows.map((r) => <Row key={r.key} {...r} />)}
        </div>
      </div>

      {/* Mobile: accordion */}
      <div className="space-y-2 md:hidden">
        {groups.map((g) => {
          const on = openMobile === g.key;
          return (
            <div key={g.key} className="overflow-hidden rounded-xl" style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-1)" }}>
              <button
                type="button"
                onClick={() => setOpenMobile(on ? "" : g.key)}
                className="focus-ring flex w-full items-center justify-between px-4 py-3 text-[14px] font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                <span className="inline-flex items-center gap-2"><g.Icon className="h-4 w-4" style={{ color: "var(--color-primary)" }} /> {g.label}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${on ? "rotate-180" : ""}`} />
              </button>
              {on && <div className="px-2 pb-2">{g.rows.map((r) => <Row key={r.key} {...r} />)}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}