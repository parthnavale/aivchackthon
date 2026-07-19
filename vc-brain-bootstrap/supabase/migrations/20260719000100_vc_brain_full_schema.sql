-- VC Brain full Supabase/PostgreSQL schema
-- Includes authentication profile data, organisations/funds, thesis engine,
-- inbound + outbound sourcing, WhatsApp state, founder memory, screening,
-- diligence, claim-level trust, investment memos, decisions, audit and storage.
--
-- IMPORTANT AUTH NOTE
-- Supabase Auth owns login credentials, password hashes, OAuth identities,
-- sessions, refresh tokens, MFA and email verification inside the auth schema.
-- Do NOT create a public password table. This migration creates public.profile
-- data linked one-to-one with auth.users.

begin;

create extension if not exists pgcrypto;
create extension if not exists vector;

-- ================================================================
-- 1. ENUMS
-- ================================================================

do $$ begin
  create type public.app_role as enum ('admin','partner','analyst','reviewer','founder');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.membership_status as enum ('invited','active','suspended','removed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.application_source as enum ('inbound','outbound');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.opportunity_status as enum (
    'sourced','activated','applied','screening','diligence','memo_ready',
    'recommended','watchlist','rejected','deployed','closed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.trend_direction as enum ('improving','stable','declining','unknown');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.verification_status as enum (
    'verified','partially_verified','unverified','inferred','unavailable','contradicted','missing'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.workflow_status as enum ('queued','running','waiting','completed','failed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.workflow_step_status as enum ('pending','running','completed','failed','skipped','waiting');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.memo_status as enum ('draft','generated','under_review','approved','superseded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.investment_decision as enum (
    'invest','reject','continue_diligence','request_more_evidence','watchlist'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.message_direction as enum ('inbound','outbound');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.message_status as enum ('received','queued','sent','delivered','read','failed');
exception when duplicate_object then null; end $$;

-- ================================================================
-- 2. COMMON FUNCTIONS
-- ================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ================================================================
-- 3. LOGIN, SIGNUP AND USER PROFILE LAYER
-- ================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  job_title text,
  timezone text not null default 'Europe/Berlin',
  locale text not null default 'en',
  onboarding_completed boolean not null default false,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  appearance text not null default 'system' check (appearance in ('light','dark','system')),
  email_notifications boolean not null default true,
  whatsapp_notifications boolean not null default true,
  default_currency text not null default 'USD',
  dashboard_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
        updated_at = now();

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_new_auth_user();

-- ================================================================
-- 4. ORGANISATIONS, FUNDS, MEMBERSHIP AND INVITATIONS
-- ================================================================

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  organization_type text not null default 'venture_fund'
    check (organization_type in ('venture_fund','angel_group','accelerator','demo')),
  logo_url text,
  website text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'analyst',
  status public.membership_status not null default 'active',
  invited_by uuid references auth.users(id) on delete set null,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role public.app_role not null default 'analyst',
  token_hash text not null unique,
  invited_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, email)
);

create or replace function public.is_org_member(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = p_organization_id
      and om.user_id = auth.uid()
      and om.status = 'active'
  );
$$;

create or replace function public.has_org_role(p_organization_id uuid, p_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = p_organization_id
      and om.user_id = auth.uid()
      and om.status = 'active'
      and om.role = any(p_roles)
  );
$$;

create table if not exists public.funds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  currency text not null default 'USD',
  committed_capital numeric(18,2),
  available_capital numeric(18,2),
  vintage_year integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create or replace function public.create_organization_with_owner(
  p_name text,
  p_slug text,
  p_fund_name text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.organizations (name, slug, created_by)
  values (p_name, p_slug, auth.uid())
  returning id into v_org_id;

  insert into public.organization_members (
    organization_id, user_id, role, status, joined_at
  ) values (
    v_org_id, auth.uid(), 'admin', 'active', now()
  );

  insert into public.funds (organization_id, name)
  values (v_org_id, coalesce(p_fund_name, p_name || ' Fund'));

  return v_org_id;
end;
$$;

-- ================================================================
-- 5. THESIS ENGINE
-- ================================================================

create table if not exists public.fund_theses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  fund_id uuid not null references public.funds(id) on delete cascade,
  name text not null,
  version integer not null default 1,
  sectors text[] not null default '{}',
  stages text[] not null default '{}',
  geographies text[] not null default '{}',
  founder_patterns text[] not null default '{}',
  dealbreakers text[] not null default '{}',
  style_anchors text[] not null default '{}',
  check_size_min numeric(14,2),
  check_size_max numeric(14,2),
  ownership_target_min numeric(7,4),
  ownership_target_max numeric(7,4),
  risk_appetite text not null default 'medium'
    check (risk_appetite in ('low','medium','high')),
  hard_filters jsonb not null default '{}'::jsonb,
  scoring_weights jsonb not null default '{
    "sector": 30,
    "stage": 15,
    "geography": 15,
    "check_size": 15,
    "ownership": 10,
    "risk": 15
  }'::jsonb,
  thresholds jsonb not null default '{
    "proceed": 70,
    "review": 50
  }'::jsonb,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fund_id, name, version)
);

