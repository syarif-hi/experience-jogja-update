// Repoint cover_image_url in db.json to locally generated thumbnails.
// Only repoints entries whose generated file exists in public/images/generated/.
// Usage: node mock-backend/apply_thumbnails.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const GEN_DIR = path.join(ROOT, "public", "images", "generated");
const DB = path.join(__dirname, "db.json");
const PUBLIC_PREFIX = "/images/generated";

function exists(key) {
  return fs.existsSync(path.join(GEN_DIR, `${key}.jpg`));
}

const d = JSON.parse(fs.readFileSync(DB, "utf8"));
let changed = 0;
const missing = [];

// Articles: key = slug
for (const a of d.article) {
  const key = a.slug;
  if (exists(key)) {
    a.cover_image_url = `${PUBLIC_PREFIX}/${key}.jpg`;
    changed++;
  } else missing.push(`article:${key}`);
}

// Guide articles: key = category__slug (slugs not unique)
for (const g of d.guide_article) {
  const key = `${g.category}__${g.slug}`;
  if (exists(key)) {
    g.cover_image_url = `${PUBLIC_PREFIX}/${key}.jpg`;
    changed++;
  } else missing.push(`guide:${key}`);
}

// Events: key = slug
for (const e of d.event) {
  const key = e.slug;
  if (exists(key)) {
    e.cover_image_url = `${PUBLIC_PREFIX}/${key}.jpg`;
    changed++;
  } else missing.push(`event:${key}`);
}

fs.writeFileSync(DB, JSON.stringify(d, null, 2) + "\n");
console.log(`Repointed ${changed} cover_image_url entries.`);
if (missing.length) {
  console.log(`Skipped (no generated file yet): ${missing.length}`);
  missing.forEach((m) => console.log("  - " + m));
}
