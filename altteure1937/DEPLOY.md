# altteure1937 — 배포 안내

기준 문서: **DESIGN_LOCK 「알뜨르: 지도를 넓혀라」 v1.0 (2026-08-22)**

---

## 1. 폴더 구조

```
altteure1937/
├── index.html
├── README.md                       DESIGN_LOCK v1.0 원문
├── DEPLOY.md                       (배포용 아님 — 저장소 보관용)
└── assets/
    ├── photo-site.jpg              S1·S2·S6 전경
    ├── photo-close.jpg             S2 근접 (비행기 모형 없음 — LOCK §14 조건 충족)
    ├── aerial.jpg                  S3 항공 리빌
    ├── locator.jpg                 S2 위치 지도
    ├── jeju.png                    S4 제주 전도 (자체 제작)
    └── eastasia.png                S5 동아시아 개략도 (자체 제작)
```

배포 URL: `gtmc-history.github.io/games/altteure1937/`

---

## 2. 공개 설정

`index.html` 안의 한 줄:

```js
supabasePublishableKey: 'sb_publishable_…'
```

현재 정상 게임과 같은 프로젝트 publishable 키를 적용했다. service-role/secret 키는 사용하지 않는다.
키가 없거나 `__`로 시작하는 대체값인 경우에도 게임은 정상 완료되고 전송만 건너뛴다.

---

## 3. 자산 결정

이번 통합에서는 전달 패키지의 기존 이미지 내용을 검색·생성·교체·보정하지 않는다.
`locator-PLACEHOLDER.jpg`만 파일 내용을 바꾸지 않고 `locator.jpg`로 정리했다.

```js
const ASSETS = {
  locator: 'assets/locator.jpg',
  aerial:  'assets/aerial.jpg',
  ...
};
```

`CREDITS`는 전달 패키지에서 확인된 범위만 유지한다. 현장 사진의 정확한 자료명·자료번호와
항공·위성 자료 권리 상태에 관해 확인되지 않은 단정을 추가하지 않는다.

---

## 4. games.manifest.json 등록

```json
{
  "slug": "altteure1937",
  "title": "알뜨르: 지도를 넓혀라",
  "era": "일제강점기·전시 동원",
  "status": "published",
  "save": "required",
  "dashboard": "A",
  "renderer": "generic",
  "aliases": []
}
```

## 5. game_meta 등록

`supabase/migrations/20260822000200_altteure1937_game_meta.sql`에 `on conflict (game_id) do update` 방식으로 등록한다.
전용 dashboard renderer는 추가하지 않고 generic 요약·소감 화면과 canonical label mapping을 사용한다.
따라서 `cityAttempts` 전용 분포 차트는 이 통합 범위에 포함되지 않는다.

---

## 6. 수집되는 choices 구조

```json
{
  "record_type": "result",
  "result_id": "UUID",
  "version": "1.0",
  "initialHyp": "outside",
  "investigation": "position",
  "sufficiency": "more",
  "observation": "strip",
  "scaleJudgment": "outside",
  "cityAttempts": ["shanghai", "nanjing"],
  "tags": ["war", "labor"],
  "finalText": "..."
}
```

소감 행은 `{ record_type: 'comment', result_id: '동일 UUID', version: '1.0' }` + `comment`만 전송한다.
선택 데이터는 재전송하지 않으며, 동일 `result_id`로 dashboard의 한 시도에 병합된다.

**수업 후 발문(LOCK §13)** 은 `cityAttempts` 의 첫 항목 분포로 회수한다.

---

## 7. 배포 차단 게이트 현황

### 코드에서 완료된 항목
- [x] `GAME_CONFIG` / `publicHeaders()` / `sendToSupabase()`
- [x] 표준 `record_type` 2단계 전송 (결과 행 즉시 / 소감 행 복사 시)
- [x] `choices` 계약 · `cityAttempts[]`
- [x] 표준 소감칸 (`maxlength="100"`, 이름·학번 제외 안내)
- [x] `class` 파라미터
- [x] 결과·소감 공유 `result_id`와 중복 전송 방지
- [x] GA4 `G-G350VXSFGE`
- [x] 저작권 푸터 (결과 화면 한정, `rgba(120,100,80,0.4)`)
- [x] 자료 출처 푸터
- [x] `도양폭격` 툴팁
- [x] 한국어 폰트 실제 로드 (Noto Serif KR / Noto Sans KR)
- [x] `border-radius` 4px
- [x] 360px 반응형 분기
- [x] 키보드 조작·`:focus-visible`·`aria-pressed`·`alt` 텍스트
- [x] manifest `published` / SAVE-required / DASH-A / generic renderer 등록
- [x] idempotent `game_meta` migration 작성
- [x] 허브 projection 및 dashboard canonical label 등록
- [x] 360px·768px·1280px 실제 Chromium 검사

### 배포 전 남은 항목
- [ ] 현장 사진의 정확한 자료명·자료번호와 항공·위성 자료 권리 상태 운영 확인
- [ ] migration production 적용 (`game_meta` production audit에서 현재 missing)
- [ ] 안전한 test 환경에서 result/comment 행 및 dashboard 병합 표시 확인
- [ ] 두 저장소 push 및 GitHub Pages 배포 (`/games/altteure1937/` production HTTP 현재 404)

---

## 8. 킬 테스트 자가 점검 (LOCK §18)

| | 내용 | 구현 상태 |
|---|---|---|
| **K1** | 읽지 않고 다음만 눌러 결론에 도달 | 방지됨 — 6장면 모두 선택 전 진행 버튼 비활성, S6는 태그 1개 + 10자 이상 필수 |
| **K2** | S3 리빌이 S4·S5를 불필요하게 만듦 | 분리됨 — S3는 정체(활주로)까지만, 역할은 S5 사료에서 공개 |
| **K3** | S5가 난징 맞히기 퀴즈로 느껴짐 | 판별 근거가 사료 텍스트 안에 완결, 선택 전 난징 시각 강조 없음, 오선택 무벌점 |
| **K4** | S6에서 의미 변화가 없음 | 처음 가설을 보존해 결과 화면에서 직접 대조 — **실제 학생 응답으로만 최종 검증 가능** |

K4는 코드로 보장할 수 없다. 첫 수업의 `initialHyp` ↔ `finalText` 대조로 판정한다.

---

## 9. 검증 기록 (2026-08-22)

- inline script 2개 문법 검사 PASS
- 정적 회귀 69/69 PASS
- 정상 경로 / 상하이→난징 / 다른 S2 조사 / 최단 경로 / 재시작 / 9·10자 / 태그 0·1개 / 소감 미작성·작성 / 키 미주입 PASS
- mock 저장: result 1행, comment 1행, 선택 데이터 미중복, 공유 `result_id`, 중복 클릭 추가 전송 없음
- 360px·768px·1280px: 가로 overflow 없음, S5 이미지·SVG 오버레이 박스 일치, console warning/error 0
- deterministic audit 및 sibling hub audit PASS
- production audit: Pages 404와 `game_meta` missing으로 예상된 2 ERROR