create table if not exists public.thesis_discovery_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  fund_id uuid not null references public.funds(id) on delete cascade,
  investor_user_id uuid references auth.users(id) on delete set null,
  channel text not null default 'web' check (channel in ('web','whatsapp','call','manual')),
  transcript text,
  extracted_thesis jsonb not null default '{}'::jsonb,
  confirmed_thesis_id uuid references public.fund_theses(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','awaiting_confirmation','confirmed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ================================================================
-- 6. FOUNDERS, COMPANIES AND LONG-TERM MEMORY
-- ================================================================

create table if not exists public.founders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  full_name text not null,
  primary_email text,
  phone text,
  geography text,
  biography text,
  linkedin_url text,
  github_url text,
  personal_website text,
  current_founder_score numeric(5,2) check (current_founder_score between 0 and 100),
  score_trend public.trend_direction not null default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.founder_user_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  founder_id uuid not null references public.founders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  is_verified boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (founder_id, user_id)
);

create table if not exists public.founder_aliases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  founder_id uuid not null references public.founders(id) on delete cascade,
  alias_type text not null,
  alias_value text not null,
  source_url text,
  created_at timestamptz not null default now(),
  unique (organization_id, alias_type, alias_value)
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  legal_name text,
  website text,
  sector text,
  stage text,
  geography text,
  description text,
  founded_on date,
  legal_entity_country text,
  registration_number text,
  status text not null default 'active' check (status in ('active','inactive','acquired','closed','unknown')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.company_founders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  founder_id uuid not null references public.founders(id) on delete cascade,
  role text not null default 'Founder',
  is_primary boolean not null default false,
  ownership_percent numeric(7,4) check (ownership_percent is null or ownership_percent between 0 and 100),
  joined_on date,
  left_on date,
  created_at timestamptz not null default now(),
  unique (company_id, founder_id)
);

create table if not exists public.founder_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  founder_id uuid not null references public.founders(id) on delete cascade,
  event_type text not null,
  title text not null,
  description text,
  occurred_at timestamptz,
  source_record_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.company_timeline_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  event_type text,
  title text not null,
  description text,
  occurred_on date,
  source_record_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.founder_score_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  founder_id uuid not null references public.founders(id) on delete cascade,
  score numeric(5,2) not null check (score between 0 and 100),
  trend public.trend_direction not null default 'unknown',
  confidence numeric(4,3) check (confidence between 0 and 1),
  rationale text,
  calculated_by text not null default 'system' check (calculated_by in ('system','ai','human','hybrid')),
  calculated_at timestamptz not null default now()
);

create table if not exists public.founder_score_dimensions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  snapshot_id uuid not null references public.founder_score_snapshots(id) on delete cascade,
  dimension_key text not null,
  dimension_label text not null,
  score numeric(5,2) not null check (score between 0 and 100),
  confidence numeric(4,3) check (confidence between 0 and 1),
  explanation text,
  evidence_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (snapshot_id, dimension_key)
);

-- ================================================================
-- 7. INBOUND APPLICATIONS, OUTBOUND SOURCING AND OPPORTUNITIES
-- ================================================================

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  primary_founder_id uuid references public.founders(id) on delete set null,
  source public.application_source not null,
  status text not null default 'draft'
    check (status in ('draft','submitted','activated','screening','diligence','completed','withdrawn','rejected')),
  company_name_submitted text,
  founder_message text,
  requested_amount numeric(14,2),
  requested_currency text default 'USD',
  offered_ownership numeric(7,4),
  submitted_at timestamptz,
  activated_at timestamptz,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.application_files (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  file_type text not null check (file_type in ('pitch_deck','financials','cap_table','legal','evidence','other')),
  storage_bucket text not null,
  storage_path text not null,
  original_filename text,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references auth.users(id) on delete set null,
  extracted_text text,
  extraction_status text not null default 'pending' check (extraction_status in ('pending','processing','completed','failed','not_applicable')),
  created_at timestamptz not null default now()
);

