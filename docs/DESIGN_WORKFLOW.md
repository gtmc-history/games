# DESIGN WORKFLOW v1.2

## Mode 0 — 작업 모드

### EXPLORE
아이디어 비교, 저충실도 화면, 플레이 감각 확인.
정본 아님.

### DESIGN
역사 자료와 게임 구조를 검증하고 DESIGN_LOCK 준비.

### BUILD
최신 DESIGN_LOCK 기준 정식 구현.

### PATCH
기존 게임의 현재 동작을 확인하고 필요한 부분만 수정.

---

## Gate 0 — Historical Fit & Game Fit

질문:
1. 학생은 무엇을 외우는 것이 아니라 무엇을 경험해서 발견해야 하는가?
2. 이 주제에는 실제로 플레이할 문제가 있는가?
3. 게임보다 토론·읽기·활동지가 더 적합하지 않은가?

산출물:
- Historical Discovery 1문장
- 게임으로 만드는 이유 1문장
- 재미/몰입의 근거 1개 이상

---

## Gate 1 — 3행 설계

- 발견 한 문장
- 플레이 동사
- 행동의 이유

---

## Gate 2 — Player Verb

1~3개로 정한다.

인터페이스 행동과 플레이 행동을 구분한다.

- 클릭한다 → 인터페이스
- 자료를 연결한다 → 플레이
- 다음으로 간다 → 인터페이스
- 협상한다 → 플레이

---

## Gate 3 — Core Loop / Core Sequence

반복 구조:
`조사 → 가설 → 증거 → 수정 → 다시 조사`

한 방향의 변화:
`본다 → 범위를 넓힌다 → 연결한다 → 다시 본다`

`읽기 → 4지선다 → 해설`이 대부분이면 재설계 후보.

---

## Gate 4 — Mechanic 후보 비교

보통 2~3개 후보를 비교한다.

각 후보:
- 역사 구조 적합성
- Player Verb
- 재미/몰입
- 역사 왜곡 위험
- 기존 게임과 중복
- 구현 난도

Primary Mechanic을 하나 정하고 Secondary는 필요한 만큼만 붙인다.

---

## Gate 5 — System

필요한 상태만 만든다.

예:
- 판단 이력
- 우선순위
- 관계
- 보유 자료
- 확신도
- 자원
- 시간

역사적 근거가 없는 정밀 수치화 금지.
`민심 73`, `탄압 +15` 같은 숫자를 사실처럼 보이게 만들지 않는다.

---

## Gate 6 — Meaningful Choice / Consequence

확인:
- 판단 정보가 있는가
- 선택 차이가 실제 의미가 있는가
- 이후 상태/정보/해석에 영향이 있는가
- 실제 역사 사건을 클릭의 결과처럼 만들지 않는가

Consequence:
- 새 정보
- 조건
- 대가
- 관계
- 판단 변화
- 결과물 변화
- 확신도 변화

---

## Gate 7 — Presentation

마지막에 표현 형식을 고른다.

- Visual Novel
- 문서 책상
- 신문 편집
- 지도
- 카드
- 타임라인
- 대시보드
- Evidence Board

Presentation은 Core Loop/Sequence를 강화해야 한다.

---

## Gate 8 — 역사 검증

`HISTORY_ACCURACY_RULES.md` 적용:
- 사실/해석/평가
- 출처 등급
- 후견지명
- 인과
- 가공 요소
- 수치/확률

민감 주제라면 `SENSITIVE_HISTORY_RULES.md` 추가 적용.

---

## Gate 8.5 — Engagement Check

- 학생이 다음 행동을 하고 싶은 이유가 실제로 있는가
- 첫 2~3분 안에 목표와 조작을 이해하는가
- 설명이 플레이를 압도하지 않는가
- 실패·오판·불확실성이 다음 행동으로 이어지는가
- 학습지 없이 기본 플레이가 완결되는가

---

## Gate 9 — DESIGN_LOCK

템플릿을 채우고 잠근다.

LOCK 이후 핵심 설계가 바뀌면 DESIGN_LOCK을 먼저 수정한다.

---

## Gate 10 — BUILD

Codex/Claude Code에 작업지시서를 전달한다.

---

## Gate 11 — Play Audit

- Player Verb가 실제 코드에서 반복/핵심 행동으로 살아 있는가
- Core Loop/Sequence가 끊기지 않는가
- 읽기가 플레이보다 길지 않은가
- 객관식으로 축소되지 않았는가
- Engagement Hook이 실제 구현됐는가
- 결과 화면이 판단을 되돌아보게 하는가

---

## Gate 12 — Release Audit

실제 저장소의 최신 계약을 사용한다.
오래된 문서·기억을 기술 정본으로 쓰지 않는다.
