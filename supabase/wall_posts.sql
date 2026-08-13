-- geunal1945 wall_posts — v1.1 FINAL
-- 공개 익명 공동 산출물 전용. 판단 궤적은 game_results와 분리한다.

create extension if not exists pgcrypto;

create table if not exists public.wall_posts (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  game       text not null,
  class      text not null default '미입력',
  content    text not null check (char_length(content) between 1 and 60),
  hidden     boolean not null default false
);

alter table public.wall_posts enable row level security;

drop policy if exists wall_posts_insert on public.wall_posts;
create policy wall_posts_insert on public.wall_posts
  for insert to anon
  with check (
    game = 'geunal1945'
    and char_length(content) between 1 and 60
    and hidden = false
  );

drop policy if exists wall_posts_select on public.wall_posts;
create policy wall_posts_select on public.wall_posts
  for select to anon
  using (hidden = false);

-- 테이블 권한도 최소화한다. UPDATE/DELETE는 anon에게 주지 않는다.
grant select, insert on public.wall_posts to anon;
revoke update, delete on public.wall_posts from anon;

-- 운영 원칙:
-- 1) class는 반×수업회차별 1회용 불투명 코드.
-- 2) class/game 필터는 UI 구분용이며 보안 경계가 아니다.
-- 3) hidden=false 행은 공개 데이터로 간주한다.
