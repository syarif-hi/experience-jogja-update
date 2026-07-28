import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useTranslation();

  // Row 1 — mirrors the navbar
  const navLinks = [
    { label: "DISCOVER", to: "/explore" },
    { label: "THINGS TO DO", to: "/destinations" },
    { label: "EVENTS", to: "/events" },
    { label: "PLAN YOUR TRIP", to: "/trip-planner" },
    { label: "BOOK & EXPERIENCE", to: "/trip-planner" },
    { label: "VISITOR INFORMATION", to: "/explore" },
    { label: "CALENDAR", to: "/calendar" },
    { label: "JOGJA MAP", to: "/#maps" },
  ];

  // Row 2 — mirrors the hero category menu below the slider
  const categoryLinks = [
    { label: "DESTINATIONS", to: "/destinations" },
    { label: "CULINARY & LIFESTYLE", to: "/destinations?category=eat-drink" },
    { label: "HEALTH & WELLNESS", to: "/destinations?category=wellness" },
    { label: "ENTERTAINMENT & CREATIVE", to: "/destinations?category=entertainment" },
    { label: "SPORTS & ADVENTURE", to: "/destinations?category=sports" },
    { label: "MICE & BUSINESS EVENTS", to: "/destinations?category=mice" },
  ];

  return (
    <footer style={{ backgroundColor: "#000000" }}>
      <div className="content-wrap py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_15%]">
          {/* LEFT column — brand + explore */}
          <div>
            {/* Brand section */}
            <div className="flex flex-col gap-1 leading-none">
              <span className="text-[10px] tracking-wide" style={{ color: "#BDB0A3" }}>experiencejogja.com</span>
              <span className="font-wordmark text-[22px] font-semibold uppercase tracking-[0.08em] md:text-[26px]" style={{ color: "#FF0000" }}>
                Experience Jogja
              </span>
              <span className="text-[16px] md:text-[18px] font-medium" style={{ color: "#E3AE4E" }}>
                {t("brand.tagline")}
              </span>
            </div>

            {/* Explore menu */}
            <div className="mt-8">
              <h4 className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "#F3EDE6" }}>{t("footer.explore")}</h4>
              {/* Row 1 — navbar menu */}
              <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                {navLinks.map((l, i) => (
                  <li key={l.label} className="flex items-center gap-4">
                    <Link to={l.to} className="focus-ring rounded text-[14px] uppercase hover:underline" style={{ color: "#BDB0A3" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Row 2 — category menu */}
              <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                {categoryLinks.map((l, i) => (
                  <li key={l.label} className="flex items-center gap-4">
                    <Link to={l.to} className="focus-ring rounded text-[14px] uppercase hover:underline" style={{ color: "#BDB0A3" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT column — contact + follow us */}
          <div className="flex flex-col gap-8 md:items-end md:text-right">
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "#F3EDE6" }}>{t("footer.contact")}</h4>
              <ul className="mt-3 space-y-2 text-[14px]" style={{ color: "#BDB0A3" }}>
                <li className="flex items-center gap-2 md:justify-end"><MapPin className="h-4 w-4" /> Yogyakarta, Indonesia</li>
                <li className="flex items-center gap-2 md:justify-end"><Mail className="h-4 w-4" /> hello@experiencejogja.com</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "#F3EDE6" }}>{t("footer.follow")}</h4>
              <div className="mt-3 flex gap-2 md:justify-end">
                {[Instagram, Facebook, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="social link"
                    className="focus-ring flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#332B24", color: "#F3EDE6" }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-[12px]" style={{ color: "#BDB0A3" }}>{t("footer.legal")}</p>
        </div>
      </div>
    </footer>
  );
}