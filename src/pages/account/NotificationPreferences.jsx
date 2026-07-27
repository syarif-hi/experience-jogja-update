import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MessageCircle, Smartphone, Mail, Check, Loader2 } from "lucide-react";

// ── Channel definitions ──
const CHANNELS = [
  {
    key: "whatsapp",
    label: "WhatsApp Broadcast",
    desc: "Receive updates and promo via WhatsApp. We'll send you curated travel deals directly.",
    icon: MessageCircle,
    color: "#25D366",
    needsPhone: true,
  },
  {
    key: "sms",
    label: "SMS",
    desc: "Get text alerts for time-sensitive promos, event reminders, and travel tips.",
    icon: Smartphone,
    color: "var(--color-primary)",
    needsPhone: true,
  },
  {
    key: "email",
    label: "Email Newsletter",
    desc: "Periodic newsletter with curated articles, destination highlights, and exclusive offers.",
    icon: Mail,
    color: "var(--tag-culture)",
    needsPhone: false,
  },
];

// ── Content type options ──
const CONTENT_TYPES = [
  { key: "events", label: "Events & Festivals" },
  { key: "promos", label: "Travel Deals & Promos" },
  { key: "destinations", label: "New Destinations" },
  { key: "culture", label: "Cultural News & Heritage" },
  { key: "tips", label: "Travel Tips & Guides" },
  { key: "food", label: "Culinary & Lifestyle" },
];

// ── Frequency options ──
const FREQUENCIES = [
  { key: "instant", label: "Instant", desc: "Receive updates as they happen" },
  { key: "daily", label: "Daily Digest", desc: "One summary per day" },
  { key: "weekly", label: "Weekly Summary", desc: "A weekly round-up every Monday" },
];

export default function NotificationPreferences() {
  const { user } = useOutletContext();

  // Channel toggles + phone numbers
  const [channels, setChannels] = useState({
    whatsapp: { enabled: false, phone: "" },
    sms: { enabled: false, phone: "" },
    email: { enabled: true, phone: "" },
  });

  // Content type selections
  const [contentTypes, setContentTypes] = useState(["events", "promos", "destinations"]);

  // Frequency
  const [frequency, setFrequency] = useState("weekly");

  // Save state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleChannel = (key) => {
    setChannels((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
    setSaved(false);
  };

  const setPhone = (key, phone) => {
    setChannels((prev) => ({
      ...prev,
      [key]: { ...prev[key], phone },
    }));
    setSaved(false);
  };

  const toggleContent = (key) => {
    setContentTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save delay (replace with real base44 call later)
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="space-y-8">
      {/* Section heading */}
      <div>
        <h2 className="text-[22px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Notification Preferences
        </h2>
        <p className="mt-1 text-[14px]" style={{ color: "var(--text-secondary)" }}>
          Choose how and what updates you'd like to receive from Experience Jogja.
        </p>
      </div>

      {/* ── Channels ── */}
      <div>
        <h3 className="mb-4 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Notification Channels
        </h3>
        <div className="space-y-3">
          {CHANNELS.map((ch) => {
            const state = channels[ch.key];
            return (
              <div
                key={ch.key}
                className="rounded-2xl p-5 transition-colors"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: `1px solid ${state.enabled ? ch.color + "55" : "var(--bg-surface-alt)"}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: ch.color + "18", color: ch.color }}
                  >
                    <ch.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                        {ch.label}
                      </p>
                      {/* Toggle */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={state.enabled}
                        onClick={() => toggleChannel(ch.key)}
                        className="relative flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors"
                        style={{
                          backgroundColor: state.enabled ? ch.color : "#D1D5DB",
                        }}
                      >
                        <span
                          className="block h-6 w-6 rounded-full bg-white shadow-md transition-transform"
                          style={{ transform: state.enabled ? "translateX(20px)" : "translateX(0)" }}
                        />
                      </button>
                    </div>
                    <p className="mt-1 text-[13px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                      {ch.desc}
                    </p>

                    {/* Phone input — shown when channel is enabled and needs phone */}
                    {state.enabled && ch.needsPhone && (
                      <div className="mt-3">
                        <label
                          htmlFor={`phone-${ch.key}`}
                          className="mb-1 block text-[12px] font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Phone Number
                        </label>
                        <input
                          id={`phone-${ch.key}`}
                          type="tel"
                          placeholder="+62 812 3456 7890"
                          value={state.phone}
                          onChange={(e) => setPhone(ch.key, e.target.value)}
                          className="focus-ring h-10 w-full max-w-[320px] rounded-lg px-3 text-[14px]"
                          style={{
                            backgroundColor: "var(--bg-surface-alt)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--bg-surface-alt)",
                          }}
                        />
                      </div>
                    )}

                    {/* Email note */}
                    {state.enabled && ch.key === "email" && (
                      <p className="mt-2 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                        Newsletters will be sent to <strong>{user?.email || "your registered email"}</strong>.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Content Types ── */}
      <div>
        <h3 className="mb-4 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Content Preferences
        </h3>
        <p className="mb-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Select the types of updates you're interested in.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CONTENT_TYPES.map((ct) => {
            const checked = contentTypes.includes(ct.key);
            return (
              <button
                key={ct.key}
                type="button"
                onClick={() => toggleContent(ct.key)}
                className="focus-ring flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] font-medium transition-colors"
                style={{
                  backgroundColor: checked ? "var(--color-primary)" : "var(--bg-surface)",
                  color: checked ? "var(--on-primary)" : "var(--text-primary)",
                  border: `1px solid ${checked ? "var(--color-primary)" : "var(--bg-surface-alt)"}`,
                }}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[12px]"
                  style={{
                    backgroundColor: checked ? "rgba(255,255,255,0.25)" : "var(--bg-surface-alt)",
                    color: checked ? "var(--on-primary)" : "transparent",
                  }}
                >
                  {checked && <Check className="h-3.5 w-3.5" />}
                </span>
                {ct.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Frequency ── */}
      <div>
        <h3 className="mb-4 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Delivery Frequency
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {FREQUENCIES.map((f) => {
            const active = frequency === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => { setFrequency(f.key); setSaved(false); }}
                className="focus-ring rounded-xl px-4 py-4 text-left transition-colors"
                style={{
                  backgroundColor: active ? "var(--color-primary)" : "var(--bg-surface)",
                  color: active ? "var(--on-primary)" : "var(--text-primary)",
                  border: `1px solid ${active ? "var(--color-primary)" : "var(--bg-surface-alt)"}`,
                }}
              >
                <p className="text-[14px] font-semibold">{f.label}</p>
                <p
                  className="mt-0.5 text-[12px]"
                  style={{ color: active ? "rgba(255,255,255,0.75)" : "var(--text-secondary)" }}
                >
                  {f.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Save ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="focus-ring inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold transition-colors disabled:opacity-60"
          style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
          onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"; }}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Preferences"
          )}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-[13px] font-medium" style={{ color: "var(--tag-nature)" }}>
            <Check className="h-4 w-4" /> Saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
