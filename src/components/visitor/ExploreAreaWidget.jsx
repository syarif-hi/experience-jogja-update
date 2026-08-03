import React from "react";
import { useTranslation } from "@/lib/i18n";
import { MapPin, Plane, ChevronRight } from "lucide-react";
import SmartImage from "@/components/shared/SmartImage";

/**
 * "Explore the Area" widget — shows a static map image and a list of nearby places
 * with icons and distances. Inspired by hotel/travel listing UIs.
 * 
 * Props:
 *   nearbyPlaces: Array of { name, distance, type: "landmark"|"airport" }
 *   mapImage: string URL for static map image
 *   compact: boolean — when true, renders without outer margin (for grid placement)
 */
export default function ExploreAreaWidget({ nearbyPlaces, mapImage, compact }) {
  const { language } = useTranslation();

  if (!nearbyPlaces || nearbyPlaces.length === 0) return null;

  return (
    <section className={compact ? "" : "mt-8 rounded-2xl"}>
      {!compact && (
        <h2 className="mb-4 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
          {language === "id" ? "Jelajahi Sekitar" : "Explore the area"}
        </h2>
      )}
      {compact && (
        <h3 className="mb-4 font-heading text-[18px] font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <MapPin className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          {language === "id" ? "Jelajahi Sekitar" : "Explore the area"}
        </h3>
      )}

      {/* Map Image Button / Thumbnail */}
      {mapImage && (
        <button 
          type="button" 
          className={`focus-ring mb-6 block w-full rounded-xl transition-transform hover:scale-[1.01] overflow-hidden ${compact ? "aspect-[2/1]" : "aspect-[16/9]"}`}
          style={{ backgroundColor: "var(--bg-surface-alt)" }}
        >
          <SmartImage
            src={mapImage}
            alt="Area map"
            className="w-full h-full object-cover"
          />
        </button>
      )}

      {/* Nearby Places List */}
      <ul className="space-y-4">
        {nearbyPlaces.map((place, idx) => {
          const isAirport = place.type === "airport";
          const IconComponent = isAirport ? Plane : MapPin;

          return (
            <li key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <IconComponent className="h-[22px] w-[22px] shrink-0" style={{ color: "var(--text-secondary)" }} strokeWidth={1.5} />
                <span className="truncate text-[15px]" style={{ color: "var(--text-primary)" }}>
                  {place.name}
                </span>
              </div>
              <span className="ml-4 shrink-0 text-[14px]" style={{ color: "var(--text-secondary)" }}>
                {place.distance}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Footer Link */}
      <button
        type="button"
        className="focus-ring mt-6 inline-flex items-center gap-1 text-[15px] font-semibold hover:underline"
        style={{ color: "var(--color-primary)" }}
      >
        {language === "id" ? "Lihat semua tentang area ini" : "See all about this area"} <ChevronRight className="h-4 w-4" />
      </button>
    </section>
  );
}
