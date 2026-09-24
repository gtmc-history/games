# AGENTS.md — 한국사 게임 운영 지도

이 파일은 작업 시작 순서와 금지선을 안내한다.
게임 설계의 공통 상위 지침은 `PROJECT_INSTRUCTIONS.md`, 저장소 운영 계약과 이유는 `docs/index.md`, 현재 game registry는 `games.manifest.json`을 따른다.

## 저장소 성격

- 게임은 vanilla HTML/CSS/JS 기반이며 보통 `<slug>/index.html` 하나로 실행된다.
- 공개 URL은 `https://gtmc-history.github.io/games/<slug>/` 형식이다.
- `games.manifest.json`이 canonical game registry의 유일한 source of truth다.
- 허브·대시보드는 sibling 저장소 `gtmc-history.github.io`에서 운영한다.
- 기존 게임은 회귀 대상이며 단순 공통화를 위한 리팩터링 대상이 아니다.

## 작업 시작

1. `git remote -v`, 현재 branch, `git status`, HEAD, `origin/main` ahead/behind를 확인한다.
2. dirty 파일과 사용자 변경을 확인하고 덮어쓰지 않는다.
3. `PROJECT_INSTRUCTIONS.md`를 읽고 현재 작업이 EXPLORE / DESIGN / BUILD / PATCH 중 무엇인지 판단한다.
4. `docs/index.md`를 읽는다.
5. 작업 성격에 맞는 계약 문서를 읽는다.
6. 새 게임·역사 콘텐츠 작업이면 `docs/DESIGN_WORKFLOW.md`와 필요한 역사/시각 규칙을 읽는다.
7. Supabase 작업이면 `supabase/AGENTS.md`도 읽는다.
8. 현재 registry와 filesystem 차이를 `npm run audit:games`로 먼저 확인한다.

## 문서 라우팅

### 저장소 운영 계약
- 새 게임·상태 변경: `docs/GAME_CONTRACT.md`
- 결과 저장·payload: `docs/DATA_CONTRACT.md`
- 배포 완료 조건: `docs/RELEASE_CHECKLIST.md`
- 키·RLS·운영 DB: `docs/SECURITY.md`
- 미해결 문제: `docs/TECH_DEBT.md`

### 게임 설계 정본
- 설계 작업 순서: `docs/DESIGN_WORKFLOW.md`
- Mechanic 후보: `docs/GAME_DESIGN_TAXONOMY.md`
- 기존 구조 비교: `docs/GAME_PORTFOLIO_MAP.md`
- 역사 정확성·사료: `docs/HISTORY_ACCURACY_RULES.md`
- 민감 역사·실존 인물·AI 화자: `docs/SENSITIVE_HISTORY_RULES.md`
- UI·연출: `docs/VISUAL_DESIGN_RULES.md`
- 비강제 시각 참고: `docs/VISUAL_REFERENCE_LIBRARY.md`
- 기술 방향의 불변 원칙: `docs/TECH_RELEASE_CONTRACT.md`
- 설계 잠금 양식: `templates/DESIGN_LOCK_TEMPLATE.md`

## 절대 규칙

- 명시적 요청 없이 역사 콘텐츠를 수정하지 않는다.
- 정답, 판정, 사료 해석을 근거 없이 바꾸지 않는다.
- canonical `game_id`를 영향 분석 없이 변경하지 않는다.
- folder slug, manifest slug, public URL, canonical `game_id`는 기본적으로 같아야 한다.
- legacy alias는 canonical ID로 재사용하거나 삭제하지 않고 manifest에 기록한다.
- production 학생 데이터를 테스트 목적으로 INSERT하지 않는다.
- payload 검사는 정적 분석, fetch intercept, mock, test 환경 순으로 수행한다.
- service-role key를 client HTML/JS에 넣지 않는다.
- client에는 publishable/anon 수준 키만 허용한다.
- 기존 정상 게임을 공통 core 적용만을 위해 리팩터링하지 않는다.
- 운영 RLS 변경과 migration history repair는 명시적 승인 없이 실행하지 않는다.
- 공개 가능한 게임만 manifest `status: published`로 둔다.
- `published`가 아닌 게임을 허브에 노출하지 않는다.
- 새 게임 통합 작업을 마치기 전에 audit를 실행한다.
- 최신 DESIGN_LOCK이 있으면 구현 단계에서 핵심 설계를 임의 변경하지 않는다.

## 새 게임 기본 흐름

1. DESIGN 단계에서 Historical Discovery, Player Verb, Core Loop/Sequence, Mechanic을 검토한다.
2. canonical slug와 title을 결정한다.
3. `games.manifest.json`에 `status: draft`로 등록한다.
4. 새 게임은 원칙적으로 `design-locks/<slug>_DESIGN_LOCK_vX.Y.md`에 DESIGN_LOCK을 기록한다. 기존 게임이 `<slug>/README.md`에 잠금을 보유한 경우 즉시 이동시키지 않는다.
5. `<slug>/index.html`을 구현한다.
6. 로컬 실행과 핵심 동선을 확인한다.
7. SAVE를 `required`, `optional`, `none` 중 하나로 판정한다.
8. DASH를 `A`, `B`, `C` 중 하나로 판정한다.
9. 필요 시 `game_meta` migration과 dashboard renderer를 등록한다.
10. production을 오염시키지 않고 결과 payload를 검사한다.
11. `npm run audit:games -- --hub-repo <path>`를 통과시킨다.
12. Pages 배포와 production HTTP를 확인한다.
13. 모든 gate가 끝난 뒤에만 `published`로 전환하고 허브에 공개한다.

