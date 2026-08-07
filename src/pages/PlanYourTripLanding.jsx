import React from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NAV_GROUPS } from "@/lib/navConfig";
import TripPlanner from "./TripPlanner";
import Itineraries from "./Itineraries";
import Stays from "./Stays";
import VisitorInformation from "./VisitorInformation";
import ComingSoon from "./ComingSoon";
import TravelTips from "./TravelTips";
import GettingToJogja from "./GettingToJogja";
import GettingAround from "./GettingAround";
import GuideArticleDetail from "./GuideArticleDetail";
import GettingToJogjaArticle from "./GettingToJogjaArticle";
import GettingAroundArticle from "./GettingAroundArticle";
import TravelTipsArticle from "./TravelTipsArticle";

export default function PlanYourTripLanding() {
  const { language } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Find the nav group to extract tab items
  const navGroup = NAV_GROUPS.find((g) => g.to === "/plan-your-trip");
  const lbl = (o) => (language === "id" ? o.label_id : o.label_en);

  // Extract the current tab from the URL pathname
  const basePath = "/plan-your-trip";
  const currentTabPath = location.pathname.startsWith(basePath)
    ? location.pathname.slice(basePath.length).split("/").filter(Boolean)[0]
    : "";
  
  // Check if we're on a detail page (has more than 2 path segments)
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isDetailPage = pathSegments.length > 2;
  
  // Create an array of path segments that correspond to the tabs
  const tabValues = navGroup.items.map(item => item.to.split("/").pop());

  // Determine active value for Tabs. If it's a known tab, use it; otherwise fallback to the first tab.
  const activeTab = tabValues.includes(currentTabPath) ? currentTabPath : tabValues[0];

  const handleTabChange = (value) => {
    navigate(`/plan-your-trip/${value}`);
  };

  return (
    <PageShell>
      <div className="bg-slate-50/50 py-10" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <div className="content-wrap">
          <h1 className="mb-2 font-heading text-[32px] font-bold md:text-[40px]" style={{ color: "var(--color-primary)" }}>
            {lbl(navGroup)}
          </h1>
          <p className="mb-8 max-w-2xl text-[16px]" style={{ color: "var(--text-secondary)" }}>
            {language === "id" ? "Semua yang Anda butuhkan untuk merencanakan perjalanan tak terlupakan ke Jogja." : "Everything you need to plan an unforgettable trip to Jogja."}
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
          
      <div className="content-wrap mt-2 md:mt-6 pb-16">
        {activeTab !== "visitor-information" && !isDetailPage && (
          <Breadcrumb items={[
            { label: lbl(navGroup), to: navGroup.to },
            ...(activeTab !== tabValues[0] ? [{ label: lbl(navGroup.items.find(i => i.to.endsWith(activeTab)) || navGroup.items[0]) }] : []),
          ]} />
        )}
        <Routes>
          <Route path="/" element={<Navigate to={tabValues[0]} replace />} />
          <Route path="trip-planner" element={<TripPlanner hideShell />} />
          <Route path="itineraries" element={<Itineraries hideShell />} />
          <Route path="getting-to-jogja" element={<GettingToJogja hideShell />} />
          <Route path="getting-to-jogja/:slug" element={<GettingToJogjaArticle />} />
          <Route path="getting-around" element={<GettingAround hideShell />} />
          <Route path="getting-around/:slug" element={<GettingAroundArticle />} />
          <Route path="where-to-stay" element={<Stays hideShell />} />
          <Route path="visitor-information/*" element={<VisitorInformation hideShell />} />
          <Route path="travel-tips" element={<TravelTips hideShell />} />
          <Route path="travel-tips/:slug" element={<TravelTipsArticle />} />
        </Routes>
      </div>
    </PageShell>
  );
}
