import React from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";

export default function ComingSoon({ hideShell }) {
  const { t } = useTranslation();
  return (
    <PageShell hideShell={hideShell}>
      <div className="content-wrap section-y">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl px-6 py-16 text-center" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
          <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "var(--bg-surface)" }}>
            <Clock className="h-7 w-7" style={{ color: "var(--color-primary)" }} />
          </span>
          <h1 className="mt-4 font-heading text-[26px] font-bold" style={{ color: "var(--color-primary)" }}>
            {t("comingSoon.title") || "Coming Soon"}
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--text-secondary)" }}>
            {t("comingSoon.desc") || "This feature is on its way. Check back soon!"}
          </p>
          <Link to="/" className="focus-ring mt-6 rounded-lg px-5 py-2.5 text-[14px] font-semibold" style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}>
            {t("comingSoon.home") || "Back to home"}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}