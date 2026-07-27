import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ExternalLink, X, ArrowRight, Landmark, Trees, Waves, Building2, Move, Save, Loader2, Plus, Pencil, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";
import SmartImage from "@/components/shared/SmartImage";
import { useTranslation } from "@/lib/i18n";
import { base44 } from "@/api/base44Client";
import MapPlaceEditor from "@/components/home/MapPlaceEditor";
import useMapZoom from "@/components/home/useMapZoom";

// ── Illustrated graphic map background ──
// Cache-buster appended so the refreshed asset (same filename) reloads instead of serving a stale cached copy.
const MAP_BG = "https://ik.imagekit.io/ibrproject/jogja_maps_bg_compressed_2.jpg";

// ── Real place photos for the hover popover, keyed by slug ──
const PHOTOS = {
  malioboro: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&q=80",
  kraton: "https://images.unsplash.com/photo-1584810359583-96fc9f6bffb0?w=600&q=80",
  "taman-sari": "https://images.unsplash.com/photo-1577720643272-265f09367456?w=600&q=80",
  "tugu-yogyakarta": "https://images.unsplash.com/photo-1626018944638-6bebc0e0f8a5?w=600&q=80",
  "kota-gede": "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=80",
  prambanan: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&q=80",
  borobudur: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80",
  mendut: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600&q=80",
  pawon: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600&q=80",
  parangtritis: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
  indrayanti: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  "kukup-beach": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80",
  "timang-beach": "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&q=80",
  "jomblang-cave": "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80",
  "goa-pindul": "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&q=80",
  nglanggeran: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
  kalibiru: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
  kaliurang: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&q=80",
  merapi: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
};
const photoFor = (pin) => pin.photo_url || PHOTOS[pin.slug] || "";

// ── Category badge (matches reference legend): icon + color per landmark kind ──
const KINDS = {
  culture: { color: "#E07B2E", Icon: Landmark },
  nature: { color: "#4E8A3E", Icon: Trees },
  beach: { color: "#2E6FB0", Icon: Waves },
  city: { color: "#7C5AAF", Icon: Building2 },
};
// map each landmark slug to its category kind
const KIND_BY_SLUG = {
  borobudur: "culture", prambanan: "culture", mendut: "culture", pawon: "culture",
  kraton: "culture", "taman-sari": "culture", "kota-gede": "culture",
  kalibiru: "nature", kaliurang: "nature", merapi: "nature", nglanggeran: "nature",
  "jomblang-cave": "nature", "goa-pindul": "nature",
  parangtritis: "beach", indrayanti: "beach", "kukup-beach": "beach", "timang-beach": "beach", kulonprogo: "nature",
  malioboro: "city", "tugu-yogyakarta": "city", airport: "city",
};
// Dynamic places carry their own `kind`; hardcoded pins map by slug.
const kindOf = (pin) => KINDS[pin.kind || KIND_BY_SLUG[pin.slug]] || KINDS.culture;

// Zone colors (Mode 2)
const ZONES = {
  north: { label: "Northern Heritage Sites", color: "var(--tag-heritage)" },
  city: { label: "Yogyakarta City — Java Culture Heart", color: "var(--tag-culture)" },
  south: { label: "Southern Coast", color: "var(--tag-nature)" },
};

// Day colors (Mode 3)
const DAYS = {
  1: { label: "Day 1 · City Cultural Core", color: "var(--color-primary)" },
  2: { label: "Day 2 · Temple Corridor", color: "var(--tag-heritage)" },
  3: { label: "Day 3 · Volcano & Nature", color: "var(--tag-nature)" },
};

const MODES = [
  { key: "distance", label: "Distance Overview" },
  { key: "zones", label: "Grouped Areas" },
  { key: "itinerary", label: "3-Day Itinerary" },
];

function pinColor(mode, pin) {
  if (mode === "zones") return ZONES[pin.zone]?.color || "var(--color-primary)";
  if (mode === "itinerary") return DAYS[pin.day]?.color || "var(--color-primary)";
  return "var(--color-primary)";
}

