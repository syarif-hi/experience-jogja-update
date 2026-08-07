import React from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";

export default function TripPlanner({ hideShell }) {
  const { t } = useTranslation();

  const cards = [
    { to: "/destinations", icon: MapPin, label: t("tripplanner.browseDest") },
    { to: "/events", icon: CalendarDays, label: t("tripplanner.browseEvents") },
  ];

  return (
    <PageShell title={t("tripband.title")} subtitle={t("tripband.subtitle")} hideShell={hideShell}>
      <div className={hideShell ? "pt-2" : "content-wrap pb-16"}>
        <p className="mt-6 max-w-2xl text-[15px]" style={{ color: "var(--text-secondary)" }}>
          {t("tripplanner.body")}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {cards.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className="focus-ring flex items-center gap-4 rounded-2xl p-6 transition-colors hover:bg-gray-200"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-[17px] font-semibold" style={{ color: "var(--text-primary)" }}>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}