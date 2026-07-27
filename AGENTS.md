# AGENTS.md

## Project Context

This is a Yogyakarta tourism demo site built with React + Vite. Uses a mock backend (`json-server`) — Base44 is NOT used in production.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite + json-server mock backend concurrently |
| `npm run build` | Build production to `dist/` |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |

## Key Files

- `src/api/base44Client.js`: Custom API client — wraps axios, points to `http://localhost:3001` (json-server). All data fetching goes through this.
- `mock-backend/db.json`: json-server database (events, destinations, articles, map places, etc.)
- `mock-backend/populate_map.cjs`: Script to repopulate map data in `db.json` — run with `node mock-backend/populate_map.cjs`
- `mock-backend/sync_data.mjs`: Script to pull latest data from Base44 into `db.json`
- `vite.config.js`: Vite config with Base44 plugin (ignored in production, no env needed)
- `deploy.sh`: Auto-deploy script for VPS (git pull → npm ci → npm run build)

## VPS Deployment

- Build output: `dist/` — point Nginx `root` to this folder.
- **SPA fallback required** for react-router:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```
- **Cron auto-deploy** (every 5 min):
  ```cron
  */5 * * * * /path/to/deploy.sh >> /var/log/deploy.log 2>&1
  ```
- `deploy.sh` uses `flock` to prevent concurrent runs, checks for new commits before build.
- **json-server must be running** at port 3001 for data to load. Either:
  - Deploy json-server as a systemd service running `json-server mock-backend/db.json --port 3001 --host 0.0.0.0`
  - Or proxy through Nginx

## Working Notes

- Base44 folder (`base44/`), plugin (`@base44/vite-plugin`), and SDK (`@base44/sdk`) are **not needed** for production. The app's custom API client in `src/api/base44Client.js` replaces them.
- No `.env.local` required for build. `VITE_BASE44_*` env vars are optional and unused in production.
- `src/lib/AuthContext.jsx` imports `@base44/sdk` but falls back silently on failure — safe to ignore.
- When making changes, update `mock-backend/db.json` if adding new entities or data.
