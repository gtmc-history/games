# Game contract

## Canonical identity

새 게임은 다음 네 값이 기본적으로 같아야 한다.

`folder slug = manifest slug = public URL slug = saved game identifier`

- 공개 URL: `https://gtmc-history.github.io/games/<slug>/`
- 기존 데이터와 연결된 ID를 변경하지 않는다.
- legacy ID는 `games.manifest.json`의 `aliases`에만 명시하고 canonical slug로 다시 사용하지 않는다.
- 현재 예외는 `gabo1894 → gabo-reform`이다. 기존 행을 자동 migration하지 않는다.

## Lifecycle

| status | 의미 | 실행 폴더 | 허브 노출 |
|---|---|---|---|
| `draft` | 아이디어·초기 작업 | 선택 | N |
| `design-locked` | 학습 목표·사료·판단 구조 확정 | 선택 | N |
| `implemented` | 핵심 동선 구현 | 필수 | N |
| `tested` | 로컬 동선·payload 검사 완료 | 필수 | N |
| `published` | Pages와 운영 통합 완료 | 필수 | Y |
| `archived` | 신규 노출 중단, ID·alias 보존 | 선택 | N |

허브는 `published`만 노출한다. 신규 항목은 반드시 `draft`로 시작한다.

## SAVE 판정

- `required`: 선택·판단·질문·성찰 등 교사가 후속 수업에 사용할 결과가 있다.
- `optional`: 완주·점수·간단 ending 정도가 의미 있으며 저장을 유지할 수 있다.
- `none`: 저장할 교육적 결과가 거의 없고 dashboard 연결도 필요 없다.

현재 26개는 운영 baseline의 저장 계약을 보호하기 위해 모두 `required`로 등록한다. 이를 낮추려면 영향 분석과 명시적 결정이 필요하다.

## DASH 판정

- `A`: 선택 패턴, 오개념, 질문·성찰, 수업 피드백에 필수.
- `B`: 완주율·점수·간단 결과 확인에 선택적으로 유용.
- `C`: 교사가 다시 볼 교육적 이유가 거의 없음.

DASH-A/B는 `save: none`일 수 없다. generic chart와 comment 화면으로 충분하면 custom renderer를 만들지 않는다.

## 완료 기준

1. 실행과 direct URL 진입이 된다.
2. 핵심 선택·진행과 결과 화면에 도달한다.
3. SAVE 판정이 manifest와 코드에 일치한다.
4. 저장 대상은 production 오염 없이 payload를 검증한다.
5. DASH-A/B는 metadata/mapping과 필요한 renderer가 있다.
6. `npm run audit:games -- --hub-repo <path>`가 PASS한다.
7. Pages와 핵심 동일 출처 리소스가 정상이다.
8. 마지막에만 `published` 전환과 허브 공개를 수행한다.
