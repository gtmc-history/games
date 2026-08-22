-- economy1930 dashboard registration.
-- The locked result payload needs cross-tab and ordered-choice analysis, so the
-- dashboard uses its dedicated central renderer while metadata remains neutral.
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
  'economy1930',
  '숫자는 성장하고 있습니다',
  '일제강점기 · 1920~1930년대 식민지 경제',
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
