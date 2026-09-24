---
name: phaser-history-exploration
description: Add or refactor spatial exploration in a classroom history web game using Phaser when appropriate. 캐릭터 이동, 자료실·박물관 탐색, NPC, 핫스팟, 타일맵, 카메라, 터치 이동, 키보드 이동, Phaser 장면을 기존 역사 게임에 최소 범위로 넣을 때 사용한다.
---

# Phaser History Exploration

**공간과 이동 자체가 학습 활동에 기여할 때만** Phaser를 사용한다.

보고는 기본적으로 한국어로 한다.

## 범위 제한

기존 웹게임 전체를 Phaser로 재작성하지 않는다. 현재 저장소가 단일 HTML이면 가능한 한 그 구조를 유지하고, 탐색 장면만 최소 범위로 통합한다.

- Phaser: 이동, 충돌, 공간 트리거, 스프라이트/카메라
- DOM: 긴 한국어, 사료, 증거 카드, 선택지, 최종 글쓰기
- 기존 상태 저장소: 진행/증거/제출

## 입력 방식은 프로젝트 프로필을 따른다

`AGENTS.md` 또는 기존 코드에서 우선 입력을 확인한다.

### touch-first
- 큰 화면 조이스틱/방향 패드 또는 탭 이동 제공
- 상호작용 버튼은 44px 이상의 안정적인 터치 영역 권장
- hover를 필수로 하지 않음
- WASD는 보조 기능

### keyboard-first
- 화살표 + WASD
- Space/Enter 상호작용
- 포커스가 입력창/모달에 있을 때 게임 키 입력을 막음

### mixed
- 터치와 키보드 모두 핵심 경로 완주 가능

## 조작 원칙

학생이 역사 과제를 캐릭터 조작 실력 때문에 실패하면 안 된다.

- 이동은 단순하게
- 대각선 속도 정규화
- 복잡한 물리 제거
- 보이지 않는 작은 충돌 트리거 금지
- 상호작용 가능 상태를 명확하게 표시

기본 패턴:
```text
이동/탭 -> 대상 접근 -> 상호작용 표시 -> 사료/미션 DOM 열기 -> 복귀
```

## 데이터화

상호작용 대상은 가능하면 선언적으로 둔다.

```js
{
  id: 'archive-cabinet-1',
  x: 420,
  y: 280,
  radius: 48,
  action: 'openSource',
  payload: { sourceId: 'src-03' }
}
```

## 저장

Phaser 객체를 저장하지 않는다. 기존 저장 인프라가 있으면 그 상태 모델에 식별자/좌표만 추가한다.

```js
{
  sceneId: 'archive',
  player: { x: 320, y: 410 },
  evidenceIds: ['src-01'],
  flags: { cabinetOpened: true }
}
```

Supabase 등 서버 저장이 이미 있으면 localStorage로 대체하지 않는다.

공용 기기에서는 이전 사용자의 좌표/진행을 자동 복원하지 않는다. 새 세션이 기본이며 이어하기는 명시적이어야 한다.

## 접근성/대체 경로

이동 자체를 평가하지 않는다면:
- 장소 목록
- '이 대상으로 이동' 버튼
- 넓은 탭 대상
같은 저마찰 대체 경로를 둘 수 있다.

## 완료 기준

- 프로젝트의 주 입력 장치에서 즉시 조작 가능
- 플레이어가 갇히지 않음
- 모든 필수 대상 접근 가능
- DOM 오버레이가 열리면 이동 입력 정지
- 화면 크기 변화로 필수 UI가 사라지지 않음
- 미션 복귀 시 상태 일치
- 이동의 신기함을 빼도 역사적 사고 목적이 남음
