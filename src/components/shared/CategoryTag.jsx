import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { categoryLabel, categoryTagColor, categoryTagTextColor } from "@/lib/categories";

export default function CategoryTag({ category, className = "" }) {
  const { language } = useLanguage();
  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1 text-[12px] font-semibold leading-none max-w-full ${className}`}
      style={{ backgroundColor: categoryTagColor(category), color: categoryTagTextColor(category) }}
    >
      <span className="truncate max-w-full">{categoryLabel(category, language)}</span>
    </span>
  );
}