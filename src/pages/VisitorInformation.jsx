import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import VisitorInfoGrid from "@/components/visitor/VisitorInfoGrid";
import { DUMMY_VISITOR_INFO } from "@/lib/dummyData";

export default function VisitorInformation({ hideShell }) {
  const { t, language } = useTranslation();
  const [cats, setCats] = useState(null);

  useEffect(() => {
    base44.entities.VisitorInfoCategory.list("display_order").then(setCats).catch(() => setCats([]));
  }, []);

  const intro = language === "id"
    ? "Semua yang perlu Anda ketahui sebelum dan selama perjalanan Anda ke Yogyakarta."
    : "Everything you need to know before and during your trip to Yogyakarta.";

  const displayCats = cats?.length === 0 ? DUMMY_VISITOR_INFO : cats;

  return (
    <PageShell hideShell={hideShell}>
      <div className={hideShell ? "pt-2" : "content-wrap section-y"}>
        <h1 className="font-display text-[34px] font-bold uppercase md:text-[44px]" style={{ color: "var(--color-primary)" }}>
          {t("visitorInfo.title") || "Visitor Information"}
        </h1>
        <p className="mt-2 max-w-2xl text-[16px]" style={{ color: "var(--text-secondary)" }}>{intro}</p>

        <div className="mt-10">
          {displayCats === null ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
              ))}
            </div>
          ) : (
            <VisitorInfoGrid categories={displayCats} />
          )}
        </div>
      </div>
    </PageShell>
  );
}