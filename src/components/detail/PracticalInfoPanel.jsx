import React from "react";
import { Link } from "react-router-dom";

// Sticky sidebar card. Pass rows [{ icon, label, value }] + an optional CTA { label, to, href, onClick }.
export default function PracticalInfoPanel({ title, rows = [], cta, priceLine }) {
  const visible = rows.filter((r) => r && r.value);
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-2)" }}>
      {title && (
        <h3 className="mb-3 text-[15px] font-bold  tracking-wide" style={{ color: "var(--text-primary)" }}>{title}</h3>
      )}
      {priceLine && (
        <p className="mb-4 text-[22px] font-bold" style={{ color: "var(--color-primary)" }}>{priceLine}</p>
      )}
      {visible.length > 0 && (
        <ul className="space-y-4">
          {visible.map((r, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--color-accent)" }}>
                <r.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[12px]  tracking-wide" style={{ color: "var(--text-secondary)" }}>{r.label}</p>
                <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{r.value}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cta && (
        cta.href ? (
          <a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-5 flex w-full items-center justify-center rounded-lg px-4 py-3 text-[14px] font-semibold"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
          >
            {cta.label}
          </a>
        ) : (
          <Link
            to={cta.to || "#"}
            className="focus-ring mt-5 flex w-full items-center justify-center rounded-lg px-4 py-3 text-[14px] font-semibold"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
          >
            {cta.label}
          </Link>
        )
      )}
    </div>
  );
}