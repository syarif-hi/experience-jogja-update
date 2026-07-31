import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "@/lib/i18n";
import { getLocalizedString, buildPath, getSiblings } from "@/lib/visitorInfoHelpers";
import * as Icons from "lucide-react";
import treeData from "@/data/content-tree.json";
import SmartImage from "@/components/shared/SmartImage";
import ExploreAreaWidget from "@/components/visitor/ExploreAreaWidget";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function DynamicIcon({ name, className }) {
  const pascalName = (name || "file-text")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  const IconComponent = Icons[pascalName] || Icons.FileText;
  return <IconComponent className={className} />;
}

// Find a node anywhere in the tree by its ID
function findNodeById(id, current = treeData) {
  if (current.id === id) return { node: current, path: [current.slug] };
  if (!current.children) return null;
  
  for (const child of current.children) {
    // @ts-ignore - TS complains about missing $schema on child
    const found = findNodeById(id, child);
    if (found) {
      return { node: found.node, path: [current.slug, ...found.path] };
    }
  }
  return null;
}

/**
 * Quick Facts panel — displays key-value info using filled background
 */
function QuickFactsPanel({ quickFacts, language }) {
  if (!quickFacts) return null;

  const factEntries = Object.entries(quickFacts).map(([key, value]) => {
    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
    return { label, value };
  });

  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{ backgroundColor: "var(--bg-surface-alt)" }}
    >
      <h3
        className="font-heading text-lg font-bold mb-4 flex items-center gap-2"
        style={{ color: "var(--text-primary)" }}
      >
        <Icons.Info className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
        {language === "id" ? "Fakta Singkat" : "Quick Facts"}
      </h3>
      <div className="flex flex-col gap-3">
        {factEntries.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span
              className="text-xs uppercase tracking-wide"
              style={{ color: "var(--text-secondary)", opacity: 0.7 }}
            >
              {label}
            </span>
            <span
              className="text-[15px] font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Inline image gallery for article pages with meta.images
 */
function ArticleImages({ images, language }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="my-8 flex flex-col gap-5">
      {images.map((img, idx) => (
        <figure key={idx} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
          <div className="w-full aspect-[16/9] overflow-hidden">
            <SmartImage
              src={img.url}
              alt={getLocalizedString(img.caption, language) || ""}
              className="w-full h-full object-cover"
            />
          </div>
          {img.caption && (
            <figcaption
              className="px-4 py-3 text-[13px] italic"
              style={{ color: "var(--text-secondary)" }}
            >
              {getLocalizedString(img.caption, language)}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/**
 * Horizontal scrolling carousel for Sibling Content using SwiperJS
 */
function SiblingCarousel({ siblings, language, parentSlugs }) {
  if (!siblings || siblings.length === 0) return null;

  return (
    <div className="mt-8 md:mt-14">
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl font-heading font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {language === "id" ? "Jelajahi Lainnya" : "Explore More"}
        </h2>
      </div>

      <div className="-mx-1 px-1">
        <Swiper
          slidesPerView="auto"
          spaceBetween={16}
          grabCursor={true}
        >
          {siblings.map((sib) => {
            const sibPath = buildPath([...parentSlugs, sib.slug]);
            return (
              <SwiperSlide key={sib.id} style={{ width: 'auto' }}>
                <Link
                  to={sibPath}
                  className="group block w-[180px] sm:w-[200px]"
                >
                  <div
                    className="aspect-[4/3] rounded-xl overflow-hidden"
                    style={{ backgroundColor: "var(--bg-surface-alt)" }}
                  >
                    <SmartImage
                      src={sib.coverImage}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3
                    className="mt-2.5 text-[13px] font-medium leading-snug line-clamp-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {getLocalizedString(sib.title, language)}
                  </h3>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default function VisitorInfoPage({ node, slugs }) {
  const { language } = useTranslation();

  const relatedNodes = (node.meta?.relatedPageIds || [])
    .map(id => findNodeById(id))
    .filter(Boolean);

  const parentSlugs = slugs.slice(0, -1);
  const allSiblings = getSiblings(slugs);
  const siblings = allSiblings.filter(s => s.id !== node.id);

  const hasQuickFacts = !!node.meta?.quickFacts;
  const hasNearbyPlaces = node.meta?.nearbyPlaces && node.meta.nearbyPlaces.length > 0;

  return (
    <article className="flex flex-col pb-12 w-full">
      {/* Meta Strip — filled pills */}
      {(node.meta?.estReadMins || node.meta?.lastUpdated || (node.meta?.tags && node.meta.tags.length > 0)) && (
        <div
          className="flex flex-wrap items-center gap-3 py-3 text-sm font-mono mb-4 md:mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          {node.meta?.estReadMins && (
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ backgroundColor: "var(--bg-surface-alt)" }}
          >
            <Icons.Clock className="w-3.5 h-3.5" />
            <span>{node.meta.estReadMins} min read</span>
          </div>
        )}
        {node.meta?.lastUpdated && (
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ backgroundColor: "var(--bg-surface-alt)" }}
          >
            <Icons.Calendar className="w-3.5 h-3.5" />
            <span>Updated {new Date(node.meta.lastUpdated).toLocaleDateString(language === "id" ? "id-ID" : "en-US", { month: "short", year: "numeric" })}</span>
          </div>
        )}
        {node.meta?.tags && node.meta.tags.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex gap-1.5">
              {node.meta.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full uppercase text-xs font-medium"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--on-primary)",
                    opacity: 0.85,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      )}

      {/* Hero Image (first image before body) */}
      {node.meta?.images && node.meta.images.length > 0 && (
        <figure
          className="rounded-2xl overflow-hidden mb-4 md:mb-8"
          style={{ backgroundColor: "var(--bg-surface-alt)" }}
        >
          <div className="w-full aspect-[16/9] overflow-hidden">
            <SmartImage
              src={node.meta.images[0].url}
              alt={getLocalizedString(node.meta.images[0].caption, language) || ""}
              className="w-full h-full object-cover"
            />
          </div>
          {node.meta.images[0].caption && (
            <figcaption
              className="px-4 py-3 text-[13px] italic"
              style={{ color: "var(--text-secondary)" }}
            >
              {getLocalizedString(node.meta.images[0].caption, language)}
            </figcaption>
          )}
        </figure>
      )}

      {/* Markdown Body */}
      <div className="prose prose-lg max-w-none" style={{ color: "var(--text-primary)" }}>
        <ReactMarkdown
          components={{
            h2: ({node, ...props}) => <h2 className="font-heading text-2xl font-bold mt-10 mb-4" style={{ color: "var(--color-primary)" }} {...props} />,
            h3: ({node, ...props}) => <h3 className="font-heading text-xl font-bold mt-8 mb-3" style={{ color: "var(--color-primary)" }} {...props} />,
            p: ({node, ...props}) => <p className="mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }} {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-5 space-y-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-5 space-y-2" {...props} />,
            li: ({node, ...props}) => <li style={{ color: "var(--text-secondary)" }} {...props} />,
            a: ({node, ...props}) => <a className="underline hover:no-underline font-medium" style={{ color: "var(--color-primary)" }} {...props} />,
            strong: ({node, ...props}) => <strong className="font-semibold" style={{ color: "var(--text-primary)" }} {...props} />,
            blockquote: ({node, ...props}) => (
              <blockquote
                className="my-6 pl-5 py-3 pr-4 rounded-xl"
                style={{
                  backgroundColor: "var(--bg-surface-alt)",
                  color: "var(--text-secondary)",
                }}
                {...props}
              />
            ),
          }}
        >
          {getLocalizedString(node.body, language)}
        </ReactMarkdown>
      </div>

      {/* Remaining Inline Images (2nd image onward) */}
      {node.meta?.images && node.meta.images.length > 1 && (
        <ArticleImages
          images={node.meta.images.slice(1)}
          language={language}
        />
      )}

      {/* Layer 4 Items Grid (child pages like YIA, JOG) */}
      {node.children && node.children.length > 0 && (
        <div className={node.body ? "mt-6 md:mt-10" : "mt-2 md:mt-8"}>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {node.children.map((child) => {
              const childSlugs = [...slugs, child.slug];
              const path = buildPath(childSlugs);
              
              return (
                <Link
                  key={child.id}
                  to={path}
                  className="group block focus-ring rounded-2xl"
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                    style={{ backgroundColor: "var(--bg-surface-alt)" }}
                  >
                    <SmartImage
                      src={child.coverImage}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="pt-3">
                    <h3
                      className="line-clamp-2 text-[14px] md:text-[15px] font-medium leading-tight"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {getLocalizedString(child.title, language)}
                    </h3>
                    <p
                      className="mt-1 text-[13px] font-medium leading-snug line-clamp-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {getLocalizedString(child.summary, language)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Facts + Explore the Area — Two Column Layout */}
      {(hasQuickFacts || hasNearbyPlaces) && (
        <div className="mt-8 md:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {hasQuickFacts && (
            <QuickFactsPanel quickFacts={node.meta.quickFacts} language={language} />
          )}
          {hasNearbyPlaces && (
            <ExploreAreaWidget
              nearbyPlaces={node.meta.nearbyPlaces}
              mapImage={node.meta?.mapImage}
              compact
            />
          )}
        </div>
      )}

      {/* Related Pages Module */}
      {relatedNodes.length > 0 && (
        <div className="mt-8 md:mt-14">
          <h2 className="text-xl font-heading font-bold mb-6" style={{ color: "var(--text-primary)" }}>
            {language === "id" ? "Halaman Terkait" : "Related Pages"}
          </h2>
          <div className="flex flex-col gap-3">
            {relatedNodes.map(({ node: relNode, path }) => {
              const relSlugs = path.slice(1);
              const linkUrl = buildPath(relSlugs);
              
              return (
                <Link
                  key={relNode.id}
                  to={linkUrl}
                  className="flex items-center gap-4 group py-2"
                >
                  <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
                    <SmartImage src={relNode.coverImage} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <h3 className="font-heading font-bold text-base line-clamp-1" style={{ color: "var(--text-primary)" }}>
                      {getLocalizedString(relNode.title, language)}
                    </h3>
                    <p className="text-sm line-clamp-1" style={{ color: "var(--text-secondary)" }}>
                      {getLocalizedString(relNode.summary, language)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Sibling Content Carousel */}
      {slugs.length >= 3 && (
        <SiblingCarousel siblings={siblings} language={language} parentSlugs={parentSlugs} />
      )}
    </article>
  );
}
