# 독도연구소: 1905 파일 — 브라우저 QA 보고서

작성일: 2026-09-14  
대상 branch: `build/dokdo-1905-file`  
대상 game: `dokdo-1905-file`

이 문서는 실제 학생 사용성 연구를 대체하지 않는다. 현재 branch의 **실제 HTML/CSS/사료 데이터/runtime**을 함께 로드했을 때 S0→S7이 기술적으로 완주되는지, 반응형 UI와 저장 payload가 잠긴 설계를 깨지 않는지를 검사한 자동 브라우저 QA 기록이다.

## 1. 실행 결과

최신 확인:

- GitHub Actions `Dokdo Draft Browser QA` run #11: **SUCCESS**
- 동일 head의 `Game Integration Audit` run #139: **SUCCESS**

검사 viewport:

- 390 × 844 — 모바일
- 768 × 1024 — 태블릿
- 1280 × 900 — 데스크톱

세 viewport 모두 같은 실제 branch 코드로 다음 경로를 완주했다.

`S0 → S1 → S2(현재 지명 식별 보류) → S3 → S4(니타카 선택 열람·3요소 분해) → S5(1900 메모 수정) → S6(관계 보드) → S7(전시문 편집) → 결과`

## 2. 자동 확인한 항목

- [x] 실제 `data.js`, `source-overrides.js`, CSS, 분리 runtime을 함께 로드한다.
- [x] VN OFF 상태에서도 핵심 Gameplay가 단독으로 완주된다.
- [x] S2에서 본문 확인 → 지도 단서 2개 → `현재 지명 식별 보류` 순서가 작동한다.
- [x] S2 보류 상태가 결과와 서버 전송용 `outside_one_status`에 유지된다.
- [x] 선택 자료실에서 니타카 자료를 실제로 열고 닫을 수 있다.
- [x] 니타카의 `기록 주체 / 정보 경로 / 명칭` 3요소 분해가 작동한다.
- [x] S5에서 1906 자료를 표시하기 전에는 수정 버튼이 잠겨 있고, 필요한 근거 확보 후 1900 메모를 수정할 수 있다.
- [x] `revision_count`가 실제 수정 행동에 따라 증가한다.
- [x] S6에서 핵심 사료 선택 및 관계 2개 이상 저장이 가능하다.
- [x] S6 자동 경로도 임의 자료쌍이 아니라 역사적으로 의미 있는 관계를 사용한다. `A → 관계 → B`는 A를 주어로 읽는다.
  - 1906 심흥택 관련 보고 → `보강한다` → 1900 칙령 제41호에서 보류했던 현재 독도 연결 설명
  - 1906 의정부 지령 제3호 → `후속 대응이다` → 1906 심흥택 관련 보고
- [x] S7에서 실제 확보 메모를 이용해 제목·본문·주의문을 구성하고 결과 화면으로 진행한다.
- [x] 390 / 768 / 1280에서 document horizontal overflow가 발생하지 않는다.
- [x] 보이는 버튼 중 접근 가능한 이름이 없는 버튼이 없다.
- [x] Supabase `game_results` POST는 브라우저에서 intercept하여 production INSERT 없이 캡처했다.
- [x] payload에 `outside_one_status / revision_count / board_links / selected_exhibit_sources` 등이 들어간다.
- [x] 학생의 S7 자유서술 `finalPanel.title/body/caution` 원문은 서버 payload에 포함되지 않는다.

자동 smoke에서 공통으로 확인된 상태:

```text
evidence_seen = 6
board_links = 2
selected_exhibit_sources = 3
revision_count = 1
outside_one_status = 현재 지명 식별 보류 경로
```

## 3. 스크린샷 시각 감사와 수정

첫 브라우저 QA에서는 Ubuntu runner에 한글 폰트가 없어 스크린샷의 한글이 정상 렌더링되지 않았다. 이는 게임 asset 문제가 아니라 QA 환경 문제였으므로 workflow에 `fonts-noto-cjk`를 설치한 뒤 다시 캡처했다. 폰트 파일 자체를 저장소나 사용자에게 배포하지 않는다.

한글 렌더링 후 390px 화면에서 두 가지 실제 반응형 문제가 발견되어 `style.css`를 수정했다.