create table if not exists public.sourcing_candidates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  fund_id uuid not null references public.funds(id) on delete cascade,
  thesis_id uuid references public.fund_theses(id) on delete set null,
  founder_id uuid references public.founders(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  source_channel text not null,
  external_id text,
  source_url text,
  candidate_name text not null,
  company_name text,
  preliminary_score numeric(5,2) check (preliminary_score between 0 and 100),
  thesis_fit numeric(5,2) check (thesis_fit between 0 and 100),
  momentum public.trend_direction not null default 'unknown',
  status text not null default 'new' check (status in ('new','reviewing','activated','ignored','converted','rejected')),
  surfaced_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, source_channel, external_id)
);

create table if not exists public.candidate_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  candidate_id uuid not null references public.sourcing_candidates(id) on delete cascade,
  signal_type text not null,
  signal_value jsonb not null default '{}'::jsonb,
  signal_score numeric(5,2) check (signal_score between 0 and 100),
  source_url text,
  observed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  fund_id uuid not null references public.funds(id) on delete cascade,
  thesis_id uuid references public.fund_theses(id) on delete set null,
  company_id uuid not null references public.companies(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  sourcing_candidate_id uuid references public.sourcing_candidates(id) on delete set null,
  source public.application_source not null,
  source_channel text,
  status public.opportunity_status not null default 'sourced',
  current_step text not null default 'sourcing',
  momentum public.trend_direction not null default 'unknown',
  requested_amount numeric(14,2),
  requested_currency text default 'USD',
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  fund_id uuid not null references public.funds(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  name text not null,
  natural_language_query text not null,
  parsed_filters jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  schedule_cron text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.search_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  saved_search_id uuid references public.saved_searches(id) on delete set null,
  natural_language_query text,
  parsed_filters jsonb not null default '{}'::jsonb,
  result_count integer not null default 0,
  status public.workflow_status not null default 'queued',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ================================================================
-- 8. WHATSAPP CONTACTS, CONVERSATIONS AND STATE
-- ================================================================

create table if not exists public.whatsapp_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  phone_number text not null,
  display_name text,
  contact_role public.app_role,
  founder_id uuid references public.founders(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  opted_in boolean not null default false,
  opted_in_at timestamptz,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, phone_number)
);

create table if not exists public.whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  contact_id uuid not null references public.whatsapp_contacts(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  current_step text,
  state_data jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open','waiting','completed','closed','blocked')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  meta_message_id text unique,
  direction public.message_direction not null,
  message_type text not null,
  body text,
  media_id text,
  media_storage_path text,
  payload jsonb not null default '{}'::jsonb,
  status public.message_status not null default 'received',
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  failed_reason text,
  created_at timestamptz not null default now()
);

-- ================================================================
-- 9. DATA INGESTION, SOURCE RECORDS AND LEDGER FACTS
-- ================================================================

create table if not exists public.source_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  application_id uuid references public.applications(id) on delete cascade,
  founder_id uuid references public.founders(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  source_type text not null,
  source_name text,
  source_url text,
  title text,
  raw_text text,
  raw_json jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  content_hash text,
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'founder_events_source_record_fk'
  ) then
    alter table public.founder_events
      add constraint founder_events_source_record_fk
      foreign key (source_record_id) references public.source_records(id) on delete set null;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'company_timeline_source_record_fk'
  ) then
    alter table public.company_timeline_events
      add constraint company_timeline_source_record_fk
      foreign key (source_record_id) references public.source_records(id) on delete set null;
  end if;
end $$;

create table if not exists public.founder_facts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  founder_id uuid not null references public.founders(id) on delete cascade,
  source_record_id uuid references public.source_records(id) on delete set null,
  field_key text not null,
  field_value jsonb not null,
  confidence numeric(4,3) check (confidence between 0 and 1),
  status public.verification_status not null default 'unverified',
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.company_facts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  source_record_id uuid references public.source_records(id) on delete set null,
  field_key text not null,
  field_value jsonb not null,
  confidence numeric(4,3) check (confidence between 0 and 1),
  status public.verification_status not null default 'unverified',
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  created_at timestamptz not null default now()
);

-- ================================================================
-- 10. THESIS EVALUATION, SCREENING AND SCORING
-- ================================================================

create table if not exists public.thesis_evaluations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  thesis_id uuid not null references public.fund_theses(id) on delete cascade,
  score numeric(5,2) not null check (score between 0 and 100),
  decision text not null check (decision in ('proceed','reject','needs_more_information','manual_review')),
  matched_criteria jsonb not null default '[]'::jsonb,
  unmatched_criteria jsonb not null default '[]'::jsonb,
  disqualifying_criteria jsonb not null default '[]'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  explanation text,
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  calculated_at timestamptz not null default now()
);

