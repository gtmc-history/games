# GAME DESIGN TAXONOMY v1.2

이 문서는 사용자가 외울 용어집이 아니다.
AI가 역사 주제에 맞는 게임 구조를 선택하기 위한 내부 설계 도구다.

## 용어 상태

- **Common industry term**: 업계에서 널리 쓰이는 표현
- **Design pattern**: 설계 구조를 설명하는 표현
- **Project shorthand**: 이 프로젝트의 분석용 별칭

Project shorthand를 업계의 고정 장르명처럼 설명하지 않는다.

---

## 1. 세 층

### Gameplay Layer
학생이 무엇을 하며 문제를 해결하는가.

### System Layer
학생 행동·상태·정보가 어떻게 기억되고 다음 상황에 영향을 주는가.

### Presentation Layer
플레이를 어떤 화면·서사 형식으로 보여주는가.

Visual Novel, 지도, 신문, 카드 화면은 Presentation일 수 있으며 그 자체로 충분한 Gameplay가 아닐 수 있다.

---

## 2. Gameplay Families

### Decision / Strategy Simulation
조건을 읽고 전략을 선택·비교한다.
- 적합: 정책, 외교, 개혁, 전략
- 위험: 객관식화

### Narrative Investigation
자료를 조사하고 가설을 갱신한다.
- Verb: 조사, 연결, 재구성
- 적합: 사건 원인, 사료 충돌

### Deduction Game
단서를 조합해 분류·판정·추론한다.
- 위험: 암기 퀴즈화

### Document-driven Gameplay
문서 자체가 주요 조작 오브젝트다.
- 적합: 조약, 신문, 법령, 보고서, 전보, 재판 기록

### Procedural Simulation
제도·행정·절차를 직접 통과한다.
- 적합: 회사령, 행정, 신고, 검열

### Systems Game
여러 변수와 관계가 서로 영향을 준다.
- 적합: 정치·경제·사회 구조
- 위험: 근거 없는 수치화

### Management Simulation
조직·정책·인력·시간을 운영한다.

### Resource Management
제한된 자원을 배분한다.
- 근거 없는 정밀 수치 금지

### Coalition / Faction Management
여러 세력의 이해관계를 조정하고 연합 상태를 관리한다.
- 적합: 신간회, 정파 연합

### Negotiation Game
조건·정보·레버리지를 활용해 합의 범위를 탐색한다.

### Argumentation Game
주장·근거·반론·재반론을 구성한다.

### Branching Narrative
선택에 따라 경로가 달라진다.
- Foldback 구조 사용 가능
- 실제 역사를 학생이 바꿨다고 오해시키지 않는다

### Belief Updating / Uncertainty
새 정보가 들어올 때 판단·확신도를 갱신한다.
- Project design family

### Evidence Board
여러 자료를 연결하고 관계를 표시한다.

### Card / Deck-driven Game
카드가 사건·정책·자료·인물의 조작 단위가 된다.
카드 모양을 쓴다고 Deckbuilder가 되는 것은 아니다.

### Spatial Strategy
공간·거리·이동·연결망이 플레이 핵심이다.

### Economic / Market Simulation
가격·유통·세금·소유·생산·분배를 시스템으로 경험한다.

### Editorial / Creation Simulation
정보를 선택·편집·배치해 결과물을 만든다.
- 적합: 신문, 보고서, 전시, 발표자료

### Information / Communication Simulation
서로 다른 정보 경로·속도·신뢰도를 경험한다.
- 적합: 해방 소식, 전시 정보, 검열

---

## 3. System Mechanics

- State Tracking
- Delayed Consequences
- Faction Relations
- Reputation / Trust
- Confidence Meter
- Progressive Disclosure
- Partial Information / Fog of War
- Information Asymmetry
- Risk–Reward
- Time Pressure
- Shrinking Decision Space
- Multiple Viable Strategies
- Fail Forward
- Replayability
- Event Deck
- Relationship State
- Network State

각 메커니즘은 역사 구조를 표현하는 데 필요할 때만 사용한다.

---

## 4. Presentation Layers

- Visual Novel
- Document Desk
- Newspaper / Editorial UI
- Map Interface
- Card Interface
- Timeline
- Evidence Board
- Dashboard
- Diegetic UI

### Visual Novel
캐릭터·대화로 상황을 전달하는 Presentation Layer로 우선 간주한다.

좋은 조합:
- Visual Novel + Document Investigation
- Visual Novel + Negotiation
- Visual Novel + Management
- Visual Novel + Belief Updating

위험:
`긴 대화 → 객관식 → 긴 대화 → 객관식`

---

## 5. 후보 선택 질문

1. 학생이 역사에서 무엇을 직접 해봐야 하는가?
2. 핵심 문제는 정보 부족, 이해관계 충돌, 절차, 자원 제약, 증거 판단, 공간 관계 중 무엇인가?
3. 학생이 바꿀 수 있는 것은 무엇인가?
4. 바꾸면 안 되는 실제 역사적 사건은 무엇인가?
5. 기존 게임과 Core Loop/Sequence가 같은가?
6. 재미의 근거는 무엇인가?
7. 다른 수업 형식보다 게임이 적합한가?

새로움보다 역사적 구조와 수업 적합성을 우선한다.
