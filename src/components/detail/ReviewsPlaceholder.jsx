import React from "react";
import { Star } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

// Honest placeholder — no fabricated ratings. Real UGC reviews are a later phase.
export default function ReviewsPlaceholder() {
  const { t } = useTranslation();
  return (
    <section className="mt-10">
      <h2 className="mb-4 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
        {t("reviews.title") || "Reviews"}
      </h2>
      <div className="flex flex-col items-center rounded-2xl px-6 py-10 text-center" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: "var(--bg-surface)" }}>
          <Star className="h-6 w-6" style={{ color: "var(--color-accent)" }} />
        </span>
        <p className="mt-3 text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
          {t("reviews.comingSoon") || "Reviews coming soon"}
        </p>
        <p className="mt-1 max-w-sm text-[13px]" style={{ color: "var(--text-secondary)" }}>
          {t("reviews.comingSoonDesc") || "Traveler reviews will appear here in a future update."}
        </p>
      </div>
    </section>
  );
}