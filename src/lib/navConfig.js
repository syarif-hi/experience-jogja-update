// Mega-menu structure (SITE-STRUCTURE.md §3). Each group has sub-items with routes.
// Routes to not-yet-built features point at /coming-soon.
export const NAV_GROUPS = [
  {
    label_en: "Plan Your Trip", label_id: "Rencanakan Perjalanan",
    to: "/plan-your-trip",
    items: [
      { label_en: "Trip Planner", label_id: "Perencana Perjalanan", to: "/plan-your-trip/trip-planner" },
      { label_en: "Sample Itineraries", label_id: "Contoh Rencana", to: "/plan-your-trip/itineraries" },
      { label_en: "Places to Stay", label_id: "Tempat Menginap", to: "/plan-your-trip/stays" },
      { label_en: "Visitor Information", label_id: "Informasi Wisatawan", to: "/plan-your-trip/visitor-information" },
    ],
  },
  {
    label_en: "Book & Experience", label_id: "Pesan & Alami",
    to: "/book-experience",
    items: [
      { label_en: "Tours", label_id: "Tur", to: "/book-experience/tours" },
      { label_en: "Places to Stay", label_id: "Tempat Menginap", to: "/book-experience/stays" },
      { label_en: "Events", label_id: "Acara", to: "/book-experience/events" },
      { label_en: "Concert", label_id: "Konser", to: "/book-experience/concert" },
    ],
  },
  {
    label_en: "Discover", label_id: "Jelajahi",
    to: "/discover",
    items: [
      { label_en: "About Jogja", label_id: "Tentang Jogja", to: "/discover/about-jogja" },
      { label_en: "Why Visit Jogja", label_id: "Mengapa Mengunjungi Jogja", to: "/discover/why-visit-jogja" },
      { label_en: "Living Heritage", label_id: "Warisan Yang Hidup", to: "/discover/living-heritage" },
      { label_en: "Creative Culture", label_id: "Budaya Kreatif", to: "/discover/creative-culture" },
      { label_en: "Future Lifestyle", label_id: "Gaya Hidup Masa Depan", to: "/discover/future-lifestyle" },
      { label_en: "Travel Inspiration", label_id: "Inspirasi Perjalanan", to: "/discover/travel-inspiration" },
    ],
  },
  {
    label_en: "Things To Do", label_id: "Hal yang Bisa Dilakukan",
    to: "/things-to-do",
    items: [
      { label_en: "Heritage & Culture", label_id: "Warisan & Budaya", to: "/things-to-do/heritage-culture" },
      { label_en: "Entertainment & Creative", label_id: "Hiburan & Kreatif", to: "/things-to-do/entertainment-creative" },
      { label_en: "Sports & Adventure", label_id: "Olahraga & Petualangan", to: "/things-to-do/sports-adventure" },
      { label_en: "Culinary & Lifestyle", label_id: "Kuliner & Gaya Hidup", to: "/things-to-do/culinary-lifestyle" },
      { label_en: "Health & Wellness", label_id: "Kesehatan & Kebugaran", to: "/things-to-do/health-wellness" },
      { label_en: "MICE & Business", label_id: "MICE & Bisnis", to: "/things-to-do/mice-business" },
    ],
  },
  {
    label_en: "Destinations", label_id: "Destinasi",
    to: "/destinations",
    items: [
      { label_en: "Yogyakarta City", label_id: "Kota Yogyakarta", to: "/destinations/yogyakarta-city" },
      { label_en: "Sleman", label_id: "Sleman", to: "/destinations/sleman" },
      { label_en: "Bantul", label_id: "Bantul", to: "/destinations/bantul" },
      { label_en: "Kulon Progo", label_id: "Kulon Progo", to: "/destinations/kulon-progo" },
      { label_en: "Gunungkidul", label_id: "Gunungkidul", to: "/destinations/gunungkidul" },
      { label_en: "Villages & Hidden Gems", label_id: "Desa & Permata Tersembunyi", to: "/destinations/villages-hidden-gems" },
    ],
  },
  {
    label_en: "Visitor Information", label_id: "Informasi Wisatawan",
    to: "/visitor-information",
    items: [
      { label_en: "Getting to Jogja", label_id: "Menuju ke Jogja", to: "/visitor-information/getting-to-jogja" },
      { label_en: "Getting Around", label_id: "Transportasi Lokal", to: "/visitor-information/transport" },
      { label_en: "Health & Emergency", label_id: "Kesehatan & Darurat", to: "/visitor-information/health-emergency" },
      { label_en: "Money & Communication", label_id: "Uang & Komunikasi", to: "/visitor-information/money-communication" },
      { label_en: "Wellness & Fitness", label_id: "Kebugaran & Kesehatan", to: "/visitor-information/wellness-fitness" },
      { label_en: "Public Facilities", label_id: "Fasilitas Umum", to: "/visitor-information/public-facilities" },
    ],
  },
];

// Standalone top-level item (also linked from within Plan Your Trip — intentional).
export const NAV_STANDALONE = [
  { label_en: "Events", label_id: "Acara", to: "/events" },
];