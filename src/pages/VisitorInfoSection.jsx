import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { getLocalizedString, buildPath } from "@/lib/visitorInfoHelpers";
import * as Icons from "lucide-react";
import SmartImage from "@/components/shared/SmartImage";

function DynamicIcon({ name, className }) {
  const pascalName = (name || "file-text")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  const IconComponent = Icons[pascalName] || Icons.FileText;
  return <IconComponent className={className} />;
}

export default function VisitorInfoSection({ node, slugs }) {
  const { language } = useTranslation();

  return (
    <div className="flex flex-col gap-8 pb-10 pt-2 md:pt-8">

      {/* Grid of Children */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {(node.children || []).map((child) => {
          const childSlugs = [...slugs, child.slug];
          const path = buildPath(childSlugs);
          
          if (child.kind === "section") {
            // Render as Section Card (like Hub card, cover image on top)
            return (
              <Link 
                key={child.id} 
                to={path}
                className="flex flex-col group overflow-hidden rounded-2xl transition-colors duration-200"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                {child.coverImage && (
                  <div className="w-full aspect-[4/3] overflow-hidden">
                    <SmartImage 
                      src={child.coverImage} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}>
                      <DynamicIcon name={child.icon} className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
                      {getLocalizedString(child.title, language)}
                    </h3>
                  </div>
                  <p className="text-sm line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {getLocalizedString(child.summary, language)}
                  </p>
                  <div className="mt-auto pt-4 text-[14px] font-semibold flex items-center gap-1 overflow-hidden" style={{ color: "var(--color-primary)" }}>
                    <span className="truncate">
                      {child.children ? child.children.map(c => getLocalizedString(c.title, language)).join(", ") : "Explore"}
                    </span>
                    <Icons.ChevronRight className="h-4 w-4 shrink-0" />
                  </div>
                </div>
              </Link>
            );
          } else {
            // Render as Page Card (DestinationCard Style)
            return (
              <Link
                key={child.id}
                to={path}
                className="group block focus-ring rounded-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
                  <SmartImage
                    src={child.coverImage}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {child.meta?.estReadMins && (
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold backdrop-blur-md" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", opacity: 0.9 }}>
                      <Icons.Clock className="h-3 w-3" />
                      {child.meta.estReadMins} min read
                    </div>
                  )}
                </div>
                <div className="pt-3">
                  <h3 className="line-clamp-2 text-[14px] md:text-[15px] font-medium leading-tight" style={{ color: "var(--color-primary)" }}>
                    {getLocalizedString(child.title, language)}
                  </h3>
                  <p className="mt-1 text-[13px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {getLocalizedString(child.summary, language)}
                  </p>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
}
