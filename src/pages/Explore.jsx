import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Compass, Sparkles, TreePine, Landmark, UtensilsCrossed } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { REGENCIES } from "@/lib/regencies";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DestinationCard from "@/components/shared/DestinationCard";
import HScrollStrip from "@/components/home/HScrollStrip";

/* ─── Themed recommendation sections ─── */
const RECOMMEND_SECTIONS = [
  {
    key: "editorPicks",
    icon: Sparkles,
    iconBg: "var(--tag-culture)",
    filter: (d) => d.is_featured_top_destination,
  },
  {
    key: "nature",
    icon: TreePine,
    iconBg: "var(--tag-nature)",
    filter: (d) => d.category === "nature-outdoor",
  },
  {
    key: "temples",
    icon: Landmark,
    iconBg: "var(--tag-heritage)",
    filter: (d) => d.category === "cultural-heritage-temples" || d.category === "landmarks",
  },
  {
    key: "culinary",
    icon: UtensilsCrossed,
    iconBg: "var(--tag-lifestyle)",
    filter: (d) => d.category === "eat-drink",
  },
];

/* ─── Storytelling Section Component ─── */
function StorySection({ sectionKey, icon: Icon, iconBg, items, t, categorySlug }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Section header with icon + storytelling */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="h-4.5 w-4.5" style={{ color: "#fff" }} />
          </span>
          <h2
            className="font-heading text-[22px] md:text-[26px] font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {t(`explore.${sectionKey}`)}
          </h2>
        </div>
        <p
          className="max-w-2xl text-[14px] md:text-[15px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {t(`explore.${sectionKey}.story`)}
        </p>
      </div>

      {/* Horizontal scroll strip of cards (desktop) / 2-col grid (mobile) */}
      <div className="grid grid-cols-2 gap-4 sm:hidden">
        {items.map((d) => (
          <DestinationCard key={d.id} destination={d} />
        ))}
      </div>
      <div className="hidden sm:block">
        <HScrollStrip>
          {items.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </HScrollStrip>
      </div>

      {/* "See All" link to directory page pre-filtered */}
      {categorySlug && (
        <div className="mt-3 text-right">
          <Link
            to={`/destinations?cat=${categorySlug}`}
            className="inline-flex items-center gap-1 text-[13px] font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--color-primary)", textDecoration: "none" }}
          >
            {t("explore.seeCategory")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}

/* ─── Main Explore Page ─── */
export default function Explore() {
  const { t, language } = useTranslation();
  const [items, setItems] = useState(null);

  useEffect(() => {
    base44.entities.Destination.list("display_order").then(setItems).catch(() => setItems([]));
  }, []);

  // Build each themed section's items
  const sectionData = useMemo(() => {
    if (!items) return {};
    const result = {};
    RECOMMEND_SECTIONS.forEach((s) => {
      result[s.key] = items.filter(s.filter);
    });
    return result;
  }, [items]);

  const regionCounts = useMemo(() => {
    if (!items) return {};
    const counts = {};
    items.forEach((d) => {
      if (d.regency) counts[d.regency] = (counts[d.regency] || 0) + 1;
    });
    return counts;
  }, [items]);

  const lbl = (c) => (language === "id" ? c.label_id : c.label_en);
  const isLoading = items === null;

  return (
    <PageShell>
      {/* ① Hero — Editorial intro */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--bg-surface-alt)" }}
      >
        <div className="content-wrap relative py-12 md:py-16">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
            <span
              className="text-[12px] font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--color-primary)" }}
            >
              {language === "id" ? "Panduan Lokal" : "Local Guide"}
            </span>
          </div>
          <h1
            className="font-heading text-[32px] font-bold md:text-[44px] leading-tight"
            style={{ color: "var(--color-primary)" }}
          >
            {t("explore.title")}
          </h1>
          <p
            className="mt-3 max-w-2xl text-[15px] md:text-[17px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("explore.subtitle")}
          </p>
        </div>
      </section>

      <div className="content-wrap">
        <div className="mt-2 md:mt-6 pb-2">
          <Breadcrumb items={[{ label: t("explore.title") }]} />
        </div>

        {/* ② Loading skeleton */}
        {isLoading && (
          <section className="mt-6 mb-10">
            <div className="mb-5">
              <div className="h-7 w-48 animate-pulse rounded-lg mb-2" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
              <div className="h-4 w-96 max-w-full animate-pulse rounded-lg" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] w-full animate-pulse rounded-2xl"
                  style={{ backgroundColor: "var(--bg-surface-alt)" }}
                />
              ))}
            </div>
            <div className="hidden sm:block">
              <HScrollStrip>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] w-[260px] shrink-0 animate-pulse rounded-2xl"
                    style={{ backgroundColor: "var(--bg-surface-alt)" }}
                  />
                ))}
              </HScrollStrip>
            </div>
          </section>
        )}

        {/* ③ Themed Recommendation Sections */}
        {!isLoading && (
          <div className="mt-6">
            {RECOMMEND_SECTIONS.map((section) => {
              // Map section keys to category slugs for "See All" links
              const catSlugMap = {
                nature: "nature-outdoor",
                temples: "cultural-heritage-temples",
                culinary: "eat-drink",
              };
              return (
                <StorySection
                  key={section.key}
                  sectionKey={section.key}
                  icon={section.icon}
                  iconBg={section.iconBg}
                  items={sectionData[section.key]}
                  t={t}
                  categorySlug={catSlugMap[section.key] || null}
                />
              );
            })}
          </div>
        )}

        {/* ④ Explore by Area — with storytelling intro */}
        {!isLoading && (
          <section className="mb-10">
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <MapPin className="h-4.5 w-4.5" style={{ color: "var(--on-primary)" }} />
                </span>
                <h2
                  className="font-heading text-[22px] md:text-[26px] font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("explore.regionIntro")}
                </h2>
              </div>
              <p
                className="max-w-2xl text-[14px] md:text-[15px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("explore.regionIntro.story")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {REGENCIES.map((r) => {
                const count = regionCounts[r.value] || 0;
                return (
                  <Link
                    key={r.value}
                    to={`/destinations?region=${r.value}`}
                    className="focus-ring group flex flex-col items-center gap-2 rounded-xl bg-slate-100 px-4 py-5 text-center transition-colors hover:bg-slate-200"
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center transition-transform group-hover:scale-110"
                    >
                      <MapPin className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
                    </span>
                    <span className="text-[13px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                      {lbl(r)}
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                      {count} {count === 1 ? "destination" : "destinations"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ⑤ CTA Banner — View All Destinations */}
        <section className="pb-12">
          <div
            className="rounded-2xl px-6 py-10 md:py-14 text-center"
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)",
              boxShadow: "var(--elevation-2)",
            }}
          >
            <Compass className="mx-auto h-10 w-10 mb-4" style={{ color: "var(--on-primary)", opacity: 0.8 }} />
            <h2
              className="font-heading text-[22px] md:text-[28px] font-bold"
              style={{ color: "var(--on-primary)" }}
            >
              {t("explore.viewAllDesc")}
            </h2>
            <Link
              to="/destinations"
              className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: "var(--bg-surface)",
                color: "var(--color-primary)",
                textDecoration: "none",
                boxShadow: "var(--elevation-1)",
              }}
            >
              {t("explore.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}