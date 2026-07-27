import React from "react";
import { useTranslation } from "@/lib/i18n";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import DestinationCardGrid from "@/components/home/DestinationCardGrid";
import EventStrip from "@/components/home/EventStrip";
import NewsSection from "@/components/home/NewsSection";
import CalendarSection from "@/components/home/CalendarSection";
import InteractiveMapsSection from "@/components/home/InteractiveMapsSection";
import TripPlannerBand from "@/components/home/TripPlannerBand";
import VisitorInfoSection from "@/components/home/VisitorInfoSection";
import NewsletterCapture from "@/components/home/NewsletterCapture";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <SiteHeader />
      <main>
        <Hero />
        {/* Interactive Maps */}
        <div id="maps" className="scroll-mt-28"><InteractiveMapsSection /></div>
        {/* 1. Calendar */}
        <div id="calendar" className="scroll-mt-28"><CalendarSection /></div>
        {/* 2. Jogja News */}
        <div id="news" className="scroll-mt-28"><NewsSection /></div>
        {/* 3. Events & Festival */}
        <div id="events" className="scroll-mt-28"><EventStrip /></div>
        {/* 4. Top Destinations */}
        <div id="destinations" className="scroll-mt-28">
          <DestinationCardGrid
            title={t("top.title")}
            subtitle={t("top.subtitle")}
            filterField="is_featured_top_destination"
          />
        </div>
        {/* 5. Recommended Destination */}
        <div id="recommended" className="scroll-mt-28">
          <DestinationCardGrid
            title={t("recommended.title")}
            subtitle={t("recommended.subtitle")}
            filterField="is_recommended_today"
            alt
          />
        </div>
        {/* 6. Explore Jogja */}
        <div id="explore" className="scroll-mt-28"><CategoryGrid /></div>
        {/* 7. Visitor Information */}
        <div id="visitor-info" className="scroll-mt-28"><VisitorInfoSection /></div>
        <div id="trip-planner" className="scroll-mt-28"><TripPlannerBand /></div>
        <NewsletterCapture />
      </main>
      <SiteFooter />
    </div>
  );
}