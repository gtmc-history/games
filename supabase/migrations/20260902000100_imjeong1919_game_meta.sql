-- imjeong1919 dashboard registration.
-- The locked payload records judgment trajectories, evidence stamps, verdicts,
-- and optional comments. The generic dashboard summary/comment handling is
-- sufficient; no custom renderer is required for initial release.
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
  'imjeong1919',
  '1919~1925, 임시 정부를 다시 설계하다',
  '일제강점기 · 대한민국 임시 정부',
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
