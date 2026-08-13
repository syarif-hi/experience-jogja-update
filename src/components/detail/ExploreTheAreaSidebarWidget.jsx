import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Plane, Utensils, ChevronRight, X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { nearest, hasCoords, haversineKm, estimateDriveMinutes } from "@/lib/distance";
import { TRANSIT_POINTS } from "@/lib/transit-reference-points";
import ExploreTheAreaModal from "./ExploreTheAreaModal";

const pinIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#C1272D;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 18],
});

function StaticMapImage({ latitude, longitude }) {
  return (
    <div className="relative h-[200px] w-full overflow-hidden rounded-xl">
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude]} icon={pinIcon} />
      </MapContainer>
      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-gray-700 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
      </div>
    </div>
  );
}

export default function ExploreTheAreaSidebarWidget({ origin }) {
  const { t, language } = useTranslation();
  const [dests, setDests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mapOnlyModalOpen, setMapOnlyModalOpen] = useState(false);

  useEffect(() => {
    base44.entities.Destination.list().then(setDests).catch(() => setDests([]));
  }, []);

  useEffect(() => {
    if (mapOnlyModalOpen) {
      document.body.style.overflow = "hidden";
      const onKey = (e) => {
        if (e.key === "Escape") setMapOnlyModalOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [mapOnlyModalOpen]);

  if (!hasCoords(origin)) return null;

  const nm = (r) => (language === "id" ? r.name_id : r.name_en);

  const attractions = nearest(origin, dests.filter((d) => d.category !== "eat-drink"), { limit: 2, excludeId: origin.id });
  const transit = TRANSIT_POINTS
    .map((p) => {
      const distanceKm = haversineKm(origin.latitude, origin.longitude, p.latitude, p.longitude);
      return { ...p, distanceKm, driveMin: estimateDriveMinutes(distanceKm) };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 2);

  // Combine top 2 attractions and top 2 transit for the widget preview
  const previewItems = [
    ...attractions.map(d => ({ key: d.id, name: nm(d), distance: `${d.driveMin} min drive`, icon: MapPin })),
    ...transit.map(p => ({ key: p.id, name: language === "id" ? p.name_id : p.name_en, distance: `${p.driveMin} min drive`, icon: Plane }))
  ].slice(0, 4);

  return (
    <>
      <section className="mt-8 rounded-2xl">
        <h2 className="mb-4 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
          {t("explore.title") || "Explore the area"}
        </h2>

        <button 
          type="button" 
          onClick={() => setMapOnlyModalOpen(true)}
          className="focus-ring mb-6 block w-full rounded-xl transition-transform hover:scale-[1.01]"
        >
          <StaticMapImage latitude={origin.latitude} longitude={origin.longitude} label={nm(origin)} />
        </button>

        <ul className="space-y-4">
          {previewItems.map(item => (
            <li key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <item.icon className="h-[22px] w-[22px] shrink-0" style={{ color: "var(--text-secondary)" }} strokeWidth={1.5} />
                <span className="truncate text-[15px]" style={{ color: "var(--text-primary)" }}>
                  {item.name}
                </span>
              </div>
              <span className="ml-4 shrink-0 text-[14px]" style={{ color: "var(--text-secondary)" }}>
                {item.distance}
              </span>
            </li>
          ))}
        </ul>

        <button 
          type="button"
          onClick={() => setModalOpen(true)}
          className="focus-ring mt-6 inline-flex items-center gap-1 text-[15px] font-semibold hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          See all about this area <ChevronRight className="h-4 w-4" />
        </button>
      </section>

      {modalOpen && (
        <ExploreTheAreaModal 
          origin={origin} 
          onClose={() => setModalOpen(false)} 
          dests={dests}
        />
      )}

      {mapOnlyModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={() => setMapOnlyModalOpen(false)}>
          <div className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>Location</h2>
              <button type="button" onClick={() => setMapOnlyModalOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5" style={{ color: "var(--text-primary)" }} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
               <iframe 
                  title="Map View"
                  src={`https://maps.google.com/maps?q=${origin.latitude},${origin.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                  style={{ width: "100%", height: "100%", border: 0 }} 
                  allowFullScreen
               />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
