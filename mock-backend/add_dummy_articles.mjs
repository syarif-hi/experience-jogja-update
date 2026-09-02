import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('mock-backend/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const article1 = {
  id: "article-dummy-cafe",
  slug: "top-5-hidden-cafes",
  title_en: "Top 5 Hidden Coffee Shops in Yogyakarta",
  title_id: "5 Kedai Kopi Tersembunyi Terbaik di Yogyakarta",
  topic_tag: "food-drink",
  published_date: "2026-08-26",
  cover_image_url: "/images/generated/hidden-cafe-jogja.jpg",
  excerpt_en: "Discover the most serene and aesthetic hidden cafes in Jogja, perfect for relaxing or working surrounded by nature.",
  excerpt_id: "Temukan kedai kopi tersembunyi yang paling tenang dan estetik di Jogja, sempurna untuk bersantai atau bekerja dikelilingi alam.",
  body_en: "<p>Yogyakarta's coffee scene is booming, but the best spots are often hidden away from the main streets. We've compiled a list of the top 5 hidden coffee shops featuring traditional Javanese architecture and lush greenery.</p><h2>1. Kopi Omah Jawa</h2><p>Tucked away in a quiet neighborhood, this cafe offers authentic local coffee blends in a beautifully restored wooden Joglo. It's the perfect escape from the city noise.</p>",
  body_id: "<p>Kancah perkopian di Yogyakarta sedang berkembang pesat, tetapi tempat-tempat terbaik sering kali tersembunyi jauh dari jalan utama. Kami telah menyusun daftar 5 kedai kopi tersembunyi teratas yang menampilkan arsitektur tradisional Jawa dan tanaman hijau subur.</p><h2>1. Kopi Omah Jawa</h2><p>Terselip di lingkungan yang tenang, kafe ini menawarkan racikan kopi lokal otentik di sebuah Joglo kayu yang telah direstorasi dengan indah. Ini adalah pelarian yang sempurna dari kebisingan kota.</p>",
  created_date: "2026-08-26T12:00:00.000000",
  updated_date: "2026-08-26T12:00:00.000000",
  created_by_id: "service_ai_assistant",
  is_sample: true
};

const article2 = {
  id: "article-dummy-temple",
  slug: "ancient-temples-beyond-borobudur",
  title_en: "Exploring the Ancient Temples Beyond Borobudur",
  title_id: "Menjelajahi Candi Kuno di Luar Borobudur",
  topic_tag: "heritage-culture",
  published_date: "2026-08-26",
  cover_image_url: "/images/generated/ancient-temple-jogja.jpg",
  excerpt_en: "Escape the crowds and discover the serene, lesser-known Hindu and Buddhist temples scattered across the green hills of Yogyakarta.",
  excerpt_id: "Hindari keramaian dan temukan candi Hindu dan Buddha yang tenang dan kurang dikenal yang tersebar di perbukitan hijau Yogyakarta.",
  body_en: "<p>While Borobudur and Prambanan draw millions of visitors, Yogyakarta's countryside hides numerous smaller, equally fascinating ancient structures. During the golden hour, these lesser-known temples offer a magical and serene atmosphere without the crowds.</p><h2>The Hidden Gems</h2><p>Many of these temples date back to the 8th and 9th centuries, featuring intricate stone carvings that tell forgotten stories. Exploring them provides a peaceful connection to Java's rich history.</p>",
  body_id: "<p>Sementara Borobudur dan Prambanan menarik jutaan pengunjung, pedesaan Yogyakarta menyembunyikan banyak struktur kuno yang lebih kecil dan sama menariknya. Saat golden hour, candi-candi yang kurang dikenal ini menawarkan suasana yang ajaib dan tenang tanpa keramaian.</p><h2>Permata Tersembunyi</h2><p>Banyak dari candi-candi ini berasal dari abad ke-8 dan ke-9, menampilkan ukiran batu rumit yang menceritakan kisah-kisah yang terlupakan. Menjelajahinya memberikan koneksi yang damai ke sejarah Jawa yang kaya.</p>",
  created_date: "2026-08-26T12:00:00.000000",
  updated_date: "2026-08-26T12:00:00.000000",
  created_by_id: "service_ai_assistant",
  is_sample: true
};

if (!db.article) {
  db.article = [];
}
db.article.unshift(article1, article2);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Dummy articles added successfully.');
