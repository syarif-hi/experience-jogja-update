import React, { useEffect } from "react";
import { X, MapPin, Navigation, Car, Train, Utensils, Plane } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { nearest, haversineKm, estimateDriveMinutes } from "@/lib/distance";
import { TRANSIT_POINTS } from "@/lib/transit-reference-points";
import SmartImage from "@/components/shared/SmartImage";
import LocationMap from "./LocationMap";

export default function ExploreTheAreaModal({ origin, onClose, dests }) {
  const { t, language } = useTranslation();

  // Handle escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const nm = (r) => (language === "id" ? r.name_id : r.name_en);

  const attractions = nearest(origin, dests.filter((d) => d.category !== "eat-drink"), { limit: 5, excludeId: origin.id });
  const eats = nearest(origin, dests.filter((d) => d.category === "eat-drink"), { limit: 5, excludeId: origin.id });
  const transit = TRANSIT_POINTS
    .map((p) => {
      const distanceKm = haversineKm(origin.latitude, origin.longitude, p.latitude, p.longitude);
      return { ...p, distanceKm, driveMin: estimateDriveMinutes(distanceKm) };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const previewImages = [...attractions, ...eats].slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div 
        className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" 
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>Explore the area</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" style={{ color: "var(--text-primary)" }} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Top gallery */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {previewImages.map((d, i) => (
              <div key={d.id} className="group relative overflow-hidden rounded-xl">
                <div className="aspect-[4/3] w-full bg-gray-100">
                  <SmartImage src={d.hero_image_url} alt={nm(d)} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="mt-2">
                  <h3 className="truncate text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{nm(d)}</h3>
                  <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{d.driveMin} min drive</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map Preview */}
          <div className="mb-8 rounded-xl overflow-hidden border">
             <LocationMap latitude={origin.latitude} longitude={origin.longitude} label={nm(origin)} markers={[...attractions, ...eats]} hideHeader={true} />
          </div>

          <div className="mb-8">
            <h3 className="mb-2 font-heading text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>About the area</h3>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Located in {origin.address || "the heart of the city"}, this area is home to {origin.name_en || origin.name}. 
              {attractions.length > 0 && ` ${nm(attractions[0])} and ${nm(attractions[1] || attractions[0])} are worth visiting if sightseeing is on the agenda.`}
              {eats.length > 0 && ` Ready for a bite? Consider ${nm(eats[0])}.`}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            
            {/* What's nearby */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" style={{ color: "var(--text-primary)" }} />
                <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>What's nearby</h4>
              </div>
              <ul className="space-y-3">
                {attractions.map(d => (
                  <li key={d.id} className="flex justify-between text-[14px]">
                    <span style={{ color: "var(--text-secondary)" }}>{nm(d)}</span>
                    <span style={{ color: "var(--text-primary)" }}>{d.driveMin} min drive</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Getting around */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Car className="h-5 w-5" style={{ color: "var(--text-primary)" }} />
                <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>Getting around</h4>
              </div>
              <ul className="space-y-3">
                {transit.map(p => (
                  <li key={p.id} className="flex justify-between text-[14px]">
                    <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                      {p.type === 'airport' ? <Plane className="h-4 w-4" /> : <Train className="h-4 w-4" />}
                      <span>{language === "id" ? p.name_id : p.name_en}</span>
                    </div>
                    <span style={{ color: "var(--text-primary)" }}>{p.driveMin} min drive</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Restaurants */}
            {eats.length > 0 && (
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center gap-2">
                  <Utensils className="h-5 w-5" style={{ color: "var(--text-primary)" }} />
                  <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>Restaurants</h4>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {eats.map(d => (
                    <div key={d.id} className="flex justify-between text-[14px]">
                      <span style={{ color: "var(--text-secondary)" }}>{nm(d)}</span>
                      <span style={{ color: "var(--text-primary)" }}>{d.driveMin} min drive</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
