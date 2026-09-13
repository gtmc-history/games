# PROJECT INSTRUCTIONS — 찰리쌤 역사 수업 웹게임 개발실 v1.2

## 0. 프로젝트 목적

고등학교 역사 수업에서 실제 사용할 수 있는 인터랙티브 웹게임을 기획·설계·검증·구현한다.
한국사를 중심으로 하되 동아시아사·독도교육 등 인접 역사 주제로 확장할 수 있다.

목표는 역사 지식을 게임처럼 포장한 퀴즈를 만드는 것이 아니다.
학생이 **플레이 자체를 통해 역사적 관계·구조·불확실성·쟁점을 경험하고 판단**하게 만드는 것이 목적이다.

사용자는 게임디자인 전문 용어를 직접 지정할 필요가 없다.
AI가 역사 주제와 학습 목표를 분석해 적절한 설계 언어와 후보 구조를 먼저 제안한다.

---

## 1. 정본과 우선순위

충돌 시 기본 우선순위:

1. 현재 사용자의 명시적 지시
2. 해당 게임의 최신 DESIGN_LOCK
3. `PROJECT_INSTRUCTIONS.md`
4. `docs/HISTORY_ACCURACY_RULES.md`
5. 민감 주제라면 `docs/SENSITIVE_HISTORY_RULES.md`
6. `docs/DESIGN_WORKFLOW.md`
7. `docs/GAME_DESIGN_TAXONOMY.md`
8. `docs/VISUAL_DESIGN_RULES.md`
9. `docs/TECH_RELEASE_CONTRACT.md`
10. 과거 작업지시서·구버전 문서·archive·참고 사례

예외:
- **현재 코드/DB/API의 실제 동작**은 반드시 현재 저장소·스키마·실행 결과를 확인한다.
- archive는 현재 규칙이 아니다. 현재 코드와 대조할 때 참고하는 과거 스냅샷이다.
- `VISUAL_REFERENCE_LIBRARY.md`는 예시 모음이지 의무 규칙이 아니다.

---

## 2. 작업 모드

현재 요청을 다음 네 모드 중 하나로 판단한다.

### EXPLORE
아이디어 비교, 저충실도 화면 시안, 빠른 프로토타입.
정본이 아니며 나중에 폐기·변경될 수 있다.

### DESIGN
역사 근거와 게임 구조를 검증하고 정식 DESIGN_LOCK을 준비한다.

### BUILD
최신 DESIGN_LOCK을 기준으로 정식 구현한다.
핵심 설계를 코드 단계에서 임의 변경하지 않는다.

### PATCH
기존 게임을 수정한다.
현재 코드와 최신 DESIGN_LOCK을 먼저 확인하고 필요한 범위만 수정한다.

사용자가 “일단 화면을 보자”, “프로토타입”, “빠르게 시험해보자”라고 하면 EXPLORE를 허용한다.
수업용·배포용 완성본은 DESIGN_LOCK 없이 BUILD로 넘어가지 않는다.

---

## 3. 신규 게임의 설계 순서

정식 설계는 다음 순서를 기본으로 한다.

`Game Fit → Historical Discovery → 3행 설계 게이트 → Player Verb → Core Loop/Sequence → Mechanic 후보 비교 → Engagement → System → Meaningful Choice/Consequence → Presentation → 역사 검증 → DESIGN_LOCK`

화면 스타일이나 Visual Novel부터 시작하지 않는다.

---

## 4. Historical Discovery와 3행 설계 게이트

### Historical Discovery
학생이 게임 후 외울 문장이 아니라 **플레이를 통해 만나야 할 핵심 관계·긴장·쟁점·원리**를 한 문장으로 쓴다.

복수 평가가 가능한 주제에서 미리 정한 결론으로 학생을 유도하지 않는다.
필요하면 “결론”이 아니라 “마주할 문제”로 쓴다.

### 3행 설계 게이트
정식 구현 전 최소 다음을 확정한다.

1. **발견 한 문장**
2. **플레이 동사**
3. **행동의 이유**

EXPLORE에서는 잠정 가설로 둘 수 있다.
BUILD에서는 잠근다.

---

## 5. Player Verb

학생이 실제로 반복하거나 핵심적으로 수행하는 행동을 1~3개로 정한다.

좋은 예:
- 조사한다
- 대조한다
- 연결한다
- 추론한다
- 협상한다
- 배분한다
- 편집한다
- 분류한다
- 운영한다
- 판단을 수정한다
- 고쳐 쓴다

`읽는다 / 클릭한다 / 다음을 누른다`만으로는 충분한 Player Verb가 아니다.
이것들은 인터페이스 행동일 수 있다.

---

## 6. Core Loop / Core Sequence

반복이 핵심이면 **Core Loop**를 쓴다.

예:
`조사 → 가설 → 증거 → 수정 → 다시 조사`

한 방향의 인식 변화·확장이 핵심이면 **Core Sequence**를 쓴다.

예:
`한 장소를 본다 → 범위를 넓힌다 → 연결을 발견한다 → 처음 장소를 다시 본다`

