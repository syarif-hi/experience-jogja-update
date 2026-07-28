import React from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, Plane, Bus, Sun, Banknote, Activity, Heart, Wifi, Phone } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import { DUMMY_VISITOR_INFO } from "@/lib/dummyData";
import { getVisitorItemIcon } from "@/lib/visitorIcons";

const ICON_MAP = {
  Passport: Plane, Bus, Sun, Banknote, HeartPulse: Activity, Heart, Wifi, Phone,
};

export default function VisitorInfoDetail({ hideShell }) {
  const { slug } = useParams();
  const { language } = useTranslation();
  
  // Load data synchronously for SEO and performance
  const category = DUMMY_VISITOR_INFO.find((c) => c.slug === slug);

  if (!category) {
    return (
      <PageShell hideShell={hideShell}>
        <div className="content-wrap section-y py-20 text-center">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Information not found</h1>
          <Link to="/visitor-information" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Visitor Information
          </Link>
        </div>
      </PageShell>
    );
  }

  const title = language === "id" ? category.title_id : category.title_en;
  const desc = language === "id" ? category.desc_id : category.desc_en;
  const items = category.items || [];
  const Icon = ICON_MAP[category.icon_name] || Plane;

  return (
    <PageShell hideShell={hideShell}>
      {/* Hero Section */}
      <div className="relative h-[20vh] min-h-[150px] w-full bg-black/10 md:h-[25vh]">
        <SmartImage src={category.image_url} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* Content Section */}
      <div className="content-wrap section-y">
        <div className="mx-auto w-full">
          <div className="text-center mb-12">
            <h1 className="font-display text-[36px] md:text-[48px] font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {title}
            </h1>
            <p className="text-[18px] leading-relaxed md:text-[20px]" style={{ color: "var(--text-secondary)" }}>
              {desc}
            </p>
          </div>
          
          {items.length > 0 && (
            <div className="flex flex-col space-y-16">
              {items.map((item, i) => {
                const itemTitle = language === "id" ? item.title_id : item.title_en;
                const itemDesc = language === "id" ? item.desc_id : item.desc_en;
                const ItemIcon = getVisitorItemIcon(item.title_en);
                
                return (
                  <div key={i} className="flex flex-col" id={item.title_en.toLowerCase().replace(/\s+/g, '-')}>
                    {/* Section Header */}
                    <div className="flex items-center gap-4 mb-6 border-b pb-4" style={{ borderColor: "var(--bg-surface-alt)" }}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--color-primary)15", color: "var(--color-primary)" }}>
                        <ItemIcon className="h-6 w-6" />
                      </div>
                      <h2 className="font-display text-[26px] md:text-[32px] font-bold" style={{ color: "var(--text-primary)" }}>
                        {itemTitle}
                      </h2>
                    </div>
                    
                    {/* Section Content */}
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="w-full md:w-1/2 overflow-hidden rounded-2xl relative aspect-[16/9]">
                        <SmartImage src={item.image_url} alt={itemTitle} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <p className="text-[16px] md:text-[18px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {itemDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
