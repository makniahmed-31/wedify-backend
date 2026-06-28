#!/bin/bash
set -e

REPO=/var/www/wedify-backend/repo
PROD=/var/www/wedify/backend

ENV_FILE=/var/www/wedify/.env
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Create it from .env.example before deploying." >&2
  exit 1
fi
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

echo "==> Pulling latest..."
cd "$REPO"
git pull

echo "==> Installing dependencies..."
# NODE_ENV=production would skip devDeps including @nestjs/cli needed for build
NODE_ENV=development npm install --silent

echo "==> Building..."
npm run build

echo "==> Staging..."
rm -rf "$PROD/dist.bak"
mv "$PROD/dist" "$PROD/dist.bak" 2>/dev/null || true
cp -r "$REPO/dist" "$PROD/dist"

echo "==> Restarting..."
pm2 restart wedify-backend --update-env
pm2 save

echo "==> Smoke test..."
sleep 3
curl -sf "http://localhost:${PORT:-4001}/api/v1/health" && echo " — Backend OK" || echo "Backend FAIL"

echo "==> Deploy complete."
