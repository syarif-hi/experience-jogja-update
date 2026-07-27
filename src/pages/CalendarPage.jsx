import React from "react";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import CalendarExplorer from "@/components/home/calendar/CalendarExplorer";

export default function CalendarPage() {
  const { t } = useTranslation();
  return (
    <PageShell title={t("calendar.heading")} subtitle={t("calendar.subtitle")}>
      <CalendarExplorer />
    </PageShell>
  );
}