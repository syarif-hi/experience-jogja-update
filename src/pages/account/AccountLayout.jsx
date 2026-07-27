import React from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { User, Bell, Settings, ChevronRight, LogOut } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const NAV_ITEMS = [
  { to: "/account", label: "Overview", icon: User, end: true },
  { to: "/account/notifications", label: "Notification Preferences", icon: Bell },
  { to: "/account/profile", label: "Profile Settings", icon: Settings },
];

export default function AccountLayout() {
  const { user, isAuthenticated, isLoadingAuth, logout } = useAuth();

  // Redirect to home if not authenticated (fallback — ProtectedRoute should handle this)
  if (!isLoadingAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SiteHeader />
      <main className="content-wrap" style={{ minHeight: "calc(100vh - 220px)" }}>
        <div className="py-8 md:py-12">
          {/* Page heading */}
          <div className="mb-8">
            <h1
              className="font-display text-[28px] font-normal md:text-[36px]"
              style={{ color: "var(--color-primary)" }}
            >
              My Account
            </h1>
            <p className="mt-1 text-[15px]" style={{ color: "var(--text-secondary)" }}>
              Manage your profile, preferences, and notification channels.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside>
              <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-x-visible">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `focus-ring flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors whitespace-nowrap ${
                        isActive ? "font-semibold" : ""
                      }`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                      color: isActive ? "var(--on-primary)" : "var(--text-secondary)",
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight
                          className="hidden h-4 w-4 lg:block"
                          style={{ opacity: isActive ? 1 : 0.3 }}
                        />
                      </>
                    )}
                  </NavLink>
                ))}

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="focus-ring mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface-alt)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Log Out</span>
                </button>
              </nav>
            </aside>

            {/* Content */}
            <section className="min-w-0">
              <Outlet context={{ user }} />
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
