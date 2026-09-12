-- Register canonical metadata for the Singanhoe classroom game.
insert into public.game_meta (game_id,label,era,axes,scenes,sliders,endings,updated_at)
values ('singanhoe1927','지회의 4년','일제강점기 · 신간회 1927~1931','[]'::jsonb,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,now())
on conflict (game_id) do update set
  label=excluded.label,
  era=excluded.era,
  axes=excluded.axes,
  scenes=excluded.scenes,
  sliders=excluded.sliders,
  endings=excluded.endings,
  updated_at=excluded.updated_at;
