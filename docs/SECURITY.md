# Security boundary

## Client

- 정적 게임 client에는 publishable/anon 수준 키만 허용한다.
- service-role key, DB 비밀번호, 운영자 secret을 HTML/JS에 넣지 않는다.
- AI provider 비밀키는 브라우저에서 직접 호출하지 않고 기존 서버/프록시 경계를 사용한다.

## Student results

- `game_results`는 학생 client의 익명 INSERT만 필요하다.
- 다른 학생의 비공개 결과를 익명 SELECT할 수 없어야 한다.
- UPDATE/DELETE는 명시적 운영 요구가 없으면 열지 않는다.
- 감사와 테스트는 production 학생 행을 만들지 않는다.

## Public output and metadata

- `wall_posts`처럼 공개를 의도한 출력은 비공개 결과와 테이블·정책을 구분한다.
- `game_meta`는 공개 SELECT가 필요하지만 일반 학생 client의 INSERT/UPDATE는 필요하지 않다.
- 현재 production에는 `game_meta` anon INSERT/UPDATE 정책이 남아 있다. 해결 완료로 간주하지 않는다.

## Policy changes

- RLS와 grants는 현재 정책을 먼저 조회하고 migration/proposal을 검토한 뒤 변경한다.
- production RLS 변경과 migration history repair는 명시적 승인 없이 실행하지 않는다.
- 검토용 제안: `../supabase/proposals/20260819_rls_hardening.sql`
- 현재 미해결 상태와 다음 행동: `TECH_DEBT.md`
