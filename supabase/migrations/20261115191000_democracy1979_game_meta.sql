-- Register canonical metadata for the democracy-1979 classroom game.
insert into public.game_meta (game_id,label,era,axes,scenes,sliders,endings,updated_at)
values ('democracy-1979','1979: 지워진 목소리','현대사·1970년대','[]'::jsonb,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,now())
on conflict (game_id) do update set
  label=excluded.label,
  era=excluded.era,
  axes=excluded.axes,
  scenes=excluded.scenes,
  sliders=excluded.sliders,
  endings=excluded.endings,
  updated_at=excluded.updated_at;
