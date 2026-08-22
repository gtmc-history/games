-- altteure1937 dashboard registration.
-- The integration uses the generic dashboard summary and comment handling.
-- Per the game handoff, no game-specific renderer is registered.
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
  'altteure1937',
  '알뜨르: 지도를 넓혀라',
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
