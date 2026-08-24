import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isSameDay, parseISO } from "date-fns";
import { Search, Music, CalendarDays } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import {
  EVENT_CATEGORIES,
  eventCategoryOf,
  getCategoriesForTab,
} from "@/lib/eventCategories";
import PageShell from "@/components/layout/PageShell";
import EventCard from "@/components/shared/EventCard";
import EventCategoryFilter from "@/components/home/calendar/EventCategoryFilter";
import CalendarStrip from "@/components/events/CalendarStrip";

const ALL_CATS = EVENT_CATEGORIES.map((c) => c.value);

/**
 * Unified Events & Concerts page.
 *
 * Props:
 *   hideShell    — when true, omits the PageShell wrapper (for embedding)
 *   defaultTab   — "events" | "concerts" — pre-select a tab
 *   defaultCategory - pre-filter events to a specific category
 *   highlightsOnly - filter to events with is_homepage_highlight
 */
export default function EventsPage({ hideShell, defaultTab, defaultCategory, highlightsOnly }) {
  const { t, language } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine the initial tab from: prop > URL param > default
  const urlTab = searchParams.get("tab");
  const initialTab = defaultTab || (urlTab === "concerts" ? "concerts" : "events");

  const [activeTab, setActiveTab] = useState(initialTab);
  const [events, setEvents] = useState(null);
  const [query, setQuery] = useState("");
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Category filter state — initialised to the tab's categories
  const tabCats = useMemo(() => getCategoriesForTab(activeTab).map((c) => c.value), [activeTab]);
  const [activeCats, setActiveCats] = useState(defaultCategory ? [defaultCategory] : tabCats);

  // When tab changes, reset category filter to that tab's categories
  useEffect(() => {
    if (defaultCategory) return;
    setActiveCats(tabCats);
    setSelectedDay(null);
    setQuery("");
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch events once
  useEffect(() => {
    base44.entities.Event.list("start_date")
      .then((data) => {
        // Filter out sample/dummy events - only show real events
        const realEvents = data.filter(event => !event.is_sample);
        setEvents(realEvents);
      })
      .catch(() => setEvents([]));
  }, []);

  // Title helper
  const title = (ev) =>
    (language === "id" ? ev.title_id : ev.title_en) || ev.title_en || ev.title_id;

  // ── Filtering pipeline ──
  const filtered = useMemo(() => {
    if (!events) return null;
    const q = query.trim().toLowerCase();

    return events.filter((ev) => {
      // 1. Must belong to the active tab's categories
      const cat = eventCategoryOf(ev);
      if (!activeCats.includes(cat)) return false;

      // 2. Must belong to the active high-level tab
      const catDef = EVENT_CATEGORIES.find((c) => c.value === cat);
      if (catDef && catDef.tab !== activeTab) return false;

      // 3. Must match the selected calendar day (if any)
      if (selectedDay) {
        try {
          const d = parseISO(ev.start_date);
          if (!isSameDay(d, selectedDay)) return false;
        } catch {
          return false;
        }
      }

      // 4. Highlight filter
      if (highlightsOnly && !ev.is_homepage_highlight) {
        return false;
      }

      // 5. Text search
      if (q) {
        return [ev.title_id, ev.title_en, ev.venue].some(
          (s) => (s || "").toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [events, activeCats, activeTab, selectedDay, query]);

  // Events scoped to the active tab (for calendar strip dots — ignoring search/day filter)
  const tabEvents = useMemo(() => {
    if (!events) return [];
    return events.filter((ev) => {
      const catDef = EVENT_CATEGORIES.find((c) => c.value === eventCategoryOf(ev));
      return catDef && catDef.tab === activeTab;
    });
  }, [events, activeTab]);

  const toggleCat = (v) =>
    setActiveCats((prev) =>
      prev.includes(v) ? prev.filter((c) => c !== v) : [...prev, v]
    );

  const allCats = () => setActiveCats(tabCats);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL param for deep-linking (but don't add to history if embedded)
    if (!hideShell) {
      setSearchParams(tab === "events" ? {} : { tab }, { replace: true });
    }
  };

  const TABS = [
    { key: "events", icon: CalendarDays, label: t("events.tabEvents") },
    { key: "concerts", icon: Music, label: t("events.tabConcerts") },
  ];

  // Visible category chips depend on the active tab
  const visibleCategories = getCategoriesForTab(activeTab);

  const pageTitle = t("events.pageTitle");
  const pageSubtitle = t("events.pageSubtitleFull");

  const content = (
    <div className={hideShell ? "pt-2" : "content-wrap"}>
      {/* Top Controls: Tabs and Search */}
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4">
        {/* Tab switcher — Events / Concerts */}
        {!defaultCategory && (
          <div className="flex w-full md:w-auto md:inline-flex items-center gap-1 rounded-xl p-1 shrink-0" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className="focus-ring flex flex-1 md:flex-none items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-[14px] font-semibold transition-all"
                  style={{
                    backgroundColor: active ? "var(--color-primary)" : "transparent",
                    color: active ? "var(--on-primary)" : "var(--text-secondary)",
                    boxShadow: active ? "var(--elevation-1)" : "none",
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Search bar */}
        <div className="relative w-full md:max-w-xs lg:max-w-sm shrink-0">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--text-secondary)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("calendar.searchPlaceholder")}
            className="focus-ring h-11 w-full rounded-xl pl-9 pr-3 text-[14px]"
            style={{
              backgroundColor: "var(--bg-surface-alt)",
              color: "var(--text-primary)",
              border: "none",
            }}
          />
        </div>
      </div>

      {/* Calendar strip */}
      {!defaultCategory && !highlightsOnly && (
        <div className="mt-4">
          <CalendarStrip
            events={tabEvents}
            viewDate={viewDate}
            onViewDateChange={setViewDate}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            language={language}
          />
        </div>
      )}

      {/* Category filter chips (only if tab has multiple categories) */}
      {!defaultCategory && !highlightsOnly && visibleCategories.length > 1 && (
        <div className="mt-4">
          <EventCategoryFilter
            categories={visibleCategories}
            active={activeCats}
            onToggle={toggleCat}
            onAll={allCats}
          />
        </div>
      )}

      {/* Results header */}
      {filtered && (
        <div className="mt-5 flex items-center justify-between">
          <h3 className="text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {selectedDay
              ? new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(selectedDay)
              : activeTab === "concerts"
              ? t("events.tabConcerts")
              : t("calendar.showcase")}
          </h3>
          <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
            {filtered.length} {t("calendar.results")}
          </span>
        </div>
      )}

      {/* Event grid */}
      {filtered === null ? (
        <div className="mt-6 grid grid-cols-2 gap-4 pb-16 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] animate-pulse rounded-2xl"
              style={{ backgroundColor: "var(--bg-surface-alt)" }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-[14px]" style={{ color: "var(--text-secondary)" }}>
          {t("calendar.noEvents")}
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 pb-16 sm:gap-6 lg:grid-cols-4">
          {filtered.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </div>
  );

  if (hideShell) return content;

  return (
    <PageShell>
      <div className="py-10" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <div className="content-wrap">
          <h1 className="font-heading text-[28px] font-bold md:text-[36px]" style={{ color: "var(--color-primary)" }}>
            {pageTitle}
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--text-secondary)" }}>
            {pageSubtitle}
          </p>
        </div>
      </div>
      <div className="pt-6">
        {content}
      </div>
    </PageShell>
  );
}
