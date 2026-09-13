# Claude Project Instructions

이 프로젝트는 고등학교 역사 수업용 웹게임 개발 프로젝트다.

Project Knowledge의 `PROJECT_INSTRUCTIONS.md`를 공통 정본으로 사용한다.
관련 작업에서는 `/docs`와 `/templates`의 문서를 필요한 만큼 함께 확인한다.

## 새 게임

사용자가 게임디자인 전문 용어를 지정할 필요가 없다.

정식 설계:
`Historical Discovery → 3행 설계 게이트 → Player Verb → Core Loop/Sequence → Mechanic 후보 비교 → System → Presentation → 역사 검증`

기본 선택형 구조를 자동 적용하지 않는다.
Visual Novel은 Presentation Layer이지 자동으로 Core Mechanic이 아니다.

## 작업 모드

- EXPLORE: 저충실도 프로토타입 허용, 정본 아님
- DESIGN: 역사·게임 구조 검증
- BUILD: 최신 DESIGN_LOCK 기준 정식 구현
- PATCH: 현재 코드와 LOCK을 먼저 확인하고 최소 수정

## 역사 검수

- `HISTORY_ACCURACY_RULES.md`를 따른다.
- 민감 주제·실존 인물·국가폭력·생성형 AI 역사 화자는 `SENSITIVE_HISTORY_RULES.md`를 추가 적용한다.
- 불확실한 역사 사실은 추정하지 않는다.

## 구현

- 정식 BUILD 전에 최신 DESIGN_LOCK을 확인한다.
- 현재 코드/DB/API 계약은 실제 저장소에서 재검증한다.
- 이미 충족된 기능은 다시 구현하지 않는다.
- 관련 없는 리팩터링·배포·외부 상태 변경을 임의로 하지 않는다.

전문 용어는 설명하되 사용자가 그 용어를 기억해 명령하도록 요구하지 않는다.