## manifest 규칙

- registry를 다른 저장소에 수동 복제하지 않는다.
- lifecycle enum은 `draft`, `design-locked`, `implemented`, `tested`, `published`, `archived`다.
- DASH-A/B는 교사가 확인할 결과가 있으므로 `save: none`과 함께 사용할 수 없다.
- custom renderer가 없으면 `renderer: generic`을 사용한다.
- archived 항목은 alias 예약을 위해 manifest에 남기고 허브에서는 제거한다.
- 신규 게임 README가 필요하면 `<slug>/README.md`를 사용한다.
- 기존 게임 폴더에 README나 AGENTS를 일괄 생성하지 않는다.

## 구현 원칙

- 게임별 단일 `index.html` 구조를 기본으로 유지한다.
- 화면 진행이 저장 실패 때문에 중단되지 않도록 기존 fire-and-forget 동작을 보존한다.
- 기존 최상위 저장 필드와 legacy payload를 임의 rename하지 않는다.
- AI 키는 브라우저에 두지 않고 기존 프록시 경계를 유지한다.
- generic dashboard renderer로 충분하면 custom renderer를 만들지 않는다.
- custom renderer 관계는 manifest와 dashboard 중앙 mapping이 일치해야 한다.

## 검증 명령

- 저장소 내부 deterministic audit: `npm run audit:games`
- sibling 허브 포함: `npm run audit:games -- --hub-repo "../gtmc-history.github.io"`
- 읽기 전용 production HTTP: `npm run audit:games -- --production`
- 두 옵션 결합 가능: `npm run audit:games -- --hub-repo "../gtmc-history.github.io" --production`

## 완료 조건

- 관련 계약 문서와 manifest가 실제 코드 상태를 반영한다.
- `npm run audit:games`가 exit code 0으로 끝난다.
- 통합 작업이면 hub repo 지정 audit도 exit code 0이어야 한다.
- `git diff --check`가 통과한다.
- 기존 게임 변경 시 핵심 동선과 결과 화면을 회귀검사한다.
- production 검사에서 가짜 학생 결과를 만들지 않는다.
- audit가 실패하면 운영 통합을 완료했다고 보고하지 않는다.

## Git

- 게임, 허브, 대시보드 저장소의 변경을 섞지 않는다.
- 목적별 커밋을 선호한다.
- push 전에 diff, status, 원격 ahead/behind를 재확인한다.
- 오래된 clone을 동기화하거나 수정하지 않는다.

## 역사 웹게임 스킬팩 (history-webgame-codex-skills v1.1.3)

`.agents/skills/`에 설치했다. 이 저장소의 규칙(`PROJECT_INSTRUCTIONS.md`, 최신 DESIGN_LOCK, `docs/` 계약, 위 절대 규칙)과 충돌하면 **저장소 규칙이 우선**한다. 스킬팩의 예시는 마이그레이션 지시가 아니다.

### Project profile

- architecture: `single-html` — 게임별 `<slug>/index.html`. 삽화 등 정적 자산은 `<slug>/assets/`에 둘 수 있다(예: `dokdo1905`).
- hosting: `github-pages`
- primary-input: `mixed` — 크롬북(키보드·트랙패드)과 태블릿(터치) 모두 완주 가능해야 한다.
- shared-device: `yes` — 학교 공용 기기 가정. 새 세션이 기본, 이어하기는 명시적 선택.
- persistence: `supabase` — `game_results` 익명 INSERT(publishable 키). sessionStorage/localStorage는 진행 캐시일 뿐 저장 PASS 근거가 아니다.
- class-time: `50m`
- historical-source-of-truth: 해당 게임의 최신 `design-locks/<slug>_DESIGN_LOCK_vX.Y.md`(사료·근거 LOCK)와 게임 폴더의 `SOURCES.md`(있을 때). 근거가 없으면 `UNVERIFIED – 교사 확인`.

### 스킬 사용

- 구조·범위·상태·수업시간 변경: `history-game-foundations`
- 사료·고지도·공문서·증거·판정 갱신: `historical-evidence-interactions`
- 비주얼노벨·선택지·분기: `historical-narrative-branching` (분기 데이터가 있을 때 `node .agents/skills/historical-narrative-branching/scripts/validate-branch-graph.mjs <file>`)
- 캐릭터 이동·공간 탐색: `phaser-history-exploration` — 공간 이동이 학습에 기여할 때만
- 화면 디자인·반응형: `history-game-ui-design` — 계정 스킬 `gtmc-history-design`과 `docs/VISUAL_DESIGN_RULES.md`를 우선
- 배포 전·큰 변경 후 검수: `history-game-playtest` — 결과는 `PASS / CONDITIONAL PASS / NO-GO`로 보고

BLOCKER/HIGH가 남아 있으면 새 기능을 추가하지 않고 최소 수정 후 재검사한다.
