-- REVIEW-ONLY PROPOSAL — do not apply without checking current policies and grants.
-- Goal: students may INSERT game results, but cannot read or mutate result rows;
-- game metadata is readable but writable only through migrations/service-role code.

-- 1. Inspect the current production policy set first.
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('game_results', 'game_meta', 'wall_posts')
order by tablename, policyname;

-- 2. Minimum table grants expected after the client-side metadata writers are removed.
revoke select, update, delete on table public.game_results from anon;
grant insert on table public.game_results to anon;

revoke insert, update, delete on table public.game_meta from anon;
grant select on table public.game_meta to anon;

-- 3. wall_posts is intentionally public classroom output. Keep SELECT/INSERT only.
revoke update, delete on table public.wall_posts from anon;
grant select, insert on table public.wall_posts to anon;

-- 4. Confirm that RLS remains enabled. Policy definitions must be reviewed separately;
-- do not replace policy names blindly because production may use different names.
alter table public.game_results enable row level security;
alter table public.game_meta enable row level security;
alter table public.wall_posts enable row level security;
