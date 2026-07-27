import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { User, Mail, Phone, Lock, Globe, Loader2, Check, Trash2 } from "lucide-react";

export default function ProfileSettings() {
  const { user } = useOutletContext();
  const { logout } = useAuth();

  // Profile form
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [language, setLanguage] = useState("en");

  // Password form
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");

  // Save states
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileSaved(false);
    await new Promise((r) => setTimeout(r, 800));
    setSavingProfile(false);
    setProfileSaved(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    if (newPw.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    setSavingPw(true);
    setPwSaved(false);
    await new Promise((r) => setTimeout(r, 800));
    setSavingPw(false);
    setPwSaved(true);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  };

  const inputClass =
    "focus-ring h-11 w-full rounded-lg px-3 text-[14px]";
  const inputStyle = {
    backgroundColor: "var(--bg-surface-alt)",
    color: "var(--text-primary)",
    border: "1px solid var(--bg-surface-alt)",
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2 className="text-[22px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Profile Settings
        </h2>
        <p className="mt-1 text-[14px]" style={{ color: "var(--text-secondary)" }}>
          Update your personal information and account settings.
        </p>
      </div>

      {/* ── Personal Information ── */}
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--bg-surface-alt)" }}
      >
        <h3 className="mb-5 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Personal Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <label htmlFor="ps-name" className="mb-1 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
              <User className="h-3.5 w-3.5" /> Display Name
            </label>
            <input
              id="ps-name"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setProfileSaved(false); }}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label htmlFor="ps-email" className="mb-1 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
              <Mail className="h-3.5 w-3.5" /> Email
            </label>
            <input
              id="ps-email"
              type="email"
              value={user?.email || ""}
              readOnly
              className={inputClass}
              style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="ps-phone" className="mb-1 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
              <Phone className="h-3.5 w-3.5" /> Phone Number
            </label>
            <input
              id="ps-phone"
              type="tel"
              placeholder="+62 812 3456 7890"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setProfileSaved(false); }}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Language */}
          <div>
            <label htmlFor="ps-lang" className="mb-1 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
              <Globe className="h-3.5 w-3.5" /> Preferred Language
            </label>
            <select
              id="ps-lang"
              value={language}
              onChange={(e) => { setLanguage(e.target.value); setProfileSaved(false); }}
              className={inputClass}
              style={inputStyle}
            >
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="focus-ring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-semibold transition-colors disabled:opacity-60"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
            onMouseEnter={(e) => { if (!savingProfile) e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"; }}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
          >
            {savingProfile ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save Changes"}
          </button>
          {profileSaved && (
            <span className="flex items-center gap-1 text-[13px] font-medium" style={{ color: "var(--tag-nature)" }}>
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </div>

      {/* ── Change Password ── */}
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--bg-surface-alt)" }}
      >
        <h3 className="mb-5 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Change Password
        </h3>

        {pwError && (
          <div className="mb-4 rounded-lg p-3 text-[13px]" style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}>
            {pwError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="max-w-md">
            <label htmlFor="ps-cpw" className="mb-1 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
              <Lock className="h-3.5 w-3.5" /> Current Password
            </label>
            <input
              id="ps-cpw"
              type="password"
              placeholder="••••••••"
              value={currentPw}
              onChange={(e) => { setCurrentPw(e.target.value); setPwSaved(false); }}
              className={inputClass}
              style={inputStyle}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-md md:max-w-none">
            <div>
              <label htmlFor="ps-npw" className="mb-1 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
                <Lock className="h-3.5 w-3.5" /> New Password
              </label>
              <input
                id="ps-npw"
                type="password"
                placeholder="••••••••"
                value={newPw}
                onChange={(e) => { setNewPw(e.target.value); setPwSaved(false); }}
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="ps-cfpw" className="mb-1 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
                <Lock className="h-3.5 w-3.5" /> Confirm New Password
              </label>
              <input
                id="ps-cfpw"
                type="password"
                placeholder="••••••••"
                value={confirmPw}
                onChange={(e) => { setConfirmPw(e.target.value); setPwSaved(false); }}
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={savingPw}
              className="focus-ring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-semibold transition-colors disabled:opacity-60"
              style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
              onMouseEnter={(e) => { if (!savingPw) e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
            >
              {savingPw ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</> : "Update Password"}
            </button>
            {pwSaved && (
              <span className="flex items-center gap-1 text-[13px] font-medium" style={{ color: "var(--tag-nature)" }}>
                <Check className="h-4 w-4" /> Password updated
              </span>
            )}
          </div>
        </form>
      </div>

      {/* ── Danger Zone ── */}
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid #FEE2E2" }}
      >
        <h3 className="mb-2 text-[16px] font-semibold" style={{ color: "#B91C1C" }}>
          Danger Zone
        </h3>
        <p className="mb-4 text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => logout()}
            className="focus-ring inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition-colors"
            style={{ borderColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface-alt)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Log Out
          </button>
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors"
            style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FECACA")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
          >
            <Trash2 className="h-4 w-4" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
