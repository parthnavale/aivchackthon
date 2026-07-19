#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

SCHEMA_SOURCE="$ROOT_DIR/supabase/migrations/20260719000100_vc_brain_full_schema.sql"
SEED_SOURCE="$ROOT_DIR/supabase/seed/seed_demo.sql"

log() { printf '\n\033[1;34m[VC Brain]\033[0m %s\n' "$*"; }
warn() { printf '\n\033[1;33m[Warning]\033[0m %s\n' "$*"; }
fail() { printf '\n\033[1;31m[Error]\033[0m %s\n' "$*" >&2; exit 1; }

command -v node >/dev/null 2>&1 || fail "Node.js is required. Install Node.js 20+ first."
command -v npm >/dev/null 2>&1 || fail "npm is required."

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if (( NODE_MAJOR < 20 )); then
  fail "Node.js 20+ is required. Current version: $(node --version)"
fi

[[ -f "$SCHEMA_SOURCE" ]] || fail "Schema file not found: $SCHEMA_SOURCE"

if [[ ! -f package.json ]]; then
  log "Creating package.json"
  npm init -y >/dev/null
fi

if ! npm ls supabase --depth=0 >/dev/null 2>&1; then
  log "Installing Supabase CLI locally"
  npm install --save-dev supabase
fi

SUPABASE=(npx supabase)

if [[ ! -f supabase/config.toml ]]; then
  log "Initializing Supabase project files"
  "${SUPABASE[@]}" init
fi

PROJECT_REF="${SUPABASE_PROJECT_REF:-}"
if [[ -z "$PROJECT_REF" ]]; then
  read -r -p "Enter your Supabase project reference: " PROJECT_REF
fi
[[ -n "$PROJECT_REF" ]] || fail "Supabase project reference is required."

log "Logging in to Supabase (browser may open)"
"${SUPABASE[@]}" login

log "Linking this repository to Supabase project: $PROJECT_REF"
"${SUPABASE[@]}" link --project-ref "$PROJECT_REF"

log "Validating migration SQL"
if ! grep -q "create table if not exists public.profiles" "$SCHEMA_SOURCE"; then
  fail "The migration does not appear to be the VC Brain schema."
fi

log "Showing pending migrations"
"${SUPABASE[@]}" migration list || true

log "Pushing schema, triggers, RLS policies, functions, and Storage buckets"
"${SUPABASE[@]}" db push

log "Generating TypeScript database types"
mkdir -p src/types
"${SUPABASE[@]}" gen types typescript --linked > src/types/database.ts

if [[ "${RUN_DEMO_SEED:-false}" == "true" ]]; then
  if ! command -v psql >/dev/null 2>&1; then
    warn "RUN_DEMO_SEED=true, but psql is not installed. Install postgresql-client and rerun."
  elif [[ -z "${SUPABASE_DB_URL:-}" ]]; then
    warn "RUN_DEMO_SEED=true, but SUPABASE_DB_URL is missing. Skipping demo seed."
  else
    log "Seeding demo data using the first Supabase Auth user"
    psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$SEED_SOURCE"
  fi
fi

cat <<DONE

✅ VC Brain database setup completed.

Created/configured:
  • Supabase Auth-linked profiles and preferences
  • Organisations, members, funds and Thesis Engine
  • Founders, companies and persistent Founder Memory
  • Inbound applications and outbound sourcing candidates
  • WhatsApp contacts, conversations and messages
  • Screening, three-axis scores and score components
  • Claims, evidence, Trust Scores and due diligence
  • Complete investment memos and all requested sections
  • Decisions, workflow runs, notifications and audit logs
  • Storage buckets and Row Level Security policies
  • Generated TypeScript types: src/types/database.ts

Next:
  1. Create a user through your app or Supabase Authentication dashboard.
  2. To load demo data, run:

     sudo apt install postgresql-client
     export SUPABASE_DB_URL='postgresql://postgres:YOUR_PASSWORD@db.${PROJECT_REF}.supabase.co:5432/postgres'
     RUN_DEMO_SEED=true SUPABASE_PROJECT_REF='${PROJECT_REF}' ./setup.sh

Do not commit SUPABASE_DB_URL, service-role keys, or passwords.
DONE
