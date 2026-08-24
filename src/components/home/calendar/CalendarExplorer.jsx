import React, { useEffect, useMemo, useState } from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  isSameMonth, isSameDay, addMonths, subMonths, format, parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import EventCategoryFilter from "@/components/home/calendar/EventCategoryFilter";
import EventCard from "@/components/shared/EventCard";
import { EVENT_CATEGORIES, eventCategoryOf, eventCategoryColor } from "@/lib/eventCategories";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const ALL_CATS = EVENT_CATEGORIES.map((c) => c.value);

function eventDate(ev) { try { return parseISO(ev.start_date); } catch { return null; } }

export default function CalendarExplorer() {
  const { t, language } = useTranslation();
  const [events, setEvents] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeCats, setActiveCats] = useState(ALL_CATS);
  const [query, setQuery] = useState("");

  useEffect(() => {
    base44.entities.Event.list("start_date").then((data) => {
      // Filter out sample/dummy events - only show real events
      const realEvents = data.filter(event => !event.is_sample);
      setEvents(realEvents);
    }).catch(() => setEvents([]));
  }, []);

  const title = (ev) => (language === "id" ? ev.title_id : ev.title_en) || ev.title_en || ev.title_id;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((ev) => {
      if (!activeCats.includes(eventCategoryOf(ev))) return false;
      if (!q) return true;
      return [ev.title_id, ev.title_en, ev.venue].some((s) => (s || "").toLowerCase().includes(q));
    });
  }, [events, activeCats, query]);

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(viewDate));
    const gridEnd = endOfWeek(endOfMonth(viewDate));
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [viewDate]);

  const eventsOnDay = (day) => filtered.filter((ev) => { const d = eventDate(ev); return d && isSameDay(d, day); });

  const showcase = useMemo(() => {
    const base = selectedDay
      ? filtered.filter((ev) => { const d = eventDate(ev); return d && isSameDay(d, selectedDay); })
      : filtered;
    return [...base].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  }, [filtered, selectedDay]);

  const toggleCat = (v) => setActiveCats((prev) => (prev.includes(v) ? prev.filter((c) => c !== v) : [...prev, v]));

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 md:px-6">
      {/* Search + filter */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("calendar.searchPlaceholder")}
            className="focus-ring h-11 w-full rounded-lg pl-9 pr-3 text-[14px]"
            style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)", border: "none" }}
          />
        </div>
        <EventCategoryFilter active={activeCats} onToggle={toggleCat} onAll={() => setActiveCats(ALL_CATS)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* Calendar widget */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-1)" }}>
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button" aria-label="Previous month"
              onClick={() => { setViewDate(subMonths(viewDate, 1)); setSelectedDay(null); }}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button" aria-label="Next month"
              onClick={() => { setViewDate(addMonths(viewDate, 1)); setSelectedDay(null); }}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <div key={w} className="pb-1 text-center text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>{w}</div>
            ))}
            {days.map((day) => {
              const inMonth = isSameMonth(day, viewDate);
              const dayEvents = eventsOnDay(day);
              const hasEvent = dayEvents.length > 0;
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              const isToday = isSameDay(day, new Date());
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className="focus-ring flex min-h-[52px] flex-col items-start justify-between rounded-lg p-1 text-left transition-colors"
                  style={{
                    backgroundColor: isSelected ? "var(--color-primary)" : hasEvent ? "var(--bg-surface-alt)" : "transparent",
                    opacity: inMonth ? 1 : 0.35,
                  }}
                >
                  <span className="text-[12px] leading-none" style={{ color: isSelected ? "var(--on-primary)" : "var(--text-primary)", fontWeight: 400 }}>
                    {format(day, "d")}
                  </span>
                  {hasEvent && (
                    <div className="mt-auto flex items-center gap-0.5">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <span key={ev.id} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: eventCategoryColor(eventCategoryOf(ev)) }} />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] font-semibold leading-none" style={{ color: isSelected ? "var(--on-primary)" : "var(--text-secondary)" }}>+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event showcase */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {selectedDay ? format(selectedDay, "d MMM yyyy") : t("calendar.showcase")}
            </h3>
            <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{showcase.length} {t("calendar.results")}</span>
          </div>
          {showcase.length === 0 ? (
            <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>{t("calendar.noEvents")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {showcase.map((ev) => <EventCard key={ev.id} event={ev} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}