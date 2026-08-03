import React from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { MapPin } from "lucide-react";
import SmartImage from "@/components/shared/SmartImage";
import { useTranslation } from "@/lib/i18n";
import { eventCategoryOf, eventCategoryColor, eventCategoryLabel } from "@/lib/eventCategories";

export default function CalendarEventItem({ event }) {
  const { language } = useTranslation();
  const title = (language === "id" ? event.title_id : event.title_en) || event.title_en || event.title_id;
  let d = null;
  try { d = parseISO(event.start_date); } catch { d = null; }
  const cat = eventCategoryOf(event);
  const color = eventCategoryColor(cat);

  return (
    <li className="h-full">
      <Link
        to={`/event/${event.slug}`}
        className="focus-ring flex h-full items-start gap-3 rounded-lg p-2 transition-colors"
        style={{ backgroundColor: "var(--bg-surface-alt)" }}
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
          <SmartImage src={event.cover_image_url} alt={title} className="h-full w-full object-cover" />
          <span className="absolute left-1 top-1 h-2 w-2 rounded-full ring-2 ring-white" style={{ backgroundColor: color }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{title}</p>
          <div className="mt-0.5 flex items-center gap-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>
            {d && <span className="font-semibold">{format(d, "d MMM")}</span>}
            {event.venue && (
              <span className="flex min-w-0 items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{event.venue}</span>
              </span>
            )}
          </div>
        </div>
        <span className="shrink-0 self-start rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ backgroundColor: color, color: "#FFFFFF" }}>
          {eventCategoryLabel(cat, language)}
        </span>
      </Link>
    </li>
  );
}