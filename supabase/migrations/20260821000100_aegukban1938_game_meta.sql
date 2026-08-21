-- aegukban1938 dashboard registration.
-- The locked payload uses r1/r2/r3 and R4 observation counts. Existing generic
-- dashboard summary and comment handling are sufficient; no custom renderer is added.
insert into public.game_meta (
  game_id,
  label,
  era,
  axes,
  scenes,
  sliders,
  endings,
  updated_at
) values (
  'aegukban1938',
  '열 집을 묶다',
  '일제강점기 · 전시 동원',
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  now()
)
on conflict (game_id) do update set
  label = excluded.label,
  era = excluded.era,
  axes = excluded.axes,
  scenes = excluded.scenes,
  sliders = excluded.sliders,
  endings = excluded.endings,
  updated_at = excluded.updated_at;
