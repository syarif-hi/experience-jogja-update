import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Utensils, Calendar, Bed, Landmark } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { nearest, hasCoords } from "@/lib/distance";
import { format, parseISO, isValid } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import SmartImage from "@/components/shared/SmartImage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function DetailVisitorInfoSection({ origin }) {
  const { language } = useTranslation();
  const locale = language === "id" ? idLocale : enUS;
  const [dests, setDests] = useState([]);
  const [events, setEvents] = useState([]);
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Destination.list().catch(() => []),
      base44.entities.Event.list().catch(() => []),
      base44.entities.Stay.list().catch(() => [])
    ]).then(([dData, eData, sData]) => {
      setDests(dData || []);
      // Filter out sample/dummy events - only show real events
      const realEvents = (eData || []).filter(event => !event.is_sample);
      setEvents(realEvents);
      setStays(sData || []);
      setLoading(false);
    });
  }, []);

  if (!origin || loading) return null;

  const nm = (r) => (language === "id" ? r.name_id : r.name_en) || r.name;
  const titleNm = (r) => (language === "id" ? r.title_id : r.title_en) || r.title;

  const attractionCategories = ["landmarks", "nature-outdoor", "cultural-heritage-temples", "art-museums", "villages-local-life", "things-to-do"];

  const nearbyAttractions = hasCoords(origin) ? nearest(origin, dests.filter(d => attractionCategories.includes(d.category)), { limit: 6, excludeId: origin.id }) : [];
  const nearbyShopping = hasCoords(origin) ? nearest(origin, dests.filter(d => d.category === "shopping"), { limit: 6, excludeId: origin.id }) : [];
  const nearbyEats = hasCoords(origin) ? nearest(origin, dests.filter(d => d.category === "eat-drink"), { limit: 6, excludeId: origin.id }) : [];

  let nearbyStays = hasCoords(origin) ? nearest(origin, stays.filter(hasCoords), { limit: 6, excludeId: origin.id }) : [];
  if (nearbyStays.length === 0) {
    nearbyStays = stays.filter(s => s.regency === origin.regency && s.id !== origin.id).slice(0, 6);
  }

  const nearbyEvents = events.filter(e => e.regency === origin.regency).slice(0, 6);
  if (nearbyEvents.length === 0 && events.length > 0) {
    nearbyEvents.push(...events.slice(0, 4));
  }

  const renderCard = (item, type) => {
    const link = type === 'stay' ? `/stays/${item.slug}`
      : type === 'event' ? `/events/${item.slug}`
        : `/destinations/${item.slug}`;
    const name = type === 'event' ? titleNm(item) : nm(item);
    const img = item.cover_image_url || item.hero_image_url;

    let dateStr = "";
    if (type === 'event') {
      const dateRaw = item.start_date || item.event_date;
      if (dateRaw) {
        const d = parseISO(dateRaw);
        if (isValid(d)) {
          dateStr = format(d, "d MMM yyyy", { locale });
        }
      }
    }

    return (
      <SwiperSlide key={item.id} className="!w-[160px] md:!w-[200px]">
        <Link to={link} className="flex flex-col gap-2 rounded-xl group focus-ring">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
            <SmartImage src={img} alt={name} className="h-full w-full object-cover transition-opacity group-hover:opacity-90" />
          </div>
          <div>
            <h4 className="truncate text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>{name}</h4>
            {item.driveMin !== undefined && (
              <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{item.driveMin} min drive</p>
            )}
            {dateStr && (
              <p className="text-[12px]" style={{ color: "var(--color-accent)" }}>{dateStr}</p>
            )}
            {type === 'event' && item.venue && (
              <p className="text-[12px] truncate" style={{ color: "var(--text-secondary)" }}>{item.venue}</p>
            )}
          </div>
        </Link>
      </SwiperSlide>
    );
  };

  const renderSection = (title, icon, items, type) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          {icon}
          <h3 className="font-heading text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
        </div>
        <Swiper slidesPerView="auto" spaceBetween={16} className="w-full pb-4">
          {items.map(item => renderCard(item, type))}
        </Swiper>
      </div>
    );
  };

  const hasAnyData = nearbyAttractions.length > 0 || nearbyShopping.length > 0 || nearbyEats.length > 0 || nearbyStays.length > 0 || nearbyEvents.length > 0;
  if (!hasAnyData) return null;

  return (
    <section className="mt-12 mb-8" style={{ borderColor: "var(--border-color)" }}>
      <h2 className="mb-6 font-heading text-[24px] font-bold" style={{ color: "var(--text-primary)" }}>
        Visitor Information
      </h2>
      {renderSection("Nearby Facilities & Restaurants", <Utensils className="h-5 w-5 text-orange-500" />, nearbyEats, 'destination')}
      {renderSection("Nearby Attractions", <Landmark className="h-5 w-5 text-emerald-600" />, nearbyAttractions, 'destination')}
      {renderSection("Nearby Mall & Shopping", <ShoppingBag className="h-5 w-5 text-blue-500" />, nearbyShopping, 'destination')}
      {renderSection("Nearby Hotels", <Bed className="h-5 w-5 text-indigo-500" />, nearbyStays, 'stay')}
      {renderSection("Events in this Area", <Calendar className="h-5 w-5 text-rose-500" />, nearbyEvents, 'event')}
    </section>
  );
}
