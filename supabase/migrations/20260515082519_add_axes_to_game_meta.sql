
-- axes 컬럼 추가 (없으면 추가)
alter table game_meta add column if not exists axes jsonb default null;

-- endings 컬럼 추가 (엔딩 분포용)
alter table game_meta add column if not exists endings jsonb default null;
;