create table if not exists public.first_pass_screenings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  outcome text not null check (outcome in ('proceed','reject','needs_more_information')),
  checks jsonb not null default '[]'::jsonb,
  failed_checks jsonb not null default '[]'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  rationale text,
  screened_at timestamptz not null default now()
);

create table if not exists public.opportunity_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  founder_axis numeric(5,2) check (founder_axis between 0 and 100),
  founder_trend public.trend_direction not null default 'unknown',
  founder_confidence numeric(4,3) check (founder_confidence is null or founder_confidence between 0 and 1),
  market_axis numeric(5,2) check (market_axis between 0 and 100),
  market_trend public.trend_direction not null default 'unknown',
  market_confidence numeric(4,3) check (market_confidence is null or market_confidence between 0 and 1),
  idea_market_axis numeric(5,2) check (idea_market_axis between 0 and 100),
  idea_market_trend public.trend_direction not null default 'unknown',
  idea_market_confidence numeric(4,3) check (idea_market_confidence is null or idea_market_confidence between 0 and 1),
  thesis_fit numeric(5,2) check (thesis_fit between 0 and 100),
  rationale jsonb not null default '{}'::jsonb,
  calculated_at timestamptz not null default now()
);

create table if not exists public.score_components (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_score_id uuid not null references public.opportunity_scores(id) on delete cascade,
  axis text not null check (axis in ('founder','market','idea_market','thesis')),
  component_key text not null,
  component_label text not null,
  score numeric(5,2) check (score between 0 and 100),
  weight numeric(6,3),
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  explanation text,
  evidence_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (opportunity_score_id, axis, component_key)
);

-- ================================================================
-- 11. CLAIMS, EVIDENCE, TRUST SCORES AND DUE DILIGENCE
-- ================================================================

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  claim_type text not null,
  statement text not null,
  normalized_value jsonb not null default '{}'::jsonb,
  claimed_by text,
  trust_score numeric(5,2) check (trust_score is null or trust_score between 0 and 100),
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  status public.verification_status not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  source_record_id uuid references public.source_records(id) on delete set null,
  evidence_type text not null,
  excerpt text,
  source_url text,
  source_locator text,
  storage_path text,
  reliability_score numeric(4,3) check (reliability_score is null or reliability_score between 0 and 1),
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.claim_evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  claim_id uuid not null references public.claims(id) on delete cascade,
  evidence_id uuid not null references public.evidence(id) on delete cascade,
  relation text not null check (relation in ('supports','contradicts','context')),
  weight numeric(4,3) check (weight is null or weight between 0 and 1),
  created_at timestamptz not null default now(),
  unique (claim_id, evidence_id)
);

create table if not exists public.due_diligence_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  category text not null check (category in ('commercial','people','financial','legal','technical')),
  check_name text not null,
  status text not null default 'open'
    check (status in ('open','in_progress','passed','failed','blocked','not_available')),
  finding text,
  open_questions text[] not null default '{}',
  assigned_to uuid references auth.users(id) on delete set null,
  source_record_id uuid references public.source_records(id) on delete set null,
  checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ================================================================
-- 12. INVESTMENT MEMOS AND ALL APPENDIX SECTIONS
-- ================================================================

create table if not exists public.investment_memos (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  version integer not null default 1,
  status public.memo_status not null default 'draft',
  recommendation public.investment_decision,
  recommended_amount numeric(14,2) check (recommended_amount is null or recommended_amount between 0 and 100000),
  currency text not null default 'USD',
  overall_confidence numeric(4,3) check (overall_confidence is null or overall_confidence between 0 and 1),
  generated_by text not null default 'ai' check (generated_by in ('ai','human','hybrid')),
  generated_by_model text,
  reviewed_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  generated_at timestamptz,
  reviewed_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (opportunity_id, version)
);

create table if not exists public.memo_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  memo_id uuid not null references public.investment_memos(id) on delete cascade,
  section_key text not null check (section_key in (
    'company_snapshot','investment_hypotheses','swot','team_history',
    'problem_product','technology_defensibility','market_sizing','competition',
    'traction_kpis','financials_round_structure','cap_table',
    'due_diligence_log','exit_perspective','risks_mitigations'
  )),
  title text not null,
  summary_markdown text,
  structured_data jsonb not null default '{}'::jsonb,
  status text not null default 'missing'
    check (status in ('complete','partial','missing','not_disclosed','not_applicable')),
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (memo_id, section_key)
);

