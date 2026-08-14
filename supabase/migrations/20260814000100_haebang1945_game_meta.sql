-- haebang1945 dashboard registration.
-- The dashboard has a dedicated parser for choices.r1..r4, so generic chart
-- metadata remains empty rather than reinterpreting the locked game content.
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
  'haebang1945',
  '도둑같이 온 해방 — 1945',
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
