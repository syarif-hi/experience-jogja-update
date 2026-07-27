import React from "react";
import { useCurrency } from "@/lib/CurrencyContext";
import { useLanguage } from "@/lib/LanguageContext";

function SegPill({ options, value, onChange, ariaLabel }) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex h-10 items-center gap-2"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className="focus-ring flex h-full items-center rounded-md px-1 text-[14px] font-bold transition-colors"
            style={{
              backgroundColor: "transparent",
              color: active ? "var(--color-primary)" : "var(--text-secondary)",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Toggles({ className = "", showCurrency = true, showLanguage = true }) {
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {showLanguage && (
        <SegPill
          ariaLabel="Language"
          value={language}
          onChange={setLanguage}
          options={[{ value: "id", label: "ID" }, { value: "en", label: "EN" }]}
        />
      )}

      {showCurrency && (
        <SegPill
          ariaLabel="Currency"
          value={currency}
          onChange={setCurrency}
          options={[{ value: "IDR", label: "IDR" }, { value: "USD", label: "USD" }]}
        />
      )}
    </div>
  );
}