insert into public.game_meta (game_id, label, era, scenes, updated_at)
values ('newsroom1945', '1945 NEWSROOM', '해방 직후 · 모스크바 3국 외상회의', '[]'::jsonb, now())
on conflict (game_id) do update
set label = excluded.label,
    era = excluded.era,
    scenes = excluded.scenes,
    updated_at = now();
