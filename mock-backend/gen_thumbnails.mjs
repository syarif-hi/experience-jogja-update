// Generate realistic AI thumbnails for all posts via Pollinations.ai (keyless).
// Saves to public/images/generated/<key>.jpg and repoints cover_image_url in db.json.
// Usage: node mock-backend/gen_thumbnails.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "generated");
const DB = path.join(__dirname, "db.json");

const STYLE =
  "realistic travel photograph, high detail, natural daylight, DSLR, 35mm, photojournalistic, no text, no watermark";

// Per-collection maps. Key = filename stem. prompt = subject description.
// Prompts are grounded in the real Yogyakarta subject so results match the post.
const ARTICLE = {
  "top-10-hidden-cafes-jogja":
    "cozy hidden specialty coffee shop cafe interior in Yogyakarta Indonesia, barista pouring latte, warm wooden decor",
  "prambanan-jazz-2026-recap":
    "outdoor jazz music festival stage at night with Prambanan Hindu temple silhouette in background, crowd and stage lights, Yogyakarta",
  "new-tourist-tax-jogja-2026":
    "tourists at a ticket counter entrance of a Yogyakarta heritage site, tropical Indonesia, official signage booth",
  "best-sunrise-spots-jogja":
    "golden sunrise over misty hills and volcano near Yogyakarta Indonesia, viewpoint silhouette, dramatic morning light",
  "malioboro-walking-guide":
    "busy Malioboro street Yogyakarta Indonesia at golden hour, pedestrians walking under colonial arcade shops, street vendors, becak pedicabs",
  "gudeg-food-tour":
    "traditional Indonesian gudeg jackfruit stew served on plate at a warung food stall in Yogyakarta, close up food photography",
  "hidden-warungs-locals-eat":
    "small local Indonesian warung eatery in Yogyakarta with locals eating, simple wooden tables, street food",
  "best-time-borobudur":
    "Borobudur Buddhist temple at sunrise with stupas and misty mountains, Central Java Indonesia, wide scenic view",
  "this-month-in-jogja":
    "vibrant Yogyakarta city cultural street scene collage feeling, Tugu monument, festive atmosphere Indonesia",
};

const GUIDE = {
  "getting-to-jogja__air":
    "airplane at Yogyakarta International Airport terminal Indonesia, modern airport tarmac daytime",
  "getting-to-jogja__train":
    "passenger train arriving at Tugu train station Yogyakarta Indonesia, platform and railway",
  "getting-to-jogja__bus":
    "intercity bus at Giwangan bus terminal Yogyakarta Indonesia, travel coach",
  "getting-to-jogja__car":
    "car driving on scenic road toward Yogyakarta Indonesia, countryside highway with volcano view",
  "getting-around__ride-hailing":
    "motorbike ride-hailing driver with green jacket and helmet on Yogyakarta street Indonesia, smartphone app transport",
  "getting-around__bus":
    "Trans Jogja city bus at a bus stop shelter in Yogyakarta Indonesia, urban public transport",
  "getting-around__traditional":
    "traditional becak pedicab and andong horse carriage on Malioboro street Yogyakarta Indonesia",
  "getting-around__rental":
    "row of rental motorbikes and small car parked for tourists in Yogyakarta Indonesia",
  "getting-around__taxi":
    "metered taxi car on a Yogyakarta city street Indonesia, daytime urban transport",
  "travel-tips__best-time":
    "sunny dry season scenic view of Yogyakarta Indonesia rice fields and blue sky, ideal travel weather",
  "travel-tips__pack":
    "flat lay of travel packing essentials backpack sunhat camera sunscreen for tropical Indonesia trip",
  "travel-tips__etiquette":
    "respectful tourists interacting politely with local Javanese people at a temple in Yogyakarta Indonesia",
  "travel-tips__safety":
    "tourist safely walking with daypack on a calm Yogyakarta street Indonesia, daytime",
  "travel-tips__budget":
    "Indonesian rupiah cash and coins with a small travel notebook and map, budget travel planning",
  "travel-tips__language":
    "friendly local Indonesian person greeting a tourist, conversation on a Yogyakarta street, cultural exchange",
};

