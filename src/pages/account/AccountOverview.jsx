import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Bell, Settings, MapPin, Calendar, Heart, TrendingUp } from "lucide-react";

const QUICK_LINKS = [
  { to: "/account/notifications", icon: Bell, label: "Notification Preferences", desc: "Choose how you receive updates — WhatsApp, SMS, or Email." },
  { to: "/account/profile", icon: Settings, label: "Profile Settings", desc: "Update your name, phone number, and password." },
];

const STAT_CARDS = [
  { icon: Calendar, label: "Member Since", value: "July 2026", color: "var(--color-primary)" },
  { icon: Bell, label: "Active Channels", value: "1 channel", color: "var(--tag-heritage)" },
  { icon: Heart, label: "Saved Destinations", value: "0", color: "var(--tag-nature)" },
  { icon: TrendingUp, label: "Promos Received", value: "3", color: "var(--color-accent)" },
];

export default function AccountOverview() {
  const { user } = useOutletContext();

  const displayName = user?.full_name || user?.email?.split("@")[0] || "Traveler";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{ backgroundColor: "var(--bg-surface-alt)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-[22px] font-bold uppercase"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
          >
            {displayName.charAt(0)}
          </div>
          <div>
            <h2
              className="text-[22px] font-semibold md:text-[26px]"
              style={{ color: "var(--text-primary)" }}
            >
              Welcome back, {displayName}!
            </h2>
            <p className="mt-0.5 text-[14px]" style={{ color: "var(--text-secondary)" }}>
              {user?.email || "user@experiencejogja.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STAT_CARDS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 md:p-5"
            style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--bg-surface-alt)" }}
          >
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: s.color + "18", color: s.color }}
            >
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-[12px] font-medium uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
              {s.label}
            </p>
            <p className="mt-1 text-[20px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h3 className="mb-4 text-[18px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {QUICK_LINKS.map((ql) => (
            <Link
              key={ql.to}
              to={ql.to}
              className="focus-ring group flex items-start gap-4 rounded-2xl p-5 transition-colors"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--bg-surface-alt)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--bg-surface-alt)")}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
              >
                <ql.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  {ql.label}
                </p>
                <p className="mt-1 text-[13px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                  {ql.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Explore CTA */}
      <div
        className="flex flex-col items-start gap-4 rounded-2xl p-6 md:flex-row md:items-center md:justify-between md:p-8"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-white" />
          <div>
            <h3 className="text-[18px] font-semibold text-white md:text-[20px]">
              Ready to explore Jogja?
            </h3>
            <p className="mt-1 text-[14px] text-white/80">
              Discover new destinations, events, and hidden gems.
            </p>
          </div>
        </div>
        <Link
          to="/destinations"
          className="focus-ring inline-flex shrink-0 items-center rounded-lg px-6 py-3 text-[14px] font-semibold transition-colors"
          style={{ backgroundColor: "var(--color-accent)", color: "var(--on-accent)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
        >
          Explore Destinations
        </Link>
      </div>
    </div>
  );
}
