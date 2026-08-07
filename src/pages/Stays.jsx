import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Star, Search, X, Compass, ArrowUpDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { REGENCIES, regencyLabel } from "@/lib/regencies";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { DUMMY_STAYS } from "@/lib/dummyData";

export default function Stays({ hideShell, forcedRegency }) {
  const { t, language } = useTranslation();
  const { currency } = useCurrency();
  const [searchParams] = useSearchParams();
  const initialRegion = forcedRegency || searchParams.get("region") || "all";

  const [items, setItems] = useState(null);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState(initialRegion);
  const [sort, setSort] = useState("recommended");
  const gridRef = useRef(null);

  useEffect(() => {
    base44.entities.Stay.list("-is_featured").then(setItems).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    const r = searchParams.get("region");
    if (r) setRegion(r);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!items) return null;
    const sourceItems = items.length > 0 ? items : DUMMY_STAYS;
    const q = query.trim().toLowerCase();

    let list = sourceItems.filter((s) => {
      if (region !== "all" && s.regency !== region) return false;
      if (q) {
        const haystack = [s.name_en, s.name_id, s.address].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      const nameA = (language === "id" ? a.name_id : a.name_en) || "";
      const nameB = (language === "id" ? b.name_id : b.name_en) || "";

      switch (sort) {
        case "az":
          return nameA.localeCompare(nameB);
        case "za":
          return nameB.localeCompare(nameA);
        case "price-low": {
          const pA = a.price_idr_per_night != null ? a.price_idr_per_night : Infinity;
          const pB = b.price_idr_per_night != null ? b.price_idr_per_night : Infinity;
          return pA - pB;
        }
        case "price-high": {
          const pA = a.price_idr_per_night != null ? a.price_idr_per_night : -Infinity;
          const pB = b.price_idr_per_night != null ? b.price_idr_per_night : -Infinity;
          return pB - pA;
        }
        case "rating": {
          const rA = a.star_rating != null ? a.star_rating : -Infinity;
          const rB = b.star_rating != null ? b.star_rating : -Infinity;
          return rB - rA;
        }
        case "recommended":
        default: {
          const oA = a.display_order ?? 9999;
          const oB = b.display_order ?? 9999;
          return oA - oB;
        }
      }
    });

    return list;
  }, [items, region, query, sort, language]);

  const hasActiveFilters = region !== "all" || query.trim().length > 0 || sort !== "recommended";

  const clearFilters = () => {
    setQuery("");
    setRegion("all");
    setSort("recommended");
  };

  const lbl = (c) => (language === "id" ? c.label_id : c.label_en);

  return (
    <PageShell
      title={t("stays.title") || "Places to Stay"}
      subtitle={t("stays.subtitle") || "Hotels and accommodations across the special region of Yogyakarta."}
      hideShell={hideShell}
    >
      <div className={hideShell ? "pt-2" : "content-wrap"} ref={gridRef} style={{ scrollMarginTop: "80px" }}>
        
        {/* Search & Filter Bar */}
        <div className="sticky top-0 z-20 -mx-5 px-5 sm:-mx-0 sm:px-0 pb-2 pt-4" style={{ backgroundColor: "var(--bg-page)" }}>
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === "id" ? "Cari penginapan..." : "Search places to stay..."}
              className="focus-ring h-11 w-full rounded-xl pl-10 pr-10 text-[14px]"
              style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)", border: "none" }}
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

          {!forcedRegency && (
            <div className="flex gap-2 overflow-x-auto pb-2 mt-1" style={{ scrollbarWidth: "none" }}>
              <span className="shrink-0 self-center text-[12px] font-semibold mr-1" style={{ color: "var(--text-secondary)" }}>
                {t("dest.filter.region") || "Region:"}
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
                {t("filter.all") || "All Regions"}
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
          )}

          {filtered && (
            <div className="mt-2 mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  {filtered.length} {language === "id" ? "hasil" : "results"}
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
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="focus-ring h-9 rounded-lg pl-3 pr-8 text-[13px] font-semibold appearance-none cursor-pointer"
                  style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)", border: "none" }}
                >
                  <option value="recommended">{language === "id" ? "Rekomendasi" : "Recommended"}</option>
                  <option value="az">A - Z</option>
                  <option value="za">Z - A</option>
                  <option value="price-low">{language === "id" ? "Harga Terendah" : "Price: Low to High"}</option>
                  <option value="price-high">{language === "id" ? "Harga Tertinggi" : "Price: High to Low"}</option>
                  <option value="rating">{language === "id" ? "Bintang Tertinggi" : "Highest Rating"}</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                  <ArrowUpDown className="h-3.5 w-3.5" style={{ color: "var(--text-secondary)" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <section className="mt-4 pb-16">
          {filtered === null ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl px-6 py-16 text-center" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "var(--bg-surface)" }}>
                <Compass className="h-7 w-7" style={{ color: "var(--color-primary)" }} />
              </span>
              <p className="mt-4 text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {t("dest.noResults") || "No places found"}
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
              {filtered.map((s) => {
                const name = language === "id" ? s.name_id : s.name_en;
                return (
                  <Link key={s.id} to={`/stays/${s.slug}`} className="group focus-ring block rounded-2xl">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                      <SmartImage src={s.hero_image_url} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="pt-3">
                      {s.star_rating && (
                        <span className="inline-flex items-center gap-0.5 text-[12px]" style={{ color: "var(--color-accent)" }}>
                          {Array.from({ length: s.star_rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                        </span>
                      )}
                      <h3 className="mt-1 truncate text-[15px] font-bold" style={{ color: "var(--color-primary)" }}>{name}</h3>
                      <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{regencyLabel(s.regency, language)}</p>
                      {typeof s.price_idr_per_night === "number" && (
                        <p className="mt-1 text-[13px] font-semibold" style={{ color: "var(--color-primary)" }}>
                          {formatPrice(s.price_idr_per_night, currency)} {t("stay.perNight") || "/ night"}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}