import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, User, LogOut, Bell, Settings, ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import Toggles from "@/components/layout/Toggles";
import MobileNavDrawer from "@/components/layout/MobileNavDrawer";
import MegaMenu from "@/components/layout/MegaMenu";
import AuthModal from "@/components/auth/AuthModal";

const SEARCH_BG = "#F1F1F1";

// User dropdown menu items
const USER_MENU = [
  { to: "/account", icon: User, label: "My Account" },
  { to: "/account/notifications", icon: Bell, label: "Notifications" },
  { to: "/account/profile", icon: Settings, label: "Settings" },
];

function UserAvatarDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const displayName = user?.full_name || user?.email?.split("@")[0] || "U";
  const initial = displayName.charAt(0).toUpperCase();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors"
        style={{ backgroundColor: "var(--bg-surface-alt)" }}
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold"
          style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
        >
          {initial}
        </span>
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform"
          style={{ color: "var(--text-secondary)", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-[220px] rounded-2xl p-2"
          style={{ backgroundColor: "var(--bg-surface-alt)", boxShadow: "var(--elevation-3)" }}
        >
          {/* User info header */}
          <div className="mb-2 rounded-lg px-3 py-2.5" style={{ backgroundColor: "var(--bg-page)" }}>
            <p className="text-[13px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {displayName}
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
              {user?.email || ""}
            </p>
          </div>

          {/* Menu links */}
          {USER_MENU.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-page)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <item.icon className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="my-1.5 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }} />

          {/* Logout */}
          <button
            type="button"
            onClick={() => { setOpen(false); onLogout(); }}
            className="focus-ring flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-page)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);

      const diff = y - lastYRef.current;
      if (Math.abs(diff) > 5) { // Small threshold to prevent jitter
        // Hide when scrolling down, reveal when scrolling up
        if (diff > 0 && y > 120) setHidden(true);
        else if (diff < 0) setHidden(false);
        lastYRef.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const authBtnStyle = { backgroundColor: "var(--color-primary)", color: "var(--on-primary)" };
  const authBtnEnter = (e) => (e.currentTarget.style.backgroundColor = "var(--color-primary-hover)");
  const authBtnLeave = (e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)");

  // Auth button or user avatar — reused in both tablet and desktop rows
  const authOrAvatar = isAuthenticated ? (
    <UserAvatarDropdown user={user} onLogout={logout} />
  ) : (
    <button
      type="button"
      onClick={() => setAuthOpen(true)}
      className="focus-ring inline-flex shrink-0 items-center justify-center rounded-lg h-10 px-4 text-[14px] font-semibold  leading-none tracking-wide transition-colors"
      style={authBtnStyle}
      onMouseEnter={authBtnEnter}
      onMouseLeave={authBtnLeave}
    >
      Log In | Sign Up
    </button>
  );

  const wordmark = (
    <Link to="/" className="focus-ring flex shrink-0 flex-col gap-1 rounded-md leading-none">
      <div className="hidden">
        <span className="text-[22px] tracking-wide" style={{ color: "var(--text-secondary)" }}>experiencejogja.com</span>
        <span className="font-wordmark text-[29px] font-semibold  tracking-[0.08em] md:text-[34px]" style={{ color: "var(--color-primary)" }}>
          Experience Jogja
        </span>
        <span className="hidden text-[25px] font-medium md:block" style={{ color: "var(--color-accent)" }}>
          {t("brand.tagline")}
        </span>
      </div>
      <img src="/brand-logo-color-8.png" alt="Experience Jogja" className="max-h-[78px] md:max-h-[131px] md:pt-[15px] w-auto object-contain" />
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
      <div className="content-wrap py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Wordmark */}
          {wordmark}



          {/* Tablet Middle (md ≤ width < xl) */}
          <div className="hidden flex-1 items-center justify-end gap-3 md:flex xl:hidden">
            <div className="relative w-full max-w-[320px] lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
              <input
                type="text"
                placeholder={t("search.placeholder")}
                className="focus-ring h-10 w-full rounded-lg pl-9 pr-3 text-[14px]"
                style={{ backgroundColor: SEARCH_BG, color: "var(--text-primary)", border: "none" }}
              />
            </div>
            <Toggles showCurrency={false} />
            {authOrAvatar}
          </div>

          <div className="flex items-center gap-3 shrink-0">
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
                {authOrAvatar}
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