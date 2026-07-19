-- VC Brain demo seed
-- Uses the first existing Supabase Auth user as the demo organisation owner.
-- Create at least one user before running this file.

begin;

do $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_fund_id uuid;
  v_thesis_id uuid;
  v_founder_id uuid;
  v_company_id uuid;
  v_candidate_id uuid;
  v_opportunity_id uuid;
  v_memo_id uuid;
begin
  select id into v_user_id
  from auth.users
  order by created_at
  limit 1;

  if v_user_id is null then
    raise exception 'No auth user exists. Sign up once, then rerun the demo seed.';
  end if;

  insert into public.organizations (name, slug, organization_type, created_by)
  values ('Maschmeyer Group Demo', 'maschmeyer-group-demo', 'demo', v_user_id)
  on conflict (slug) do update set updated_at = now()
  returning id into v_org_id;

  insert into public.organization_members (
    organization_id, user_id, role, status, joined_at
  ) values (
    v_org_id, v_user_id, 'admin', 'active', now()
  ) on conflict (organization_id, user_id) do update
    set role = 'admin', status = 'active', joined_at = coalesce(public.organization_members.joined_at, now());

  insert into public.funds (
    organization_id, name, currency, committed_capital, available_capital, vintage_year
  ) values (
    v_org_id, 'VC Brain Demo Fund', 'USD', 10000000, 8500000, 2026
  ) on conflict (organization_id, name) do update
    set available_capital = excluded.available_capital
  returning id into v_fund_id;

  insert into public.fund_theses (
    organization_id, fund_id, name, sectors, stages, geographies,
    founder_patterns, dealbreakers, style_anchors,
    check_size_min, check_size_max,
    ownership_target_min, ownership_target_max,
    risk_appetite, created_by
  ) values (
    v_org_id,
    v_fund_id,
    'DACH AI Pre-Seed Thesis',
    array['AI infrastructure','Legal tech','Developer tools'],
    array['Pre-seed','Seed'],
    array['Berlin','Munich','DACH'],
    array['Technical founder','Solo founder acceptable'],
    array['No technical co-founder for deeply technical product'],
    array['Seedcamp','Techstars'],
    25000,
    100000,
    2,
    10,
    'high',
    v_user_id
  ) on conflict (fund_id, name, version) do update
    set sectors = excluded.sectors, stages = excluded.stages, geographies = excluded.geographies
  returning id into v_thesis_id;

  insert into public.founders (
    organization_id, full_name, geography, biography, github_url,
    linkedin_url, current_founder_score, score_trend
  ) values (
    v_org_id,
    'Marek Kovacs',
    'Berlin, DE',
    'Technical founder building AI infrastructure for edge deployments.',
    'https://github.com/example-marek',
    'https://linkedin.com/in/example-marek',
    68,
    'improving'
  ) on conflict do nothing
  returning id into v_founder_id;

  if v_founder_id is null then
    select id into v_founder_id
    from public.founders
    where organization_id = v_org_id and full_name = 'Marek Kovacs'
    limit 1;
  end if;

  insert into public.companies (
    organization_id, name, website, sector, stage, geography, description
  ) values (
    v_org_id,
    'EdgeML',
    'https://example.com/edgeml',
    'AI infrastructure',
    'Pre-seed',
    'Berlin, DE',
    'AI infrastructure for deploying and monitoring models on edge devices.'
  ) on conflict (organization_id, name) do update
    set description = excluded.description
  returning id into v_company_id;

  insert into public.company_founders (
    organization_id, company_id, founder_id, role, is_primary
  ) values (
    v_org_id, v_company_id, v_founder_id, 'Founder & CEO', true
  ) on conflict (company_id, founder_id) do nothing;

  insert into public.sourcing_candidates (
    organization_id, fund_id, thesis_id, founder_id, company_id,
    source_channel, status, preliminary_score, thesis_fit_score,
    trust_score, momentum, surfaced_reason, raw_profile
  ) values (
    v_org_id, v_fund_id, v_thesis_id, v_founder_id, v_company_id,
    'github', 'reviewing', 82, 82, 75, 'improving',
    'Strong recent GitHub activity, technical-founder signal, Berlin location, and AI-infrastructure fit.',
    '{"repositories":4,"commits_last_8_months":340,"contributors":12}'::jsonb
  ) returning id into v_candidate_id;

  insert into public.opportunities (
    organization_id, fund_id, thesis_id, company_id, sourcing_candidate_id,
    source, source_channel, status, current_step, momentum, requested_amount,
    requested_currency, assigned_to
  ) values (
    v_org_id, v_fund_id, v_thesis_id, v_company_id, v_candidate_id,
    'outbound', 'github', 'diligence', 'claim_verification', 'improving',
    100000, 'USD', v_user_id
  ) returning id into v_opportunity_id;

  insert into public.founder_score_snapshots (
    organization_id, founder_id, score, trend, reason, calculated_at
  ) values (
    v_org_id, v_founder_id, 68, 'improving',
    'Score based on technical execution, GitHub activity, hackathon result, and prior product history.',
    now()
  );

  insert into public.opportunity_scores (
    organization_id, opportunity_id,
    founder_axis_score, founder_axis_trend, founder_axis_confidence,
    market_axis_score, market_axis_trend, market_axis_confidence,
    idea_market_axis_score, idea_market_axis_trend, idea_market_axis_confidence,
    thesis_fit_score, calculated_at
  ) values (
    v_org_id, v_opportunity_id,
    68, 'improving', 0.82,
    74, 'stable', 0.70,
    79, 'improving', 0.76,
    82, now()
  );

  insert into public.decision_logs (
    organization_id, opportunity_id, actor_user_id,
    action, title, rationale, metadata
  ) values (
    v_org_id, v_opportunity_id, v_user_id,
    'diligence_started',
    'Diligence in progress for EdgeML — Marek Kovacs',
    'Cold-start case: verify track-record signals before a decision; no revenue claim is assumed.',
    '{"source":"github","thesis_fit":0.82,"trust":0.75}'::jsonb
  );

  raise notice 'Demo seeded. Organization %, opportunity %', v_org_id, v_opportunity_id;
end $$;

commit;
