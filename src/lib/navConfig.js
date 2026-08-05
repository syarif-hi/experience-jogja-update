// Mega-menu structure. Each group has sub-items with routes.
export const NAV_GROUPS = [
  {
    label_en: "Plan Your Trip", label_id: "Rencanakan Perjalanan",
    to: "/plan-your-trip",
    items: [
      { label_en: "Trip Planner", label_id: "Perencana Perjalanan", to: "/plan-your-trip/trip-planner" },
      { label_en: "Itineraries", label_id: "Rencana Perjalanan", to: "/plan-your-trip/itineraries" },
      { label_en: "Getting to Jogja", label_id: "Menuju ke Jogja", to: "/plan-your-trip/getting-to-jogja" },
      { label_en: "Getting Around", label_id: "Transportasi Lokal", to: "/plan-your-trip/getting-around" },
      { label_en: "Where to Stay", label_id: "Tempat Menginap", to: "/plan-your-trip/where-to-stay" },
      { label_en: "Visitor Information", label_id: "Informasi Wisatawan", to: "/plan-your-trip/visitor-information" },
      { label_en: "Travel Tips", label_id: "Tips Perjalanan", to: "/plan-your-trip/travel-tips" },
    ],
  },
  {
    label_en: "Book & Experience", label_id: "Pesan & Alami",
    to: "/book-experience",
    items: [
      { label_en: "Attractions", label_id: "Objek Wisata", to: "/book-experience/attractions" },
      { label_en: "Tours", label_id: "Tur", to: "/book-experience/tours" },
      { label_en: "Activities", label_id: "Aktivitas", to: "/book-experience/activities" },
      { label_en: "Hotels", label_id: "Hotel", to: "/book-experience/hotels" },
      { label_en: "Transportation", label_id: "Transportasi", to: "/book-experience/transportation" },
      { label_en: "Restaurants", label_id: "Restoran", to: "/book-experience/restaurants" },
      { label_en: "Event Tickets", label_id: "Tiket Acara", to: "/book-experience/event-tickets" },
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
      { label_en: "MICE & Business Events", label_id: "MICE & Acara Bisnis", to: "/things-to-do/mice-business" },
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
    label_en: "Explore", label_id: "Eksplorasi",
    to: "/explore",
    items: [
      { label_en: "All Destinations", label_id: "Semua Destinasi", to: "/destinations" },
      { label_en: "Yogyakarta City", label_id: "Kota Yogyakarta", to: "/destinations?region=yogyakarta-city" },
      { label_en: "Sleman", label_id: "Sleman", to: "/destinations?region=sleman" },
      { label_en: "Bantul", label_id: "Bantul", to: "/destinations?region=bantul" },
      { label_en: "Kulon Progo", label_id: "Kulon Progo", to: "/destinations?region=kulon-progo" },
      { label_en: "Gunungkidul", label_id: "Gunungkidul", to: "/destinations?region=gunungkidul" },
      { label_en: "Outer Yogyakarta", label_id: "Yogyakarta Luar", to: "/destinations?region=villages-hidden-gems" },
    ],
  },
  {
    label_en: "Events", label_id: "Acara",
    to: "/events",
    items: [
      { label_en: "Events Calendar", label_id: "Kalender Acara", to: "/events/calendar" },
      { label_en: "Festivals", label_id: "Festival", to: "/events/festivals" },
      { label_en: "Cultural Performances", label_id: "Pertunjukan Budaya", to: "/events/cultural-performances" },
      { label_en: "Exhibitions", label_id: "Pameran", to: "/events/exhibitions" },
      { label_en: "Sports Events", label_id: "Acara Olahraga", to: "/events/sports-events" },
      { label_en: "Upcoming Highlights", label_id: "Sorotan Mendatang", to: "/events/upcoming-highlights" },
    ],
  },
];

// No standalone items.
export const NAV_STANDALONE = [];