# 한국사 게임 저장소·허브·대시보드 전수 감사

- 감사 기준일: 2026-08-19 (Asia/Seoul)
- source of truth: 현재 기준 저장소의 실행 가능한 `index.html` 보유 폴더
- 공개 URL 기준: `https://gtmc-history.github.io/games/<slug>/`

## 0. 기준 저장소 판정

| 구분 | 기준 절대경로 | 원격 | branch | 감사 시작 상태 | 감사 시작 revision |
|---|---|---|---|---|---|
| 게임 | `C:\Users\user\OneDrive\claude-projects\games` | `https://github.com/gtmc-history/games` | `main` | clean, `origin/main`과 일치 | `ab8c8cedf3eb2569cfc0f76f98e98886f0987b66` (2026-08-17) |
| 허브·대시보드 | `C:\Users\user\OneDrive\claude-projects\gtmc-history.github.io` | `https://github.com/gtmc-history/gtmc-history.github.io` | `main` | clean, `origin/main`과 일치 | `e47951c465cdd2b06795d557e846a18fe5f02d65` (2026-08-14) |

동일 원격의 오래된 clone은 수정하지 않았다.

- `C:\Users\user\OneDrive\claude-projects\games-repo`: 2026-06-05 revision, `euljsa1905/index.html` 사용자 변경 보유.
- `C:\Users\user\OneDrive\문서\GitHub\gtmc-history.github.io`: `feature/question-demo-mvp`, 2026-08-05 revision, `2026-2/` 미추적 파일 보유.

## A. 전수조사 결과

| 지표 | 감사 전 | 최종 | 설명 |
|---|---:|---:|---|
| 실제 게임 수 | 26 | 26 | 실행 entry point가 있는 폴더만 집계 |
| 정상 Pages 배포 수 | 26 | 26 | 전 URL HTTP 200, 핵심 동일 출처 리소스 404 없음 |
| 허브 연결 수 | 23 | 26 | `gendarme1910`, `haebang1945`, `geunal1945` 추가 |
| 허브 누락 수 | 3 | 0 | 저장소↔허브 전수 대조 완료 |
| 결과 저장 게임 수 | 23 | 26 | `balhae`, `gaehang`, `goryeo-debate` 추가 |
| DASH-A / B / C | - | 23 / 3 / 0 | 교육적 결과를 근거로 개별 판정 |
| 대시보드 정상 mapping 수 | 22 canonical + legacy 1 | 26 canonical | 신규 meta 4건, `gabo1894` alias, 중앙 renderer map 적용 |
| 수정한 게임 수 | - | 10 | 저장 3, metadata writer 제거 3, 중복 방지 3, 표시 오류 1(일부 중첩) |

저장소에는 `games.list.json`이 없다. 현재 같은 역할은 허브 카드와 Supabase `game_meta`가 나누어 맡고 있으며, 이번 감사에서는 폴더 slug를 기준 ID로 삼아 양쪽을 맞췄다.

## B. 발견한 주요 문제

### P0

- 운영 `game_meta`에 `anon` INSERT/UPDATE 정책이 열려 있었다. `gabo-reform`, `gukchae1907`, `haebang1945`의 일반 공개 화면이 metadata를 쓸 수 있던 코드 경로를 제거했다.
- 운영 정책 자체는 지시서에 따라 자동 변경하지 않았다. 검토용 SQL은 `supabase/proposals/20260819_rls_hardening.sql`에 두었다. 적용 시 익명 metadata 변조를 막되 공개 SELECT와 service-role/마이그레이션 쓰기는 유지한다.
- `game_results`는 RLS가 켜져 있고 익명 INSERT 정책만 존재한다. 익명 SELECT로 다른 학생 결과를 읽을 수 없음을 확인했다. client-side service role key는 발견되지 않았고, 노출된 JWT는 `anon`, 신규 코드는 publishable key만 사용한다.

### P1

