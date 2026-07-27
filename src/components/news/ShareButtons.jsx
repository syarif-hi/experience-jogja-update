import React, { useState } from "react";
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function ShareButtons({ title, hideLabel = false }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const enc = encodeURIComponent;

  const links = [
    { icon: Facebook, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { icon: Twitter, label: "X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title || "")}` },
    { icon: Linkedin, label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="flex items-center gap-2">
      {!hideLabel && <span className="mr-1 text-[13px] font-semibold" style={{ color: "var(--text-secondary)" }}>{t("share.label")}</span>}
      {links.map(({ icon: Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("share.label")} ${label}`}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label={t("share.copy")}
        className="focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-colors"
        style={{ backgroundColor: copied ? "var(--color-primary)" : "var(--bg-surface-alt)", color: copied ? "var(--on-primary)" : "var(--text-primary)" }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}