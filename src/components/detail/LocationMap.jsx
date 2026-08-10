import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useTranslation } from "@/lib/i18n";

// Divicon pin so we don't depend on Leaflet's default marker image assets.
const pinIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<span style="display:block;width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};box-shadow:0 1px 4px rgba(0,0,0,0.4);"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
  });

// Numbered pin for ordered stops (e.g. an itinerary route).
const numberedIcon = (color, n) =>
  L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};box-shadow:0 1px 4px rgba(0,0,0,0.4);border:2px solid #fff;"><span style="transform:rotate(45deg);color:#fff;font-size:12px;font-weight:700;line-height:1;">${n}</span></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });

// Fits the map viewport to all provided points once on mount/update.
function FitBounds({ points }) {
  const map = useMap();
  React.useEffect(() => {
    if (!points || points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 12 });
  }, [map, points]);
  return null;
}

// Centered on the listing, with optional extra markers (the "Explore the area" items).
// When `numbered` is true, markers render as sequential numbered pins and the
// viewport auto-fits to include every point (used by the itinerary trip map).
export default function LocationMap({
  latitude,
  longitude,
  label,
  markers = [],
  hideHeader = false,
  numbered = false,
  height = 340,
  fitToMarkers = false,
}) {
  const { t } = useTranslation();

  const hasCenter = typeof latitude === "number" && typeof longitude === "number";
  const validMarkers = markers.filter(
    (m) => typeof m.latitude === "number" && typeof m.longitude === "number"
  );
  if (!hasCenter && validMarkers.length === 0) return null;

  const center = hasCenter ? [latitude, longitude] : [validMarkers[0].latitude, validMarkers[0].longitude];
  const boundsPoints = [
    ...(hasCenter && !fitToMarkers ? [center] : []),
    ...validMarkers.map((m) => [m.latitude, m.longitude]),
  ];

  return (
    <section className={hideHeader ? "" : "mt-10"}>
      {!hideHeader && (
        <h2 className="mb-4 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
          {t("detail.location") || "Location"}
        </h2>
      )}
      <div className="relative z-0 overflow-hidden rounded-2xl" style={{ height, boxShadow: "var(--elevation-1)" }}>
        <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hasCenter && !fitToMarkers && (
            <Marker position={center} icon={pinIcon("#C1272D")}>
              <Popup>{label}</Popup>
            </Marker>
          )}
          {validMarkers.map((m, i) => (
            <Marker
              key={m.id}
              position={[m.latitude, m.longitude]}
              icon={numbered ? numberedIcon("#C1272D", i + 1) : pinIcon("#5B534C")}
            >
              <Popup>{m.name}</Popup>
            </Marker>
          ))}
          {(fitToMarkers || boundsPoints.length > 1) && <FitBounds points={boundsPoints} />}
        </MapContainer>
      </div>
    </section>
  );
}