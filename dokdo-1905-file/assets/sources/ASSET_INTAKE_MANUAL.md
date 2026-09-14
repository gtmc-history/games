# 독도연구소: 1905 파일 — 공식 사료 asset intake

목적: 자동 접근 환경에서 공식 이미지 endpoint가 403으로 막힌 두 자료를 **사람이 공식 뷰어에서 한 번만 확인·다운로드**하고, 그 뒤 BUILD가 임의 추정 없이 이어지게 하는 절차다.

이 문서는 역사 설계를 변경하지 않는다. `DESIGN_LOCK v1.0`과 `S2_MAP_ASSET_CONTRACT.md`의 미해결 자산을 채우기 위한 작업 지침이다.

## 1. S2 `磯竹島略圖` 확보

### 정본 확인

- 기관: 일본 국립공문서관 Digital Archive
- 일건: `日本海内竹島外一島地籍ニ編纂方伺`
- Reference Code: `公02032100-01600`
- Item ID: `3018187`
- 공식 catalog: `https://www.digital.archives.go.jp/item/en/3018187`
- JACAR 교차 locator: `A07060000300`

### 사람이 확인할 것

1. 공식 catalog에서 `Image / Browse`를 연다.
2. 일건 안에서 `磯竹島略圖`가 보이는 실제 페이지를 찾는다.
3. 페이지 번호 또는 뷰어가 제공하는 식별값을 그대로 기록한다.
4. **공식 뷰어가 제공하는 원 이미지/다운로드 기능만** 사용한다.
5. 제3자 블로그·위키·논문에 재수록된 그림은 canonical asset으로 사용하지 않는다.

### 저장할 원본 정보

아래를 이 문서 하단 `INTAKE RECORD`에 채운다.

- 확인한 실제 page/frame:
- 뷰어 URL:
- 원 파일명 또는 image identifier:
- 다운로드 일시:
- 원 파일 픽셀 크기:
- 원 파일 SHA-256:

### 게임용 파일

원 공개본에서 **지도 자체가 충분히 읽히도록** 크롭한다.

기본 경로:

```text
dokdo-1905-file/assets/sources/kijukdo-yakudo.webp
```

가공 허용:

- 여백 크롭
- 화면 읽기용 확대/축소
- 방향을 바꾸지 않는 최소 회전 보정
- 원문 판독을 훼손하지 않는 범위의 밝기/명암 보정

가공 금지:

- 섬 위치 이동
- 지명 재작성
- 현대 지명 덧씌우기
- 선·거리 정보의 임의 보정
- 학생이 찾을 단서에 색칠/화살표로 정답 표시

학생 화면 캡션에는 최소한 다음을 표시한다.

> 1876년 시마네현 제출 자료 「기죽도약도」(같은 『공문록』 일건에 편철, 게임 화면용 크롭). 일본 국립공문서관 소장 `公02032100-01600`.

`태정관 최종 지령에 직접 첨부된 지도`라고 단순화하지 않는다.

## 2. S2 hotspot 측정

hotspot은 **완성된 local crop**을 기준으로 측정한다. 원본과 crop의 좌표를 섞지 않는다.

필요한 관찰 지점은 두 종류다.

1. 큰 섬의 명칭·위치 단서
2. 두 번째 섬의 명칭·상대 위치 단서

학생에게 현대 지명을 정답 버튼처럼 보여주지 않는다.

정규화 공식:

```text
x = hotspot_left / image_width
y = hotspot_top / image_height
w = hotspot_width / image_width
h = hotspot_height / image_height
```

예: crop이 1600×1000이고 hotspot이 left=320, top=250, width=240, height=180이면

```text
x=0.2000
y=0.2500
w=0.1500
h=0.1800
```

좌표는 최소 소수점 4자리까지 기록한다.

측정 뒤 `data.js` 또는 별도 asset metadata에 다음 구조로 넣는다.