create table if not exists public.memo_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  section_id uuid not null references public.memo_sections(id) on delete cascade,
  item_type text not null default 'bullet',
  label text,
  content text not null,
  numeric_value numeric,
  unit text,
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  status public.verification_status not null default 'unverified',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.memo_item_evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  memo_item_id uuid not null references public.memo_section_items(id) on delete cascade,
  evidence_id uuid not null references public.evidence(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (memo_item_id, evidence_id)
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  memo_id uuid references public.investment_memos(id) on delete cascade,
  founder_id uuid references public.founders(id) on delete set null,
  full_name text not null,
  role text,
  background text,
  pedigree text,
  red_flags text,
  fund_comfort_rationale text,
  joined_on date,
  left_on date,
  created_at timestamptz not null default now()
);

create table if not exists public.market_sizing_estimates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  memo_id uuid not null references public.investment_memos(id) on delete cascade,
  level text not null check (level in ('TAM','SAM','SOM')),
  approach text not null check (approach in ('top_down','bottom_up','hybrid')),
  amount numeric(18,2),
  currency text not null default 'USD',
  estimate_year integer,
  assumptions jsonb not null default '[]'::jsonb,
  source_record_id uuid references public.source_records(id) on delete set null,
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  created_at timestamptz not null default now()
);

create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  memo_id uuid not null references public.investment_memos(id) on delete cascade,
  name text not null,
  cluster text,
  website text,
  difference_from_company text,
  future_threat text,
  threat_level text check (threat_level is null or threat_level in ('low','medium','high')),
  source_record_id uuid references public.source_records(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  memo_id uuid not null references public.investment_memos(id) on delete cascade,
  metric_key text not null,
  metric_name text not null,
  metric_value numeric,
  text_value text,
  unit text,
  period_start date,
  period_end date,
  source_record_id uuid references public.source_records(id) on delete set null,
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  created_at timestamptz not null default now()
);

create table if not exists public.financial_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  memo_id uuid not null references public.investment_memos(id) on delete cascade,
  period_label text not null,
  period_start date,
  period_end date,
  data_type text not null check (data_type in ('historical','projected')),
  currency text not null default 'USD',
  revenue numeric(18,2),
  ebitda numeric(18,2),
  opex numeric(18,2),
  cogs numeric(18,2),
  cash_balance numeric(18,2),
  runway_months numeric(8,2),
  source_record_id uuid references public.source_records(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (memo_id, period_label, data_type)
);

create table if not exists public.funding_rounds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  memo_id uuid not null references public.investment_memos(id) on delete cascade,
  round_name text not null,
  round_status text not null check (round_status in ('historical','current','planned')),
  currency text not null default 'USD',
  amount numeric(18,2),
  pre_money_valuation numeric(18,2),
  post_money_valuation numeric(18,2),
  target_close_date date,
  next_round_expected_at date,
  created_at timestamptz not null default now()
);

create table if not exists public.cap_table_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  memo_id uuid not null references public.investment_memos(id) on delete cascade,
  holder_name text not null,
  holder_type text not null check (holder_type in ('founder','employee','investor','advisor','vsop','other')),
  ownership_pre numeric(7,4) check (ownership_pre is null or ownership_pre between 0 and 100),
  ownership_post numeric(7,4) check (ownership_post is null or ownership_post between 0 and 100),
  shares numeric,
  investment_amount numeric(18,2),
  currency text default 'USD',
  source_record_id uuid references public.source_records(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.exit_paths (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  memo_id uuid not null references public.investment_memos(id) on delete cascade,
  exit_type text not null check (exit_type in ('strategic_acquisition','pe_rollup','ipo','secondary','other')),
  acquirer_or_buyer text,
  comparable_company text,
  rationale text not null,
  premium_reason text,
  horizon_years numeric(5,2),
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  created_at timestamptz not null default now()
);

-- ================================================================
-- 13. WORKFLOW, N8N EXECUTION, DECISIONS AND OVERSIGHT
-- ================================================================

create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  application_id uuid references public.applications(id) on delete cascade,
  external_execution_id text,
  workflow_name text not null,
  status public.workflow_status not null default 'queued',
  current_step text,
  progress_percent numeric(5,2) check (progress_percent is null or progress_percent between 0 and 100),
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_steps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workflow_run_id uuid not null references public.workflow_runs(id) on delete cascade,
  step_key text not null,
  step_name text not null,
  sequence_number integer not null,
  status public.workflow_step_status not null default 'pending',
  input_summary jsonb not null default '{}'::jsonb,
  output_summary jsonb not null default '{}'::jsonb,
  evidence_ids uuid[] not null default '{}',
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  warnings text[] not null default '{}',
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (workflow_run_id, step_key)
);