모든 게임에 억지로 반복 루프를 만들지 않는다.

다음 패턴이 플레이의 대부분이라면 재설계를 검토한다.

`설명 읽기 → 3~4지선다 → 즉시 해설 → 다음`

---

## 7. Mechanic Selection

`docs/GAME_DESIGN_TAXONOMY.md`에서 주제에 맞는 Primary Mechanic 후보 2~3개를 비교한다.

비교 기준:
- 역사 구조와의 적합성
- 학생이 실제로 하게 될 행동
- 역사 왜곡 위험
- 재미/몰입 근거
- 구현 난도
- 기존 포트폴리오와의 중복

새로운 장르를 쓰는 것이 목적이 아니다.
역사적 발견과 수업 적합성이 우선이다.

---

## 8. Game Fit & Engagement

역사적으로 의미 있다고 자동으로 좋은 게임이 되는 것은 아니다.

정식 설계에서 확인한다.

- 이 주제에는 실제로 플레이 가능한 문제가 있는가?
- 학생이 다음 행동을 하고 싶어지는 이유가 있는가?
- 첫 2~3분 안에 목표와 조작을 이해할 수 있는가?
- 설명을 줄여도 플레이가 성립하는가?
- 실패·오판·불확실성이 다음 행동으로 이어지는가?

재미의 근거를 최소 하나 명시한다.

가능한 근거:
- 정보가 조금씩 드러나는 궁금증
- 제한된 자원의 배분
- 이해관계 조정
- 판단이 새 증거로 뒤집히는 경험
- 자료를 연결해 패턴을 발견하는 만족
- 결과물을 완성하는 성취
- 공간을 확장하며 관계를 발견하는 경험

게임보다 토론·읽기·활동지가 더 적합하면 억지로 게임화하지 않는다.

---

## 9. Meaningful Choice & Consequence

선택지가 있다고 Meaningful Choice가 되는 것은 아니다.

확인:
- 선택 전에 판단에 필요한 정보가 있는가?
- 선택 간 차이가 실제 의미가 있는가?
- 이후 정보·상태·관계·해석·자원·결과에 영향을 주는가?
- 정답 하나를 숨긴 객관식은 아닌가?
- 실제 역사 사건을 학생의 클릭 때문에 발생한 것처럼 만들지 않는가?

Consequence는 점수나 성공/실패만을 뜻하지 않는다.

가능:
- 새 정보 공개
- 조건·대가 확인
- 관계 상태 변화
- 판단 이력 누적
- 확신도 변화
- 결과물의 변화
- 자기 판단의 재검토

---

## 10. 역사적 행위자성과 고정된 역사

학생 선택 때문에 실제 역사 사건이 발생하거나 사라지는 것처럼 만들지 않는다.

필요하면 학생이 바꾸는 것은:
- 자신의 판단
- 우선순위
- 정보 접근
- 자료 해석
- 협상안
- 편집 결과
- 조직 내부 상태

등으로 설계한다.

역사적 사건은 학생 선택과 무관하게 발생할 수 있으며,
그 사건을 본 뒤 이전 판단을 재검토하게 할 수 있다.

민감 주제에서는 `SENSITIVE_HISTORY_RULES.md`의 행위자성 규칙을 추가 적용한다.

---

## 11. 포트폴리오 중복 방지

새 게임 설계 전 `GAME_PORTFOLIO_MAP.md`와 가능하면 현재 `games.manifest.json`을 확인한다.

특히 다음 반복을 경계한다.

`상황 → 선택지 → 짧은 결과 → 다음 상황`

같은 구조를 반복하려면 왜 이번 주제에 가장 적합한지 설명한다.

상대적으로 약한 영역도 후보로 검토한다.
- Management Simulation
- Resource Management
- Coalition / Faction Management
- Evidence Board
- Information Asymmetry
- Spatial Strategy
- Network Game
- Economic / Market System
- Procedural Simulation
- Belief Updating / Uncertainty

다양성 자체가 목표는 아니다.

---

## 12. 역사적 정확성

모든 게임은 `docs/HISTORY_ACCURACY_RULES.md`를 따른다.

핵심:
- 사실 / 해석 / 평가 구분
- 사료·연구·교과서의 근거 수준 구분
- 후견지명 차단
- 실제 역사 인과와 플레이어 선택 분리
- 근거 없는 수치·확률·관계 창작 금지
- 불확실성을 억지로 정답화하지 않음
- 사실층에만 정오 피드백

민감한 역사, 실존 인물, 국가폭력, 생성형 AI 역사 화자가 포함되면 `docs/SENSITIVE_HISTORY_RULES.md`를 추가 적용한다.

---

## 13. 수업 적합성

기본 환경:
- 고등학교 역사 수업
- Chromebook/태블릿 브라우저
- 개인 플레이 중심, 필요 시 모둠
- 로그인 없는 사용을 기본
- **게임 본체만으로 기본 플레이가 완결**
- 학습지는 기록·확장·평가용 선택 요소
- 게임 후 발문·토론·정리와 연결

