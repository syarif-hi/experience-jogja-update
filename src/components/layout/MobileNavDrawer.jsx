import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X, Search, ChevronDown, User, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import Toggles from "@/components/layout/Toggles";
import { NAV_GROUPS, NAV_STANDALONE } from "@/lib/navConfig";

export default function MobileNavDrawer({ open, onClose, onAuth }) {
  const { t, language } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [openGroup, setOpenGroup] = useState(-1);
  const lbl = (o) => (language === "id" ? o.label_id : o.label_en);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-[84%] max-w-[360px] flex-col"
            style={{ backgroundColor: "var(--bg-surface)", boxShadow: "var(--elevation-3)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between p-4">
              <span className="font-wordmark text-[18px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--color-primary)" }}>
                Experience Jogja
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("menu.close")}
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  className="focus-ring w-full rounded-lg py-2.5 pl-9 pr-3 text-[14px]"
                  style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)", border: "none" }}
                />
              </div>
            </div>

            <nav className="mt-2 flex-1 overflow-y-auto p-2">
              {NAV_GROUPS.map((group, i) => {
                const on = openGroup === i;
                return (
                  <div key={group.label_en}>
                    <div className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-[15px] font-semibold uppercase" style={{ color: "var(--text-primary)" }}>
                      <Link to={group.to || "#"} onClick={onClose} className="focus-ring flex-1 text-left">
                        {lbl(group)}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOpenGroup(on ? -1 : i)}
                        className="focus-ring p-1"
                        aria-label="Toggle sub-menu"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${on ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    {on && (
                      <div className="mb-1 flex flex-col pl-3">
                        {group.items.map((item) => (
                          <Link
                            key={item.label_en + item.to}
                            to={item.to}
                            onClick={onClose}
                            className="focus-ring rounded-lg px-3 py-2.5 text-[14px]"
                            style={{ color: "var(--text-secondary)" }}
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
                  onClick={onClose}
                  className="focus-ring block rounded-lg px-3 py-3 text-[15px] font-semibold uppercase"
                  style={{ color: "var(--text-primary)" }}
                >
                  {lbl(item)}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 border-t p-4" style={{ borderColor: "var(--border)" }}>
              <Toggles showCurrency={false} />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-center text-[15px] font-semibold uppercase tracking-wide"
                    style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
                  >
                    <User className="h-4 w-4" /> My Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => { onClose(); logout(); }}
                    className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-center text-[15px] font-semibold uppercase tracking-wide transition-colors"
                    style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => { onClose(); onAuth?.(); }}
                  className="focus-ring w-full rounded-lg py-2.5 text-center text-[15px] font-semibold uppercase tracking-wide"
                  style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
                >
                  Log In | Sign Up
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}