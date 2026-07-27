import React from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

// Shared page wrapper: site header + optional page heading + footer.
export default function PageShell({ title, subtitle, hideShell, children }) {
  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <SiteHeader />
      <main className="min-h-[60vh]">
        {title && (
          <div className="content-wrap pt-10">
            <h1 className="font-heading text-[28px] font-bold md:text-[36px]" style={{ color: "var(--color-primary)" }}>
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-[15px]" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}