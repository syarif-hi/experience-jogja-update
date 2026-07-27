// Single source of truth for the consolidated 9-category taxonomy (PRD §6.2).
// tagColor references DESIGN-SYSTEM §2.2 tag tokens.
export const CATEGORIES = [
  { value: "landmarks", label_id: "Landmark", label_en: "Landmarks", desc_id: "Ikon kota yang tak boleh dilewatkan", desc_en: "Iconic city sights you can't miss", tagColor: "var(--tag-heritage)" },
  { value: "nature-outdoor", label_id: "Alam & Luar Ruangan", label_en: "Nature & Outdoor", desc_id: "Petualangan di alam terbuka", desc_en: "Your gateway to pure adventure", tagColor: "var(--tag-nature)" },
  { value: "cultural-heritage-temples", label_id: "Warisan Budaya & Candi", label_en: "Cultural Heritage & Temples", desc_id: "Menjaga warisan untuk dunia", desc_en: "Preserving heritage for the world to see", tagColor: "var(--tag-heritage)" },
  { value: "art-museums", label_id: "Seni & Museum", label_en: "Art & Museums", desc_id: "Karya dan cerita di setiap dinding", desc_en: "Art and stories on every wall", tagColor: "var(--tag-culture)" },
  { value: "eat-drink", label_id: "Kuliner", label_en: "Eat & Drink", desc_id: "Cita rasa untuk setiap penjelajah", desc_en: "A signature taste for every traveler", tagColor: "var(--tag-lifestyle)" },
  { value: "shopping", label_id: "Belanja", label_en: "Shopping", desc_id: "Oleh-oleh dan kerajinan khas Jogja", desc_en: "Local crafts and souvenirs to bring home", tagColor: "var(--tag-lifestyle)" },
  { value: "events-festivals", label_id: "Acara & Festival", label_en: "Events & Festivals", desc_id: "Perayaan budaya sepanjang tahun", desc_en: "Cultural celebrations all year round", tagColor: "var(--tag-culture)" },
  { value: "villages-local-life", label_id: "Desa & Kehidupan Lokal", label_en: "Villages & Local Life", desc_id: "Kehangatan kehidupan desa Jogja", desc_en: "The warmth of Jogja's village life", tagColor: "var(--tag-nature)" },
  { value: "things-to-do", label_id: "Hal yang Bisa Dilakukan", label_en: "Things To Do", desc_id: "Panduanmu untuk pengalaman terbaik", desc_en: "Your guide to the best experiences around", tagColor: "var(--tag-lifestyle)" },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

export function categoryLabel(value, language) {
  const c = CATEGORY_MAP[value];
  if (!c) return value;
  return language === "id" ? c.label_id : c.label_en;
}

export function categoryTagColor(value) {
  return (CATEGORY_MAP[value] && CATEGORY_MAP[value].tagColor) || "var(--tag-lifestyle)";
}

// Lifestyle (gold) tags read best with dark text; the rest use white.
export function categoryTagTextColor(value) {
  return categoryTagColor(value) === "var(--tag-lifestyle)" ? "var(--on-accent)" : "#FFFFFF";
}