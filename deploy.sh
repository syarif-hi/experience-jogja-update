#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

LOCKFILE="/tmp/$(basename "$DIR")-deploy.lock"
exec 200>"$LOCKFILE"
flock -n 200 || { echo "Deploy already running"; exit 1; }

git fetch origin
BEFORE=$(git rev-parse HEAD)
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git pull --ff-only origin "$BRANCH"

if [ "$BEFORE" = "$(git rev-parse HEAD)" ] && [ -d "dist" ]; then
    echo "No new commits"
    exit 0
fi

npm ci --production=false
npm run build

sudo systemctl restart experiencejogja-json-server.service

echo "Deploy done: $(date)"
