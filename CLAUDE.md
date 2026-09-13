# CLAUDE.md

이 저장소에서 작업할 때 먼저 다음을 확인한다.

1. `PROJECT_INSTRUCTIONS.md`
2. 해당 게임의 최신 DESIGN_LOCK
3. 관련 `/docs` 문서
4. 현재 코드와 manifest

## 설계
- 사용자가 전문 용어를 지정할 때까지 기다리지 않는다.
- Historical Discovery → Player Verb → Core Loop/Sequence → Mechanic → Presentation 순으로 사고한다.
- 민감 주제면 `docs/SENSITIVE_HISTORY_RULES.md`를 확인한다.

## 구현
- DESIGN_LOCK을 설계 SSOT로 취급한다.
- 코드·DB·API의 현재 사실은 실제 코드와 실행으로 확인한다.
- 오래된 작업 문서를 자동 복원하지 않는다.
- 이미 충족된 요구는 다시 만들지 않는다.
- 범위 밖 리팩터링 금지.

## 외부 상태
배포·DB 변경·키 교체·외부 상태 변경은 사용자가 요청한 범위를 넘어서 실행하지 않는다.

## 완료
검증하지 않은 내용을 완료라고 보고하지 않는다.
현재 코드가 이미 요구를 만족하면 `수정 없음 — 검증 전용`이 가능하다.
