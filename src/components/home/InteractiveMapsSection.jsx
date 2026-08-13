import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Clock, ExternalLink, X, ArrowRight, Landmark, Trees, Waves, Building2, Plane, Move, Save, Loader2, Plus, Pencil, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";
import SmartImage from "@/components/shared/SmartImage";
import { useTranslation } from "@/lib/i18n";
import { base44 } from "@/api/base44Client";
import MapPlaceEditor from "@/components/home/MapPlaceEditor";
import useMapZoom from "@/components/home/useMapZoom";
import { convexHull, expandHull, hullToSmoothPath } from "@/lib/convexHull";

// ── Illustrated graphic map background ──
// Cache-buster appended so the refreshed asset (same filename) reloads instead of serving a stale cached copy.
const MAP_BG = "https://ik.imagekit.io/ibrproject/jogja_maps_bg_compressed_2.jpg";

// ── Real place photos for the hover popover, keyed by slug ──
const PHOTOS = {
  "malioboro-street": "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&q=80",
  "kraton-yogyakarta": "https://images.unsplash.com/photo-1584810359583-96fc9f6bffb0?w=600&q=80",
  "taman-sari": "https://images.unsplash.com/photo-1577720643272-265f09367456?w=600&q=80",
  "tugu-jogja": "https://images.unsplash.com/photo-1626018944638-6bebc0e0f8a5?w=600&q=80",
  "kota-gede": "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=80",
  "prambanan-temple": "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&q=80",
  "borobudur-temple": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80",
  "mendut": "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600&q=80",
  "pawon": "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600&q=80",
  "pantai-parangtritis": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  "indrayanti-beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  "kukup-beach": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80",
  "timang-beach": "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&q=80",
  "jomblang-cave": "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80",
  "goa-pindul": "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&q=80",
  "desa-wisata-nglanggeran": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
  "kalibiru": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
  "kaliurang-park": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&q=80",
  "mount-merapi": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
  "yia-airport": "https://images.unsplash.com/photo-1436491865332-7a615069f4f2?w=600&q=80",
};
const photoFor = (pin) => pin.photo_url || PHOTOS[pin.slug] || "";

