import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import { DUMMY_DISCOVER } from "@/lib/dummyData";

// One generic template for all 6 Discover slugs: hero image + title + rich body.
export default function DiscoverPageTemplate({ hideShell = false }) {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const [page, setPage] = useState(undefined);

  useEffect(() => {
    setPage(undefined);
    base44.entities.DiscoverPage.filter({ slug }).then((r) => setPage(r[0] || DUMMY_DISCOVER)).catch(() => setPage(DUMMY_DISCOVER));
  }, [slug]);

  const title = page && (language === "id" ? page.title_id : page.title_en);
  const body = page && (language === "id" ? page.body_id : page.body_en);

  const Wrapper = hideShell ? React.Fragment : PageShell;

  return (
    <Wrapper>
      {page === undefined ? (
        <div className="content-wrap section-y">
          <div className="aspect-[21/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
        </div>
      ) : page === null ? (
        <div className="content-wrap section-y">
          <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
        </div>
      ) : (
        <>
          {page.hero_image_url && (
            <div className="relative aspect-[21/9] max-h-[420px] w-full overflow-hidden">
              <SmartImage src={page.hero_image_url} alt={title} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="content-wrap section-y">
            <div className="mx-auto max-w-[760px]">
              <h1 className="font-display text-[34px] font-bold md:text-[44px]" style={{ color: "var(--color-primary)" }}>{title}</h1>
              {body && (
                <div
                  className="prose-detail mt-6 text-[17px] leading-relaxed [&_p]:mb-4"
                  style={{ color: "var(--text-secondary)" }}
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
}