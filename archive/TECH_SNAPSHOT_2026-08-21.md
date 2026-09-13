# TECH SNAPSHOT — 2026-08-21

> ARCHIVE / HISTORICAL SNAPSHOT
> 구 프로젝트 지침 v3에서 실코드 전수검증을 바탕으로 기록된 운영 계약을 요약 보존한다.
> 현재 계약으로 자동 적용하지 말고 반드시 현재 저장소와 대조한다.

## 당시 확인된 주요 구조

### Canonical Registry
- 저장소 루트 `games.manifest.json`
- 당시 필드 예: `slug / title / era / status / save / dashboard / renderer / aliases`

### 당시 공통 결과 테이블
- `game_results`
- 당시 envelope: `{ class, game, choices, comment, timestamp }`

### 당시 신규 게임 식별 패턴
```javascript
window.GAME_CONFIG = {
  game_id: 'GAME_SLUG',
  label: '게임 표시 이름',
  era: '시대 구분',
  version: '1.0'
};
```

### 당시 결과/소감 분리 관행
`choices.record_type`에 `result`와 `comment`를 사용한 신규 표준이 기록되어 있었다.

### 당시 주의사항
- 네트워크/HTTP 실패로 게임 UI 흐름 중단 금지
- 중복 전송 방지 플래그 사용
- `attempt_id` 병합 시 최신 comment choices가 result choices를 덮어쓸 가능성이 당시 대시보드 구현에서 지적됨
- 신규 게임은 `game_meta`와 dashboard renderer 확인 필요
- publishable key와 Authorization 헤더 사용 방식에 당시 마이그레이션 이슈가 있었음
- 레거시 anon JWT 키를 사용하는 게임이 다수 존재한다는 기록이 있었음

## 당시 배포 체크에 포함된 항목

- manifest 등록
- GAME_CONFIG와 slug 일치
- 결과 POST 테스트
- game_meta / dashboard
- GA4
- 저작권 footer
- 소감 입력
- 허브 카드

## 현재 사용 규칙

이 스냅샷의 프로젝트 ID, 키 체계, 함수명, 대시보드 내부 함수, 게임 수, 마이그레이션 상태는 현재 사실로 간주하지 않는다.
구현 전 실제 저장소/DB/운영 환경에서 재확인한다.
