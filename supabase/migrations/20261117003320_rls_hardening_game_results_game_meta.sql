-- 2026-11-17 production applied (migration version 20261117003320, name rls_hardening_game_results_game_meta).
-- 승인: 찰리쌤 2026-11-17. 검토 근거: supabase/proposals/20261117_rls_hardening_v2.sql
-- 목적: game_results는 anon INSERT만, game_meta는 공개 SELECT만 허용하고 저장 형식 상한을 둔다.
-- 적용 직후 확인: policy game_results/insert_anon(INSERT), game_meta/anon select(SELECT);
--   grant game_results/anon=INSERT, game_meta/anon=SELECT; CHECK 4개 validated; 기존 2,443행 유지.

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
