import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, MapPin, X, Compass } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { REGENCIES, regencyLabel } from "@/lib/regencies";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DestinationCard from "@/components/shared/DestinationCard";
import HScrollStrip from "@/components/home/HScrollStrip";
import SectionHeading from "@/components/home/SectionHeading";

export default function Destinations() {
  const { t, language } = useTranslation();
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [region, setRegion] = useState("all");
  const gridRef = useRef(null);

  useEffect(() => {
    base44.entities.Destination.list("display_order").then(setItems).catch(() => setItems([]));
  }, []);

  // ── Derived data ──
  const featured = useMemo(() => {
    if (!items) return [];
    return items.filter((d) => d.is_featured_top_destination);
  }, [items]);

  const filtered = useMemo(() => {
    if (!items) return null;
    const q = query.trim().toLowerCase();
    return items.filter((d) => {
      if (cat !== "all" && d.category !== cat) return false;
      if (region !== "all" && d.regency !== region) return false;
      if (q) {
        const haystack = [d.name_en, d.name_id, d.address].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [items, cat, region, query]);

  const hasActiveFilters = cat !== "all" || region !== "all" || query.trim().length > 0;

  const regionCounts = useMemo(() => {
    if (!items) return {};
    const counts = {};
    items.forEach((d) => {
      counts[d.regency] = (counts[d.regency] || 0) + 1;
    });
    return counts;
  }, [items]);

  const clearFilters = () => {
    setQuery("");
    setCat("all");
    setRegion("all");
  };

  const selectRegion = (r) => {
    setRegion(r);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lbl = (c) => (language === "id" ? c.label_id : c.label_en);

  return (
    <PageShell>
      {/* ① Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--bg-surface-alt)" }}
      >


        <div className="content-wrap relative py-12 md:py-16">
          <h1
            className="font-heading text-[32px] font-bold md:text-[44px] leading-tight"
            style={{ color: "var(--color-primary)" }}
          >
            {t("dest.title")}
          </h1>
          <p
            className="mt-3 max-w-xl text-[16px] md:text-[17px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("dest.subtitle")}
          </p>
        </div>
      </section>

      {/* ② Search & Filter Bar */}
      <div className="content-wrap" ref={gridRef} style={{ scrollMarginTop: "80px" }}>
        <div className="mt-2 md:mt-6 pb-2">
          <Breadcrumb items={[{ label: t("dest.title") }]} />
        </div>
        <div className="sticky top-0 z-20 -mx-5 px-5 sm:-mx-0 sm:px-0 pb-2 pt-2" style={{ backgroundColor: "var(--bg-page)" }}>
          {/* Search input */}
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--text-secondary)" }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("dest.search.placeholder")}
              className="focus-ring h-11 w-full rounded-xl pl-10 pr-10 text-[14px]"
              style={{
                backgroundColor: "var(--bg-surface-alt)",
                color: "var(--text-primary)",
                border: "none",
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--border-color)", color: "var(--text-primary)" }}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            <button
              type="button"
              onClick={() => setCat("all")}
              className="focus-ring shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
              style={
                cat === "all"
                  ? { backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }
                  : { backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }
              }
            >
              {t("filter.all")}
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCat(cat === c.value ? "all" : c.value)}
                className="focus-ring shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
                style={
                  cat === c.value
                    ? { backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }
                    : { backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }
                }
              >
                {lbl(c)}
              </button>
            ))}
          </div>

          {/* Region pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mt-1" style={{ scrollbarWidth: "none" }}>
            <span className="shrink-0 self-center text-[12px] font-semibold mr-1" style={{ color: "var(--text-secondary)" }}>
              {t("dest.filter.region")}
            </span>
            <button
              type="button"
              onClick={() => setRegion("all")}
              className="focus-ring shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
              style={
                region === "all"
                  ? { backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }
                  : { backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }
              }
            >
              {t("filter.all")}
            </button>
            {REGENCIES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRegion(region === r.value ? "all" : r.value)}
                className="focus-ring shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
                style={
                  region === r.value
                    ? { backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }
                    : { backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }
                }
              >
                {lbl(r)}
              </button>
            ))}
          </div>

          {/* Results count + clear */}
          {filtered && (
            <div className="mt-2 mb-1 flex items-center justify-between">
              <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                {filtered.length} {t("dest.results")}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="focus-ring inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--color-primary)" }}
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* ③ Featured Destinations Carousel */}
        {!hasActiveFilters && featured.length > 0 && (
          <section className="mt-4 mb-8">
            <SectionHeading title={t("dest.featured")} />
            <HScrollStrip>
              {featured.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </HScrollStrip>
          </section>
        )}

        {/* ④ All Destinations Grid */}
        <section className="mt-2 pb-8">
          {hasActiveFilters && (
            <h2 className="mb-4 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
              {t("dest.title")}
            </h2>
          )}

          {filtered === null ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-2xl"
                  style={{ backgroundColor: "var(--bg-surface-alt)" }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center rounded-2xl px-6 py-16 text-center"
              style={{ backgroundColor: "var(--bg-surface-alt)" }}
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <Compass className="h-7 w-7" style={{ color: "var(--color-primary)" }} />
              </span>
              <p className="mt-4 text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {t("dest.noResults")}
              </p>
              <p className="mt-1 max-w-sm text-[13px]" style={{ color: "var(--text-secondary)" }}>
                {t("dest.noResults.desc")}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="focus-ring mt-4 rounded-lg px-5 py-2 text-[13px] font-semibold"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          )}
        </section>

        {/* ⑤ Explore by Region */}
        {region === "all" && (
          <section className="pb-12">
            <h2
              className="mb-5 font-heading text-[22px] font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {t("dest.exploreRegion")}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {REGENCIES.map((r) => {
                const count = regionCounts[r.value] || 0;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => selectRegion(r.value)}
                    className="focus-ring group flex flex-col items-center gap-2 rounded-xl px-4 py-5 text-center transition-all hover:shadow-md"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      boxShadow: "var(--elevation-1)",
                    }}
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                      style={{ backgroundColor: "var(--bg-surface-alt)" }}
                    >
                      <MapPin className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
                    </span>
                    <span className="text-[13px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                      {lbl(r)}
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                      {count} {count === 1 ? "destination" : "destinations"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}