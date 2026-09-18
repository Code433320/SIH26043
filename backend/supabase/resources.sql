-- Run after creating public.users and public.problems.
-- These tables support the solutions, engagements, and discussions API modules.

create table if not exists public.solutions (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems(id) on delete cascade,
  university_id uuid not null references public.users(id) on delete cascade,
  submitted_by uuid not null references public.users(id) on delete restrict,
  title text not null,
  description text not null,
  team_name text,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'in_progress', 'completed', 'rejected')),
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.engagements (
  id uuid primary key default gen_random_uuid(),
  solution_id uuid not null references public.solutions(id) on delete cascade,
  industry_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('funding', 'mentorship', 'field_support')),
  amount numeric(12, 2) check (amount is null or amount >= 0),
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'completed', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.discussions (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  message text not null check (length(trim(message)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists solutions_problem_id_idx on public.solutions(problem_id);
create index if not exists solutions_university_id_idx on public.solutions(university_id);
create index if not exists solutions_status_idx on public.solutions(status);
create index if not exists engagements_solution_id_idx on public.engagements(solution_id);
create index if not exists engagements_industry_id_idx on public.engagements(industry_id);
create index if not exists engagements_status_idx on public.engagements(status);
create index if not exists discussions_problem_id_created_at_idx
  on public.discussions(problem_id, created_at);

alter table public.solutions enable row level security;
alter table public.engagements enable row level security;
alter table public.discussions enable row level security;

-- Authenticated users may browse solutions. Only the submitting university/team
-- may create or update its own solution through a browser client.
drop policy if exists "Authenticated users can view solutions" on public.solutions;
create policy "Authenticated users can view solutions"
on public.solutions for select to authenticated
using (true);

drop policy if exists "University users can create solutions" on public.solutions;
create policy "University users can create solutions"
on public.solutions for insert to authenticated
with check (
  university_id = (select auth.uid())
  and submitted_by = (select auth.uid())
);

drop policy if exists "University users can update solutions" on public.solutions;
create policy "University users can update solutions"
on public.solutions for update to authenticated
using (university_id = (select auth.uid()))
with check (university_id = (select auth.uid()));

-- Engagements are private to the industry/NGO account that created them.
drop policy if exists "Industry users can view own engagements" on public.engagements;
create policy "Industry users can view own engagements"
on public.engagements for select to authenticated
using (industry_id = (select auth.uid()));

drop policy if exists "Industry users can create engagements" on public.engagements;
create policy "Industry users can create engagements"
on public.engagements for insert to authenticated
with check (industry_id = (select auth.uid()));

drop policy if exists "Industry users can update own engagements" on public.engagements;
create policy "Industry users can update own engagements"
on public.engagements for update to authenticated
using (industry_id = (select auth.uid()))
with check (industry_id = (select auth.uid()));

-- All authenticated roles can read and post discussion messages.
drop policy if exists "Authenticated users can view discussions" on public.discussions;
create policy "Authenticated users can view discussions"
on public.discussions for select to authenticated
using (true);

drop policy if exists "Authenticated users can post discussions" on public.discussions;
create policy "Authenticated users can post discussions"
on public.discussions for insert to authenticated
with check (user_id = (select auth.uid()));
