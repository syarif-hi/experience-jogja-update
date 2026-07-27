import React, { useState } from "react";
import { Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/lib/LanguageContext";

// Available site languages (content is authored in these two).
const LANGS = [
  { code: "id", flag: "🇮🇩", country: "Indonesia", name: "Bahasa Indonesia" },
  { code: "en", flag: "🇬🇧", country: "United Kingdom", name: "English" },
];

export default function LanguagePopover() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Change language"
          className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg px-3 transition-colors"
          style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-primary)" }}
        >
          <span className="font-heading text-[16px] font-semibold leading-none">文A</span>
          <span className="text-[13px] leading-none" style={{ color: "var(--text-secondary)" }}>|</span>
          <span className="text-[13px] font-semibold uppercase leading-none">{language}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 p-1.5"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        {LANGS.map((l) => {
          const active = l.code === language;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => { setLanguage(l.code); setOpen(false); }}
              className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
              style={{ backgroundColor: active ? "var(--bg-surface-alt)" : "transparent" }}
            >
              <span className="text-[22px] leading-none">{l.flag}</span>
              <span className="flex flex-1 flex-col">
                <span className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{l.name}</span>
                <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{l.country}</span>
              </span>
              {active && <Check className="h-4 w-4" style={{ color: "var(--color-primary)" }} />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}