// ── Category badge (matches reference legend): icon + color per landmark kind ──
const KINDS = {
  culture: { color: "#E07B2E", Icon: Landmark },
  nature: { color: "#4E8A3E", Icon: Trees },
  beach: { color: "#2E6FB0", Icon: Waves },
  city: { color: "#7C5AAF", Icon: Building2 },
  flight: { color: "#0099CC", Icon: Plane },
};
// map each landmark slug to its category kind
const KIND_BY_SLUG = {
  "borobudur-temple": "culture", "prambanan-temple": "culture", mendut: "culture", pawon: "culture",
  "kraton-yogyakarta": "culture", "taman-sari": "culture", "kota-gede": "culture",
  kalibiru: "nature", "kaliurang-park": "nature", "mount-merapi": "nature", "desa-wisata-nglanggeran": "nature",
  "jomblang-cave": "nature", "goa-pindul": "nature",
  "pantai-parangtritis": "beach", "indrayanti-beach": "beach", "kukup-beach": "beach", "timang-beach": "beach", kulonprogo: "nature",
  "malioboro-street": "city", "tugu-jogja": "city", "yia-airport": "flight",
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

function getDestinationSlug(pin) {
  if (pin.slug === 'mount-merapi') return 'kaliurang-merapi';
  if (pin.slug === 'kaliurang-park') return 'kaliurang-merapi';
  return pin.slug;
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

      {/* Row 1: Map View (Transparent backdrop allows clicks to pass through to the map) */}
      <div className="flex-1 pointer-events-none" />

      {/* The Bottom Sheet (Row 2 & 3) */}
      <div className="w-full max-h-[85vh] flex flex-col pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)] rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom-full duration-300 relative" style={{ backgroundColor: "var(--bg-surface)" }}>

        {/* Floating Close Button */}
        <button
          type="button"
          onClick={() => setOpenPin(null)}
          className="absolute top-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Row 2: Horizontal Card Layout */}
        <div className="flex flex-row overflow-hidden p-4 gap-4 pt-5">
          {/* Left Column: Image Thumbnail */}
          <div className="w-[110px] h-[130px] shrink-0 relative rounded-xl overflow-hidden bg-black/5">
            <SmartImage src={photoFor(pin)} alt={pin.label} loading="eager" className="h-full w-full object-cover" />
            <div className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full shadow-lg border-2 border-white" style={{ backgroundColor: kc, color: "#fff" }}>
              <Icon className="h-3 w-3" />
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex-1 flex flex-col justify-center overflow-hidden py-1">
            <p className="text-[16px] font-bold leading-tight line-clamp-2" style={{ color: "var(--text-primary)" }}>{pin.label}</p>

            <div className="mt-1 flex items-center gap-2">
              {(pin.distanceKm != null && pin.distanceKm > 0) && (
                <span className="text-[12px] font-mono-num font-bold" style={{ color: "var(--color-primary)" }}>
                  {pin.distanceKm} KM
                </span>
              )}
            </div>

            <p className="text-[12px] leading-snug mt-1.5 line-clamp-3" style={{ color: "var(--text-secondary)" }}>{pin.shortDesc}</p>

            <div className="mt-auto pt-3 flex gap-2">
              <Link to={`/destinations/${getDestinationSlug(pin)}`} className="focus-ring flex-1 flex items-center justify-center rounded-lg py-2 text-[12px] font-bold text-white shadow-md" style={{ backgroundColor: "var(--color-primary)" }}>
                {t("viewDetails") || "Details"}
              </Link>
              <a href={pin.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center justify-center rounded-lg px-3 py-2 shadow-sm border transition-colors" style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                <ExternalLink className="h-4 w-4" />
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
              {pins.map(otherPin => {
                const isActive = openPin === otherPin.id;
                return (
                  <SwiperSlide key={otherPin.id} style={{ width: "130px", height: "auto" }}>
                    <button
                      onClick={() => setOpenPin(otherPin.id)}
                      className={`w-full h-full text-left overflow-hidden rounded-xl transition-transform active:scale-95 flex flex-col focus-ring ${isActive ? "bg-[var(--color-primary)]" : "bg-white"}`}
                    >
                      <div className="h-[75px] w-full shrink-0 bg-black/5">
                        <SmartImage src={photoFor(otherPin)} alt={otherPin.label} loading="eager" className="h-full w-full object-cover" />
                      </div>
                      <div className={`p-2.5 flex-1 flex flex-col justify-center min-h-[56px] ${isActive ? "bg-[var(--color-primary)] text-white" : "bg-white text-gray-900"}`}>
                        <p className="text-[12px] font-semibold line-clamp-2 leading-tight">{otherPin.label}</p>
                      </div>
                    </button>
                  </SwiperSlide>
                );
              })}
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

export default function InteractiveMapsSection({ disableWrap = false }) {
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
        panToPct(x, y + 20);

        // Wait briefly for React to apply the pan transform, then scroll the page
        // so the pin itself is clearly visible above the modal
        setTimeout(() => {
          const pinEl = document.getElementById(`pin-btn-${openPin}`);
          if (pinEl) {
            const pinRect = pinEl.getBoundingClientRect();
            const absolutePinY = window.scrollY + pinRect.top;
            // Scroll so the pin sits at ~35% from the top of the screen
            const targetY = absolutePinY - (window.innerHeight * 0.35);
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
        }, 50);
      }
    }
  }, [openPin]);

  // Close modal when the user scrolls the window manually
  useEffect(() => {
    if (!openPin || window.innerWidth >= 1024) return;

    // Use a slight delay so the automated scroll to the map doesn't trigger the close immediately
    let lastScroll = window.scrollY;
    let isActive = false;

    const tId = setTimeout(() => {
      lastScroll = window.scrollY;
      isActive = true;
    }, 500); // 500ms should be enough for smooth scroll to finish

    const handleScroll = () => {
      if (!isActive) return;
      if (Math.abs(window.scrollY - lastScroll) > 20) {
        setOpenPin(null);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(tId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [openPin]);

  // Load saved positions + custom places + detect admin
  useEffect(() => {
    let alive = true;
    (async () => {
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

  // ── Computed overlay data for each mode ──
  const zoneHulls = mode === "zones"
    ? Object.entries(ZONES).map(([key, z]) => {
      const zonePins = pins.filter((p) => p.zone === key).map((p) => ({ ...p, ...coordOf(p) }));
      if (zonePins.length === 0) return null;
      const hull = convexHull(zonePins);
      const expanded = expandHull(hull, 6);
      const pathD = hullToSmoothPath(expanded, 4);
      const cx = zonePins.reduce((s, p) => s + p.x, 0) / zonePins.length;
      const cy = zonePins.reduce((s, p) => s + p.y, 0) / zonePins.length;
      return { key, zone: z, pathD, cx, cy };
    }).filter(Boolean)
    : [];

  const kratonPin = mode === "distance" ? pins.find((p) => p.slug === "kraton-yogyakarta") : null;
  const kratonCoord = kratonPin ? coordOf(kratonPin) : null;
  const distanceLines = mode === "distance" && kratonCoord
    ? pins.filter((p) => p.slug !== "kraton-yogyakarta" && p.distanceKm > 0).map((p) => {
      const { x, y } = coordOf(p);
      return { pin: p, x, y, mx: (kratonCoord.x + x) / 2, my: (kratonCoord.y + y) / 2 };
    })
    : [];

  const itineraryStopInfo = {};
  if (mode === "itinerary") {
    itineraryPaths.forEach((path) => {
      path.points.forEach((p, i) => {
        itineraryStopInfo[p.id] = { index: i + 1, color: path.color, day: path.day };
      });
    });
  }

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
      const existing = await base44.entities.MapPlace.list();
      const bySlug = {};
      existing.forEach((r) => { bySlug[r.slug] = r; });

      for (const [slug, { x, y }] of Object.entries(positions)) {
        if (bySlug[slug]) {
          await base44.entities.MapPlace.update(bySlug[slug].id, { x, y });
        }
      }
      setDirty(false);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section-y !pt-2 md:!pt-6">
      <div className={disableWrap ? "" : "content-wrap"}>
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
              className="relative mx-auto w-full overflow-hidden rounded-2xl aspect-square md:aspect-[16/10]"
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
                    src={mode === "zones" || mode === "itinerary" ? "/images/maps/jogja_maps_bg_bw.jpg" : "/images/maps/jogja_maps_bg.jpg"}
                    alt="Map of D.I. Yogyakarta"
                    className="absolute inset-0 h-full w-full object-contain transition-opacity"
                  />

                  {/* SVG overlay: zone shapes, route lines, distance connectors */}
                  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Zone convex hull shapes */}
                    {mode === "zones" && zoneHulls.map((zh) => (
                      <path
                        key={zh.key}
                        d={zh.pathD}
                        fill={zh.zone.color}
                        fillOpacity="0.5"
                        stroke={zh.zone.color}
                        strokeOpacity="0.35"
                        strokeWidth="1.5"
                        strokeDasharray="5 5"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                    {/* Itinerary route polylines */}
                    {itineraryPaths.map((path) => (
                      <polyline
                        key={path.day}
                        points={path.points.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill="none"
                        stroke={path.color}
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                    {/* Distance radial lines from Kraton */}
                    {mode === "distance" && kratonCoord && distanceLines.map((dl) => (
                      <line
                        key={`dist-line-${dl.pin.id}`}
                        x1={kratonCoord.x} y1={kratonCoord.y}
                        x2={dl.x} y2={dl.y}
                        stroke="var(--color-primary)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity={openPin === dl.pin.id ? 0.6 : 0}
                        style={{ transition: "opacity 0.2s ease" }}
                        className="hidden md:block"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </svg>

                  {/* Zone name labels */}
                  {mode === "zones" && zoneHulls.map((zh) => {
                    // Add offsets to prevent labels overlapping with place pins in the centroid
                    const yOffset = zh.key === "north" ? -8 : zh.key === "south" ? 8 : 0;
                    const xOffset = zh.key === "city" ? 12 : 0;

                    return (
                      <div
                        key={`zone-label-${zh.key}`}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${zh.cx + xOffset}%`,
                          top: `${zh.cy + yOffset}%`,
                          transform: `translate(-50%, -50%) scale(${1 / (transform.scale || 1)})`,
                          zIndex: 10,
                        }}
                      >
                        <span
                          className="inline-block rounded-lg px-2 py-1 text-[11px] font-bold whitespace-nowrap shadow-sm"
                          style={{ backgroundColor: zh.zone.color, color: "#fff", opacity: 0.85 }}
                        >
                          {zh.zone.label}
                        </span>
                      </div>
                    )
                  })}

                  {/* Itinerary day badges at first stop of each day */}
                  {mode === "itinerary" && itineraryPaths.map((path) => {
                    const first = path.points[0];
                    if (!first) return null;
                    return (
                      <div
                        key={`day-badge-${path.day}`}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${first.x}%`,
                          top: `${first.y}%`,
                          transform: `translate(-50%, calc(-100% - 28px)) scale(${1 / (transform.scale || 1)})`,
                          transformOrigin: "center bottom",
                          zIndex: 15,
                        }}
                      >
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md whitespace-nowrap"
                          style={{ backgroundColor: path.color }}
                        >
                          Day {path.day}
                        </span>
                      </div>
                    );
                  })}

                  {/* Distance midpoint labels */}
                  {mode === "distance" && distanceLines.map((dl) => {
                    const isHighlighted = openPin === dl.pin.id;
                    return (
                      <div
                        key={`dist-label-${dl.pin.id}`}
                        className="absolute pointer-events-none hidden md:block"
                        style={{
                          left: `${dl.mx}%`,
                          top: `${dl.my}%`,
                          transform: `translate(-50%, -50%) scale(${1 / (transform.scale || 1)})`,
                          opacity: isHighlighted ? 1 : 0,
                          zIndex: isHighlighted ? 50 : 5,
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        <span
                          className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 whitespace-nowrap shadow-sm ${isHighlighted ? "text-[10px] font-bold" : "text-[8px] font-semibold"}`}
                          style={{
                            backgroundColor: isHighlighted ? "var(--color-primary)" : "rgba(255,255,255,0.88)",
                            color: isHighlighted ? "#fff" : "var(--text-secondary)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Clock className="h-2 w-2" />
                          {dl.pin.distanceKm}km · ~{dl.pin.durationMin}m
                        </span>
                      </div>
                    );
                  })}

                  {/* Pins */}
                  {pins.map((pin) => {
                    const color = pinColor(mode, pin);
                    const isOpen = openPin === pin.id;
                    const { x, y } = coordOf(pin);
                    const { color: kc, Icon } = kindOf(pin);
                    const stopInfo = itineraryStopInfo[pin.id];
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
                            className="flex items-center gap-1.5 whitespace-nowrap rounded-full pr-2 transition-colors"
                            style={{
                              backgroundColor: isOpen ? "var(--color-primary)" : "rgba(255,255,255,0.92)",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.25)"
                            }}
                          >
                            <span className="flex h-4 w-4 items-center justify-center rounded-full ring-1 ring-white" style={{ backgroundColor: stopInfo ? stopInfo.color : kc }}>
                              {stopInfo ? (
                                <span className="text-[9px] font-bold leading-none text-white">{stopInfo.index}</span>
                              ) : (
                                <Icon className="h-2.5 w-2.5" style={{ color: "#FFFFFF" }} />
                              )}
                            </span>
                            <span className="text-[11px] font-semibold leading-none transition-colors" style={{ color: isOpen ? "#FFFFFF" : "#3a2c1a" }}>
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
                  style={{ display: "none", backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
                >
                  <Plus className="h-3.5 w-3.5" /> Add place
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode((v) => !v)}
                  className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors"
                  style={{
                    display: "none",
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
              ) : mode === "itinerary" ? (
                [1, 2, 3].map((day) => {
                  const dayPins = pins.filter((p) => p.day === day).sort((a, b) => a.dayOrder - b.dayOrder);
                  if (dayPins.length === 0) return null;
                  return (
                    <div key={day} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 pt-2 pb-1 px-1">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white shrink-0" style={{ backgroundColor: DAYS[day].color }}>
                          {day}
                        </span>
                        <span className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>
                          {DAYS[day].label}
                        </span>
                      </div>
                      {dayPins.map((pin, i) => {
                        const isActive = openPin === pin.id;
                        return (
                          <Link
                            key={pin.id}
                            to={`/destinations/${pin.slug}`}
                            onMouseEnter={() => { if (!editMode && window.innerWidth >= 1024) setOpenPin(pin.id); }}
                            onMouseLeave={() => { if (!editMode && window.innerWidth >= 1024) setOpenPin((cur) => (cur === pin.id ? null : cur)); }}
                            onClick={(e) => { if (editMode) e.preventDefault(); }}
                            className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${isActive ? "bg-black/5" : ""}`}
                            style={{
                              backgroundColor: isActive ? "var(--bg-surface-alt)" : "var(--bg-surface)",
                              borderColor: isActive ? DAYS[day].color : "transparent",
                            }}
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-[12px] font-bold" style={{ backgroundColor: DAYS[day].color }}>
                              {i + 1}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[14px] font-semibold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
                                {pin.label}
                              </span>
                              <span className="mt-0.5 text-[12px] leading-snug line-clamp-1" style={{ color: "var(--text-secondary)" }}>
                                {pin.shortDesc}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  );
                })
              ) : (
                pins.map((pin) => {
                  const { color: kc, Icon } = kindOf(pin);
                  const isActive = openPin === pin.id;
                  return (
                    <Link
                      key={pin.id}
                      to={`/destinations/${pin.slug}`}
                      onMouseEnter={() => { if (!editMode && window.innerWidth >= 1024) setOpenPin(pin.id); }}
                      onMouseLeave={() => { if (!editMode && window.innerWidth >= 1024) setOpenPin((cur) => (cur === pin.id ? null : cur)); }}
                      onClick={(e) => { if (editMode) e.preventDefault(); }}
                      className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${isActive ? "bg-black/5" : ""}`}
                      style={{
                        backgroundColor: isActive ? "var(--bg-surface-alt)" : "var(--bg-surface)",
                        borderColor: isActive ? "var(--color-primary)" : "transparent",
                      }}
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: kc }}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-semibold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
                          {pin.label}
                        </span>
                        {mode === "distance" && pin.distanceKm != null && (
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--color-primary)" }}>
                            <Clock className="h-3 w-3" />
                            {pin.distanceKm === 0 ? "0 KM — anchor" : `${pin.distanceKm} KM · ~${pin.durationMin} min`}
                          </span>
                        )}
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