// Event categories for the calendar legend + filter. Colors map to DESIGN-SYSTEM tag tokens.
export const EVENT_CATEGORIES = [
  { value: "festival", label_id: "Festival", label_en: "Festival", color: "var(--tag-lifestyle)", tab: "events" },
  { value: "music", label_id: "Musik", label_en: "Music", color: "var(--tag-culture)", tab: "concerts" },
  { value: "cultural", label_id: "Budaya", label_en: "Cultural", color: "var(--tag-heritage)", tab: "events" },
  { value: "outdoor", label_id: "Luar Ruangan", label_en: "Outdoor", color: "var(--tag-nature)", tab: "events" },
];

export const EVENT_CATEGORY_MAP = Object.fromEntries(EVENT_CATEGORIES.map((c) => [c.value, c]));

export function eventCategoryOf(ev) {
  return EVENT_CATEGORY_MAP[ev?.category] ? ev.category : "festival";
}

export function eventCategoryColor(value) {
  return (EVENT_CATEGORY_MAP[value] && EVENT_CATEGORY_MAP[value].color) || "var(--tag-lifestyle)";
}

export function eventCategoryLabel(value, language) {
  const c = EVENT_CATEGORY_MAP[value];
  if (!c) return value;
  return language === "id" ? c.label_id : c.label_en;
}

/** Get category definitions belonging to a high-level tab ("events" | "concerts"). */
export function getCategoriesForTab(tab) {
  return EVENT_CATEGORIES.filter((c) => c.tab === tab);
}

/** Return which tab a given category value belongs to. */
export function getTabForCategory(categoryValue) {
  return EVENT_CATEGORY_MAP[categoryValue]?.tab || "events";
}