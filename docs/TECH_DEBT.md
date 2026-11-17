# Technical debt

## 해결됨 (2026-11-17) — `game_meta`·`game_results` RLS/grant hardening

- 적용: `supabase/migrations/20261117003320_rls_hardening_game_results_game_meta.sql` (검토 근거 `supabase/proposals/20261117_rls_hardening_v2.sql`).
- 결과: `game_meta` anon INSERT/UPDATE 정책 삭제·쓰기 grant 회수(SELECT만), `game_results` anon INSERT만, CHECK 4개(game 형식·class 20자·comment 500자·choices 16KB).
- 남은 일: `wall_posts` grant 정리(v1 제안 3번)는 미적용.

## Migration history

- 상태: remote history의 `20260515081700`, `20260515082519`에 대응하는 local migration 파일이 없음.
- 위험: 향후 일괄 `supabase db push`가 history 불일치로 실패하거나 잘못된 repair를 유도할 수 있음.
- 다음 행동: 실제 원본과 운영 history를 안전하게 대조해 복원. SQL을 추측하거나 임의 repair하지 않음.

## `analyze-question` test expectation

- 상태: production config는 `demoMode:false`, 기존 test는 과거 `true`를 기대해 assertion 1건이 실패함.
- 위험: game integration과 무관한 stale expectation이 전체 회귀 신호를 흐림.
- 다음 행동: question-demo의 의도된 운영 모드를 소유자와 확인한 뒤 test 또는 config 중 하나만 별도 작업으로 정정.

## Shared architecture

- 상태: repository-wide `charlie-core`가 없고 일부 신규 게임만 인라인 config/fallback을 사용함.
- 위험: 신규 게임마다 저장·config 구현이 조금씩 달라질 수 있음.
- 다음 행동: 향후 신규 게임부터 공통 구조를 적용할지 별도 설계. 기존 26개는 강제 migration하지 않음.

## Historical source follow-up

- 상태: `haebang1945`의 정오 방송 예고 벽보 원출처 확인 TODO가 남아 있음.
- 위험: 실행 blocker는 아니지만 자료 설명의 근거 품질과 연결됨.
- 다음 행동: 역사 자료 검수 작업에서 원출처를 확인하고 게임 README 또는 근거 문서에 기록.
