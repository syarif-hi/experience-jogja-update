import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import SectionHeading from "@/components/home/SectionHeading";
import HScrollStrip from "@/components/home/HScrollStrip";
import DestinationCard from "@/components/shared/DestinationCard";

// Single reusable grid — fed by a query flag prop, rendered twice on the homepage.
export default function DestinationCardGrid({ title, subtitle, filterField, alt = false, seeMoreTo = "/destinations" }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.Destination.filter({ [filterField]: true }, "display_order", 8).then((res) => {
      if (active) setItems(res);
    });
    return () => { active = false; };
  }, [filterField]);

  return (
    <section className="section-y" style={{ backgroundColor: alt ? "var(--bg-surface-alt)" : "transparent" }}>
      <div className="content-wrap">
        <SectionHeading title={title} subtitle={subtitle} seeMoreTo={seeMoreTo} />
        <HScrollStrip rows={2}>
          {items === null
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
              ))
            : items.map((d) => <DestinationCard key={d.id} destination={d} />)}
        </HScrollStrip>
      </div>
    </section>
  );
}