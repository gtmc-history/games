# Supabase operations rules

이 디렉터리에서는 루트 `AGENTS.md`와 `docs/SECURITY.md`, `docs/DATA_CONTRACT.md`를 함께 따른다.

## 시작 전

1. linked project와 대상 환경을 확인한다.
2. local/remote migration list를 읽기 전용으로 비교한다.
3. 기존 policy, grants, RLS 상태를 조회한다.
4. 변경이 production에 미치는 영향을 먼저 설명한다.

## Migration

- schema·metadata 변경은 재현 가능한 migration으로 남긴다.
- 이미 적용된 migration을 내용 변경하지 않는다.
- remote history에만 있는 version의 SQL을 추측해 만들지 않는다.
- `migration repair`는 명시적 승인과 실제 적용 상태의 증거 없이는 실행하지 않는다.
- `db push` 전에 누락 history와 예상 적용 SQL을 확인한다.

## 권한 경계

- client에는 publishable/anon key만 허용한다.
- service-role key와 DB 비밀번호를 client, 문서, 로그에 넣지 않는다.
- `game_results`: 학생 INSERT, 익명 비공개 결과 SELECT 금지가 기본이다.
- `game_meta`: 공개 SELECT, 운영 migration/service 경로 쓰기가 기본이다.
- `wall_posts`: 의도된 공개 출력만 별도 policy로 다룬다.

## Production 안전

- 감사용 `game_results`를 production에 INSERT하지 않는다.
- payload는 정적 분석, fetch intercept, mock, test 환경 순으로 확인한다.
- RLS/grant 변경은 proposal 검토와 명시적 승인 후 수행한다.
- `proposals/`의 SQL은 review-only이며 자동 배포 대상이 아니다.
- secret 값은 출력하지 않고 설정 존재 여부만 확인한다.

## 완료 전

- migration diff와 history를 확인한다.
- anon 권한으로 허용·차단 동작을 읽기 전용으로 검증한다.
- `npm run audit:games`를 실행한다.
- 수행한 production 변경과 수행하지 않은 proposal을 구분해 보고한다.
