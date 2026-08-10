import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import Breadcrumb from "@/components/shared/Breadcrumb";
import QuickFactsStrip from "@/components/detail/QuickFactsStrip";

/**
 * Shared shell for booking sub-pages (Tour, Activity, Restaurant, Transportation).
 * Props:
 *  - loading: boolean — undefined means loading, null means not found
 *  - item: object with { name, description (html), highlights[], hero_image_url }
 *  - breadcrumb: [{ label, to? }]
 *  - backTo: string (path to index)
 *  - backLabel: string
 *  - title: string
 *  - subtitle: string (regency line, etc.)
 *  - facts: [{ icon, label }]
 *  - description: html string
 *  - highlights: string[]
 *  - hero: string url
 */
export default function BookingDetailShell({
  status, // 'loading' | 'notFound' | 'ok'
  breadcrumb,
  backTo,
  title,
  subtitleNode,
  facts,
  description,
  highlights,
  hero,
  fallbackCopy,
}) {
  const { t } = useTranslation();

  return (
    <PageShell>
      <div className="content-wrap py-8">
        <Breadcrumb items={breadcrumb} />

        <Link
          to={backTo}
          className="focus-ring mt-4 mb-6 inline-flex items-center gap-1.5 rounded text-[14px] font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>

        {status === "loading" ? (
          <div className="aspect-[21/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
        ) : status === "notFound" ? (
          <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
        ) : (
          <>
            {hero && (
              <figure className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
                <div className="w-full aspect-[16/9] md:aspect-[32/9] overflow-hidden">
                  <SmartImage src={hero} alt={title} className="w-full h-full object-cover" />
                </div>
              </figure>
            )}

            <div className="mt-6 max-w-3xl">
              <h1 className="font-heading text-[28px] font-bold md:text-[36px]" style={{ color: "var(--color-primary)" }}>{title}</h1>
              {subtitleNode}
            </div>

            {facts && facts.length > 0 && <QuickFactsStrip facts={facts} />}

            <section className="mt-8 max-w-3xl">
              <h2 className="mb-3 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
                {t("detail.overview") || "Overview"}
              </h2>
              {description ? (
                /<[a-z][\s\S]*>/i.test(description) ? (
                  <div className="prose-detail text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }} dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                  description.split("\n").filter(Boolean).map((para, i) => (
                    <p key={i} className="text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)", marginBottom: "1em" }}>{para}</p>
                  ))
                )
              ) : (
                <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{fallbackCopy}</p>
              )}
            </section>

            {highlights && highlights.length > 0 && (
              <section className="mt-8 max-w-3xl">
                <h2 className="mb-3 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {t("detail.highlights") || "Highlights"}
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-[15px]" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--color-accent)" }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