create table if not exists public.decision_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  memo_id uuid references public.investment_memos(id) on delete set null,
  action text not null check (action in (
    'sourced','activated','application_received','screening_started','diligence_started',
    'flagged','passed','rejected','watchlisted','recommended','deployed','reopened'
  )),
  amount numeric(14,2),
  currency text default 'USD',
  rationale text,
  actor_type text not null default 'system' check (actor_type in ('system','ai','human','n8n')),
  actor_user_id uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  channel text not null check (channel in ('in_app','email','whatsapp')),
  title text not null,
  body text,
  action_url text,
  status text not null default 'unread' check (status in ('unread','read','sent','failed')),
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigserial primary key,
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_type text not null default 'user' check (actor_type in ('user','system','n8n','ai')),
  action text not null,
  table_name text,
  record_id uuid,
  before_data jsonb,
  after_data jsonb,
  request_id text,
  ip_address inet,
  created_at timestamptz not null default now()
);

-- ================================================================
-- 14. HELPER RPC: CREATE COMPLETE MEMO SHELL
-- ================================================================

create or replace function public.create_investment_memo(p_opportunity_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_memo_id uuid;
  v_version integer;
begin
  select organization_id into v_org_id
  from public.opportunities
  where id = p_opportunity_id
    and public.is_org_member(organization_id);

  if v_org_id is null then
    raise exception 'Opportunity not found or access denied';
  end if;

  select coalesce(max(version), 0) + 1 into v_version
  from public.investment_memos
  where opportunity_id = p_opportunity_id;

  insert into public.investment_memos (organization_id, opportunity_id, version)
  values (v_org_id, p_opportunity_id, v_version)
  returning id into v_memo_id;

  insert into public.memo_sections
    (organization_id, memo_id, section_key, title, sort_order)
  values
    (v_org_id, v_memo_id, 'company_snapshot', 'Company snapshot', 10),
    (v_org_id, v_memo_id, 'investment_hypotheses', 'Investment hypotheses', 20),
    (v_org_id, v_memo_id, 'swot', 'SWOT', 30),
    (v_org_id, v_memo_id, 'team_history', 'Team & history', 40),
    (v_org_id, v_memo_id, 'problem_product', 'Problem & product', 50),
    (v_org_id, v_memo_id, 'technology_defensibility', 'Technology & defensibility', 60),
    (v_org_id, v_memo_id, 'market_sizing', 'Market sizing', 70),
    (v_org_id, v_memo_id, 'competition', 'Competition', 80),
    (v_org_id, v_memo_id, 'traction_kpis', 'Traction & KPIs', 90),
    (v_org_id, v_memo_id, 'financials_round_structure', 'Financials & round structure', 100),
    (v_org_id, v_memo_id, 'cap_table', 'Cap table', 110),
    (v_org_id, v_memo_id, 'due_diligence_log', 'Due diligence log', 120),
    (v_org_id, v_memo_id, 'exit_perspective', 'Exit perspective', 130),
    (v_org_id, v_memo_id, 'risks_mitigations', 'Risks & mitigations', 140);

  return v_memo_id;
end;
$$;

-- ================================================================
-- 15. DASHBOARD VIEW
-- ================================================================

create or replace view public.opportunity_dashboard
with (security_invoker = true) as
select
  o.id as opportunity_id,
  o.organization_id,
  o.status,
  o.source,
  o.source_channel,
  o.momentum,
  c.id as company_id,
  c.name as company_name,
  c.sector,
  c.stage,
  c.geography,
  os.founder_axis,
  os.market_axis,
  os.idea_market_axis,
  os.thesis_fit,
  im.id as latest_memo_id,
  im.recommendation,
  im.recommended_amount,
  im.overall_confidence,
  o.created_at,
  o.updated_at
from public.opportunities o
join public.companies c on c.id = o.company_id
left join lateral (
  select s.*
  from public.opportunity_scores s
  where s.opportunity_id = o.id
  order by s.calculated_at desc
  limit 1
) os on true
left join lateral (
  select m.*
  from public.investment_memos m
  where m.opportunity_id = o.id
  order by m.version desc
  limit 1
) im on true;

-- ================================================================
-- 16. INDEXES
-- ================================================================

create index if not exists idx_org_members_user on public.organization_members(user_id, status);
create index if not exists idx_org_members_org_role on public.organization_members(organization_id, role, status);
create index if not exists idx_funds_org on public.funds(organization_id, is_active);
create index if not exists idx_theses_fund_active on public.fund_theses(fund_id, is_active, version desc);
create index if not exists idx_founders_org_name on public.founders(organization_id, full_name);
create index if not exists idx_companies_org_name on public.companies(organization_id, name);
create index if not exists idx_applications_org_status on public.applications(organization_id, status);
create index if not exists idx_candidates_org_status_score on public.sourcing_candidates(organization_id, status, preliminary_score desc);
create index if not exists idx_opportunities_org_status on public.opportunities(organization_id, status, updated_at desc);
create index if not exists idx_whatsapp_contacts_phone on public.whatsapp_contacts(organization_id, phone_number);
create index if not exists idx_whatsapp_messages_conversation_time on public.whatsapp_messages(conversation_id, created_at);
create index if not exists idx_source_records_opportunity on public.source_records(opportunity_id, source_type);
create index if not exists idx_source_records_hash on public.source_records(organization_id, content_hash);
create index if not exists idx_founder_facts_key on public.founder_facts(founder_id, field_key, valid_from desc);
create index if not exists idx_company_facts_key on public.company_facts(company_id, field_key, valid_from desc);
create index if not exists idx_thesis_evaluations_opportunity on public.thesis_evaluations(opportunity_id, calculated_at desc);
create index if not exists idx_scores_opportunity_time on public.opportunity_scores(opportunity_id, calculated_at desc);
create index if not exists idx_claims_opportunity_status on public.claims(opportunity_id, status);
create index if not exists idx_evidence_opportunity on public.evidence(opportunity_id);
create index if not exists idx_dd_opportunity_status on public.due_diligence_checks(opportunity_id, status);
create index if not exists idx_memos_opportunity_version on public.investment_memos(opportunity_id, version desc);
create index if not exists idx_memo_sections_memo_order on public.memo_sections(memo_id, sort_order);
create index if not exists idx_workflow_runs_opportunity on public.workflow_runs(opportunity_id, created_at desc);
create index if not exists idx_decision_logs_opportunity_time on public.decision_logs(opportunity_id, created_at desc);
create index if not exists idx_notifications_user_status on public.notifications(user_id, status, created_at desc);
create index if not exists idx_source_records_raw_json_gin on public.source_records using gin(raw_json);
create index if not exists idx_memo_sections_structured_gin on public.memo_sections using gin(structured_data);

-- Optional vector index; create only after enough rows exist for best performance.
-- create index source_records_embedding_hnsw
--   on public.source_records using hnsw (embedding vector_cosine_ops);

-- ================================================================
-- 17. UPDATED_AT TRIGGERS
-- ================================================================

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','user_preferences','organizations','organization_members','funds',
    'fund_theses','thesis_discovery_sessions','founders','companies','applications',
    'sourcing_candidates','opportunities','saved_searches','whatsapp_contacts',
    'whatsapp_conversations','claims','due_diligence_checks','investment_memos',
    'memo_sections','workflow_runs'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', t, t);
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end $$;

-- ================================================================
-- 18. ROW LEVEL SECURITY
-- ================================================================

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invitations enable row level security;

-- Profiles: self-management; organisation members can view colleagues.
drop policy if exists profiles_select_self_or_colleague on public.profiles;
create policy profiles_select_self_or_colleague
on public.profiles for select to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.organization_members mine
    join public.organization_members theirs
      on theirs.organization_id = mine.organization_id
    where mine.user_id = auth.uid()
      and mine.status = 'active'
      and theirs.user_id = profiles.id
      and theirs.status = 'active'
  )
);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists preferences_manage_self on public.user_preferences;
create policy preferences_manage_self
on public.user_preferences for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Organisations and membership.
drop policy if exists organizations_select_member on public.organizations;
create policy organizations_select_member
on public.organizations for select to authenticated
using (public.is_org_member(id));

