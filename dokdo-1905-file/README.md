# 독도연구소: 1905 파일 — BUILD DRAFT

이 폴더는 `design-locks/dokdo-1905-file_DESIGN_LOCK_v1.0.md`를 구현하는 작업 브랜치용 초안이다.

## 현재 상태

- manifest: `implemented`
- S0~S7 핵심 동선: 구현 완료
- 선택 조사: 구현 완료
- S2: `죽도 외 1도` 본문 직접 문구와 현재 지명 식별을 분리하고, 식별/보류를 해석 메모로 저장하도록 DESIGN_LOCK v1.0과 구현을 다시 정렬
- S4 니타카 자료: `작성 주체 / 정보 경로 / 명칭` 분해 조작 구현 초안 있음
- S5: 1906 구절 직접 추출 후 과거 1900년 메모 재검토·수정 구현 초안 있음
- S6 고정 시간축형 관계 보드: 구현 초안 있음
- 결과 저장: `game_results` 공통 계약의 구조화 값만 전송하도록 구현
- `source-overrides.js`: 핵심 사료의 학생용 현대어와 검증된 원문 핵심구절·정본 링크를 분리해 보강
- runtime: `app-core.js` / `app-scenes-a.js` / `app-scenes-b.js` / `app-init.js`로 분리. 이전 단일 `app.js`는 제거
- `QA_CHECKLIST.md`: 브라우저·교실·SAVE payload 실기검사 기준
- `QA_BROWSER_REPORT_2026-09-14.md`: 실제 branch 데이터/CSS를 사용한 390/768/1280 자동 브라우저 완주 결과
- `Dokdo Draft Browser QA` run #5: **SUCCESS**
- 같은 head의 `Game Integration Audit` run #133: **SUCCESS**
- 허브 공개/production release: 하지 않음

## 2026-09-23 구현 완료 체크포인트

- S2 `DEV PLACEHOLDER` 제거
- local map asset: `assets/sources/kijukdo-yakudo.jpg`
- asset: JPEG 1000×841 / SHA-256 `b1be2ea9880196a7ae40e13a82a372c1bda811dea70c20a73768a16a9ea9844c`
- 원 소장처: 일본 국립공문서관 `公02032100-01600`, Item `3018187`
- 게임 저장본: 대한민국 외교부 독도 자료실 공개 스캔
- S2 hotspot 2개를 실제 지도 위 명칭·상대 위치에 맞춰 적용
- 로컬 자산으로 전환하여 외부 이미지 서버 상태와 무관하게 핵심 Gameplay가 동작
- 1904 쓰시마 자료는 정확한 스캔 frame을 추정하지 않고, 검증된 텍스트·메타데이터 + JACAR `C09050402800` 링크 방식으로 고정
- `implemented` 승격. 실제 학생/교사 파일럿은 `tested` 승격 gate로 남김

## 사료 화면 보강 상태

학생에게 긴 자료를 한 줄 요약으로만 제시하지 않기 위해, 현재 BUILD에서는 `data.js`의 학생용 현대어 재구성 위에 `source-overrides.js`를 적용한다.

- 1877 태정관 지령: 일본 국립공문서관 `公02032100-01600`을 정본 링크로 사용하고, 「伺之趣竹島外一島之儀本邦關係無之儀ト可相心得事」를 원문 핵심구절로 별도 표시한다.
- 1877 `磯竹島略圖`: 단순히 `태정관 최종 지령에 직접 첨부된 지도`라고 부르지 않는다. 현재 확인한 편철 관계상 1876년 시마네현이 내무성에 제출한 질의의 지도 자료이며, 이후 내무성 질의와 태정관 처리 문서와 함께 같은 『公文録』 일건에 편철되어 있다. 학생 화면에서는 `같은 일건에 편철된 시마네현 제출 지도`로 설명한다.
- 1900 칙령 제41호: 국사편찬위원회 한국사데이터베이스 관보 제1716호를 정본 링크로 사용하고, 제1·2조 원문 핵심구절을 학생용 현대어와 분리해 표시한다.
- 1904 니타카/쓰시마: JACAR 정본 레코드 `C09050457300` / `C09050402800` 링크를 제공한다. 쓰시마는 1904.11.20 유선 전신소 설치 적합성 조사 사실까지 사용하되 정확한 게임용 스캔 프레임은 아직 확정하지 않는다.
- 1905 내각 결정: 내각관방 자료 페이지를 통해 원 소장처와 당대 핵심구절을 확인해 전사 레이어에 추가했다. 오늘날 일본 정부의 `주권 재확인` 설명은 별도 선택 자료로 유지한다.
- 1905 시마네현 고시 제40호: 내각관방 자료 페이지가 안내하는 시마네현 공문서센터 원 자료를 기준으로 고시 핵심구절을 추가했다.
- 1906 보고서 호외·지령 제3호: 국사편찬위원회 『各觀察道(去來)案』을 정본 링크로 사용하고, `本郡所屬獨島`, 일본 관리 일행의 발언 부분, `獨島領地之說은 全屬無根` 등을 학생용 설명과 분리해 표시한다. 지령 제3호는 원문 말미 `五月十日`에 따라 1906.5.10으로 처리한다.

원문 전체 이미지가 아직 들어오지 않은 자료에서도 `원문 핵심구절 / 학생용 현대어 재구성 / 현대 정부·연구 해설`의 층위를 섞지 않는다.

