import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { getLocalizedString, buildPath, findNodeByPath } from "@/lib/visitorInfoHelpers";
import * as Icons from "lucide-react";
import SmartImage from "@/components/shared/SmartImage";
import SectionHeading from "@/components/home/SectionHeading";

function DynamicIcon({ name, className, style }) {
  // Convert kebab-case to PascalCase
  const pascalName = (name || "compass")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  const IconComponent = Icons[pascalName] || Icons.Circle;
  return <IconComponent className={className} style={style} />;
}

export default function VisitorInfoSection() {
  const { language } = useTranslation();
  const rootNode = findNodeByPath([]);
  const items = rootNode?.children || [];

  return (
    <section className="section-y" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <div className="content-wrap">
          <SectionHeading
            title={language === "id" ? "Informasi Pengunjung" : "Visitor Information"}
            subtitle={language === "id"
              ? "Yang perlu Anda ketahui sebelum berkunjung ke Yogyakarta"
              : "What you need to know before visiting Yogyakarta"
            }
            seeMoreTo="/visitor-information"
          />

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-10 xl:grid-cols-4">
            {items.map((child) => {
              const path = buildPath([child.slug]);
              return (
                <div key={child.id} className="flex flex-col">
                  <Link
                    to={path}
                    className="group block overflow-hidden rounded-2xl relative"
                    style={{ backgroundColor: "var(--bg-surface)" }}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden relative" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
                      {child.coverImage && (
                        <SmartImage 
                          src={child.coverImage} 
                          alt="" 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      {/* Badge */}
                      <div
                        className="absolute left-3 top-3 flex items-center justify-center rounded-lg p-2 backdrop-blur-md"
                        style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)", opacity: 0.9 }}
                      >
                        <DynamicIcon name={child.icon} className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                  
                  <div className="mt-4">
                    <h3 className="font-heading text-[15px] md:text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
                      {getLocalizedString(child.title, language)}
                    </h3>
                  </div>

                  {/* Children List */}
                  {child.children && child.children.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {child.children.slice(0, 4).map((gc) => {
                        const gcTitle = getLocalizedString(gc.title, language);
                        return (
                          <li key={gc.id} className="flex items-start gap-2 text-[13px] md:text-[14px]">
                            <DynamicIcon name={gc.icon} className="mt-1 h-3.5 w-3.5 shrink-0" style={{ color: "var(--color-primary)" }} />
                            <span className="truncate" style={{ color: "var(--text-secondary)" }}>
                              {gcTitle}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <Link
                    to={path}
                    className="mt-3 inline-flex items-center text-[13px] md:text-[14px] font-semibold transition-colors"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {language === "id" ? "Baca selengkapnya" : "Read more"}
                    <Icons.ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
    </section>
  );
}
