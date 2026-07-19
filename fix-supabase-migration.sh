#!/usr/bin/env bash
set -euo pipefail

echo "Checking Supabase project..."

if [[ ! -d "supabase" ]]; then
  echo "Supabase folder is missing."
  echo "Run: npx supabase init"
  exit 1
fi

mkdir -p supabase/migrations

echo "Existing migrations:"
ls -lh supabase/migrations || true

echo
echo "Backing up empty migration files..."

find supabase/migrations \
  -maxdepth 1 \
  -type f \
  -name "*.sql" \
  -size 0 \
  -print0 |
while IFS= read -r -d '' file; do
  mv "$file" "${file}.empty-backup"
  echo "Moved empty migration: $file"
done

echo
echo "Checking linked project..."

if [[ ! -f "supabase/.temp/project-ref" ]]; then
  echo "Project is not linked."
  echo "Run this first:"
  echo "npx supabase link --project-ref YOUR_PROJECT_REF"
  exit 1
fi

echo
echo "Pulling the remote database schema..."

npx supabase db pull --linked

echo
echo "Generated migrations:"
ls -lh supabase/migrations

latest_file="$(
  find supabase/migrations \
    -maxdepth 1 \
    -type f \
    -name "*.sql" \
    -printf '%T@ %p\n' |
  sort -nr |
  head -n 1 |
  cut -d' ' -f2-
)"

if [[ -z "${latest_file:-}" ]]; then
  echo "No migration file was generated."
  exit 1
fi

if [[ ! -s "$latest_file" ]]; then
  echo "Generated migration is empty: $latest_file"
  exit 1
fi

echo
echo "Latest migration:"
echo "$latest_file"

echo
echo "Migration size:"
wc -l "$latest_file"
du -h "$latest_file"

echo
echo "Regenerating database types..."

npx supabase gen types typescript \
  --linked \
  --schema public \
  > types/database.types.ts

echo
echo "Running validation..."

npm run lint
npm run build

echo
echo "Migration setup completed successfully."
echo "Review and commit:"
echo "  git add supabase/migrations types/database.types.ts"
echo "  git commit -m 'Track remote Supabase schema'"
