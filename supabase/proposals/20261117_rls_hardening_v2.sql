-- PROPOSAL v2 (2026-11-17, Claude) — 찰리쌤 승인 후 2026-11-17 production 적용 완료.
-- 적용본: supabase/migrations/20261117003320_rls_hardening_game_results_game_meta.sql
-- 기반: supabase/proposals/20260819_rls_hardening.sql (v1) + 2026-11-17 운영 읽기 전용 점검 결과.
--
-- 점검 시점 운영 상태 (gtmc-history's Project, xgniwztlrakkrbzcfklb)
--   game_results : RLS on, 정책 insert_anon(INSERT, check true) 1개뿐.
--                  GRANT는 anon/authenticated에 SELECT·UPDATE·DELETE·TRUNCATE까지 부여(RLS가 유일한 방어선).
--                  제약은 PK뿐. 2,443행 / 34게임, 아래 CHECK를 모두 통과함(위반 0건).
--   game_meta    : RLS on, anon SELECT·INSERT("anon upsert")·UPDATE("anon update") 모두 true.
--                  → anon 키로 누구나 게임 메타 수정 가능.
--   wall_posts   : 정책 SELECT·INSERT만, GRANT에 TRUNCATE·TRIGGER·REFERENCES 잔존. (이번 범위 밖, v1 3번 유지)
--
-- 코드 영향 확인 (games·hub 저장소 main, 2026-11-17 shallow clone)
--   - 게임 클라이언트의 game_results 호출은 모두 POST + Prefer: return=minimal → SELECT 불필요.
--   - game_meta를 쓰는 클라이언트 코드 없음(등록은 migrations만). docs/TECH_DEBT.md도 "writer 제거됨" 기록.
--   - scripts/audit-games.mjs는 anon으로 game_meta SELECT → SELECT는 유지해야 함.
--   - 대시보드(dashboard-data Edge Function)는 service_role로 읽음 → GRANT 회수 영향 없음.

begin;

-- 1. game_meta: 공개 읽기만 남기고 anon/authenticated 쓰기 차단
drop policy if exists "anon upsert" on public.game_meta;
drop policy if exists "anon update" on public.game_meta;
revoke insert, update, delete, truncate, references, trigger on table public.game_meta from anon, authenticated;
grant select on table public.game_meta to anon;

-- 2. game_results: 학생은 INSERT만. 읽기·수정·삭제 권한 자체를 회수(RLS + GRANT 이중 방어)
revoke select, update, delete, truncate, references, trigger on table public.game_results from anon, authenticated;
revoke insert on table public.game_results from authenticated;  -- authenticated 정책 없음, 사용처 없음
grant insert on table public.game_results to anon;

-- 3. game_results 저장 형식 상한 (기존 행 위반 0건 확인; NOT VALID 후 VALIDATE로 잠금 최소화)
alter table public.game_results
  add constraint game_results_game_format
    check (game ~ '^[a-z0-9][a-z0-9-]{0,39}$') not valid,
  add constraint game_results_class_len
    check (class is null or char_length(class) <= 20) not valid,
  add constraint game_results_comment_len
    check (comment is null or char_length(comment) <= 500) not valid,
  add constraint game_results_choices_size
    check (choices is null or octet_length(choices::text) <= 16384) not valid;

alter table public.game_results validate constraint game_results_game_format;
alter table public.game_results validate constraint game_results_class_len;
alter table public.game_results validate constraint game_results_comment_len;
alter table public.game_results validate constraint game_results_choices_size;

-- 4. RLS 유지 확인
alter table public.game_results enable row level security;
alter table public.game_meta enable row level security;

commit;

-- 5. 적용 직후 확인 쿼리 (기대값)
-- select policyname, cmd from pg_policies where schemaname='public' and tablename in ('game_results','game_meta');
--   → game_results: insert_anon/INSERT, game_meta: anon select/SELECT 만
-- select table_name, grantee, string_agg(privilege_type, ',' order by privilege_type)
--   from information_schema.role_table_grants
--  where table_schema='public' and table_name in ('game_results','game_meta') and grantee in ('anon','authenticated')
--  group by 1,2;
--   → game_results/anon: INSERT, game_meta/anon: SELECT, authenticated: 없음
-- 실기 확인: 아무 게임 1개 완주 → HTTP 201, 교사 대시보드 집계 정상, npm run audit:games 의 game_meta coverage PASS.

-- 6. 되돌리기 (문제 발생 시)
-- alter table public.game_results drop constraint if exists game_results_game_format,
--   drop constraint if exists game_results_class_len, drop constraint if exists game_results_comment_len,
--   drop constraint if exists game_results_choices_size;
-- grant select, insert, update, delete on table public.game_results to anon, authenticated;
-- grant select, insert, update, delete on table public.game_meta to anon, authenticated;
-- create policy "anon upsert" on public.game_meta for insert to anon with check (true);
-- create policy "anon update" on public.game_meta for update to anon using (true);