### S2 구현 정렬

DESIGN_LOCK v1.0은 1877 지령의 `죽도 외 1도` 문구 확인은 사실층으로, 그 두 번째 섬을 현재 독도로 식별하는 것은 지도와 후대 연구를 연결하는 해석층으로 잠가 두었다.

현재 runtime은 다음처럼 구현한다.

1. 태정관 지령 본문의 `죽도 외 1도` 직접 문구를 따로 확인한다.
2. 같은 일건에 편철된 시마네현 제출 지도에서 명칭·상대 위치 단서를 따로 확인한다.
3. 그 뒤 학생은 `지도 단서·후대의 식별 해석을 연결해 현재 독도로 식별` 또는 `현재 지명 식별 보류` 중 하나를 **해석 메모**로 저장할 수 있다.
4. 두 선택에 정오·점수 판정을 붙이지 않고 `outside_one_status`에 판단 상태를 남긴다.

이 구조는 지령 본문, 지도 자료, 현대 지명 식별을 같은 층위의 사실로 합치지 않는다.

## 자동 branch browser QA — 2026-09-14

`qa-browser.mjs`와 전용 GitHub Actions workflow를 통해 실제 branch의 HTML/CSS/사료 데이터/runtime을 함께 로드한 S0→S7 회귀를 수행한다.

run #5에서 확인:

- 390×844 / 768×1024 / 1280×900 세 viewport 모두 완주
- VN OFF에서도 핵심 Gameplay 완주
- S2 `현재 지명 식별 보류` 상태 유지
- 니타카 선택 자료 dialog 및 3요소 분해 조작 정상
- S5 과거 메모 수정과 `revision_count` 정상
- S6 관계 보드 / S7 전시 편집 정상
- horizontal overflow 없음
- production DB INSERT 없이 Supabase POST intercept
- 구조화 payload 캡처 성공
- S7 자유서술 원문은 서버 payload에 포함하지 않음

스크린샷 시각 감사에서 발견한 모바일 radio/checkbox 레이아웃과 장면 질문보다 연구 노트가 먼저 보이던 순서 문제도 수정했다. 세부 기록은 `QA_BROWSER_REPORT_2026-09-14.md`를 따른다.

### official metadata probe

동일 workflow에서 canonical asset 확보를 위해 공식 endpoint만 조회하는 비파괴 probe를 실행했다.

- 일본 국립공문서관 item JSON / item page / viewer
- JACAR `A07060000300`
- JACAR `C09050402800`

현재 GitHub Actions runner에서는 모두 HTTP 403이 반환되었다. 따라서 공식 IIIF image identifier, 기죽도약도 실제 page, 쓰시마 정확한 스캔 프레임을 새로 확정하지 못했다. 이 값을 추정해서 기록하지 않는다.

## `tested` / 공개 전 남은 검수

1. **학생/교사 사용성 검수**
   - 기술적 browser QA와 integration audit는 통과했다.
   - 학생 3~6명 소규모 파일럿에서 자료 분량·S2 층위 구분·S5 판단 수정·S6 관계 방향·30~35분 완주를 확인한다.
   - 이 단계는 `implemented`가 아니라 `tested` 승격 조건이다.

2. **1904 군함 쓰시마 자료의 원문 이미지**
   - JACAR ref: `C09050402800`.
   - 현재 게임은 1904.11.20 유선 전신소 설치 적합성 조사에 관한 검증된 텍스트·메타데이터와 정본 링크를 사용한다.
   - 정확한 스캔 frame을 확인하지 않은 상태에서 이미지를 추정 복제하지 않는다.
   - 핵심 Gameplay가 이미지에 의존하지 않으므로 구현 blocker로 취급하지 않는다.

## 역사 처리 금지선

- 칙령 제41호의 `석도`를 원문에서 곧바로 `독도`로 바꾸어 쓰지 않는다.
- 태정관 지령 본문의 `외 1도` 직접 문구와 현재 지명 식별을 구분한다.
- `磯竹島略圖`를 태정관 최종 지령의 직접 첨부물이라고 단순화하지 않는다.
- `외 1도`의 현재 지명 식별에는 단일 정오를 붙이지 않고 지도·후대 해석과의 관계를 명시한다.
- 1904 해군 통신 조사를 1905 편입의 단일·직접 원인으로 확정하지 않는다.
- 현재 일본 정부의 `주권 재확인` 설명을 1905년 당대 결정문의 직접 문구로 제시하지 않는다.
- 현대 국제법적 영유권 판정을 게임의 점수형 정답으로 만들지 않는다.

## 로컬 점검 권장

```bash
node --check dokdo-1905-file/app-core.js
node --check dokdo-1905-file/app-scenes-a.js
node --check dokdo-1905-file/app-scenes-b.js
node --check dokdo-1905-file/app-init.js
node --check dokdo-1905-file/data.js
node --check dokdo-1905-file/source-overrides.js
node --check dokdo-1905-file/qa-browser.mjs
python3 -m py_compile dokdo-1905-file/qa-asset-probe.py
npm run audit:games
git diff --check
```

브라우저 테스트는 `dokdo-1905-file/QA_CHECKLIST.md`와 `QA_BROWSER_REPORT_2026-09-14.md`를 따른다.
실제 배포·허브 통합은 RELEASE gate에서 별도로 진행한다.
