#!/bin/bash
set -e

APP=/var/www/wedify-backend

ENV_FILE=/var/www/wedify/.env
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found." >&2
  exit 1
fi
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

echo "==> Pulling latest..."
cd "$APP"
rm -f package-lock.json
git pull

echo "==> Installing dependencies..."
# NODE_ENV=production skips devDeps including @nestjs/cli needed for build
NODE_ENV=development npm install --silent

echo "==> Running migrations..."
npx prisma migrate deploy

echo "==> Building..."
npm run build

echo "==> Restarting..."
pm2 restart wedify-backend --update-env
pm2 save

echo "==> Smoke test..."
sleep 3
curl -sf "http://localhost:${PORT:-4001}/api/v1/health" && echo " — Backend OK" || echo "Backend FAIL"

echo "==> Deploy complete."
