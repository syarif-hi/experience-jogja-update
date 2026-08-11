import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.46-.02-.84.05-1.69.31-2.49.46-1.4 1.34-2.62 2.5-3.43 1.84-1.28 4.31-1.55 6.35-.61v4.19c-.83-.34-1.84-.33-2.61.16-.76.47-1.19 1.35-1.18 2.23.01.89.44 1.75 1.19 2.21.75.47 1.74.49 2.55.19.86-.34 1.48-1.14 1.6-2.07.03-.23.03-.47.04-.71V.02h-.01z" />
  </svg>
);

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
              <div className="mt-3 flex gap-6 sm:gap-16">
                {/* Column 1 — navbar menu */}
                <ul className="flex flex-col gap-y-2 min-w-max">
                  {navLinks.map((l, i) => (
                    <li key={l.label}>
                      <Link to={l.to} className="focus-ring rounded text-[14px] uppercase hover:underline" style={{ color: "#FFFFFF" }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* Column 2 — category menu */}
                <ul className="flex flex-col gap-y-2">
                  {categoryLinks.map((l, i) => (
                    <li key={l.label}>
                      <Link to={l.to} className="focus-ring rounded text-[14px] uppercase hover:underline" style={{ color: "#FFFFFF" }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT column — contact + follow us */}
          <div className="flex flex-col justify-end gap-8 md:items-end md:text-right">
            <div>
              <h4 className="text-[15px] font-bold uppercase tracking-wide" style={{ color: "#FFFFFF" }}>{t("footer.contact")}</h4>
              <ul className="mt-3 space-y-2 text-[14px]" style={{ color: "#FFFFFF" }}>
                <li className="flex items-center gap-2 md:justify-end"><MapPin className="h-4 w-4" /> Yogyakarta, Indonesia</li>
                <li className="flex items-center gap-2 md:justify-end"><Mail className="h-4 w-4" /> hello@experiencejogja.com</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[15px] font-bold uppercase tracking-wide" style={{ color: "#FFFFFF" }}>{t("footer.follow")}</h4>
              <div className="mt-3 flex gap-2 md:justify-end">
                {[Instagram, Facebook, Youtube, TikTokIcon, XIcon].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="social link"
                    className="focus-ring flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#f7941d", color: "#FFFFFF" }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-[12px]" style={{ color: "#FFFFFF" }}>{t("footer.legal")}</p>
        </div>
      </div>
    </footer>
  );
}