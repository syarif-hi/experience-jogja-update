import React from "react";
import { useParams } from "react-router-dom";
import { findNodeByPath, getBreadcrumbTrail, getLocalizedString } from "@/lib/visitorInfoHelpers";
import VisitorInfoLayout from "@/components/visitor/VisitorInfoLayout";
import BreadcrumbTrail from "@/components/visitor/BreadcrumbTrail";
import Breadcrumb from "@/components/shared/Breadcrumb";
import VisitorInfoHub from "./VisitorInfoHub";
import VisitorInfoSection from "./VisitorInfoSection";
import VisitorInfoPage from "./VisitorInfoPage";
import PageNotFound from "@/lib/PageNotFound";
import PageShell from "@/components/layout/PageShell";
import { useTranslation } from "@/lib/i18n";

export default function VisitorInformation({ hideShell }) {
  const { language } = useTranslation();
  const params = useParams();
  // `params["*"]` contains everything after /visitor-information/ (or the parent wildcard)
  const wildcard = params["*"] || "";
  const slugs = wildcard ? wildcard.split("/").filter(Boolean) : [];

  const node = findNodeByPath(slugs);
  const trail = getBreadcrumbTrail(slugs);

  if (!node) {
    if (hideShell) {
      return <PageNotFound />;
    }
    return (
      <PageShell title="Not Found" subtitle="">
        <PageNotFound />
      </PageShell>
    );
  }

  const isHub = slugs.length === 0;

  let content;
  if (isHub) {
    content = <VisitorInfoHub node={node} />;
  } else if (node.kind === "section") {
    content = <VisitorInfoSection node={node} slugs={slugs} />;
  } else if (node.kind === "page") {
    content = <VisitorInfoPage node={node} slugs={slugs} />;
  }

  if (hideShell) {
    // Embedded under Plan Your Trip — show breadcrumb for deeper navigation
    const viLabel = language === "id" ? "Informasi Wisatawan" : "Visitor Information";
    const breadcrumbItems = [
      { label: language === "id" ? "Rencanakan Perjalanan" : "Plan Your Trip", to: "/plan-your-trip" },
      ...(isHub
        ? [{ label: viLabel }]
        : [
            { label: viLabel, to: "/plan-your-trip/visitor-information" },
            ...slugs.map((slug, idx) => {
              const partialSlugs = slugs.slice(0, idx + 1);
              const partialNode = findNodeByPath(partialSlugs);
              const label = partialNode ? getLocalizedString(partialNode.title, language) : slug;
              const isLastSlug = idx === slugs.length - 1;
              return isLastSlug
                ? { label }
                : { label, to: `/plan-your-trip/visitor-information/${partialSlugs.join("/")}` };
            }),
          ]),
    ];

    return (
      <>
        <Breadcrumb items={breadcrumbItems} />
        <VisitorInfoLayout slugs={slugs} node={node} trail={trail} hideShell={hideShell}>
          {content}
        </VisitorInfoLayout>
      </>
    );
  }

  return (
    <PageShell>
      <div className="py-8 md:py-12" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <div className="content-wrap">
          {!isHub && (
            <div>
              <BreadcrumbTrail trail={trail} />
            </div>
          )}
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-1" style={{ color: "var(--color-primary)" }}>
            {getLocalizedString(node.title, language)}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed max-w-3xl" style={{ color: "var(--text-secondary)" }}>
            {getLocalizedString(node.summary, language)}
          </p>
        </div>
      </div>
      <VisitorInfoLayout slugs={slugs} node={node} trail={trail}>
        {content}
      </VisitorInfoLayout>
    </PageShell>
  );
}