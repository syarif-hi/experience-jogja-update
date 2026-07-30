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
    <div className={compact ? "" : "mt-14"}>
      {!compact && (
        <h2
          className="text-xl font-heading font-bold mb-5"
          style={{ color: "var(--text-primary)" }}
        >
          {language === "id" ? "Jelajahi Sekitar" : "Explore the area"}
        </h2>
      )}

      <div
        className="rounded-2xl overflow-hidden h-full"
        style={{ backgroundColor: "var(--bg-surface-alt)" }}
      >
        {/* Section title inside the card when compact */}
        {compact && (
          <div className="px-5 pt-5 pb-0">
            <h3
              className="font-heading text-lg font-bold flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <MapPin className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
              {language === "id" ? "Jelajahi Sekitar" : "Explore the area"}
            </h3>
          </div>
        )}

        {/* Map Image */}
        {mapImage && (
          <div className={`w-full overflow-hidden ${compact ? "aspect-[2/1] mt-4 mx-5 rounded-xl" : "aspect-[16/9]"}`}
            style={compact ? { width: "calc(100% - 40px)" } : undefined}
          >
            <SmartImage
              src={mapImage}
              alt="Area map"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Nearby Places List */}
        <div className="px-5 py-4">
          <div className="flex flex-col gap-0.5">
            {nearbyPlaces.map((place, idx) => {
              const isAirport = place.type === "airport";
              const IconComponent = isAirport ? Plane : MapPin;

              return (
                <div
                  key={idx}
                  className="flex items-center gap-3"
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      color: isAirport ? "var(--color-primary)" : "var(--text-secondary)",
                    }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Name */}
                  <span
                    className="flex-1 text-[14px] font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {place.name}
                  </span>

                  {/* Distance */}
                  <span
                    className="text-[13px] font-medium shrink-0"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {place.distance}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer Link */}
          <div className="pt-2 pb-1">
            <button
              className="flex items-center gap-1 text-[13px] font-semibold transition-opacity hover:opacity-80"
              style={{ color: "var(--color-primary)" }}
            >
              {language === "id" ? "Lihat semua tentang area ini" : "See all about this area"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
