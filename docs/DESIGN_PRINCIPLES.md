# Historical game design principles — compatibility entry point

이 문서는 기존 링크와 작업 습관을 위한 호환 진입점이다.
역사게임의 상세 설계 정본은 루트 `PROJECT_INSTRUCTIONS.md`와 아래 문서를 따른다.

- 공통 역사 정확성·사료·인과: `HISTORY_ACCURACY_RULES.md`
- 민감 역사·실존 인물·생성형 AI: `SENSITIVE_HISTORY_RULES.md`
- 설계 절차: `DESIGN_WORKFLOW.md`
- 게임 메커니즘: `GAME_DESIGN_TAXONOMY.md`
- UI·연출: `VISUAL_DESIGN_RULES.md`

## 유지되는 안전선

- 역사적 정확성과 근거를 게임적 편의보다 우선한다.
- 핵심 사료, 정답 판정, 역사 해석을 근거 없이 임의 수정하지 않는다.
- 게임 속 인물이 알 수 없었던 후대 정보를 선택 근거로 미리 주지 않는다.
- 학생 선택 때문에 실제 역사 사건이 발생한 것처럼 인과를 만들지 않는다.
- 민감한 피해 경험을 점수 경쟁, 승리 조건, 가벼운 역할극으로 소비하지 않는다.
- 기술 통합 작업은 역사 콘텐츠 수정의 근거가 아니다.

## 변경된 설계 관점

과거의 `선택 → 결과 → 발견`은 유용한 한 패턴이지만 모든 게임의 기본 구조로 강제하지 않는다.
새 게임은 Player Verb와 역사 구조에 따라 Core Loop 또는 Core Sequence를 설계한다.
Visual Novel, 지도, 카드, 신문 화면은 Presentation Layer일 수 있으며 실제 Gameplay Mechanic을 별도로 확인한다.

## DESIGN_LOCK

새 게임은 원칙적으로 `../design-locks/<slug>_DESIGN_LOCK_vX.Y.md`에 최신 설계 잠금을 둔다.
기존 게임이 `<slug>/README.md`에 DESIGN_LOCK 또는 동등한 설계 확정을 가지고 있다면 즉시 이동시키지 않고 차기 리비전에서 통합한다.
