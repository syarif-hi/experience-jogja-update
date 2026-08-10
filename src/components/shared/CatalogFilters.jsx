import React, { useMemo, useState } from "react";
import { Search, X, ArrowUpDown, Compass } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { REGENCIES } from "@/lib/regencies";

/**
 * Reusable catalog filter bar for booking sub-pages.
 *
 * Props:
 *  - items: array | null (null = loading)
 *  - priceKey: string — field used for price sorting (e.g. "price_idr", "price_idr_per_night"). Omit to hide price sort.
 *  - ratingKey: string — field for rating sort (e.g. "star_rating"). Omit to hide.
 *  - hideRegion: boolean — hide region filter (e.g. transportation)
 *  - extraFilter: { key, label_en, label_id, values: [{value, label_en, label_id}] } — one extra chip row (e.g. cuisine, type)
 *  - searchPlaceholder: { en, id }
 *  - children: (filteredItems) => ReactNode
 *  - onClearScroll: () => void — optional scroll callback
 */
export default function CatalogFilters({
  items,
  priceKey,
  ratingKey,
  hideRegion = false,
  extraFilter,
  searchPlaceholder = { en: "Search...", id: "Cari..." },
  children,
}) {
  const { t, language } = useTranslation();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [extraValue, setExtraValue] = useState("all");
  const [sort, setSort] = useState("recommended");

  const filtered = useMemo(() => {
    if (!items) return null;
    const q = query.trim().toLowerCase();

    let list = items.filter((s) => {
      if (!hideRegion && region !== "all" && s.regency !== region) return false;
      if (extraFilter && extraValue !== "all" && s[extraFilter.key] !== extraValue) return false;
      if (q) {
        const haystack = [s.name_en, s.name_id, s.address, s.descriptor_en, s.descriptor_id]
          .filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      const nameA = (language === "id" ? a.name_id : a.name_en) || "";
      const nameB = (language === "id" ? b.name_id : b.name_en) || "";
      switch (sort) {
        case "az": return nameA.localeCompare(nameB);
        case "za": return nameB.localeCompare(nameA);
        case "price-low": {
          if (!priceKey) return 0;
          const pA = a[priceKey] != null ? a[priceKey] : Infinity;
          const pB = b[priceKey] != null ? b[priceKey] : Infinity;
          return pA - pB;
        }
        case "price-high": {
          if (!priceKey) return 0;
          const pA = a[priceKey] != null ? a[priceKey] : -Infinity;
          const pB = b[priceKey] != null ? b[priceKey] : -Infinity;
          return pB - pA;
        }
        case "rating": {
          if (!ratingKey) return 0;
          const rA = a[ratingKey] != null ? a[ratingKey] : -Infinity;
          const rB = b[ratingKey] != null ? b[ratingKey] : -Infinity;
          return rB - rA;
        }
        default: {
          const oA = a.display_order ?? 9999;
          const oB = b.display_order ?? 9999;
          return oA - oB;
        }
      }
    });
    return list;
  }, [items, region, extraValue, query, sort, language, priceKey, ratingKey, hideRegion, extraFilter]);

  const hasActive = region !== "all" || extraValue !== "all" || query.trim().length > 0 || sort !== "recommended";
  const clearFilters = () => { setQuery(""); setRegion("all"); setExtraValue("all"); setSort("recommended"); };

  const lbl = (c) => (language === "id" ? c.label_id : c.label_en);
  const chip = (active) =>
    active
      ? { backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }
      : { backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" };

  return (
    <>
      <div className="sticky top-0 z-20 -mx-5 px-5 sm:-mx-0 sm:px-0 pb-2 pt-4" style={{ backgroundColor: "var(--bg-page)" }}>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === "id" ? searchPlaceholder.id : searchPlaceholder.en}
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

        {/* Region chips */}
        {!hideRegion && (
          <div className="flex gap-2 overflow-x-auto pb-2 mt-1" style={{ scrollbarWidth: "none" }}>
            <span className="shrink-0 self-center text-[12px] font-semibold mr-1" style={{ color: "var(--text-secondary)" }}>
              {t("dest.filter.region") || "Region:"}
            </span>
            <button
              type="button"
              onClick={() => setRegion("all")}
              className="focus-ring shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
              style={chip(region === "all")}
            >
              {t("filter.all") || "All Regions"}
            </button>
            {REGENCIES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRegion(region === r.value ? "all" : r.value)}
                className="focus-ring shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
                style={chip(region === r.value)}
              >
                {lbl(r)}
              </button>
            ))}
          </div>
        )}

        {/* Extra filter chips */}
        {extraFilter && (
          <div className="flex gap-2 overflow-x-auto pb-2 mt-1" style={{ scrollbarWidth: "none" }}>
            <span className="shrink-0 self-center text-[12px] font-semibold mr-1" style={{ color: "var(--text-secondary)" }}>
              {language === "id" ? extraFilter.label_id : extraFilter.label_en}
            </span>
            <button
              type="button"
              onClick={() => setExtraValue("all")}
              className="focus-ring shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
              style={chip(extraValue === "all")}
            >
              {language === "id" ? "Semua" : "All"}
            </button>
            {extraFilter.values.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => setExtraValue(extraValue === v.value ? "all" : v.value)}
                className="focus-ring shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
                style={chip(extraValue === v.value)}
              >
                {language === "id" ? v.label_id : v.label_en}
              </button>
            ))}
          </div>
        )}

        {/* Result count + sort */}
        {filtered && (
          <div className="mt-2 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                {filtered.length} {language === "id" ? "hasil" : "results"}
              </span>
              {hasActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="focus-ring inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--color-primary)" }}
                >
                  <X className="h-3 w-3" />
                  {language === "id" ? "Bersihkan" : "Clear"}
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
                {priceKey && <option value="price-low">{language === "id" ? "Harga Terendah" : "Price: Low to High"}</option>}
                {priceKey && <option value="price-high">{language === "id" ? "Harga Tertinggi" : "Price: High to Low"}</option>}
                {ratingKey && <option value="rating">{language === "id" ? "Bintang Tertinggi" : "Highest Rating"}</option>}
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
              {t("dest.noResults") || (language === "id" ? "Tidak ada hasil" : "No results found")}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="focus-ring mt-4 rounded-lg px-5 py-2 text-[13px] font-semibold"
              style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
            >
              {language === "id" ? "Bersihkan Filter" : "Clear Filters"}
            </button>
          </div>
        ) : (
          children(filtered)
        )}
      </section>
    </>
  );
}