const EVENT = {
  "demo-wayang-kulit-night":
    "traditional Javanese wayang kulit leather shadow puppet performance at night, dalang puppeteer behind lit white screen, gamelan, Yogyakarta Indonesia",
  "demo-sekaten-grand-fair":
    "crowded Sekaten traditional fair at Alun-Alun Utara Yogyakarta at night, ferris wheel and food stalls, festive lights Indonesia",
  "demo-jazz-at-tugu":
    "live jazz band performing on outdoor stage near Tugu monument Yogyakarta at night, saxophone player, crowd",
  "demo-merapi-sunrise-trek":
    "hikers trekking at sunrise on the slopes of Mount Merapi volcano Yogyakarta Indonesia, dramatic golden morning light",
  "demo-kraton-cultural-parade":
    "traditional Javanese royal palace cultural parade with palace guards abdi dalem in front of Kraton Yogyakarta Indonesia",
  "demo-indie-music-showcase":
    "indie band concert on stage with colorful lights and young crowd, indoor music venue Indonesia",
  "demo-ramayana-ballet":
    "Ramayana ballet dancers in ornate Javanese costumes performing outdoors with Prambanan temple lit behind at night, Yogyakarta",
  "demo-street-food-festival":
    "bustling Indonesian street food festival at night on Malioboro Yogyakarta, food stalls, grilled satay, crowd",
  "demo-cave-tubing-adventure":
    "cave tubing adventure floating on inner tubes through a river cave at Goa Pindul Yogyakarta Indonesia, headlamps and rock formations",
  "demo-keroncong-evening":
    "keroncong traditional Indonesian acoustic music ensemble performing in the evening, ukulele and violin, cultural stage Yogyakarta",
  "demo-batik-art-expo":
    "batik art exhibition with colorful hand-drawn batik cloth displayed on walls, visitors viewing, Yogyakarta Indonesia",
  "demo-sunset-yoga-beach":
    "people doing yoga on the sand at sunset on Parangtritis beach Yogyakarta Indonesia, silhouettes and orange sky",
  "jogja-arts-fest-2026":
    "vibrant arts festival with installations and performers at Taman Budaya cultural center Yogyakarta Indonesia",
  "malioboro-night-2026":
    "Malioboro night market Yogyakarta Indonesia with glowing food stalls, lesehan mat seating, crowd at night",
  "prambanan-jazz-2026":
    "large jazz festival stage at night with Prambanan temple illuminated in background, big crowd, Yogyakarta Indonesia",
  "batik-workshop-2026":
    "hands making batik with canting wax pen on white cloth at a batik workshop in Giriloyo village Yogyakarta Indonesia, close up",
  "gamelan-night-2026":
    "Javanese gamelan orchestra with bronze gongs and metallophones performing at night in Kraton Yogyakarta Indonesia",
  "jogja-batik-festival":
    "colorful batik festival parade with models wearing batik fashion on stage, Yogyakarta Indonesia",
  "malam-gamelan":
    "atmospheric night gamelan and traditional dance cultural performance inside Kraton Yogyakarta Indonesia, warm lantern light",
  "malioboro-night-market":
    "special Malioboro night market Yogyakarta Indonesia, string lights, souvenir and food stalls, evening crowd",
  "artjog-mmxxvii":
    "contemporary art exhibition gallery with large modern art installations and visitors, Jogja National Museum Indonesia",
  "jogja-marathon-2027":
    "runners in a city marathon passing Tugu monument Yogyakarta Indonesia at morning, race bibs and crowd",
  "wayang-kulit-sono-budoyo":
    "wayang kulit shadow puppet show at Sonobudoyo museum Yogyakarta, ornate leather puppets and gamelan, night",
  "biennale-jogja-xviii":
    "contemporary biennale art exhibition with bold installations and visitors, Yogyakarta Indonesia gallery space",
  "batik-heritage-exhibition":
    "batik heritage museum exhibition with antique royal batik cloth displayed in glass cases, visitors, Museum Batik Yogyakarta Indonesia",
  "photography-jogja-2026":
    "photography exhibition with framed photos on gallery walls and visitors viewing, Jogja Gallery Indonesia",
  "sculpture-in-motion":
    "modern sculpture art exhibition with kinetic metal sculptures in a gallery, Taman Budaya Yogyakarta Indonesia",
  "digital-art-fair-jogja":
    "immersive digital art fair with projection mapping and glowing screens, visitors in dark gallery, Yogyakarta Indonesia",
  "wayang-craft-showcase":
    "display of handcrafted wayang leather puppets and Javanese crafts at Sonobudoyo museum Yogyakarta Indonesia",
  "tour-de-merapi-2026":
    "cyclists riding road bikes uphill on scenic mountain road near Mount Merapi Kaliurang Yogyakarta Indonesia",
  "borobudur-marathon":
    "large marathon runners on road with Borobudur temple in background, morning, Central Java Indonesia",
  "parangtritis-surf-open":
    "surfer riding a wave at Parangtritis beach Yogyakarta Indonesia, ocean spray, dramatic coast",
  "jogja-badminton-championship":
    "indoor badminton championship match in a sports hall, player smashing shuttlecock, crowd, Indonesia",
  "merapi-trail-run":
    "trail runners racing on a forest mountain path near Mount Merapi Kaliurang Yogyakarta Indonesia, morning light",
};

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function pollUrl(prompt, seed) {
  const full = `${prompt}, ${STYLE}`;
  const enc = encodeURIComponent(full);
  return `https://image.pollinations.ai/prompt/${enc}?width=1200&height=675&nologo=true&model=flux&seed=${seed}`;
}

// stable seed from key so re-runs are deterministic
function seedFor(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % 100000;
}

async function download(key, prompt) {
  const dest = path.join(OUT_DIR, `${key}.jpg`);
  const url = pollUrl(prompt, seedFor(key));
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(120000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 3000) throw new Error(`too small ${buf.length}`);
      fs.writeFileSync(dest, buf);
      console.log(`OK   ${key}.jpg (${buf.length} bytes)`);
      return true;
    } catch (e) {
      console.log(`WARN ${key} attempt ${attempt}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 2500 * attempt));
    }
  }
  console.log(`FAIL ${key}`);
  return false;
}

async function main() {
  ensureDir(OUT_DIR);
  const only = process.argv[2]; // optional: article|guide|event|<key>
  const jobs = [];
  for (const [k, p] of Object.entries(ARTICLE)) jobs.push(["article", k, p]);
  for (const [k, p] of Object.entries(GUIDE)) jobs.push(["guide", k, p]);
  for (const [k, p] of Object.entries(EVENT)) jobs.push(["event", k, p]);

  const filtered = only
    ? jobs.filter(([g, k]) => g === only || k === only)
    : jobs;

  console.log(`Generating ${filtered.length} images -> ${OUT_DIR}`);
  // sequential to be gentle on the free endpoint
  const results = {};
  for (const [, key, prompt] of filtered) {
    results[key] = await download(key, prompt);
  }

  const ok = Object.values(results).filter(Boolean).length;
  console.log(`\nDone: ${ok}/${filtered.length} succeeded`);
}

main();
