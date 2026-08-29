-- jangnal1919 dashboard registration.
-- The locked payload records five historical judgment choices plus derived
-- relationship/space axes. A custom renderer shows the choice distributions
-- without interpreting them as correctness, trust, or motivation.
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
  'jangnal1919',
  '장날, 1919년 3월',
  '일제강점기 · 3·1 운동',
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
