-- hoesaryeong1912 dashboard registration.
-- The locked payload uses company_form, final_decision, decision_reason, and
-- pattern. A custom dashboard renderer keeps the four trajectories and the
-- decision-specific reason distributions separate.
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
  'hoesaryeong1912',
  '허가받으시오 — 1912년, 회사를 세우다',
  '일제강점기 · 1910년대',
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
