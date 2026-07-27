const fs = require('fs');

const db = require('./db.json');

// Make the user an admin so the Edit buttons show up
db.auth_me.role = 'admin';

const KIND_BY_SLUG = {
  borobudur: { label: "Borobudur", kind: "culture", zone: "north", day: 2, x: 25, y: 35 },
  prambanan: { label: "Prambanan Temple", kind: "culture", zone: "city", day: 2, x: 75, y: 40 },
  kraton: { label: "Kraton (Sultan's Palace)", kind: "culture", zone: "city", day: 1, x: 55, y: 60 },
  "taman-sari": { label: "Taman Sari Water Castle", kind: "culture", zone: "city", day: 1, x: 53, y: 65 },
  kaliurang: { label: "Kaliurang Park", kind: "nature", zone: "north", day: 3, x: 58, y: 30 },
  merapi: { label: "Mount Merapi", kind: "nature", zone: "north", day: 3, x: 60, y: 20 },
  nglanggeran: { label: "Nglanggeran", kind: "nature", zone: "south", day: 3, x: 68, y: 75 },
  "jomblang-cave": { label: "Jomblang Cave", kind: "nature", zone: "south", day: 3, x: 80, y: 80 },
  "goa-pindul": { label: "Goa Pindul", kind: "nature", zone: "south", day: 3, x: 78, y: 70 },
  parangtritis: { label: "Parangtritis Beach", kind: "beach", zone: "south", day: 3, x: 45, y: 90 },
  indrayanti: { label: "Indrayanti Beach", kind: "beach", zone: "south", day: 3, x: 82, y: 92 },
  malioboro: { label: "Malioboro", kind: "city", zone: "city", day: 1, x: 53, y: 53 },
  "tugu-yogyakarta": { label: "Tugu Yogyakarta", kind: "city", zone: "city", day: 1, x: 53, y: 48 },
  airport: { label: "Yogyakarta Int'l Airport", kind: "city", zone: "south", day: null, x: 20, y: 70 },
};

db.mapplace = Object.entries(KIND_BY_SLUG).map(([slug, data], index) => ({
  id: index + 1,
  slug,
  label: data.label,
  kind: data.kind,
  zone: data.zone,
  day: data.day,
  show_in_distance: true
}));

db.mappinposition = Object.entries(KIND_BY_SLUG).map(([slug, data], index) => ({
  id: index + 1,
  slug,
  x: data.x,
  y: data.y
}));

fs.writeFileSync('./mock-backend/db.json', JSON.stringify(db, null, 2));
console.log('Successfully populated db.json with map places and admin role!');
