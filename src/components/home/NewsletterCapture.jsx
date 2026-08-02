import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import SmartImage from "@/components/shared/SmartImage";

export default function NewsletterCapture() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire real newsletter subscription (backend function / email provider) in a future session.
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="section-y !pt-6 md:!pt-10" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="content-wrap">
        <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-3xl md:grid-cols-2" style={{ backgroundColor: "#E8E8E8" }}>
          <div className="p-8 text-left md:p-12">
            <h2 className="font-display text-[26px] font-normal md:text-[34px]" style={{ color: "var(--color-primary)" }}>
              {t("newsletter.title")}
            </h2>
            <p className="mt-2 max-w-[48ch] text-[15px] font-normal md:text-[16px]" style={{ color: "var(--text-secondary)" }}>
              {t("newsletter.subtitle")}
            </p>

            {submitted ? (
              <p className="mt-6 text-[15px] font-semibold" style={{ color: "var(--color-success, #3F6B4F)" }}>
                {t("newsletter.success")}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex max-w-[480px] flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  className="focus-ring flex-1 rounded-lg px-4 py-3 text-[15px]"
                  style={{ backgroundColor: "#FFFFFF", color: "var(--text-primary)", border: "none" }}
                />
                <button
                  type="submit"
                  className="focus-ring rounded-lg px-6 py-3 text-[15px] font-semibold transition-colors"
                  style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
                >
                  {t("newsletter.cta")}
                </button>
              </form>
            )}
          </div>
          <div className="relative hidden md:block">
            <SmartImage
              src="/traditional_dance_jogja-w1500.jpg"
              alt="Yogyakarta scenery"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}