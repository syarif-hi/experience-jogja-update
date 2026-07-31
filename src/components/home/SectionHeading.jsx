import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SectionHeading({ title, subtitle, center = false, seeMoreTo, right }) {
  const { t } = useTranslation();

  const formatTitle = (txt) => {
    if (typeof txt !== "string") return txt;
    const parts = txt.trim().split(" ");
    if (parts.length <= 1) return txt;
    const mid = Math.ceil(parts.length / 2);
    return (
      <>
        {parts.slice(0, mid).join(" ")}
        <br className="md:hidden" />
        <span className="hidden md:inline"> </span>
        {parts.slice(mid).join(" ")}
      </>
    );
  };

  return (
    <div className={`flex items-start justify-between gap-4 ${center ? "text-center" : "text-left"}`}>
      <div>
        <h2 className="font-display text-[30px] font-normal leading-[1] md:leading-tight md:text-[40px]" style={{ color: "var(--color-primary)" }}>
          {formatTitle(title)}
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
            className="focus-ring inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-[13px] font-semibold  tracking-wide transition-colors md:text-[14px]"
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