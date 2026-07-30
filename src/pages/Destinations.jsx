import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import DestinationCard from "@/components/shared/DestinationCard";
import { CATEGORIES } from "@/lib/categories";
import { regencyLabel } from "@/lib/regencies";
import { experienceTypeLabel } from "@/lib/experienceTypes";
import { DUMMY_DESTINATIONS } from "@/lib/dummyData";

export default function Destinations({ hideShell = false, forcedType, forcedRegency }) {
  const { t, language } = useTranslation();
  const [items, setItems] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const regency = forcedRegency || params.get("regency");
  const type = forcedType || params.get("type"); // experience_type
  const initialCat = params.get("category") || "all";
  const [cat, setCat] = useState(initialCat);

  useEffect(() => {
    base44.entities.Destination.list("display_order").then(setItems).catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    let list = items.length === 0 ? DUMMY_DESTINATIONS : items;
    if (regency) list = list.filter((d) => d.regency === regency);
    if (type) list = list.filter((d) => (d.experience_type || []).includes(type));
    if (!regency && !type && cat !== "all") list = list.filter((d) => d.category === cat);
    return list;
  }, [items, cat, regency, type]);

  const headerTitle = regency
    ? regencyLabel(regency, language)
    : type
    ? experienceTypeLabel(type, language)
    : t("dest.title");
  const headerSubtitle = regency
    ? (language === "id" ? "Destinasi di wilayah ini" : "Destinations in this regency")
    : type
    ? (language === "id" ? "Berdasarkan jenis pengalaman" : "By experience type")
    : t("dest.subtitle");

  const showChips = !regency && !type;
  const chips = [
    { value: "all", label: t("filter.all") },
    ...CATEGORIES.map((c) => ({ value: c.value, label: language === "id" ? c.label_id : c.label_en })),
  ];

  const content = (
    <div className={hideShell ? "pt-2" : "content-wrap"}>
      {showChips && (
        <div className="mt-6 flex flex-wrap gap-2">
          {chips.map((o) => {
            const active = cat === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => setCat(o.value)}
                aria-pressed={active}
                className="focus-ring rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors"
                style={{
                  backgroundColor: active ? "var(--color-primary)" : "var(--bg-surface-alt)",
                  color: active ? "var(--on-primary)" : "var(--text-secondary)",
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 pb-16 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {filtered === null ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
          ))
        ) : filtered.length === 0 ? (
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>{t("empty.none")}</p>
        ) : (
          filtered.map((d) => <DestinationCard key={d.id} destination={d} />)
        )}
      </div>
    </div>
  );

  if (hideShell) {
    return content;
  }

  return (
    <PageShell title={headerTitle} subtitle={headerSubtitle}>
      {content}
    </PageShell>
  );
}