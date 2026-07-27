import React from "react";
import { Link } from "react-router-dom";
import { Map } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function TripPlannerBand() {
  const { t } = useTranslation();
  return (
    <section className="section-y" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
      <div className="content-wrap">
        <div
          className="flex flex-col items-start gap-6 rounded-3xl p-8 md:flex-row md:items-center md:justify-between md:p-12"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <div className="max-w-[52ch]">
            <div className="flex items-center gap-3">
              <Map className="h-6 w-6 text-white" />
              <h2 className="font-display text-[26px] font-normal leading-tight text-white md:text-[34px]">
                {t("tripband.title")}
              </h2>
            </div>
            <p className="mt-3 text-[15px] font-normal leading-relaxed text-white/90 md:text-[16px]">
              {t("tripband.subtitle")}
            </p>
          </div>
          <Link
            to="/trip-planner"
            className="focus-ring inline-flex shrink-0 items-center rounded-lg px-6 py-3 text-[15px] font-semibold transition-colors"
            style={{ backgroundColor: "var(--color-accent)", color: "var(--on-accent)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
          >
            {t("tripband.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}