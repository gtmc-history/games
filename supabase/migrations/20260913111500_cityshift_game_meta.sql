-- Register canonical metadata for the cityshift classroom game.
-- This migration only prepares game_meta; it does not modify student results or RLS.
insert into public.game_meta (game_id,label,era,axes,scenes,sliders,endings,updated_at)
values ('cityshift','도시의 자리','일제강점기 · 도시 변화','[]'::jsonb,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,now())
on conflict (game_id) do update set
  label=excluded.label,
  era=excluded.era,
  axes=excluded.axes,
  scenes=excluded.scenes,
  sliders=excluded.sliders,
  endings=excluded.endings,
  updated_at=excluded.updated_at;
