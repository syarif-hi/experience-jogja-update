import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { getLocalizedString, buildPath } from "@/lib/visitorInfoHelpers";
import * as Icons from "lucide-react";
import treeData from "@/data/content-tree.json";

function DynamicIcon({ name, className, style }) {
  const pascalName = (name || "circle")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  const IconComponent = Icons[pascalName] || Icons.Circle;
  return <IconComponent className={className} style={style} />;
}

export default function TrailRail({ trail, currentSlugs, forceExpandAll = false }) {
  const { language } = useTranslation();
  
  // trail[1] is the active top-level category if we are deep in the tree
  const activeCategoryId = trail.length > 1 ? trail[1].id : null;
  const currentId = trail[trail.length - 1].id;

  return (
    <nav className="py-2 flex flex-col gap-2" aria-label="Secondary Navigation">
      {/* "All Topics" Root Link */}
      <Link
        to="/visitor-information"
        className="flex items-center gap-3 py-2 px-3 rounded-xl transition-colors duration-200 group mb-2"
        style={{ backgroundColor: activeCategoryId === null ? "var(--bg-surface)" : "transparent" }}
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
          style={{ 
            backgroundColor: activeCategoryId === null ? "var(--color-primary)" : "var(--bg-surface)",
            color: activeCategoryId === null ? "var(--on-primary)" : "var(--text-secondary)"
          }}
        >
          <DynamicIcon name="compass" className="w-4 h-4" />
        </div>
        <span className="text-[15px] font-bold" style={{ color: activeCategoryId === null ? "var(--text-primary)" : "var(--text-secondary)" }}>
          {language === "id" ? "Semua Topik" : "All Topics"}
        </span>
      </Link>

      {/* Accordion Categories */}
      <div className="flex flex-col gap-1.5">
        {(treeData.children || []).map((category) => {
          const isActiveCategory = category.id === activeCategoryId;
          const isExpanded = forceExpandAll || isActiveCategory;
          const categoryPath = buildPath([category.slug]);

          return (
            <div key={category.id} className="flex flex-col">
              {/* Category Header */}
              <Link
                to={categoryPath}
                className="flex items-center gap-3 py-2 px-3 rounded-xl group transition-all duration-300 z-10 relative"
                style={{ backgroundColor: isActiveCategory && trail.length === 2 ? "var(--bg-surface)" : "transparent" }}
              >
                {/* Active category left border indicator when it's the exact current page */}
                {isActiveCategory && trail.length === 2 && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full" style={{ backgroundColor: "var(--color-primary)" }} />
                )}

                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                  style={{ 
                    backgroundColor: isActiveCategory ? "var(--color-primary)" : "var(--bg-surface)",
                    color: isActiveCategory ? "var(--on-primary)" : "var(--text-secondary)"
                  }}
                >
                  <DynamicIcon name={category.icon} className="w-4 h-4" />
                </div>
                <span className="text-[14px] font-bold transition-colors" style={{ color: isActiveCategory ? "var(--text-primary)" : "var(--text-secondary)" }}>
                  {getLocalizedString(category.title, language)}
                </span>
              </Link>

              {/* Sub-topics Timeline (Only shown if expanded) */}
              <div 
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <div className="relative pl-[44px] pb-2">
                    {/* Vertical Connecting Line (centered at 28px) */}
                    <div 
                      className="absolute left-[27px] top-1 bottom-4 w-[2px] rounded-full"
                      style={{ backgroundColor: "var(--border-color)", opacity: 0.5 }}
                    />

                    <div className="flex flex-col gap-0.5 relative z-10">
                      {(category.children || []).map(subTopic => {
                        const subPath = buildPath([category.slug, subTopic.slug]);
                        const isSubActive = trail.some(n => n.id === subTopic.id);
                        
                        return (
                          <div key={subTopic.id} className="relative">
                            {/* Dot indicator on the line (center at 28px, left at 24px) */}
                            <div 
                              className="absolute -left-[20px] top-[14px] w-2 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                backgroundColor: isSubActive ? "var(--color-primary)" : "var(--bg-surface)",
                                transform: isSubActive ? "scale(1.2)" : "scale(1)"
                              }}
                            />
                            
                            <Link
                              to={subPath}
                              className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg group transition-colors duration-200"
                              style={{ backgroundColor: isSubActive && currentId === subTopic.id ? "var(--bg-surface)" : "transparent" }}
                            >
                              <DynamicIcon name={subTopic.icon} className="w-4 h-4 transition-colors" style={{ color: isSubActive ? "var(--color-primary)" : "var(--text-muted)" }} />
                              <span className="text-[13px] font-medium transition-colors hover:underline" style={{ color: isSubActive ? "var(--color-primary)" : "var(--text-secondary)" }}>
                                {getLocalizedString(subTopic.title, language)}
                              </span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </nav>
  );
}
