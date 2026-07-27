import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { NAV_GROUPS, NAV_STANDALONE } from "@/lib/navConfig";

// Desktop (xl+) mega-menu: each group opens a dropdown panel of sub-items.
export default function MegaMenu() {
  const { language } = useTranslation();
  const [openIdx, setOpenIdx] = useState(-1);
  const lbl = (o) => (language === "id" ? o.label_id : o.label_en);

  return (
    <nav className="content-wrap hidden items-center gap-6 pb-3 xl:flex" onMouseLeave={() => setOpenIdx(-1)}>
      {NAV_GROUPS.map((group, i) => {
        const open = openIdx === i;
        return (
          <div key={group.label_en} className="relative" onMouseEnter={() => setOpenIdx(i)}>
            <Link
              to={group.to || "#"}
              className="focus-ring inline-flex items-center gap-1 rounded-md py-1 text-[17px] font-normal uppercase transition-colors"
              style={{ color: open ? "var(--color-primary)" : "var(--text-secondary)" }}
              aria-expanded={open}
            >
              {lbl(group)}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </Link>

            {open && (
              <div
                className="absolute left-0 top-full z-50 min-w-[260px] rounded-2xl p-2"
                style={{ backgroundColor: "var(--bg-surface-alt)", boxShadow: "var(--elevation-3)" }}
              >
                {group.items.map((item) => (
                  <Link
                    key={item.label_en + item.to}
                    to={item.to}
                    onClick={() => setOpenIdx(-1)}
                    className="focus-ring block rounded-lg px-3 py-2.5 text-[14px] transition-colors"
                    style={{ color: "var(--text-primary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-page)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {lbl(item)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {NAV_STANDALONE.map((item) => (
        <Link
          key={item.label_en}
          to={item.to}
          className="focus-ring rounded-md py-1 text-[17px] font-normal uppercase transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          {lbl(item)}
        </Link>
      ))}
    </nav>
  );
}