```js
D.assets = D.assets || {};
D.assets.kijukdoMap = {
  src: 'assets/sources/kijukdo-yakudo.webp',
  alt: '1876년 시마네현 제출 자료 기죽도약도. 섬의 명칭과 상대 위치·거리 정보가 표시되어 있다.',
  sourceLabel: '일본 국립공문서관 소장 · 公02032100-01600',
  processedLabel: '원 공개본에서 게임 화면용으로 크롭·확대',
  hotspots: [
    { id:'large-island', label:'큰 섬의 명칭·위치', x:0, y:0, w:0, h:0 },
    { id:'second-island', label:'두 번째 섬의 명칭·상대 위치', x:0, y:0, w:0, h:0 }
  ]
};
```

`0` 값은 실제 측정 전 placeholder일 뿐이며 추정값으로 commit하지 않는다.

## 3. S2 교체 후 검수

실제 이미지가 들어온 뒤 다음을 모두 확인한다.

- [ ] `DEV PLACEHOLDER` 문구와 개발용 도식 제거
- [ ] local image가 네트워크 없이도 표시됨
- [ ] 390 / 768 / 1280px에서 이미지 비율 유지
- [ ] hotspot이 실제 단서 위에 유지됨
- [ ] 각 hotspot 실제 터치 영역 최소 44×44 CSS px
- [ ] Tab + Enter/Space로 선택 가능
- [ ] hotspot의 accessible name이 `정답 독도` 같은 결론을 미리 말하지 않음
- [ ] 두 단서를 확보해야 식별/보류 판단이 열림
- [ ] `식별`과 `보류` 두 경로 모두 정상 진행
- [ ] `outside_one_status` 저장 정상
- [ ] `Dokdo Draft Browser QA`와 `Game Integration Audit` 재통과

## 4. 쓰시마 전시일지 exact frame 확인

### 정본

- JACAR Ref.: `C09050402800`
- 자료명: `軍艦對馬戰時日誌（5）`
- 소장: 방위성 방위연구소
- 확인할 사건일: **1904-11-20**
- 찾을 문구: `リヤンコ島ハ電信所（無線電信所ニ非ズ）設置ニ適スルヤ否ヤヲ視察スルコト`

### 사람이 확인할 것

1. JACAR 공식 record `C09050402800`을 연다.
2. 뷰어에서 1904년 11월 20일 부분을 찾는다.
3. 위 문구가 실제로 보이는 frame/image 번호를 기록한다.
4. frame 번호와 뷰어 URL을 `INTAKE RECORD`에 적는다.
5. 이용조건이 별도로 허용되지 않은 한 스캔 이미지는 저장소에 복제하지 않는다.

이 게임은 현재 텍스트·메타데이터만으로도 P05의 역사 기능을 수행하므로, **프레임 locator 확인과 이미지 저장 허가는 별개**로 기록한다.

## 5. INTAKE RECORD

### `磯竹島略圖`

- 실제 page/frame: TBD
- 뷰어 URL: TBD
- image identifier / 원 파일명: TBD
- 다운로드 일시: TBD
- 원 파일 픽셀 크기: TBD
- 원 파일 SHA-256: TBD
- 게임용 crop 픽셀 크기: TBD
- 게임용 crop SHA-256: TBD
- 가공 내용: TBD
- 큰 섬 hotspot: TBD
- 두 번째 섬 hotspot: TBD

### `軍艦對馬戰時日誌（5）`

- 1904-11-20 exact frame: TBD
- exact viewer URL: TBD
- 해당 프레임에서 확인한 문구: TBD
- 이미지 저장소 복제 허가 여부: 미확인 / 사용하지 않음

## 6. 승격 금지선

다음 상태에서는 manifest를 `implemented/tested/published`로 승격하지 않는다.

- S2가 개발용 도식인 상태
- 실제 지도 좌표가 추정값인 상태
- 쓰시마 frame을 추측해 기록한 상태
- 기술 QA만 통과하고 실제 교실 사용성 검수가 없는 상태

공식 asset intake가 끝나면 **새 설계 논의 없이** S2 asset 교체 → hotspot 측정 → 브라우저 회귀검사 순서로 BUILD를 계속한다.
