# Result data contract

새 schema를 만드는 문서가 아니라 현재 26개 게임에서 공통으로 확인된 저장 형태를 기록한다.

## `game_results` 공통 필드

```js
{
  class: "...?class= 값 또는 미입력",
  game: "canonical-slug",
  choices: { /* 게임별 결과 */ },
  comment: "학생 소감 또는 빈 문자열",
  timestamp: "ISO-8601 문자열"
}
```

- `game`은 manifest canonical slug와 같아야 한다.
- `class`는 URL의 `?class=`에서 읽으며 미지정 기본값은 기존 계약을 유지한다.
- `choices`는 object 또는 기존 게임이 이미 사용하는 호환 구조다.
- `comment`는 선택 입력일 수 있지만 최상위 필드는 유지한다.
- `timestamp`는 기존 코드가 보내는 ISO 시각 또는 DB 기본 동작과 호환되어야 한다.

## Result/attempt identifier

- 신규 저장 구현은 `choices.result_id` 같은 안정적인 제출 ID를 권장한다.
- 기존 게임 중에는 in-memory `_submitted` guard만 쓰는 항목도 있다.
- legacy 행에 없는 ID를 필수화하거나 기존 payload를 일괄 변환하지 않는다.
- 대시보드는 ID가 있는 행만 같은 attempt로 병합하고, 없는 legacy 행은 원래 행으로 취급한다.

## 게임 고유 결과

선택 경로, 점수, ending, 토론 질문, 주장, 사료 판단, 성찰문은 `choices` 내부에서 게임별로 관리한다. custom renderer는 이 구조를 읽되 원본 필드를 rename하지 않는다.

`geunal1945`의 `wall_posts`는 공개 교실 벽보용 별도 계약이다. 비공개 `game_results`의 대체 테이블이 아니다.

## 호환성과 금지 사항

- 기존 최상위 필드를 임의 rename하거나 제거하지 않는다.
- 기존 `game_id`/`game` 값을 영향 분석 없이 변경하지 않는다.
- legacy alias 행을 자동 rewrite하지 않는다.
- service-role key를 client에 노출하지 않는다.
- production DB에 감사용 학생 결과를 INSERT하지 않는다.
- payload 검사는 fetch intercept, mock 또는 승인된 test 환경을 사용한다.
- 저장 실패가 게임 완료 자체를 막지 않도록 기존 fire-and-forget 원칙을 보존한다.
