# cityshift 지도·비주얼 패치 v1

상태: 교사용 검수 전 Visual Patch

이 패치는 DESIGN_LOCK v1.0의 Core Sequence, 사례 구조, 저장 계약을 바꾸지 않고 Presentation Layer만 수정한다.

## 적용한 실제 지도

### 화면 2 / 사례 1 / 사례 2
- 자료: 1934년 「朝鮮鉄道略図」
- 제작·표기: Chosen Government Railway
- 공개본: Wikimedia Commons `File:1930s korea rail map.jpg`
- 파일: https://upload.wikimedia.org/wikipedia/commons/7/76/1930s_korea_rail_map.jpg
- 설명: https://commons.wikimedia.org/wiki/File:1930s_korea_rail_map.jpg
- Commons 표기: 대한민국·일본 Public Domain.
- 게임 사용: 원본을 저채도·저대비 배경으로 두고, 사례 위치 및 학생 인과선만 별도 HTML/SVG 오버레이로 표시한다.

### 사례 2 위치 보조 inset
- 익산: Wikimedia Commons `File:Iksan-map.png`, 장길산, Public Domain.
  - https://commons.wikimedia.org/wiki/File:Iksan-map.png
- 나주: Wikimedia Commons `File:Naju-map.png`, 장길산, Public Domain.
  - https://commons.wikimedia.org/wiki/File:Naju-map.png
- 게임 사용: 현재 행정구역의 위치 감각을 돕는 작은 보조 inset. 역사적 인과 근거로 사용하지 않는다.

### 사례 3 목포
- 자료: 오늘날 목포 지형도
- 제작자: Jjw
- 공개본: Wikimedia Commons `File:목포 지형도.svg`
- 설명: https://commons.wikimedia.org/wiki/File:목포_지형도.svg
- 라이선스: CC BY-SA 4.0
- 게임 사용: 해안·도서·항만 위치 감각용 배경. 영산강과 나주 방향을 별도 강조하지 않는다.

## 시각 문법

- 실제 지도 배경은 낮은 채도/대비로 처리한다.
- 학생이 만드는 인과선은 굵고 전경에 둔다.
- 실제 지도에 인쇄된 철도선은 배경 정보이며 탭할 수 없다.
- `자료에 연결이 명시됨`, `연결은 자료에 미진술`, `timeScope` 배지는 기존 게임 상태를 그대로 사용한다.
- 배경 지도가 자료 카드보다 강한 인과를 주장하지 않도록 각 보드에 "배경 지도는 위치·지형 맥락용" 안내를 둔다.
- 사례 3의 1897 개항과 1914 철도 시차는 지도 선으로 연결하지 않고 자료/배지에서 판단한다.

## 구현 파일

- `app-visual.js`: 실제 지도 배경, 위치 오버레이, 지도 출처 표시
- `visual.css`: 지도 톤, 오버레이, 출처 캡션, 보드 시각 계층
- `app.js`: visual patch 로더 추가

## 검수 필요

1. 1366×768에서 지도 라벨과 인과선 겹침 여부
2. 1024×768에서 지도 출처 캡션 가독성
3. 모바일에서 외부 지도 이미지 로딩 실패 시에도 게임 진행 가능한지
4. 화면 2의 위치 오버레이가 실제 1934 지도상의 도시 위치와 충분히 일치하는지
5. 사례 2 inset이 플레이를 방해하지 않는지
6. 사례 3 목포 지형도에서 영산강/나주 축이 시각적으로 과도하게 암시되지 않는지
7. 외부 Wikimedia 이미지 의존을 최종 release 전에 로컬 자산으로 고정할지 여부

이 검수가 끝나기 전 `published` 전환은 하지 않는다.