function PinPopover({ pin, color, t }) {
  const popoverRef = useRef(null);

  useLayoutEffect(() => {
    const el = document.getElementById(`pin-btn-${pin.id}`);
    if (!el || !popoverRef.current) return;
    const rect = el.getBoundingClientRect();
    const left = window.scrollX + rect.left + rect.width / 2;
    const top = window.scrollY + rect.top;
    
    popoverRef.current.style.left = `${left}px`;
    popoverRef.current.style.top = `${top}px`;
  });

  return createPortal(
    <div
      ref={popoverRef}
      className="absolute z-[9999] mb-2 w-[220px] -translate-x-1/2 -translate-y-full overflow-hidden rounded-2xl text-left hidden lg:block"
      style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-3)" }}
    >
      <div className="h-[120px] w-full" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <SmartImage src={photoFor(pin)} alt={pin.label} className="h-full w-full object-cover" />
      </div>
      <div className="p-3">
        <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{pin.label}</p>
        <p className="mt-1 text-[12px] leading-snug" style={{ color: "var(--text-secondary)" }}>{pin.shortDesc}</p>
        {(pin.distanceKm != null && pin.distanceKm > 0) && (
          <p className="mt-1.5 text-[11px] font-mono-num" style={{ color }}>
            {pin.distanceKm} KM · ~{pin.durationMin} min from Kraton
          </p>
        )}
        {pin.distanceKm === 0 && (
          <p className="mt-1.5 text-[11px] font-mono-num" style={{ color }}>
            0 KM anchor point
          </p>
        )}
        <div className="mt-2.5 flex flex-col gap-1.5">
          <Link
            to={`/destinations/${pin.slug}`}
            className="focus-ring inline-flex items-center gap-1 text-[12px] font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("viewDetails") || "View Details"} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={pin.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1 text-[12px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("openInGoogleMaps") || "Open in Google Maps"} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}

function MobilePinModal({ openPin, setOpenPin, pins, t }) {
  if (!openPin) return null;
  const pin = pins.find(p => p.id === openPin);
  if (!pin) return null;

  const { color: kc, Icon } = kindOf(pin);

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex flex-col lg:hidden pointer-events-none">
      
      {/* Row 1: Map View (Transparent backdrop that dismisses on click) */}
      <div 
        className="flex-1 pointer-events-auto" 
        onClick={() => setOpenPin(null)} 
      />

      {/* The Bottom Sheet (Row 2 & 3) */}
      <div className="h-[65vh] w-full flex flex-col pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)] rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom-full duration-300 relative" style={{ backgroundColor: "var(--bg-surface)" }}>
        
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={() => setOpenPin(null)}
          className="absolute top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Row 2: Cover and details (flex-1 so it scrolls if needed) */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Image */}
          <div className="h-[200px] w-full shrink-0 relative bg-black/5">
            <SmartImage src={photoFor(pin)} alt={pin.label} loading="eager" className="h-full w-full object-cover" />
            <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full shadow-lg border-2 border-white" style={{ backgroundColor: kc, color: "#fff" }}>
              <Icon className="h-5 w-5" />
            </div>
          </div>

          {/* Details & Actions */}
          <div className="p-5 pb-6">
            <p className="text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>{pin.label}</p>
            
            <div className="mt-2 mb-3 flex items-center gap-2">
              {(pin.distanceKm != null && pin.distanceKm > 0) && (
                <span className="text-[13px] font-mono-num font-bold" style={{ color: "var(--color-primary)" }}>
                  {pin.distanceKm} KM · ~{pin.durationMin} min from Kraton
                </span>
              )}
              {pin.distanceKm === 0 && (
                <span className="text-[13px] font-mono-num font-bold" style={{ color: "var(--color-primary)" }}>
                  0 KM anchor point
                </span>
              )}
            </div>

            <p className="text-[14px] leading-relaxed mb-6 line-clamp-3" style={{ color: "var(--text-secondary)" }}>{pin.shortDesc}</p>
            
            <div className="flex gap-3">
              <Link to={`/destinations/${pin.slug}`} className="focus-ring flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-bold text-white shadow-md" style={{ backgroundColor: "var(--color-primary)" }}>
                {t("viewDetails") || "View Details"}
              </Link>
              <a href={pin.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center justify-center gap-2 rounded-xl px-4 py-3 shadow-sm border transition-colors" style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Row 3: Carousel places */}
        <div className="shrink-0 pt-4 pb-safe bg-gray-100 border-none">
          <p className="px-5 mb-3 text-[14px] font-bold text-gray-900">Other Places</p>
          <div className="w-full">
            <Swiper
              slidesPerView="auto"
              spaceBetween={12}
              slidesOffsetBefore={20}
              slidesOffsetAfter={20}
              className="w-full pb-3"
            >
              {pins.filter(p => p.id !== openPin).map(otherPin => (
                <SwiperSlide key={otherPin.id} style={{ width: "130px", height: "auto" }}>
                  <button
                    onClick={() => setOpenPin(otherPin.id)}
                    className="w-full h-full text-left overflow-hidden rounded-xl transition-transform active:scale-95 flex flex-col focus-ring border border-gray-200 bg-white"
                  >
                    <div className="h-[75px] w-full shrink-0 bg-black/5">
                      <SmartImage src={photoFor(otherPin)} alt={otherPin.label} loading="eager" className="h-full w-full object-cover" />
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-center bg-white h-[56px] shrink-0">
                      <p className="text-[12px] font-semibold line-clamp-2 leading-tight text-gray-900">{otherPin.label}</p>
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// All unique slugs across every mode — the shared position map is keyed by slug.
const slugOf = (pin) => pin.slug;

export default function InteractiveMapsSection() {
  const { t } = useTranslation();
  const [mode, setMode] = useState("distance");
  const [openPin, setOpenPin] = useState(null);

  // Shared position overrides keyed by slug: { [slug]: {x, y} }
  const [positions, setPositions] = useState({});
  const [places, setPlaces] = useState([]); // admin-created MapPlace records
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const mapRef = useRef(null);
  const stageRef = useRef(null);
  const dragRef = useRef(null); // { slug }

  // Touch-only pinch-zoom + pan. Disabled in edit mode so admin pin-dragging keeps raw coords.
  const { enabled: zoomEnabled, transform, zoomBy, reset, canReset, panToPct } = useMapZoom(mapRef, {
    initialScale: 2,
    enabledWhen: !editMode,
  });

  const loadPlaces = async () => {
    try {
      const recs = await base44.entities.MapPlace.list();
      setPlaces(recs);
    } catch { /* ignore */ }
  };

  // Scroll the map into view automatically when a pin is opened on mobile
  useEffect(() => {
    if (openPin && window.innerWidth < 1024 && mapRef.current) {
      const pin = pins.find((p) => p.id === openPin);
      if (pin) {
        const { x, y } = coordOf(pin);
        panToPct(x, y);
      }
      const yScroll = mapRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: yScroll, behavior: 'smooth' });
    }
  }, [openPin]);

  // Load saved positions + custom places + detect admin
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const saved = await base44.entities.MapPinPosition.list();
        if (!alive) return;
        const map = {};
        saved.forEach((p) => { map[p.slug] = { x: p.x, y: p.y }; });
        setPositions(map);
      } catch { /* ignore */ }
      try {
        const recs = await base44.entities.MapPlace.list();
        if (alive) setPlaces(recs);
      } catch { /* ignore */ }
      try {
        const me = await base44.auth.me();
        if (alive && me?.role === "admin") setIsAdmin(true);
      } catch { /* not logged in */ }
    })();
    return () => { alive = false; };
  }, []);

  // Resolve a pin's coordinate: saved override by slug, else its default.
  const coordOf = (pin) => positions[slugOf(pin)] || { x: pin.x, y: pin.y };

  // Normalize a MapPlace record into the pin shape used across the section.
  const placeToPin = (rec) => ({
    id: `place-${rec.id}`,
    placeId: rec.id,
    isCustom: true,
    slug: rec.slug,
    label: rec.label,
    shortLabel: rec.short_label || rec.label,
    shortDesc: rec.short_desc || "",
    kind: rec.kind,
    zone: rec.zone,
    day: rec.day,
    dayOrder: rec.day_order ?? 99,
    distanceKm: rec.distance_km,
    durationMin: rec.duration_min,
    googleMapsUrl: rec.google_maps_url || "",
    photo_url: rec.photo_url || "",
    x: rec.x ?? 50,
    y: rec.y ?? 50,
  });

  // The map is fully data-driven from MapPlace records, filtered per active mode.
  const pins = places
    .map(placeToPin)
    .filter((p) => {
      if (mode === "distance") return places.find((r) => r.id === p.placeId)?.show_in_distance !== false;
      if (mode === "zones") return Boolean(p.zone);
      if (mode === "itinerary") return Boolean(p.day);
      return true;
    });

  // route line segments per day for itinerary, ordered by day_order
  const itineraryPaths = mode === "itinerary"
    ? [1, 2, 3].map((day) => ({
      day,
      color: DAYS[day].color,
      points: pins
        .filter((p) => p.day === day)
        .sort((a, b) => a.dayOrder - b.dayOrder)
        .map((p) => ({ ...p, ...coordOf(p) })),
    }))
    : [];

  // ── Drag handling (edit mode only) ──
  const onPointerDownPin = (pin) => (e) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { slug: slugOf(pin) };
    setOpenPin(null);
  };

  useEffect(() => {
    if (!editMode) return;
    let rafId = null;
    const onMove = (e) => {
      if (!dragRef.current || !stageRef.current) return;
      if (rafId) cancelAnimationFrame(rafId);

      const rect = stageRef.current.getBoundingClientRect();
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

      rafId = requestAnimationFrame(() => {
        if (!dragRef.current) return;
        const x = Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100));
        const y = Math.min(100, Math.max(0, ((cy - rect.top) / rect.height) * 100));
        setPositions((prev) => ({ ...prev, [dragRef.current.slug]: { x, y } }));
        setDirty(true);
        rafId = null;
      });
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [editMode]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const existing = await base44.entities.MapPinPosition.list();
      const bySlug = {};
      existing.forEach((r) => { bySlug[r.slug] = r; });
      for (const [slug, { x, y }] of Object.entries(positions)) {
        if (bySlug[slug]) {
          await base44.entities.MapPinPosition.update(bySlug[slug].id, { x, y });
        } else {
          await base44.entities.MapPinPosition.create({ slug, x, y });
        }
      }
      setDirty(false);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section-y">
      <div className="content-wrap">
        <SectionHeading title={t("maps.heading") || "Explore the Region"} subtitle={t("maps.subtitle") || "Discover D.I. Yogyakarta by distance, zone, or a ready-made 3-day route."} />

        <div className="mt-6 flex flex-col lg:flex-row gap-6 relative">
          {/* Left Column (Map) */}
          <div className="flex-1 min-w-0 flex flex-col">
            {editMode && (
              <p className="mb-3 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                Drag any pin to reposition it. Click the pencil to edit a custom pin. Click Save when done.
              </p>
            )}
            
            {/* Legend */}
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {mode === "zones" && Object.values(ZONES).map((z) => (
                <span key={z.label} className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: z.color }} /> {z.label}
                </span>
              ))}
              {mode === "itinerary" && Object.values(DAYS).map((d) => (
                <span key={d.label} className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} /> {d.label}
                </span>
              ))}
              {mode === "distance" && (
                <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  Distances & travel times measured from the Kraton (0 KM anchor).
                </span>
              )}
            </div>

        {/* Map */}
        <div
          ref={mapRef}
          className="relative mx-auto w-full overflow-hidden rounded-2xl aspect-[4/5] lg:aspect-[16/10]"
          style={{ touchAction: zoomEnabled ? "none" : undefined }}
          onClick={() => setOpenPin(null)}
        >
          {/* Zoom controls — touch devices only */}
          {zoomEnabled && (
            <div className="absolute right-2 top-2 z-50 flex flex-col gap-1.5">
              <button type="button" aria-label="Zoom in" onClick={(e) => { e.stopPropagation(); zoomBy(1.4); }} className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", boxShadow: "var(--elevation-2)" }}>
                <ZoomIn className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Zoom out" onClick={(e) => { e.stopPropagation(); zoomBy(1 / 1.4); }} className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", boxShadow: "var(--elevation-2)" }}>
                <ZoomOut className="h-4 w-4" />
              </button>
              {canReset && (
                <button type="button" aria-label="Reset zoom" onClick={(e) => { e.stopPropagation(); reset(); }} className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", boxShadow: "var(--elevation-2)" }}>
                  <Maximize className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Transformed stage — scaled/panned as one unit so pins stay aligned */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              ref={stageRef}
              className="w-full aspect-[16/10] pointer-events-auto"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transformOrigin: "center center",
              transition: dragRef.current ? "none" : "transform 0.12s ease-out",
            }}
          >
            <SmartImage
              src={MAP_BG}
              alt="Map of D.I. Yogyakarta"
              className="absolute inset-0 h-full w-full object-contain transition-opacity"
              style={{ opacity: mode === "zones" || mode === "itinerary" ? 0.6 : 1 }}
            />

            {/* SVG overlay: zone blobs (mode 2) + route lines (mode 3) */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {mode === "zones" && Object.entries(ZONES).map(([key, z]) => {
                const zonePins = pins.filter((p) => p.zone === key).map((p) => ({ ...p, ...coordOf(p) }));
                if (zonePins.length === 0) return null;
                const cx = zonePins.reduce((s, p) => s + p.x, 0) / zonePins.length;
                const cy = zonePins.reduce((s, p) => s + p.y, 0) / zonePins.length;
                const rx = Math.max(...zonePins.map((p) => Math.abs(p.x - cx))) + 8;
                const ry = Math.max(...zonePins.map((p) => Math.abs(p.y - cy))) + 8;
                return <ellipse key={key} cx={cx} cy={cy} rx={rx} ry={ry} fill={z.color} opacity="0.16" />;
              })}
              {itineraryPaths.map((path) => (
                <polyline
                  key={path.day}
                  points={path.points.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="0.6"
                  strokeDasharray="2 1.5"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {/* Pins */}
            {pins.map((pin) => {
              const color = pinColor(mode, pin);
              const isOpen = openPin === pin.id;
              const { x, y } = coordOf(pin);
              const { color: kc, Icon } = kindOf(pin);
              return (
                <div
                  key={pin.id}
                  className={`absolute -translate-x-1/2 -translate-y-full ${editMode ? "cursor-move" : ""}`}
                  style={{ left: `${x}%`, top: `${y}%`, zIndex: isOpen ? 100 : 20, touchAction: editMode ? "none" : undefined }}
                  onPointerDown={onPointerDownPin(pin)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (editMode) return;
                    setOpenPin(isOpen ? null : pin.id);
                  }}
                  onMouseEnter={() => { if (!editMode && window.innerWidth >= 1024) setOpenPin(pin.id); }}
                  onMouseLeave={() => { if (!editMode && window.innerWidth >= 1024) setOpenPin((cur) => (cur === pin.id ? null : cur)); }}
                >
                  <button
                    id={`pin-btn-${pin.id}`}
                    type="button"
                    aria-label={pin.label}
                    className={`focus-ring relative flex flex-col items-center transition-transform duration-200 origin-bottom ${editMode ? "" : "hover:scale-110"}`}
                    style={{ transform: `scale(${(isOpen && !editMode ? 1.1 : 1) / (transform.scale || 1)})` }}
                  >
                    {/* Category badge + name label (no landmark illustration) */}
                    <span
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-full pr-2"
                      style={{ backgroundColor: "rgba(255,255,255,0.92)", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }}
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full ring-1 ring-white" style={{ backgroundColor: kc }}>
                        <Icon className="h-2.5 w-2.5" style={{ color: "#FFFFFF" }} />
                      </span>
                      <span className="text-[11px] font-semibold leading-none" style={{ color: "#3a2c1a" }}>
                        {pin.shortLabel}
                      </span>
                    </span>
                  </button>
                  {editMode && pin.isCustom && (
                    <button
                      type="button"
                      aria-label={`Edit ${pin.label}`}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); setEditingPlace(places.find((r) => r.id === pin.placeId)); setEditorOpen(true); }}
                      className="focus-ring absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)", zIndex: 50 }}
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  )}
                  {isOpen && !editMode && <PinPopover pin={pin} color={color} t={t} />}
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
      
        {/* Spacer to hold space for the absolute right column on desktop */}
        <div className="hidden lg:block w-[320px] shrink-0" />

        {/* Right Column (Controls & Place List) */}
        <div className="w-full lg:w-[320px] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 shrink-0 flex flex-col gap-4 rounded-2xl p-4" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
          
          {/* Mode toggle tabs */}
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Filter by</span>
            <div className="inline-flex flex-wrap gap-1 rounded-xl p-1" style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-1)" }}>
              {MODES.map((m) => {
                const active = mode === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => { setMode(m.key); setOpenPin(null); }}
                    aria-pressed={active}
                    className="focus-ring flex-1 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors"
                    style={{ backgroundColor: active ? "var(--color-primary)" : "transparent", color: active ? "var(--on-primary)" : "var(--text-secondary)" }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => { setEditingPlace(null); setEditorOpen(true); }}
                className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors"
                style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
              >
                <Plus className="h-3.5 w-3.5" /> Add place
              </button>
              <button
                type="button"
                onClick={() => setEditMode((v) => !v)}
                className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors"
                style={{
                  backgroundColor: editMode ? "var(--color-accent)" : "var(--bg-surface-alt)",
                  color: editMode ? "var(--on-accent)" : "var(--text-secondary)",
                }}
              >
                <Move className="h-3.5 w-3.5" /> {editMode ? "Editing" : "Edit pins"}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !dirty}
                  className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  {saving ? "Saving" : "Save"}
                </button>
              )}
            </div>
          )}

          {/* Places List */}
          <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0 max-h-[400px] lg:max-h-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {pins.length === 0 ? (
              <p className="text-[13px] text-center mt-4" style={{ color: "var(--text-secondary)" }}>No places in this view.</p>
            ) : (
              pins.map((pin) => {
                const { color: kc, Icon } = kindOf(pin);
                const isActive = openPin === pin.id;
                return (
                  <Link
                    key={pin.id}
                    to={`/destinations/${pin.slug}`}
                    onMouseEnter={() => { if (!editMode) setOpenPin(pin.id); }}
                    onMouseLeave={() => { if (!editMode) setOpenPin((cur) => (cur === pin.id ? null : cur)); }}
                    onClick={(e) => {
                      if (editMode) {
                        e.preventDefault();
                      }
                    }}
                    className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${isActive ? 'bg-black/5' : ''}`}
                    style={{ 
                      backgroundColor: isActive ? "var(--bg-surface-alt)" : "var(--bg-surface)",
                      borderColor: isActive ? "var(--color-primary)" : "transparent"
                    }}
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: kc }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-semibold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
                        {pin.label}
                      </span>
                      <span className="mt-1 text-[12px] leading-snug line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                        {pin.shortDesc}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>

      <MapPlaceEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        place={editingPlace}
        onSaved={loadPlaces}
      />
      <MobilePinModal
        openPin={openPin}
        setOpenPin={setOpenPin}
        pins={pins}
        t={t}
      />
    </section>
  );
}