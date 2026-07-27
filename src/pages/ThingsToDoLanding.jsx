import React from "react";
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NAV_GROUPS } from "@/lib/navConfig";
import Destinations from "./Destinations";

// Wrapper to extract type and pass it to Destinations component
function ThingsToDoContent() {
  const { type } = useParams();
  return <Destinations hideShell forcedType={type} />;
}

export default function ThingsToDoLanding() {
  const { language } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navGroup = NAV_GROUPS.find((g) => g.to === "/things-to-do");
  const lbl = (o) => (language === "id" ? o.label_id : o.label_en);

  const currentTabPath = location.pathname.split("/").pop();
  const tabValues = navGroup.items.map(item => item.to.split("/").pop());
  const activeTab = tabValues.includes(currentTabPath) ? currentTabPath : tabValues[0];

  const handleTabChange = (value) => {
    navigate(`/things-to-do/${value}`);
  };

  return (
    <PageShell>
      <div className="bg-slate-50/50 py-10" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <div className="content-wrap">
          <h1 className="mb-2 font-heading text-[32px] font-bold md:text-[40px]" style={{ color: "var(--color-primary)" }}>
            {lbl(navGroup)}
          </h1>
          <p className="mb-8 max-w-2xl text-[16px]" style={{ color: "var(--text-secondary)" }}>
            {language === "id" ? "Temukan berbagai aktivitas seru di Yogyakarta berdasarkan minat Anda." : "Find exciting activities in Yogyakarta based on your interests."}
          </p>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="inline-flex h-auto flex-wrap items-center justify-start gap-1 rounded-xl p-1" style={{ backgroundColor: "var(--bg-surface)" }}>
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
          <Route path="/" element={<Navigate to={tabValues[0]} replace />} />
          <Route path=":type" element={<ThingsToDoContent />} />
        </Routes>
      </div>
    </PageShell>
  );
}