drop policy if exists organizations_update_admin on public.organizations;
create policy organizations_update_admin
on public.organizations for update to authenticated
using (public.has_org_role(id, array['admin']::public.app_role[]))
with check (public.has_org_role(id, array['admin']::public.app_role[]));

drop policy if exists organization_members_select_member on public.organization_members;
create policy organization_members_select_member
on public.organization_members for select to authenticated
using (public.is_org_member(organization_id));

drop policy if exists organization_members_manage_admin on public.organization_members;
create policy organization_members_manage_admin
on public.organization_members for all to authenticated
using (public.has_org_role(organization_id, array['admin','partner']::public.app_role[]))
with check (public.has_org_role(organization_id, array['admin','partner']::public.app_role[]));

drop policy if exists invitations_manage_admin on public.organization_invitations;
create policy invitations_manage_admin
on public.organization_invitations for all to authenticated
using (public.has_org_role(organization_id, array['admin','partner']::public.app_role[]))
with check (public.has_org_role(organization_id, array['admin','partner']::public.app_role[]));

-- Generic organisation-scoped policy for all business tables.
do $$
declare
  t text;
begin
  foreach t in array array[
    'funds','fund_theses','thesis_discovery_sessions','founders','founder_user_links',
    'founder_aliases','companies','company_founders','founder_events',
    'company_timeline_events','founder_score_snapshots','founder_score_dimensions',
    'applications','application_files','sourcing_candidates','candidate_signals',
    'opportunities','saved_searches','search_runs','whatsapp_contacts',
    'whatsapp_conversations','whatsapp_messages','source_records','founder_facts',
    'company_facts','thesis_evaluations','first_pass_screenings','opportunity_scores',
    'score_components','claims','evidence','claim_evidence','due_diligence_checks',
    'investment_memos','memo_sections','memo_section_items','memo_item_evidence',
    'team_members','market_sizing_estimates','competitors','kpi_snapshots',
    'financial_periods','funding_rounds','cap_table_entries','exit_paths',
    'workflow_runs','workflow_steps','decision_logs','notifications','audit_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists org_member_manage on public.%I', t);
    execute format(
      'create policy org_member_manage on public.%I for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id))',
      t
    );
  end loop;