- 저장소의 공개 가능 게임 3개가 허브에 없었다: `gendarme1910`, `haebang1945`, `geunal1945`.
- 교육적으로 가치 있는 결과를 만드는 3개가 저장하지 않았다: `balhae`의 증거 분석·최종 보고서, `gaehang`의 질문·입장·근거, `goryeo-debate`의 5개 주장·최종 피드백.
- `balhae`, `gaehang`, `gendarme1910`, `goryeo-debate`의 `game_meta`가 없었다. migration을 운영 DB에 적용했고 history를 `20260819000100` applied로 기록했다.
- 갑오개혁 과거 행이 `gabo1894`, 현재 게임이 `gabo-reform`으로 갈라져 있었다. 기존 데이터를 바꾸지 않고 Edge와 client에서 `gabo1894 → gabo-reform`으로 정규화한다.
- `gendarme1910`과 `geunal1945`의 payload 구조는 기존 generic chart로 충분히 해석되지 않았다. 중앙 `CUSTOM_RENDERERS` map에 기관 배치·즉결 판단·인상 카드와 확신도 궤적·밤의 입장을 추가했다.
- 허브와 게임 내부의 여러 표시명이 달랐다. 게임 내부 제목을 canonical label로 삼아 허브와 대시보드 표시명을 통일했다.

### P2

