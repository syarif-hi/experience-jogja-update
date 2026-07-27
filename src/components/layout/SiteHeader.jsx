import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import Toggles from "@/components/layout/Toggles";
import MobileNavDrawer from "@/components/layout/MobileNavDrawer";
import MegaMenu from "@/components/layout/MegaMenu";
import AuthModal from "@/components/auth/AuthModal";

const SEARCH_BG = "#F1F1F1";

export default function SiteHeader() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Hide when scrolling down past the header, reveal when scrolling up.
      if (y > lastYRef.current && y > 120) setHidden(true);
      else if (y < lastYRef.current) setHidden(false);
      lastYRef.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const authBtnStyle = { backgroundColor: "var(--color-primary)", color: "var(--on-primary)" };
  const authBtnEnter = (e) => (e.currentTarget.style.backgroundColor = "var(--color-primary-hover)");
  const authBtnLeave = (e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)");

  const wordmark = (
    <Link to="/" className="focus-ring flex shrink-0 flex-col gap-1 rounded-md leading-none">
      <span className="text-[22px] tracking-wide" style={{ color: "var(--text-secondary)" }}>experiencejogja.com</span>
      <span className="font-wordmark text-[29px] font-semibold uppercase tracking-[0.08em] md:text-[34px]" style={{ color: "var(--color-primary)" }}>
        Experience Jogja
      </span>
      <span className="hidden text-[25px] font-medium md:block" style={{ color: "var(--color-accent)" }}>
        {t("brand.tagline")}
      </span>
    </Link>
  );

  return (
    <header
      className="sticky top-0 z-40 transition-transform duration-300 will-change-transform"
      style={{
        backgroundColor: "var(--bg-surface)",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <div className="content-wrap py-3">
        {/* Tablet utility row (md ≤ width < xl): search + language + auth, above the logo */}
        <div className="mb-3 hidden items-center gap-3 md:flex xl:hidden">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              className="focus-ring h-10 w-full rounded-lg pl-9 pr-3 text-[14px]"
              style={{ backgroundColor: SEARCH_BG, color: "var(--text-primary)", border: "none" }}
            />
          </div>
          <Toggles showCurrency={false} />
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="focus-ring inline-flex shrink-0 items-center justify-center rounded-lg h-10 px-4 text-[14px] font-semibold uppercase leading-none tracking-wide transition-colors"
            style={authBtnStyle}
            onMouseEnter={authBtnEnter}
            onMouseLeave={authBtnLeave}
          >
            Log In | Sign Up
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Wordmark */}
          {wordmark}

          <div className="ml-auto flex items-center gap-3">
            {/* Desktop (xl+): search stacked above login button */}
            <div className="hidden xl:flex xl:flex-col xl:items-end xl:gap-2">
              <div className="relative w-[640px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  className="focus-ring h-10 w-full rounded-lg pl-9 pr-3 text-[14px]"
                  style={{ backgroundColor: SEARCH_BG, color: "var(--text-primary)", border: "none" }}
                />
              </div>
              <div className="flex items-center gap-3">
                <Toggles showCurrency={false} />
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="focus-ring inline-flex items-center justify-center rounded-lg h-10 px-4 text-[14px] font-semibold uppercase leading-none tracking-wide transition-colors"
                  style={authBtnStyle}
                  onMouseEnter={authBtnEnter}
                  onMouseLeave={authBtnLeave}
                >
                  Log In | Sign Up
                </button>
              </div>
            </div>

            {/* Hamburger — below xl */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={t("menu.open")}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg xl:hidden"
              style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop primary nav row — mega-menu */}
      <MegaMenu />

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAuth={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}