1. 전역 `input{width:100%}` 때문에 시작 화면 radio가 과도하게 넓어져 수업 렌즈 글자가 세로로 깨지던 문제
   - `input[type="radio"], input[type="checkbox"] { width:auto; flex:0 0 auto; }`로 수정
   - 수업 렌즈는 390px에서도 자연스럽게 배치됨

2. S6 체크박스가 텍스트와 분리되어 위쪽에 떠 보이던 문제
   - `.source-select-grid label`을 flex 행으로 정렬

추가로 900px 이하에서 `.sidebar{order:-1}` 때문에 `연구 노트/열람 자료`가 장면 질문보다 먼저 나타나던 구조를 제거했다. 이제 모바일·태블릿에서도 **장면 질문과 해야 할 일 → 사료·작업 → 연구 노트** 순서가 유지된다.

수정 후 재실행한 브라우저 QA에서 위 문제들이 해소된 것을 확인했다.

## 4. S2 역사 provenance 재검수

브라우저 QA와 별도로 S2 문서 관계를 재검수했다. `磯竹島略圖`는 단순히 `태정관 최종 지령에 직접 첨부된 지도`라고 부르지 않는다.

현재 BUILD 표기는 다음 관계를 따른다.

- 1876년 시마네현이 내무성에 제출한 질의에 지도 자료 `磯竹島略圖`가 포함됨
- 이후 내무성 질의와 태정관 처리가 같은 『公文録』 일건 자료에 편철됨
- 따라서 학생 화면에서는 `같은 일건에 편철된 시마네현 제출 지도`라고 설명
- 태정관 지령의 직접 문구 / 지도에서 읽은 단서 / 오늘날 지명 식별을 서로 다른 층으로 유지

관련 locator:

- 일본 국립공문서관: `公02032100-01600`, item `3018187`
- JACAR cross-locator: `A07060000300` — 『公文録』 일건 자료
- 별도 대조: `A07060000100` — 『太政類典』 `日本海内竹島外一島ヲ版図外トス`

## 5. 공식 asset metadata probe

canonical asset blocker를 좁히기 위해 **공식 endpoint만** 비파괴적으로 조회하는 probe도 실행한다.

조회 대상:

- `digital.archives.go.jp/item/3018187.json`
- 국립공문서관 item page / image viewer
- JACAR `A07060000300`
- JACAR `C09050402800`

CI runner에서는 HTTP 403이 반환되어 공식 IIIF manifest 후보나 정확한 이미지 프레임을 추가로 얻지 못했다. 공개 검색 색인에서는 국립공문서관 item `3018187`에 `Image / Browse`가 존재하고 자료가 공개 상태임을 확인할 수 있지만, 자동 접근으로 실제 이미지 identifier/page를 추출할 수 있는 것은 아니다.

따라서 다음을 하지 않았다.

- item ID를 image identifier로 임의 치환
- 일건 내 문서 순서를 근거로 지도 페이지/프레임 번호 추정
- 제3자 블로그·논문 이미지를 canonical asset으로 복제
- JACAR/NIDS 스캔 이미지를 이용 허가 확인 없이 저장소에 복제

이 결과는 **blocker가 해소되지 않았음을 확인한 것**이며 실패한 역사 검증이 아니다.

## 6. 지령 제3호 날짜 검수

`指令 第三號`의 날짜는 일부 2차 연표에서 5월 20일로 표기된 사례가 있으므로 원문과 현재 공식 설명을 다시 대조했다.

- 국사편찬위원회 한국사DB 원문 말미: `五月十日`
- 현재 대한민국 외교부 독도 자료: `지령 제3호(1906.5.10)`

따라서 현재 BUILD는 **1906.5.10**을 유지한다. 2차 연표의 상이한 날짜 표기만으로 원문 날짜를 변경하지 않는다.

## 7. 현재 판정

### 기술적 branch browser QA
**통과**

실제 branch 데이터·CSS·runtime 기준으로 S0→S7 완주, 390/768/1280 반응형, 상태 전이, SAVE intercept가 모두 성공했다.

### 아직 통과하지 않은 것

1. S2 실제 `기죽도약도` local asset + 실제 hotspot 좌표
2. `C09050402800`의 1904-11-20 정확한 스캔 프레임 locator
3. 실제 학생/교사 대상 수업 사용성 테스트

따라서 이 QA만으로 manifest를 `tested` 또는 `published`로 올리지 않는다. 현재 `draft`와 Draft PR 상태를 유지한다.
