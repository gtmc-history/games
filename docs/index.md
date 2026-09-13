# Repository knowledge map

이 디렉터리는 저장소 운영 계약과 역사게임 설계 정본을 설명한다. 현재 게임 목록과 상태는 문서가 아니라 루트 `games.manifest.json`을 기준으로 한다.

## 저장소 운영 계약

| 작업 | 먼저 읽을 문서 | 내용 |
|---|---|---|
| 새 게임 생성·상태 변경 | `GAME_CONTRACT.md` | canonical identity, lifecycle, SAVE/DASH 판정, 완료 기준 |
| 결과 저장·payload | `DATA_CONTRACT.md` | 실제 공통 payload와 호환성 규칙 |
| 배포 준비 | `RELEASE_CHECKLIST.md` | 새 게임·큰 변경의 Definition of Done |
| 키·RLS·운영 DB | `SECURITY.md` | client 권한, 데이터 보호, 정책 변경 원칙 |
| 미해결 문제 | `TECH_DEBT.md` | RLS, migration history, stale test, architecture 부채 |

## 역사게임 설계 정본

새 게임의 상위 행동 규칙은 루트 `../PROJECT_INSTRUCTIONS.md`를 먼저 읽는다.

| 작업 | 문서 | 역할 |
|---|---|---|
| 설계 전체 흐름 | `DESIGN_WORKFLOW.md` | EXPLORE / DESIGN / BUILD / PATCH, 설계 게이트 |
| Mechanic 선택 | `GAME_DESIGN_TAXONOMY.md` | Gameplay / System / Presentation 후보 |
| 기존 게임과 비교 | `GAME_PORTFOLIO_MAP.md` | Core Loop/Sequence와 포트폴리오 중복 분석 |
| 역사 사료·인과 | `HISTORY_ACCURACY_RULES.md` | 사실/해석/평가, 출처 등급, 후견지명, 인과 |
| 민감한 역사 | `SENSITIVE_HISTORY_RULES.md` | 국가폭력, 실존 인물, AI 역사 화자, 학생 정서 안전 |
| UI·연출 | `VISUAL_DESIGN_RULES.md` | Player Verb·자료·역할 기반 시각 설계 |
| 시각 참고 | `VISUAL_REFERENCE_LIBRARY.md` | 비강제 팔레트·마이크로인터랙션 예시 |
| 기술 방향 | `TECH_RELEASE_CONTRACT.md` | 불변 원칙; 구체 계약은 현재 코드와 운영 문서가 정본 |
| 역사설계 호환 진입점 | `DESIGN_PRINCIPLES.md` | 기존 링크를 위한 요약·라우팅 문서 |

템플릿:
- `../templates/DESIGN_LOCK_TEMPLATE.md`
- `../templates/CODEX_HANDOFF_TEMPLATE.md`

게임별 새 DESIGN_LOCK은 원칙적으로 `../design-locks/`에 저장한다. 기존 게임의 잠금 문서가 게임 폴더 README에 있으면 차기 리비전 전까지 그대로 둘 수 있다.

플랫폼 프로젝트 지침 원본:
- `project-adapters/CHATGPT_PROJECT_INSTRUCTIONS.md`
- `project-adapters/CLAUDE_PROJECT_INSTRUCTIONS.md`

추가 참고 자료:
- 마지막 전수 baseline: `../AUDIT_GAMES_20260819.md`
- 과거 기술계약 스냅샷: `../archive/TECH_SNAPSHOT_2026-08-21.md`

문서와 실제 상태가 다르면 filesystem과 코드를 확인한 뒤 manifest와 관련 운영 문서를 함께 고친다. 과거 목록 문서를 registry로 사용하지 않는다.
