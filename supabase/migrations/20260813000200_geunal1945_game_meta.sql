-- Current dashboard-data reads public.game_meta directly.
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
  'geunal1945',
  '그날, 아무도 몰랐다 — 1945',
  '일제강점기',
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
