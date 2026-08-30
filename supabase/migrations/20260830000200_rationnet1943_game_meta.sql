-- rationnet1943 dashboard registration.
-- The game records first-attempt placement/line judgments and S7 evidence-range choices.
-- A custom dashboard renderer is required because claim B must be aggregated by mode,
-- not by verdict, and comment rows carry final_text separately from result rows.
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
  'rationnet1943',
  '배급망 1943',
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
