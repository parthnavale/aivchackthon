# VC Brain Supabase Bootstrap

This bundle installs the complete VC Brain database into an existing hosted Supabase project.

## What it creates

- Supabase Auth-linked profiles and preferences
- Organisations, memberships and funds
- Configurable Thesis Engine
- Founder Memory and Founder Score history
- Inbound applications and outbound sourcing
- WhatsApp conversation state
- Three-axis screening
- Claims, evidence, Trust Scores and due diligence
- Full investment memo structure
- Workflow/decision/audit logs
- Storage buckets, policies and RLS

## Prerequisites

- Ubuntu/Linux, macOS or WSL
- Node.js 20+
- An existing Supabase project
- Your Supabase project reference

## Run

```bash
chmod +x setup.sh
./setup.sh
```

The script installs the Supabase CLI locally through npm, initializes Supabase files, logs in, links the project, pushes the migration, and generates TypeScript types.

## Optional demo seed

Create at least one user through Supabase Auth or your signup page, then:

```bash
sudo apt update
sudo apt install postgresql-client

export SUPABASE_PROJECT_REF='your-project-ref'
export SUPABASE_DB_URL='postgresql://postgres:YOUR_DB_PASSWORD@db.your-project-ref.supabase.co:5432/postgres'
RUN_DEMO_SEED=true ./setup.sh
```

Do not commit database passwords or service-role keys.
