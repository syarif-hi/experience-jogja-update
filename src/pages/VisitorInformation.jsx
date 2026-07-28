import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";
import PageShell from "@/components/layout/PageShell";
import VisitorInfoGrid from "@/components/visitor/VisitorInfoGrid";
import VisitorInfoDetail from "./VisitorInfoDetail";
import { DUMMY_VISITOR_INFO } from "@/lib/dummyData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NAV_GROUPS } from "@/lib/navConfig";

function VisitorInfoGridWrapper({ cats }) {
  if (cats === null) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
        ))}
      </div>
    );
  }
  return <VisitorInfoGrid categories={cats} />;
}

export default function VisitorInformation({ hideShell }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [cats, setCats] = useState(null);

  useEffect(() => {
    base44.entities.VisitorInfoCategory.list("display_order").then(setCats).catch(() => setCats([]));
  }, []);

  const intro = language === "id"
    ? "Semua yang perlu Anda ketahui sebelum dan selama perjalanan Anda ke Yogyakarta."
    : "Everything you need to know before and during your trip to Yogyakarta.";

  const displayCats = cats?.length === 0 ? DUMMY_VISITOR_INFO : cats;

  const navGroup = NAV_GROUPS.find((g) => g.to === "/visitor-information");
  const lbl = (o) => (language === "id" ? o.label_id : o.label_en);

  // Active tab logic
  const currentTabPath = location.pathname.split("/").pop();
  const isOverview = currentTabPath === "visitor-information" || currentTabPath === "";
  const activeTab = isOverview ? "overview" : currentTabPath;

  const handleTabChange = (value) => {
    if (value === "overview") {
      navigate("/visitor-information");
    } else {
      navigate(`/visitor-information/${value}`);
    }
  };

  return (
    <PageShell hideShell={hideShell}>
      <div className="w-full py-10" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <div className="content-wrap">
          <h1 className="mb-2 font-heading text-[32px] font-bold md:text-[40px]" style={{ color: "var(--color-primary)" }}>
            {t("visitorInfo.title") || "Visitor Information"}
          </h1>
          <p className="mb-8 max-w-2xl text-[16px]" style={{ color: "var(--text-secondary)" }}>{intro}</p>

          {/* Tab Group */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="inline-flex h-auto flex-wrap items-center justify-start gap-1 rounded-xl p-1" style={{ backgroundColor: "var(--bg-surface)" }}>
              <TabsTrigger
                value="overview"
                className="focus-ring rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors data-[state=active]:shadow-none hover:bg-black/5"
                style={{
                  backgroundColor: activeTab === "overview" ? "var(--color-primary)" : "transparent",
                  color: activeTab === "overview" ? "var(--on-primary)" : "var(--text-secondary)",
                }}
              >
                {language === "id" ? "Semua Informasi" : "All Information"}
              </TabsTrigger>
              {navGroup.items.map((item) => {
                const tabValue = item.to.split("/").pop();
                const isActive = activeTab === tabValue;
                return (
                  <TabsTrigger
                    key={tabValue}
                    value={tabValue}
                    className="focus-ring rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors data-[state=active]:shadow-none hover:bg-black/5"
                    style={{
                      backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                      color: isActive ? "var(--on-primary)" : "var(--text-secondary)",
                    }}
                  >
                    {lbl(item)}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="content-wrap mt-6 pb-16">
        <Routes>
          <Route path="/" element={<VisitorInfoGridWrapper cats={displayCats} />} />
          <Route path=":slug" element={<VisitorInfoDetail hideShell />} />
        </Routes>
      </div>
    </PageShell>
  );
}