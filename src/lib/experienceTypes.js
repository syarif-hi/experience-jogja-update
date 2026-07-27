// Intent-based experience tags — powers the Things To Do nav group.
export const EXPERIENCE_TYPES = [
  { value: "heritage-culture", label_id: "Warisan & Budaya", label_en: "Heritage & Culture" },
  { value: "entertainment-creative", label_id: "Hiburan & Kreatif", label_en: "Entertainment & Creative" },
  { value: "sports-adventure", label_id: "Olahraga & Petualangan", label_en: "Sports & Adventure" },
  { value: "culinary-lifestyle", label_id: "Kuliner & Gaya Hidup", label_en: "Culinary & Lifestyle" },
  { value: "health-wellness", label_id: "Kesehatan & Kebugaran", label_en: "Health & Wellness" },
  { value: "mice-business", label_id: "MICE & Bisnis", label_en: "MICE & Business" },
];

const MAP = Object.fromEntries(EXPERIENCE_TYPES.map((e) => [e.value, e]));

export function experienceTypeLabel(value, language) {
  const e = MAP[value];
  if (!e) return value;
  return language === "id" ? e.label_id : e.label_en;
}