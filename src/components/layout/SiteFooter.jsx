import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useTranslation();

  // Row 1 — mirrors the navbar
  const navLinks = [
    { label: "PLAN YOUR TRIP", to: "/plan-your-trip" },
    { label: "BOOK & EXPERIENCE", to: "/book-experience" },
    { label: "THINGS TO DO", to: "/things-to-do" },
    { label: "DISCOVER", to: "/discover" },
    { label: "DESTINATIONS", to: "/destinations" },
    { label: "EVENTS", to: "/events" },
    { label: "NEWS", to: "/news" },
  ];

  // Row 2 — mirrors the hero category menu below the slider
  const categoryLinks = [
    { label: "HERITAGE & CULTURE", to: "/things-to-do/heritage-culture" },
    { label: "ENTERTAINMENT & CREATIVE", to: "/things-to-do/entertainment-creative" },
    { label: "SPORTS & ADVENTURE", to: "/things-to-do/sports-adventure" },
    { label: "CULINARY & LIFESTYLE", to: "/things-to-do/culinary-lifestyle" },
    { label: "HEALTH & WELLNESS", to: "/things-to-do/health-wellness" },
    { label: "MICE & BUSINESS EVENTS", to: "/things-to-do/mice-business" },
  ];

  return (
    <footer style={{ backgroundColor: "#000000" }}>
      <div className="content-wrap py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_15%]">
          {/* LEFT column — brand + explore */}
          <div>
            {/* Brand section */}
            <Link to="/" className="flex flex-col gap-2 leading-none">
              <img src="/brand-logo-black-9.png" alt="Experience Jogja" className="max-h-[60px] md:max-h-[80px] w-auto object-contain object-left" />
            </Link>

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