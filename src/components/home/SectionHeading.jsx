import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SectionHeading({ title, subtitle, center = false, seeMoreTo, right }) {
  const { t } = useTranslation();
  return (
    <div className={`flex items-end justify-between gap-4 ${center ? "text-center" : "text-left"}`}>
      <div>
        <h2 className="font-display text-[30px] font-normal leading-tight md:text-[40px]" style={{ color: "var(--color-primary)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[15px] font-normal md:text-[16px]" style={{ color: "var(--text-secondary)" }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {right}
        {seeMoreTo && (
          <Link
            to={seeMoreTo}
            className="focus-ring inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors md:text-[14px]"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--bg-surface)" }}
          >
            {t("seeMore")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}