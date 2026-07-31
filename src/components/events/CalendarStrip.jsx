import React, { useMemo, useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { eventCategoryOf, eventCategoryColor } from "@/lib/eventCategories";
import SmartImage from "@/components/shared/SmartImage";
import { useTranslation } from "@/lib/i18n";

/**
 * Monthly calendar grid for a given month.
 * Shows day numbers with colored dots for events, and allows selecting
 * a day to filter the parent list.
 *
 * Props:
 *   events       — array of event objects (must have start_date)
 *   viewDate     — Date controlling which month is shown
 *   onViewDateChange — (Date) => void
 *   selectedDay  — Date | null
 *   onSelectDay  — (Date | null) => void
 *   language     — "en" | "id"
 */
export default function CalendarStrip({
  events = [],
  viewDate,
  onViewDateChange,
  selectedDay,
  onSelectDay,
  language = "en",
}) {
  const { t } = useTranslation();
  const [hoveredKey, setHoveredKey] = useState(null);
  const [mode, setMode] = useState("month");

  const WEEKDAYS = language === "id"
    ? ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
    : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const MONTHS = language === "id"
    ? ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(viewDate));
    const gridEnd = endOfWeek(endOfMonth(viewDate));
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [viewDate]);

  function eventDate(ev) {
    try { return parseISO(ev.start_date); } catch { return null; }
  }

  const eventsOnDay = (day) => events.filter((ev) => { const d = eventDate(ev); return d && isSameDay(d, day); });
  const eventsInMonthOfYear = (monthIndex) => events.filter((ev) => {
    const d = eventDate(ev);
    return d && d.getFullYear() === viewDate.getFullYear() && d.getMonth() === monthIndex;
  });

  const title = (ev) => (language === "id" ? ev.title_id : ev.title_en) || ev.title_en || ev.title_id;

  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-1)" }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={mode === "year" ? "Previous year" : "Previous month"}
            onClick={() => { onViewDateChange(mode === "year" ? subMonths(viewDate, 12) : subMonths(viewDate, 1)); onSelectDay(null); }}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[120px] text-center text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {mode === "year" ? viewDate.getFullYear() : `${MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
          </span>
          <button
            type="button"
            aria-label={mode === "year" ? "Next year" : "Next month"}
            onClick={() => { onViewDateChange(mode === "year" ? addMonths(viewDate, 12) : addMonths(viewDate, 1)); onSelectDay(null); }}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="inline-flex items-center rounded-lg p-0.5" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
          {[
            { key: "month", label: t("calendar.monthView") },
            { key: "year", label: t("calendar.yearView") },
          ].map((m) => {
            const active = mode === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => { setMode(m.key); onSelectDay(null); }}
                aria-pressed={active}
                className="focus-ring rounded-md px-3 py-1 text-[12px] font-semibold transition-colors"
                style={{ backgroundColor: active ? "var(--color-primary)" : "transparent", color: active ? "var(--on-primary)" : "var(--text-secondary)" }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {mode === "month" ? (
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="pb-1 text-center text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>{w}</div>
          ))}
          {days.map((day) => {
            const inMonth = isSameMonth(day, viewDate);
            const dayEvents = eventsOnDay(day);
            const hasEvent = dayEvents.length > 0;
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const key = day.toISOString();
            return (
              <div key={key} className="relative">
                <button
                  type="button"
                  onClick={() => onSelectDay(isSelected ? null : day)}
                  onMouseEnter={() => setHoveredKey(hasEvent ? key : null)}
                  onMouseLeave={() => setHoveredKey(null)}
                  className="focus-ring flex min-h-[62px] w-full flex-col items-start justify-between rounded-lg p-1 text-left transition-colors md:min-h-[72px]"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--color-primary)"
                      : hasEvent
                      ? "#F3F4F6"
                      : "transparent",
                    opacity: inMonth ? 1 : 0.35,
                  }}
                >
                  <span
                    className="text-[12px] leading-none"
                    style={{ color: isSelected ? "var(--on-primary)" : "var(--text-primary)", fontWeight: 400 }}
                  >
                    {format(day, "d")}
                  </span>
                  {hasEvent && (
                    <div className="mt-auto flex w-full items-center gap-1">
                      {dayEvents[0].cover_image_url && (
                        <SmartImage
                          src={dayEvents[0].cover_image_url}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-md object-cover md:h-10 md:w-10"
                        />
                      )}
                      <div className="flex flex-wrap items-center gap-0.5">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <span key={ev.id} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: eventCategoryColor(eventCategoryOf(ev)) }} />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[9px] font-semibold leading-none" style={{ color: "var(--text-secondary)" }}>
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </button>

                {(hoveredKey === key || isSelected) && hasEvent && (
                  <div
                    className="absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[240px] -translate-x-1/2 rounded-lg p-3 text-left"
                    style={{ backgroundColor: "var(--color-primary)", boxShadow: "var(--elevation-3)" }}
                  >
                    <p className="mb-1.5 text-[11px] font-semibold uppercase opacity-90" style={{ color: "var(--on-primary)" }}>
                      {format(day, "d MMM yyyy")}
                    </p>
                    <ul className="space-y-1.5">
                      {dayEvents.map((ev) => (
                        <li key={ev.id}>
                          <Link to={`/events/${ev.slug}`} className="flex items-center gap-2 text-[12px] hover:underline" style={{ color: "var(--on-primary)" }}>
                            <SmartImage src={ev.cover_image_url} alt="" className="h-6 w-6 shrink-0 rounded object-cover" />
                            <span className="max-w-[160px] truncate">{title(ev)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {MONTHS.map((m, i) => {
            const count = eventsInMonthOfYear(i).length;
            const isCurrent = i === new Date().getMonth() && viewDate.getFullYear() === new Date().getFullYear();
            return (
              <button
                key={m}
                type="button"
                onClick={() => { const d = new Date(viewDate); d.setMonth(i); onViewDateChange(d); setMode("month"); onSelectDay(null); }}
                className="focus-ring flex flex-col items-start rounded-lg p-3 text-left transition-colors"
                style={{ backgroundColor: "var(--bg-surface-alt)", borderBottom: `10px solid ${count > 0 ? "var(--color-primary)" : "transparent"}` }}
              >
                <span className="text-[13px] font-semibold" style={{ color: isCurrent ? "var(--color-primary)" : "var(--text-primary)" }}>{m.slice(0, 3)}</span>
                <span className="mt-0.5 text-[11px]" style={{ color: "var(--text-secondary)" }}>{count} {t("calendar.eventsCount")}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
