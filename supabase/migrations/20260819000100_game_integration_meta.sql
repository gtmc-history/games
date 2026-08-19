-- Dashboard metadata for games that previously had no durable registration.
-- Apply through the normal Supabase migration workflow; do not run from a game client.

insert into public.game_meta (
  game_id,
  label,
  era,
  axes,
  scenes,
  sliders,
  endings,
  final_key,
  final_a,
  final_b,
  updated_at
) values
  (
    'balhae',
    '발해에서 고구려의 DNA를 찾아라',
    '삼국·남북국',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    null,
    null,
    null,
    now()
  ),
  (
    'gaehang',
    '개항의 갈림길 — 1876년 전야',
    '근대 · 개항기',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    'stance',
    '{"key":"cheokhwa","label":"왜양일체론·척화","color":"c-red"}'::jsonb,
    '{"key":"gaehwa","label":"통상개화론·개화","color":"c-blue"}'::jsonb,
    now()
  ),
  (
    'gendarme1910',
    '어느 기관의 일입니까?',
    '일제강점기 · 1910년대',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    null,
    null,
    null,
    now()
  ),
  (
    'goryeo-debate',
    '고려 말 대논쟁 — 정몽주 vs 정도전',
    '고려 말',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    null,
    null,
    null,
    now()
  )
on conflict (game_id) do update set
  label = excluded.label,
  era = excluded.era,
  axes = excluded.axes,
  scenes = excluded.scenes,
  sliders = excluded.sliders,
  endings = excluded.endings,
  final_key = excluded.final_key,
  final_a = excluded.final_a,
  final_b = excluded.final_b,
  updated_at = excluded.updated_at;