end $$;

-- Views inherit underlying RLS through the querying user.
grant select on public.opportunity_dashboard to authenticated;

-- ================================================================
-- 19. SUPABASE STORAGE BUCKETS AND POLICIES
-- ================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('pitch-decks', 'pitch-decks', false, 52428800, array['application/pdf']),
  ('evidence-files', 'evidence-files', false, 52428800, null),
  ('memo-exports', 'memo-exports', false, 10485760, array['application/pdf'])
on conflict (id) do nothing;

-- Storage path convention: <organization_id>/<record_id>/<filename>
drop policy if exists storage_select_org_files on storage.objects;
create policy storage_select_org_files
on storage.objects for select to authenticated
using (
  bucket_id in ('pitch-decks','evidence-files','memo-exports')
  and public.is_org_member((storage.foldername(name))[1]::uuid)
);

drop policy if exists storage_insert_org_files on storage.objects;
create policy storage_insert_org_files
on storage.objects for insert to authenticated
with check (
  bucket_id in ('pitch-decks','evidence-files','memo-exports')
  and public.is_org_member((storage.foldername(name))[1]::uuid)
);

drop policy if exists storage_update_org_files on storage.objects;
create policy storage_update_org_files
on storage.objects for update to authenticated
using (
  bucket_id in ('pitch-decks','evidence-files','memo-exports')
  and public.is_org_member((storage.foldername(name))[1]::uuid)
)
with check (
  bucket_id in ('pitch-decks','evidence-files','memo-exports')
  and public.is_org_member((storage.foldername(name))[1]::uuid)
);

drop policy if exists storage_delete_org_files on storage.objects;
create policy storage_delete_org_files
on storage.objects for delete to authenticated
using (
  bucket_id in ('pitch-decks','evidence-files','memo-exports')
  and public.is_org_member((storage.foldername(name))[1]::uuid)
);

-- ================================================================
-- 20. COMMENTS
-- ================================================================

comment on table public.profiles is 'Public user profile linked one-to-one to auth.users. Passwords and sessions remain in Supabase Auth.';
comment on table public.organization_members is 'Multi-tenant access control for investors, analysts, reviewers and founders.';
comment on table public.fund_theses is 'Versioned, configurable investor thesis used by the Thesis Engine.';
comment on table public.founders is 'Persistent founder identity and long-term Founder Score.';
comment on table public.opportunity_scores is 'Three independent axes plus thesis fit; axes are intentionally not averaged.';
comment on table public.claims is 'One row per factual claim with claim-level Trust Score.';
comment on table public.investment_memos is 'Versioned memo header and recommendation.';
comment on table public.memo_sections is 'Complete memo sections required by the challenge brief.';
comment on table public.workflow_runs is 'n8n or other workflow execution state stored outside n8n history.';
comment on table public.whatsapp_conversations is 'Persistent WhatsApp conversation state for inbound and investor workflows.';

commit;
