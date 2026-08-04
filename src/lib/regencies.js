// DIY regency labels — powers the Destinations nav group + detail-page title bars.
export const REGENCIES = [
  { value: "yogyakarta-city", label_id: "Kota Yogyakarta", label_en: "Yogyakarta City" },
  { value: "sleman", label_id: "Sleman", label_en: "Sleman" },
  { value: "bantul", label_id: "Bantul", label_en: "Bantul" },
  { value: "kulon-progo", label_id: "Kulon Progo", label_en: "Kulon Progo" },
  { value: "gunungkidul", label_id: "Gunungkidul", label_en: "Gunungkidul" },
  { value: "villages-hidden-gems", label_id: "Yogyakarta Luar", label_en: "Outer Yogyakarta" },
];

const MAP = Object.fromEntries(REGENCIES.map((r) => [r.value, r]));

export function regencyLabel(value, language) {
  const r = MAP[value];
  if (!r) return value;
  return language === "id" ? r.label_id : r.label_en;
}