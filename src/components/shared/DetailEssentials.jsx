import React from "react";
import { useTranslation } from "@/lib/i18n";

// Generic Essentials sidebar card. Pass a list of { icon, label, value } rows.
export default function DetailEssentials({ rows = [] }) {
  const { t } = useTranslation();
  const visible = rows.filter((r) => r && r.value);

  if (visible.length === 0) return null;

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
      <h3 className="mb-4 text-[15px] font-bold  tracking-wide" style={{ color: "var(--text-primary)" }}>
        {t("essentials.title")}
      </h3>
      <ul className="space-y-4">
        {visible.map((r) => (
          <li key={r.label} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--color-accent)" }}>
              <r.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[12px]  tracking-wide" style={{ color: "var(--text-secondary)" }}>{r.label}</p>
              <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{r.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}