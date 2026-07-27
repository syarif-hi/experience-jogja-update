import React from "react";
import { Check } from "lucide-react";

// Icon + label chip grid for highlights / amenities (solid fill tag styling).
export default function ChipGrid({ title, items = [] }) {
  const list = (items || []).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {list.map((label, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[14px]"
            style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "var(--color-primary)" }}>
              <Check className="h-3 w-3" style={{ color: "var(--on-primary)" }} />
            </span>
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}