- `ganghwa` 문서 끝의 화면 노출 가능 잔여 문자열 `` `;`` 를 제거했다.
- 설정이 끝난 `goryeo-debate`에도 GAS 설정 안내가 보이던 문제를 수정했다.
- `gobu1894`, `sahwa-factcheck`, `ujeongtonguk`의 결과 진입/버튼 연타 중 중복 POST 가능성을 `_submitted` guard로 막았다. 나머지 기존 게임은 이미 같은 guard 또는 attempt/result ID를 사용한다.
- repository에 `shared/charlie-config.js`나 `charlie-core` 자체가 없다. 인라인 config가 있는 게임은 '부분', 나머지는 '미적용'으로 기록했으며 이번 작업에서 강제 migration하지 않았다.

## Phase A–E 게임별 전수조사표

| slug | 게임명 | 시대 | index 존재 | Pages 예상 URL | 실제 접근 | 허브 등록 | 허브 링크 정상 | games.list.json | game_id | 결과 저장 | 저장 방식 | 대시보드 연결 | 대시보드 필요성 | 공통 core/config | 콘솔 오류 | 비고 |
|---|---|---|:---:|---|:---:|:---:|:---:|:---:|---|:---:|---|:---:|---|---|:---:|---|
| `balhae` | 발해에서 고구려의 DNA를 찾아라 | 전근대·남북국 | Y | <https://gtmc-history.github.io/games/balhae/> | 200 | Y | Y | 해당 없음 | `balhae` | Y | Supabase | Y | DASH-A·필수 | 부분(인라인 config) | N | 보고서·증거 답변 저장 추가, 제목 통일 |
| `bungdang` | 이조 전랑 자리를 차지하라 — 붕당의 탄생 1575 | 전근대·조선 | Y | <https://gtmc-history.github.io/games/bungdang/> | 200 | Y | Y | 해당 없음 | `bungdang` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 인사·안건·분당 결과 |
| `daehan1897` | 대한제국 1897 — 당신의 기준으로 평가하라 | 근대 | Y | <https://gtmc-history.github.io/games/daehan1897/> | 200 | Y | Y | 해당 없음 | `daehan1897` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 사료 판단 분포 |
| `daewongun` | 대원군의 결단 — 무너지는 조선을 세워라 | 근대·개항 전후 | Y | <https://gtmc-history.github.io/games/daewongun/> | 200 | Y | Y | 해당 없음 | `daewongun` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 정책 trade-off |
| `dongnip1898` | 황제와 맞서다 — 1898 독립협회 | 근대 | Y | <https://gtmc-history.github.io/games/dongnip1898/> | 200 | Y | Y | 해당 없음 | `dongnip1898` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | AI 토론 판단 |
| `euibyeong1907` | 의병을 일으켜라 — 1895·1905·1907 | 근대 | Y | <https://gtmc-history.github.io/games/euibyeong1907/> | 200 | Y | Y | 해당 없음 | `euibyeong1907` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 시기별 모집·전략 renderer |
| `euljsa1905` | 1905 — 남겨진 선택 | 근대 | Y | <https://gtmc-history.github.io/games/euljsa1905/> | 200 | Y | Y | 해당 없음 | `euljsa1905` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 선택지 축소 경로 |
| `gabo-reform` | 갑오개혁 — 내가 설계한 개혁이 사라지는 날 | 근대 | Y | <https://gtmc-history.github.io/games/gabo-reform/> | 200 | Y | Y | 해당 없음 | `gabo-reform` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | legacy `gabo1894` 조회 alias; 공개 meta writer 제거 |
| `gaehang` | 개항의 갈림길 — 1876년 전야 | 근대 | Y | <https://gtmc-history.github.io/games/gaehang/> | 200 | Y | Y | 해당 없음 | `gaehang` | Y | Supabase | Y | DASH-A·필수 | 부분(인라인 config) | N | 질문 3개·최종 입장·근거 저장 추가 |
| `gaehangmarket1883` | 내 돈이 사라진다 — 개항장 상인 1883 | 근대 | Y | <https://gtmc-history.github.io/games/gaehangmarket1883/> | 200 | Y | Y | 해당 없음 | `gaehangmarket1883` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 경제 구조 선택 |
| `gaemong1905` | 1905년의 선택 — 애국계몽운동 | 근대 | Y | <https://gtmc-history.github.io/games/gaemong1905/> | 200 | Y | Y | 해당 없음 | `gaemong1905` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 운동 경로 분기 |
| `ganghwa` | 강화도 협상 테이블 — 1876년 2월 | 근대 | Y | <https://gtmc-history.github.io/games/ganghwa/> | 200 | Y | Y | 해당 없음 | `ganghwa` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 문서 끝 잔여 문자열 제거 |
| `gendarme1910` | 어느 기관의 일입니까? | 일제강점기·1910년대 | Y | <https://gtmc-history.github.io/games/gendarme1910/> | 200 | Y | Y | 해당 없음 | `gendarme1910` | Y | Supabase | Y | DASH-A·필수 | 부분(인라인 config/fallback) | N | 허브·meta·전용 renderer 추가; 첫 식민 통치 게임 후보 |
| `geunal1945` | 그날, 아무도 몰랐다 — 1945 | 해방기 | Y | <https://gtmc-history.github.io/games/geunal1945/> | 200 | Y | Y | 해당 없음 | `geunal1945` | Y | Supabase | Y | DASH-A·필수 | 부분(인라인 config/fallback) | N | 허브·확신도 궤적 renderer 추가 |
| `gobu1894` | 고부, 1894 | 근대 | Y | <https://gtmc-history.github.io/games/gobu1894/> | 200 | Y | Y | 해당 없음 | `gobu1894` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 중복 제출 guard 추가 |
| `goryeo-debate` | 고려 말 대논쟁 — 정몽주 vs 정도전 | 전근대·고려 | Y | <https://gtmc-history.github.io/games/goryeo-debate/> | 200 | Y | Y | 해당 없음 | `goryeo-debate` | Y | Supabase | Y | DASH-A·필수 | 부분(인라인 config) | N | 주장·피드백 저장, 설정 안내 수정 |
| `goryeo-detective` | 고려 지배세력 탐정단 | 전근대·고려 | Y | <https://gtmc-history.github.io/games/goryeo-detective/> | 200 | Y | Y | 해당 없음 | `goryeo-detective` | Y | Supabase | Y | DASH-B·선택 | 미적용 | N | 점수·완주 중심 generic 표시 |
| `gukchae1907` | 대한신문 1907 — 오늘의 1면을 써라 | 근대 | Y | <https://gtmc-history.github.io/games/gukchae1907/> | 200 | Y | Y | 해당 없음 | `gukchae1907` | Y | Supabase | Y | DASH-A·필수 | 부분(인라인 config) | N | 전용 기사·검열 renderer; 공개 meta writer 제거 |
| `haebang1945` | 도둑같이 온 해방 — 1945 | 해방기 | Y | <https://gtmc-history.github.io/games/haebang1945/> | 200 | Y | Y | 해당 없음 | `haebang1945` | Y | Supabase | Y | DASH-A·필수 | 부분(인라인 config/fallback) | N | 허브 추가; 공개 meta writer 제거 |
| `mongol-survival` | 1232 — 당신은 살아남을 수 있는가 | 전근대·고려 | Y | <https://gtmc-history.github.io/games/mongol-survival/> | 200 | Y | Y | 해당 없음 | `mongol-survival` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 항전·생존 선택 경로 |
| `sahwa-factcheck` | 조보청 특별 조사관 — 사화의 진실 | 전근대·조선 | Y | <https://gtmc-history.github.io/games/sahwa-factcheck/> | 200 | Y | Y | 해당 없음 | `sahwa-factcheck` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 문항별 오개념 결과; 중복 guard 추가 |
| `samsa-hearing` | 3사 청문회 — 이 임명을 막아라 | 전근대·조선 | Y | <https://gtmc-history.github.io/games/samsa-hearing/> | 200 | Y | Y | 해당 없음 | `samsa-hearing` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 공론·신뢰·결정 결과 |
| `skycastle` | 고려에서 환생했다 — 문벌의 사다리 | 전근대·고려 | Y | <https://gtmc-history.github.io/games/skycastle/> | 200 | Y | Y | 해당 없음 | `skycastle` | Y | Supabase | Y | DASH-B·선택 | 미적용 | N | 점수·tier·완주 중심 |
| `ujeongtonguk` | 우정총국의 밤 — 갑신정변 1884 | 근대 | Y | <https://gtmc-history.github.io/games/ujeongtonguk/> | 200 | Y | Y | 해당 없음 | `ujeongtonguk` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 최종 선택 중복 guard 추가 |
| `wang-geon` | 왕건의 외교전 — 918년 고려 | 전근대·고려 | Y | <https://gtmc-history.github.io/games/wang-geon/> | 200 | Y | Y | 해당 없음 | `wang-geon` | Y | Supabase | Y | DASH-B·선택 | 미적용 | N | 점수·ending 중심 generic 표시 |
| `wangs-approval` | 왕의 결재함 — 조선의 통치를 경험하다 | 전근대·조선 | Y | <https://gtmc-history.github.io/games/wangs-approval/> | 200 | Y | Y | 해당 없음 | `wangs-approval` | Y | Supabase | Y | DASH-A·필수 | 미적용 | N | 태종·세종 결정 비교 |

### DASH 판정 근거

- DASH-A 23개: 선택 분포, 사료 판단, 오개념, 토론 질문·주장, 성찰문, 정책·전략 경로 중 하나 이상을 학급 단위 후속 수업에 사용할 수 있다.
- DASH-B 3개: `goryeo-detective`, `skycastle`, `wang-geon`은 주된 결과가 점수·tier·ending이라 완주/간단 결과 확인 가치가 중심이다. 이미 공통 metadata 구조에 무리 없이 들어와 있어 유지한다.
- DASH-C 0개: 현재 filesystem에서 확인된 26개는 모두 완성·배포 게임이고, C로 분리해 연결을 제거할 명백한 대상은 없었다. 이 판정은 '모두 필수'가 아니라 A/B 근거를 개별 검토한 결과다.

## C. 실제 수정한 파일

### 게임 저장소

- `AUDIT_GAMES_20260819.md`
- `balhae/index.html`
- `gabo-reform/index.html`
- `gaehang/index.html`
- `ganghwa/index.html`
- `gobu1894/index.html`
- `goryeo-debate/index.html`
- `gukchae1907/index.html`
- `haebang1945/index.html`
- `sahwa-factcheck/index.html`
- `ujeongtonguk/index.html`
- `supabase/migrations/20260819000100_game_integration_meta.sql`
- `supabase/proposals/20260819_rls_hardening.sql`

### 허브·대시보드 저장소

- `index.html`
- `dashboard/index.html`
- `supabase/config.toml`
- `supabase/functions/dashboard-data/index.ts`

## D. 게임별 최종 4단계 상태

| 게임 | 허브 | 저장 | 대시보드 | 최종 상태 |
|---|:---:|:---:|:---:|---|
| balhae | Y | Y | Y | 정상 |
| bungdang | Y | Y | Y | 정상 |
| daehan1897 | Y | Y | Y | 정상 |
| daewongun | Y | Y | Y | 정상 |
| dongnip1898 | Y | Y | Y | 정상 |
| euibyeong1907 | Y | Y | Y | 정상 |
| euljsa1905 | Y | Y | Y | 정상 |
| gabo-reform | Y | Y | Y | 정상·legacy alias |
| gaehang | Y | Y | Y | 정상 |
| gaehangmarket1883 | Y | Y | Y | 정상 |
| gaemong1905 | Y | Y | Y | 정상 |
| ganghwa | Y | Y | Y | 정상 |
| gendarme1910 | Y | Y | Y | 정상·신규 허브/renderer |
| geunal1945 | Y | Y | Y | 정상·신규 허브/renderer |
| gobu1894 | Y | Y | Y | 정상 |
| goryeo-debate | Y | Y | Y | 정상 |
| goryeo-detective | Y | Y | Y | 정상·DASH-B |
| gukchae1907 | Y | Y | Y | 정상 |
| haebang1945 | Y | Y | Y | 정상·신규 허브 |
| mongol-survival | Y | Y | Y | 정상 |
| sahwa-factcheck | Y | Y | Y | 정상 |
| samsa-hearing | Y | Y | Y | 정상 |
| skycastle | Y | Y | Y | 정상·DASH-B |
| ujeongtonguk | Y | Y | Y | 정상 |
| wang-geon | Y | Y | Y | 정상·DASH-B |
| wangs-approval | Y | Y | Y | 정상 |

## 테스트와 운영 검증

- production Pages: 26/26 HTTP 200. 핵심 동일 출처 JS/CSS/이미지 404 0건, 대소문자 불일치 0건.
- Chrome 실제 로드: 26/26 `document.readyState=complete`, 초기 치명적 console error 0건.
- 768×720 좁은 화면: 26/26 수평 overflow 없음, 초기 진행 control 표시. `balhae`는 역할 선택 전 시작 버튼 disabled가 정상 동작이다.
- 기본 시작 상호작용: 25개는 첫 클릭으로 화면 전환, `balhae`는 역할 선택 후 정상 전환.
- 완료 동선 payload intercept: `gendarme1910`, `balhae`, `gaehang`, `goryeo-debate`를 실제 UI로 끝까지 진행했다. class, canonical game ID, choices, 고유 결과, comment, timestamp와 result ID를 확인했다.
- production DB 오염 방지: 위 완료 동선의 Supabase/GAS 요청은 로컬 브라우저 shim이 가로채 mock 응답했다. 감사용 `game_results` 행은 production에 INSERT하지 않았다.
- 일반 게임 화면 metadata 쓰기 회귀: `gabo-reform`, `gukchae1907`, `haebang1945` 각각 `game_meta` POST/PATCH 0건.
- 로컬 허브: 카드 26개, 신규 카드 3개와 public URL 확인.
- 로컬 dashboard fixture: `gabo1894`가 갑오개혁 하나로 합쳐짐, `gendarme1910` 3개 집계 카드, `geunal1945` 확신도·입장 카드 확인.
- 모든 수정 HTML inline script 구문 검사 통과, `dashboard-data/index.ts` Node strip-types 구문 검사 통과, `git diff --check` 오류 없음.
- 기존 `analyze-question` 회귀 테스트는 기능 계약 20건이 통과했으나, 현재 production config의 `demoMode:false`와 테스트의 과거 기대값 `true`가 달라 1개 assertion이 실패했다. 이번 게임 통합 변경과 무관하여 임의 수정하지 않았다.

## E. 남은 수동 작업

1. `supabase/proposals/20260819_rls_hardening.sql` 검토 후 운영자 승인으로 적용한다. 현재 `game_meta`의 `anon update`와 `anon upsert` 정책은 남아 있으나 공개 게임 클라이언트의 writer는 제거됐다.
2. 원격 migration history의 `20260515081700`, `20260515082519`는 현재 repo에 대응 파일이 없다. 이번 migration은 SQL 적용 후 history를 정확히 applied 처리했지만, 향후 일괄 `supabase db push` 전에 과거 두 migration 파일을 안전하게 복원·대조해야 한다.
3. `haebang1945`의 주석에 남은 정오 방송 예고 벽보 원출처 확인은 역사 자료 검수 과제다. 게임 실행·저장·허브 연결을 막는 배포 blocker는 아니다.
4. 공통 `shared/charlie-core`를 새로 도입하려면 별도 migration 계획과 전체 게임 회귀가 필요하다. 이번 감사에서는 기존 인라인 fallback을 보존했다.

## F. 일제강점기 라인업

현재 공개 흐름은 다음과 같다.

`대한신문 1907 / 의병 1907 / 애국계몽 1905–1910` → `gendarme1910` → **1920–1930년대 공백** → `haebang1945`·`geunal1945`

- `gendarme1910`: 완성·배포·저장·dashboard renderer가 모두 확인되어 일제강점기 첫 게임으로 공개 가능하다.
- 《민향일보》 또는 1920년대 신문 검열 구현본: 기준 저장소, 오래된 clone, 관련 프로젝트에서 찾지 못했다. 개발 중 게임을 허브에 선노출하지 않았다.
- `haebang1945`와 `geunal1945`: 같은 날짜를 다루지만 전자는 정보 경로 비교, 후자는 확신도 변화 추적이라 구조가 다르다. 중복 삭제 대상이 아니라 상호 보완 게임이다.

권장 시대 배치는 `근대 말기 → 1910년대 권한 구조 → 1920년대 검열(향후) → 1930–40년대 전시 동원(향후) → 1945년 정보·판단`이다.

## G. 새 게임 후보 (최대 3개)

### 1. 1920년대 — 삭제선 아래의 편집회의

- 핵심 개념: 문화 통치, 신문 검열, 허용된 공론장의 경계.
- 학생 판단: 원문·검열본·발행 조건을 비교해 어떤 주장과 근거를 남길지 결정한다.
- 선택 → 결과 → 발견: 기사 구성 선택 → 삭제/축약/우회 표현 결과 → 검열이 정보 자체뿐 아니라 말하는 방식과 독자 이해를 바꾼다는 점 발견.
- 차별점: 기존 `gukchae1907`의 헤드라인 선택이 아니라 원문-검열본 대조와 redaction 추론이 핵심이다.
- 위험: 검열을 퍼즐 쾌감으로만 소비하거나 실제 언론 탄압을 가볍게 만들지 않도록 피해와 사료 맥락을 함께 제시한다.

### 2. 1938–1945 — 한 장의 배급표가 말해 주는 것

- 핵심 개념: 전시 동원, 국가총동원법, 배급·노무·징병/징용, 식민지 차등.
- 학생 판단: 가계 기록·배급표·동원 통지서에서 확인 가능한 사실과 추정에 그쳐야 할 사실을 구분한다.
- 선택 → 결과 → 발견: 사료 채택과 추론 강도 선택 → 증거 신뢰도·누락 정보 표시 → 일상 통제가 여러 행정 장치를 통해 누적됐음을 발견.
- 차별점: 생존 simulation이 아니라 사료의 한계와 행정 구조를 판정하는 evidence board다.
- 위험: 강제동원 피해를 역할극이나 점수 경쟁으로 재연하지 않고, 개인 식별 정보와 피해 서사를 익명·존중 원칙으로 다룬다.

### 3. 1930년대 — 같은 목표, 갈라진 조직 지도

- 핵심 개념: 민족운동의 변화, 학생·노동·농민 운동, 비합법 조직과 탄압, 연대의 조건.
- 학생 판단: 제한된 사료를 연결해 어떤 조직들이 협력할 수 있었고 무엇이 연대를 막았는지 설명한다.
- 선택 → 결과 → 발견: 사료 노드·관계 선택 → 조직 network의 연결/단절 표시 → 이념만이 아니라 탄압·지역·계층·정보 조건이 운동 방식을 바꿨음을 발견.
- 차별점: 특정 영웅이나 단일 노선을 고르는 게임이 아니라 관계망을 구성하고 반증 자료로 수정한다.
- 위험: 독립운동 노선을 승패나 선악의 단순 구도로 평가하지 않고, 사료 불균형과 후대 평가의 차이를 명시한다.

## 이후 새 게임 통합 순서

1. 실행 가능한 게임과 canonical slug 확정
2. Pages 배포·리소스·완료 동선 검사
3. 교육적 결과에 따라 SAVE-MISSING / SAVE-NOT-NEEDED 판정
4. `game_meta` migration과 필요 시 renderer map 등록
5. 공개 가능 상태에서만 허브 카드 추가
6. production을 오염시키지 않는 payload intercept와 대시보드 mapping 회귀검사
