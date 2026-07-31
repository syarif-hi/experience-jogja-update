import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import SectionHeading from "@/components/home/SectionHeading";
import HScrollStrip from "@/components/home/HScrollStrip";
import EventCard from "@/components/shared/EventCard";

export default function EventStrip() {
  const { t } = useTranslation();
  const [events, setEvents] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.Event.filter({ is_homepage_highlight: true }, "start_date", 8).then((res) => {
      if (active) setEvents(res);
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="section-y" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
      <div className="content-wrap">
        <SectionHeading title={t("events.title")} subtitle={t("events.subtitle")} seeMoreTo="/events" />
        <HScrollStrip rows={2}>
          {events === null
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
              ))
            : events.map((e) => <EventCard key={e.id} event={e} />)}
        </HScrollStrip>
      </div>
    </section>
  );
}