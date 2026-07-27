import React from "react";

// Solid-fill chip row shown directly under the title. Pass { icon, label } items.
export default function QuickFactsStrip({ facts = [] }) {
  const visible = facts.filter((f) => f && f.label);
  if (visible.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {visible.map((f, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold"
          style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}
        >
          {f.icon && <f.icon className="h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} />}
          {f.label}
        </span>
      ))}
    </div>
  );
}