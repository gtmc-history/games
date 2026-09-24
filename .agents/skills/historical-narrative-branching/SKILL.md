---
name: historical-narrative-branching
description: Create or refactor branching historical narrative and visual-novel flows. 역사 비주얼노벨, 분기형 서사, 선택지, 역사 인물 대화, 의사결정, 여러 엔딩, 분기 그래프, 선택 결과 검수나 데이터 기반 장면 전환을 만들 때 사용한다.
---

# Historical Narrative Branching

분기는 역사 상황의 **제약, 경쟁하는 우선순위, 불확실성, 결과**를 드러낼 때 사용한다.

보고는 기본적으로 한국어로 한다.

## 기존 구조 보존

현재 게임이 단일 HTML이면 JSON 파일 분리를 강제하지 않는다. 데이터 객체와 엔진 함수를 논리적으로 분리하는 것만으로도 충분하다. 구조 변경은 최소화한다.

## 데이터와 엔진 분리

장면·선택지는 데이터로, 전이는 결정적 함수로 유지한다.

예:
```json
{
  "startNodeId": "n1",
  "nodes": [
    {
      "id": "n1",
      "speaker": "...",
      "body": "...",
      "grantEvidence": ["ev-a"],
      "choices": [
        {
          "id": "c1",
          "label": "...",
          "targetId": "n2",
          "requiresEvidence": [],
          "effects": { "addEvidence": ["ev-b"] }
        }
      ]
    }
  ],
  "endings": [
    { "id": "e1", "requiresEvidence": ["ev-a", "ev-b"] }
  ]
}
```

## 선택지 설계

좋은 선택지는 서로 다른 실제 전략·가정·우선순위를 표현한다. 대부분 2~4개로 제한한다.

피한다:
- 교과서 정답 1개 + 우스운 오답
- 역사적 맥락과 무관한 도덕성 함정
- 선택 문구와 실제 행동이 다른 선택지

## 역사적 경계

- 창작 대사를 실제 발언처럼 제시하지 않는다.
- 필요한 경우 극적 연결 대사임을 데이터/교사 노트에서 구분한다.
- 한 개인이 구조적 제약을 자유롭게 무시할 수 있었던 것처럼 만들지 않는다.
- 반사실적 결과를 쓸 경우 가정을 명시한다.
- 실제로 확정된 사건 사실을 '아무 선택이나 가능한 대안 역사'처럼 흐리지 않는다.

## 결과 피드백

필요하면 두 층으로 보여준다.
1. 게임 안의 즉각적 결과
2. 그 선택이 당시 왜 가능/위험/제약되었는지 역사 맥락

실제 역사와 다른 선택을 했다는 이유만으로 합리적 선택을 벌점 처리하지 않는다.

## 분기 그래프 필수 검사

이 스킬과 함께 제공되는 검사기 경로:

```bash
node .agents/skills/historical-narrative-branching/scripts/validate-branch-graph.mjs path/to/game.json
```

검사기는 최소한 다음을 확인해야 한다.
- node/ending ID 중복
- 선택지 ID 중복
- 깨진 `targetId`
- 시작점 유효성
- 도달 불가능 요소
- 선택지 없는 비종료 노드
- 어떤 엔딩에도 도달할 수 없는 노드/무한 루프 구간
- `requiresEvidence`를 만족할 수 없는 엔딩
- 지원되는 증거 조건을 고려한 실제 상태 경로

커스텀 조건식이 검사기가 이해하지 못하는 형태면 PASS라고 단정하지 말고 경고를 남기고 수동 테스트 대상으로 올린다.

## 상태·이력

가능하면 선택 이력을 append-only로 남긴다.

```js
history.push({
  nodeId,
  choiceId,
  stateDelta
})
```

공용 기기에서는 학생 식별정보를 localStorage에 불필요하게 남기지 않는다.

## 비주얼노벨이 적합한 곳

- 브리핑
- 증언/인터뷰
- 행위자 간 갈등
- 짧은 의사결정 연속 장면

읽기 자체가 학습목표가 아니라면 게임 전체를 긴 클릭형 대화로 만들지 않는다.

## 완료 기준

학생이 다음을 설명할 수 있어야 한다.
- 무엇을 선택했는가
- 어떤 제약에 대응했는가
- 선택으로 무엇이 달라졌는가
- 실제 역사 상황과 무엇이 같고 달랐는가

검사기가 PASS해도 역사 내용 검수와 브라우저 플레이테스트는 별도 수행한다.

### 검사기 v1.1.1 보강 사항

- 모든 (장면, 보유 증거) 상태를 탐색해 **학생이 갇히는 경로(soft lock)**를 FAIL로 잡는다. 한 경로만 통과해도 PASS로 넘어가지 않는다.
- 필요한 증거 없이 엔딩에 들어가는 경로를 FAIL로 잡는다.
- `requiredEvidence`처럼 지원하지 않는 증거 관련 키(오타)를 FAIL로 잡는다. 지원 키: `requiresEvidence`, `grantEvidence`, `effects.addEvidence`, `effects.removeEvidence`.
- 단일 HTML 게임은 분기 데이터를 `<script type="application/json" id="branch-data">` 블록에 두면 HTML 파일을 그대로 검사할 수 있다:
  `node .agents/skills/historical-narrative-branching/scripts/validate-branch-graph.mjs index.html`
- FAIL 메시지의 경로(`n1 -> c2:n3 [evidence: ...]`)를 그대로 재현 테스트로 사용한다.


### 검사기 v1.1.2 strict schema

- 증거 필드는 위치까지 엄격히 검사한다: node=`grantEvidence`, choice=`requiresEvidence`, choice.effects=`addEvidence/removeEvidence`, ending=`requiresEvidence`.
- 지원 증거 필드는 반드시 비어 있지 않은 문자열 배열이어야 한다. 문자열 하나나 잘못된 타입을 조용히 무시하지 않는다.
- evidence catalog의 중복 ID를 FAIL로 잡는다.
- 단일 HTML의 `branch-data`는 `type="application/json"`을 요구한다.
- 커스텀 조건/플래그 때문에 자동 경로 검사가 완전하지 않으면 검사기 결과가 `CONDITIONAL PASS`가 되며 수동/브라우저 경로 검사를 반드시 이어간다.
- 종료 코드: `0` PASS, `1` FAIL, `2` 입력 오류, `3` CONDITIONAL PASS. **종료 코드 3을 성공으로 처리하지 않는다.**
- 선택지에 검사기가 모르는 키(`showIf`, `locked`, `visibleWhen` 등)나 모르는 effect(`setFlag` 등)가 있으면 흐름을 바꿀 수 있는 것으로 보고 CONDITIONAL PASS로 내린다. 표시용 키를 새로 쓸 때는 검사기의 `KNOWN_CHOICE_KEYS`에 추가한다.
