
-- game_meta 테이블 생성
create table if not exists game_meta (
  game_id   text primary key,
  label     text,
  era       text,
  scenes    jsonb default '[]',
  sliders   jsonb default '[]',
  final_key text,
  final_a   jsonb,
  final_b   jsonb,
  updated_at timestamptz default now()
);

-- RLS 활성화
alter table game_meta enable row level security;

-- anon SELECT 허용 (대시보드가 읽어야 함)
create policy "anon select"
  on game_meta for select
  to anon
  using (true);

-- anon INSERT/UPDATE 허용 (게임이 자동 등록)
create policy "anon upsert"
  on game_meta for insert
  to anon
  with check (true);

create policy "anon update"
  on game_meta for update
  to anon
  using (true);
;
