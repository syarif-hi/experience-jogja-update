import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { getLocalizedString, buildPath } from "@/lib/visitorInfoHelpers";

export default function BreadcrumbTrail({ trail }) {
  const { language } = useTranslation();
  const [popoverOpenMobile, setPopoverOpenMobile] = useState(false);
  const [popoverOpenDesktop, setPopoverOpenDesktop] = useState(false);

  // DESKTOP: never collapse
  let desktopVisible = trail;
  let desktopCollapsed = [];

  // MOBILE: collapse if > 2
  let mobileVisible = trail;
  let mobileCollapsed = [];
  if (trail.length > 2) {
    mobileCollapsed = trail.slice(0, trail.length - 2);
    mobileVisible = [{ isEllipsis: true }, trail[trail.length - 2], trail[trail.length - 1]];
  }

  const renderTrail = (visibleTrail, collapsedNodes, isMobile) => {
    const popoverOpen = isMobile ? popoverOpenMobile : popoverOpenDesktop;
    const setPopoverOpen = isMobile ? setPopoverOpenMobile : setPopoverOpenDesktop;
    
    return (
      <ol className={`items-center w-full min-w-0 ${isMobile ? "flex md:hidden" : "hidden md:flex"}`}>
        {visibleTrail.map((node, idx) => {
          const isLast = idx === visibleTrail.length - 1;
          
          if (node.isEllipsis) {
            return (
              <li key="ellipsis" className="flex items-center relative shrink-0">
                {/* Connecting line from prev (only if not first item) */}
                {idx > 0 && (
                  <div className="w-4 shrink-0 h-px" style={{ backgroundColor: "var(--border-color)" }}></div>
                )}
                
                <button 
                  onClick={() => setPopoverOpen(!popoverOpen)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-expanded={popoverOpen}
                  aria-label="Show collapsed breadcrumbs"
                >
                  <span className="text-xl leading-none -mt-2" style={{ color: "var(--text-secondary)" }}>...</span>
                </button>
                
                {/* Popover */}
                {popoverOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setPopoverOpen(false)}
                    />
                    <div 
                      className="absolute top-10 left-0 z-50 py-2 rounded-xl min-w-[200px] shadow-lg"
                      style={{ backgroundColor: "var(--bg-surface)" }}
                    >
                      {collapsedNodes.map((cNode, cIdx) => {
                        // We need the full path up to this node. Root is idx 0 -> slice(1,1) is []
                        const cSlugs = trail.slice(1, trail.findIndex(t => t.id === cNode.id) + 1).map(n => n.slug);
                        const cPath = buildPath(cSlugs);
                        return (
                          <Link 
                            key={cNode.id}
                            to={cPath}
                            onClick={() => setPopoverOpen(false)}
                            className="block px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {cNode.id === "page-visitor-information" ? (language === "id" ? "Informasi Wisatawan" : "Visitor Information") : getLocalizedString(cNode.title, language)}
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </li>
            );
          }

          // Normal Node
          const isHub = trail.findIndex(t => t.id === node.id) === 0;
          // Compute full path up to this node
          const nodeIndexInFullTrail = trail.findIndex(t => t.id === node.id);
          const slugs = isHub ? [] : trail.slice(1, nodeIndexInFullTrail + 1).map(n => n.slug);
          const path = buildPath(slugs);

          return (
            <li key={node.id} className="flex items-center group min-w-0 shrink">
              {idx > 0 && (
                <div className="w-4 shrink-0 h-px transition-colors duration-200" style={{ backgroundColor: "var(--color-primary)", opacity: isLast ? 1 : 0.4 }}></div>
              )}
              
              <Link
                to={path}
                className="flex items-center gap-2 py-1 px-1 rounded-md outline-none focus-visible:ring-2 min-w-0"
                style={{ color: isLast ? "var(--text-primary)" : "var(--text-secondary)" }}
                aria-current={isLast ? "page" : undefined}
              >
                <div className="relative flex shrink-0 items-center justify-center w-5 h-5">
                  {isLast && (
                    <div className="absolute inset-0 rounded-full opacity-20" style={{ backgroundColor: "var(--color-primary)" }}></div>
                  )}
                  <div 
                    className="rounded-full transition-colors duration-200"
                    style={{ 
                      width: isLast ? '10px' : '8px', 
                      height: isLast ? '10px' : '8px',
                      backgroundColor: "var(--color-primary)",
                      opacity: isLast ? 1 : 0.4
                    }}
                  ></div>
                </div>
                <span className={`text-sm font-medium truncate transition-opacity duration-200 ${isLast ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                  {isHub ? (language === "id" ? "Informasi Wisatawan" : "Visitor Information") : getLocalizedString(node.title, language)}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    );
  };

  return (
    <nav aria-label="Breadcrumb" className="h-11 md:h-12 flex items-center relative w-full">
      {renderTrail(desktopVisible, desktopCollapsed, false)}
      {renderTrail(mobileVisible, mobileCollapsed, true)}
    </nav>
  );
}
