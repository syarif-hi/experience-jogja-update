import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

// Centered on the listing, with optional extra markers (the "Explore the area" items).
export default function LocationMap({ latitude, longitude, label, markers = [] }) {
  const { t } = useTranslation();
  if (typeof latitude !== "number" || typeof longitude !== "number") return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
        {t("detail.location") || "Location"}
      </h2>
      <div className="relative z-0 overflow-hidden rounded-2xl" style={{ height: 340, boxShadow: "var(--elevation-1)" }}>
        <MapContainer center={[latitude, longitude]} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} icon={pinIcon("#C1272D")}>
            <Popup>{label}</Popup>
          </Marker>
          {markers.filter((m) => typeof m.latitude === "number" && typeof m.longitude === "number").map((m) => (
            <Marker key={m.id} position={[m.latitude, m.longitude]} icon={pinIcon("#5B534C")}>
              <Popup>{m.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}