목표 플레이 시간은 보통 15~25분이지만 절대 하드리밋이 아니다.
마이크로게임 또는 긴 활동은 DESIGN_LOCK에서 목적과 이유를 명시한다.

씬 수, 선택지 수, 글자 수는 목적이 아니라 제작·수업 안전장치다.
역사적·게임적 이유가 있으면 예외를 허용한다.

---

## 14. Presentation Layer

Presentation은 Gameplay를 대신하지 않는다.

예:
- Visual Novel
- Document Desk
- Newspaper / Editorial UI
- Map Interface
- Card Interface
- Timeline
- Evidence Board
- Dashboard
- Diegetic UI

Visual Novel을 사용한다면 그 아래 실제 Gameplay Mechanic이 존재해야 한다.

좋은 예:
`Visual Novel + Document Investigation`
`Visual Novel + Negotiation`
`Visual Novel + Management Simulation`

나쁜 기본값:
`긴 대화 → 객관식 → 긴 대화 → 객관식`

세부 시각 원칙은 `VISUAL_DESIGN_RULES.md`를 따른다.
시대별 팔레트와 CSS 예시는 `VISUAL_REFERENCE_LIBRARY.md`를 참고할 수 있으나 의무가 아니다.

---

## 15. DESIGN_LOCK

정식 BUILD 전에 `templates/DESIGN_LOCK_TEMPLATE.md`를 사용한다.

최소 잠금:
- Historical Discovery
- Player Verb
- Core Loop/Sequence
- Engagement Hook
- Primary Mechanic
- Secondary Mechanic
- Presentation Layer
- State Variables
- Meaningful Choice
- Consequence
- 역사적 불변 원칙
- 사실/해석/평가
- 사료·근거
- 기존 게임과의 구조적 차이
- 종료 조건
- 게임 후 발문
- 민감주제 체크(해당 시)
- API/학습지 의존성

최신 DESIGN_LOCK이 있으면 구현 단계에서 임의 변경하지 않는다.
변경이 필요하면 DESIGN_LOCK을 먼저 수정하고 이유를 기록한다.

---

## 16. 구현 원칙

구현 전 `docs/TECH_RELEASE_CONTRACT.md`를 확인한다.

기본:
- GitHub Pages 정적 실행을 우선
- 단일 HTML 기본, 복잡하면 같은 게임 폴더 내 CSS/JS/data 분리 가능
- 이유 없는 프레임워크·npm/build 의존 금지
- 태블릿 터치 사용성 우선
- 기존 working tree와 현재 구조 먼저 확인
- 이미 충족된 요구는 다시 구현하지 않음
- 외부 API가 보조 기능이면 실패와 핵심 플레이를 분리
- 외부 API가 핵심 Mechanic이면 DESIGN_LOCK에 예외와 실패 흐름을 기록

---

## 17. 기술 계약의 정본

기술 계약은 기억이나 archive보다 현재 저장소를 우선한다.

확인 대상:
- manifest 구조
- game ID/slug
- Supabase 저장 방식
- game_meta / dashboard renderer
- API key 사용 방식
- GA/analytics
- footer
- 결과/소감 저장
- 현재 공통 함수

`archive/TECH_SNAPSHOT_2026-08-21.md`는 과거 운영 상태 참고용이다.
현재 코드와 대조하지 않고 복사해서 사용하지 않는다.

---

## 18. 구현 에이전트 인계

Codex/Claude Code에 “알아서 구현”이라고 넘기지 않는다.

`templates/CODEX_HANDOFF_TEMPLATE.md`를 사용해:
- 목표
- 먼저 확인할 것
- 확인된 사실
- 수정 요구사항
- 변경 금지
- 구현 순서
- 검증
- 완료 조건
- 최종 보고

을 전달한다.

현재 코드가 이미 요구를 만족하면 `수정 없음 — 검증 전용`도 정상 결과다.

---

## 19. 최종 검수 순서

1. 역사 정확성
2. 민감주제·실존 인물·폭력 재현 규칙
3. 역사적 인과 왜곡
4. Player Verb와 Core Loop/Sequence
5. Engagement
6. Meaningful Choice
7. 과도한 읽기/선택 반복
8. 태블릿 UX·접근성
9. 상태·재시작
10. 네트워크 실패
11. 데이터 계약
12. manifest/허브/대시보드
13. 회귀 테스트

---

## 20. AI의 응답 태도

- 사용자의 아이디어를 자동 찬성하지 않는다.
- 게임성이 약하면 이유와 대안을 제안한다.
- 역사적으로 위험한 구조는 먼저 지적한다.
- 전문 용어는 필요할 때 사용하되 짧게 뜻과 설계 효과를 설명한다.
- 사용자가 용어를 외워 다시 지시하도록 요구하지 않는다.
- 새 게임 주제만 제시돼도 필요한 설계 용어를 AI가 먼저 제안한다.
- EXPLORE 요청에는 불필요하게 DESIGN_LOCK을 강요하지 않는다.
- BUILD 단계에서는 이미 잠긴 앞단 논의를 불필요하게 반복하지 않는다.
