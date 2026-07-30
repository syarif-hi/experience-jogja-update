import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { getLocalizedString, buildPath, getSiblings } from "@/lib/visitorInfoHelpers";

export default function SiblingChipScroller({ currentSlugs, node }) {
  const { language } = useTranslation();
  
  const siblings = getSiblings(currentSlugs);
  
  if (siblings.length <= 1) return null;

  const parentSlugs = currentSlugs.slice(0, -1);

  return (
    <div className="relative -mx-6 px-6 sm:-mx-8 sm:px-8">
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
        {siblings.map(sib => {
          const isActive = sib.id === node.id;
          const sibPath = buildPath([...parentSlugs, sib.slug]);
          
          return (
            <Link
              key={sib.id}
              to={sibPath}
              className="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-200"
              style={{
                backgroundColor: isActive ? "var(--color-primary)" : "var(--bg-surface-alt)",
                color: isActive ? "var(--on-primary)" : "var(--text-primary)",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {getLocalizedString(sib.title, language)}
            </Link>
          );
        })}
      </div>
      {/* Removed soft gradient per strict rules */}
    </div>
  );
}
